// components/hero-webgl-canvas.tsx
"use client"

import React, { useRef, useEffect, useCallback, useState } from 'react';

// --- SHADER CODE ---
// You will paste your vertex and fragment shader code here
const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_textTexture;
    uniform vec2 u_resolution;
    uniform vec2 u_mousePosition;
    uniform float u_time;

    varying vec2 v_texCoord;

    // Noise function for organic distortion
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        // Convert GLSL frag coord to UV (0 to 1) relative to screen resolution
        vec2 screenCoord = gl_FragCoord.xy / u_resolution;
        vec2 distortedTexCoord = v_texCoord;

        // Sample original texture to check if we're on text (assuming background is a specific color)
        vec4 originalSample = texture2D(u_textTexture, v_texCoord);
        // NOTE: This color value (vec3(0.039, 0.039, 0.063)) assumes the text texture background is this specific color.
        // You might need to adjust this based on how you render text to the texture.
        float textMask = 1.0 - step(0.1, length(originalSample.rgb - vec3(0.039, 0.039, 0.063))); // Detect non-background

        // Calculate distance to mouse (mouse position is also 0 to 1 UV)
        float distToMouse = distance(screenCoord, u_mousePosition);
        float distortionRadius = 0.15; // Adjust radius as needed (0 to 1 relative to screen)
        float maxDistortionStrength = 0.03; // Adjust strength

        // Living ink distortion - apply only over text
        if (distToMouse < distortionRadius && textMask > 0.5) {
            float distortionEffect = 1.0 - smoothstep(0.0, distortionRadius, distToMouse);
            distortionEffect = pow(distortionEffect, 1.5);

            // Direction from mouse to current pixel
            vec2 dirFromMouse = normalize(screenCoord - u_mousePosition);
             if (length(screenCoord - u_mousePosition) < 0.001) { // Avoid division by zero
                dirFromMouse = vec2(0.0, 0.0);
            }

            // Base displacement - push away from mouse
            vec2 displacement = dirFromMouse * maxDistortionStrength * distortionEffect;

            // Add organic noise-based wobbling
            float noiseScale = 8.0; // How detailed the noise is
            float timeScale = 2.0; // How fast the noise moves
            float wobbleMagnitude = 0.008 * distortionEffect; // How much the wobble displaces

            float noiseX = smoothNoise(v_texCoord * noiseScale + u_time * timeScale);
            float noiseY = smoothNoise(v_texCoord * noiseScale + vec2(100.0) + u_time * timeScale);

            displacement.x += (noiseX - 0.5) * wobbleMagnitude;
            displacement.y += (noiseY - 0.5) * wobbleMagnitude;

            // Add ripple effect
            float rippleFreq = 12.0; // How many ripples
            float rippleMag = 0.004 * distortionEffect; // Ripple strength
            float ripple = sin(distToMouse * rippleFreq - u_time * 3.0) * rippleMag;
            displacement += dirFromMouse * ripple;

            distortedTexCoord = v_texCoord + displacement;
        }

        // Sample texture with distorted coordinates
        vec4 textColor = texture2D(u_textTexture, distortedTexCoord);

        // Faded shadow effect (increased radius)
        float spotlightSize = 0.4; // Increased from 0.25 to 0.4 for larger radius
        vec3 spotlightColor = vec3(0.4, 0.6, 1.0); // Color of the spotlight (RGB 0-1)
        float spotlightIntensity = 0.5; // How much text is brightened in the spotlight

        float spotlightEffect = 1.0 - smoothstep(0.0, spotlightSize, distToMouse);
        spotlightEffect = pow(spotlightEffect, 2.0); // Soften the edge

        vec3 finalColor = textColor.rgb;

        // Apply spotlight to background (assuming background is the color checked in textMask)
        // If textMask is low (close to background color)
        if (textMask < 0.5) {
             // NOTE: Background color assumption here too
            vec3 backgroundColor = vec3(0.039, 0.039, 0.063); // The original background color you want to light up
            vec3 lightedBackground = mix(backgroundColor, backgroundColor + spotlightColor * 0.2, spotlightEffect); // Subtle background lighting
            finalColor = lightedBackground;
        } else {
             // Enhance text color in spotlight AND add base visibility
            // Base text visibility - make text slightly visible even without mouse hover
            float baseVisibility = 0.4; // Adjust this value (0.0 to 1.0) to control default text visibility
            vec3 baseVisibleText = mix(vec3(0.039, 0.039, 0.063), textColor.rgb, baseVisibility);
            
            // Apply spotlight enhancement on top of base visibility
            finalColor = mix(baseVisibleText, textColor.rgb + spotlightColor * spotlightIntensity, spotlightEffect);
        }

        // Add subtle grain
        float grain = noise(gl_FragCoord.xy + u_time) * 0.03; // Grain intensity
        finalColor += grain;

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
// --- END SHADER CODE ---

// Helper function to compile shaders
const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

// Helper function to create program
const createProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) {
         gl.deleteShader(vertexShader);
         gl.deleteShader(fragmentShader);
         return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Clean up shader objects once linked
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);


    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Shader program failed to link:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
};

// Helper function to create and bind a buffer
const createBuffer = (gl: WebGLRenderingContext, data: Float32Array): WebGLBuffer | null => {
    const buffer = gl.createBuffer();
    if (!buffer) return null;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
};


interface HeroWebGLCanvasProps {
    // You might need to pass text content or styling info here later
}

export default function HeroWebGLCanvas(props: HeroWebGLCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const buffersRef = useRef<{ position: WebGLBuffer | null; texCoord: WebGLBuffer | null } | null>(null);
    const textureRef = useRef<WebGLTexture | null>(null);
    const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});
    const attributesRef = useRef<{ [key: string]: number }>({});

    const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
    const timeRef = useRef<number>(0);
    const animationFrameIdRef = useRef<number | null>(null);


     // --- TEXTURE CREATION (Major Point of Customization/Difficulty) ---
    const createTextTexture = useCallback((gl: WebGLRenderingContext) => {
         // THIS IS A PLACEHOLDER.
         // You need to render your desired text (with gradients, spans, etc.)
         // onto this off-screen canvas. This is non-trivial for complex HTML styling.
         // The reference code used simple text.
         const textCanvas = document.createElement('canvas');
         // Choose a suitable texture size (powers of 2)
         textCanvas.width = 1024; // Adjust based on your text length and detail
         textCanvas.height = 512; // Adjust based on your text height and lines
         const textCtx = textCanvas.getContext('2d');

         if (!textCtx) {
             console.error("Could not get 2D context for text texture canvas.");
             return null;
         }

         // Fill background with the color the shader considers 'background'
         // NOTE: This must match the color check in the fragment shader!
         textCtx.fillStyle = 'rgb(10, 10, 16)'; // Corresponds to vec3(0.039, 0.039, 0.063)
         textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

         // --- Draw your text here ---
         // This is the hardest part to match your current HTML/Tailwind/Framer styling.
         // You'll need to use 2D canvas drawing commands.
         // Example (simplified):
         textCtx.fillStyle = '#ffffff'; // White text
         textCtx.font = 'bold 80px sans-serif'; // Match approximate font/size
         textCtx.textAlign = 'center';
         textCtx.textBaseline = 'middle';

         const centerX = textCanvas.width / 2;
         // Move text up by reducing centerY value
         const centerY = textCanvas.height / 2 - 60; // Moved up by 60 pixels
         const lineHeight = 90; // Approximate line height

         // You'll need to figure out how to render your gradient/multi-span text here
         // For now, let's draw simple white text for demonstration
         textCtx.fillText('3D Visualization', centerX, centerY - lineHeight / 2);
         textCtx.fillText('That Captivates', centerX, centerY + lineHeight / 2);
         // End Example

         // Create WebGL texture
         const texture = gl.createTexture();
         if (!texture) return null;

         gl.bindTexture(gl.TEXTURE_2D, texture);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);

         // Set texture parameters for non-power-of-2 texture handling (if needed, but powers of 2 is safer)
         // or for preventing weird clamping/filtering issues.
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

         return texture;
    }, []); // Dependencies if text content/style changes


    const setupWebGL = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return false;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.error('WebGL not supported');
            // Implement a fallback here if needed (e.g., return false and render standard HTML hero)
            return false;
        }
        glRef.current = gl;

        // Setup canvas size
        const updateCanvasSize = () => {
             // Use devicePixelRatio for sharper rendering on high-res screens
             canvas.width = window.innerWidth * window.devicePixelRatio;
             canvas.height = window.innerHeight * window.devicePixelRatio;
             canvas.style.width = window.innerWidth + 'px';
             canvas.style.height = window.innerHeight + 'px';
             gl.viewport(0, 0, canvas.width, canvas.height);
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.039, 0.039, 0.063, 1.0); // Corresponds to rgb(10, 10, 16)

        // Create shaders and program
        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) {
             // Handle error or fallback
             return false;
        }
        programRef.current = program;
        gl.useProgram(program);

        // Get uniform locations
        uniformsRef.current = {
            textTexture: gl.getUniformLocation(program, 'u_textTexture'),
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            mousePosition: gl.getUniformLocation(program, 'u_mousePosition'),
            time: gl.getUniformLocation(program, 'u_time')
        };

        // Get attribute locations
         attributesRef.current = {
            position: gl.getAttribLocation(program, 'a_position'),
            texCoord: gl.getAttribLocation(program, 'a_texCoord')
        };


        // Create geometry (full-screen quad)
        const positions = new Float32Array([
            -1, -1,  // bottom left
             1, -1,  // bottom right
            -1,  1,  // top left
             1,  1   // top right
        ]);

        const texCoords = new Float32Array([
            0, 1,  // bottom left
            1, 1,  // bottom right
            0, 0,  // top left
            1, 0   // top right
        ]);

        buffersRef.current = {
             position: createBuffer(gl, positions),
             texCoord: createBuffer(gl, texCoords)
        };

        if (!buffersRef.current.position || !buffersRef.current.texCoord) {
             console.error("Failed to create buffers");
             return false;
        }

        // Create texture
        const texture = createTextTexture(gl);
        if (!texture) {
             console.error("Failed to create text texture");
             return false;
        }
        textureRef.current = texture;


        // Initial attribute pointers
        gl.enableVertexAttribArray(attributesRef.current.position);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.position);
        gl.vertexAttribPointer(attributesRef.current.position, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(attributesRef.current.texCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.texCoord);
        gl.vertexAttribPointer(attributesRef.current.texCoord, 2, gl.FLOAT, false, 0, 0);


        return true; // Setup successful

    }, [createTextTexture]);


    const render = useCallback(() => {
        const gl = glRef.current;
        const program = programRef.current;
        const uniforms = uniformsRef.current;
        const attributes = attributesRef.current;
        const buffers = buffersRef.current;
        const texture = textureRef.current;

        if (!gl || !program || !buffers || !texture) return;

        timeRef.current += 1/60; // Increment time (adjust for actual frame time if needed)

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        // Update uniforms
        gl.uniform1i(uniforms.textTexture, 0); // Texture unit 0
        gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(uniforms.mousePosition, mousePositionRef.current.x, mousePositionRef.current.y);
        gl.uniform1f(uniforms.time, timeRef.current);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Bind and set attribute pointers (they were set up initially but re-binding is safe practice before drawing)
         gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
         gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);

         gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
         gl.vertexAttribPointer(attributes.texCoord, 2, gl.FLOAT, false, 0, 0);

        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationFrameIdRef.current = requestAnimationFrame(render);

    }, []); // Dependencies for render? Mouse pos, time, resolution are uniforms, texture is set up.

    const handleMouseMove = useCallback((event: MouseEvent) => {
        const canvas = canvasRef.current;
         if (!canvas) return;
        // Convert screen coordinates to WebGL UV coordinates (0 to 1, Y flipped)
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1.0 - (event.clientY - rect.top) / rect.height; // Flip Y
        mousePositionRef.current = { x, y };
    }, []);


    useEffect(() => {
        // This effect runs once on mount to set up WebGL and event listeners
        const setupSuccessful = setupWebGL();

        if (setupSuccessful) {
             window.addEventListener('mousemove', handleMouseMove);
             // Start the render loop
             animationFrameIdRef.current = requestAnimationFrame(render);
        }


        // Cleanup function runs on unmount
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
             window.removeEventListener('mousemove', handleMouseMove);
             // Resize listener cleanup is handled inside setupWebGL updateCanvasSize closure

            const gl = glRef.current;
            const program = programRef.current;
            const buffers = buffersRef.current;
            const texture = textureRef.current;

            if (gl) {
                 if (program) gl.deleteProgram(program);
                 if (buffers) {
                     if (buffers.position) gl.deleteBuffer(buffers.position);
                     if (buffers.texCoord) gl.deleteBuffer(buffers.texCoord);
                 }
                 if (texture) gl.deleteTexture(texture);
                 // No need to delete shaders explicitly if deleteShader was called after linking
             }
             glRef.current = null;
             programRef.current = null;
             buffersRef.current = null;
             textureRef.current = null;
        };
    }, [setupWebGL, render, handleMouseMove]); // Re-run if setupWebGL, render, or handleMouseMove functions change (unlikely with useCallback)


    // You can potentially render children over the canvas if needed
    return <canvas ref={canvasRef} id="heroCanvas" className="absolute inset-0 w-full h-full z-0"></canvas>;
}
