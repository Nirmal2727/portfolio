// components/dynamic-glow-circle.tsx
"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from "framer-motion";

interface DynamicGlowCircleProps {
  size?: number;
  children?: React.ReactNode;
  glowIntensity?: number;
  glowWidth?: number; // This controls the effective thickness/spread of the ring
  waveSpeed?: number;
  waveAmplitude?: number;
  pulseSpeed?: number;
  initial?: any;
  animate?: any;
  variants?: any;
}

// Vertex Shader (No change)
const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Fragment Shader - Revised glow band calculation for a cleaner ring shape
const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_glowIntensity;
    uniform float u_glowWidth; // Controls the effective width of the ring band around the edge
    uniform float u_waveSpeed;
    uniform float u_waveAmplitude;
    uniform float u_pulseSpeed;
    uniform float u_radius; // This is the radius of the *reference* circle (1.0), which is the edge of the inner content circle

    float circleSDF(vec2 p, float r) {
        return length(p) - r;
    }

    vec2 screenUVToCentered(vec2 uv, vec2 resolution) {
        vec2 pixelCoords = uv * resolution;
        // Scale coordinates so that the circle of radius 1.0 touches the edges of the *minimum* dimension.
        // Since the container is square, this means radius 1.0 maps to the edges of the square container.
        vec2 centeredCoords = (pixelCoords - 0.5 * resolution) / (0.5 * min(resolution.x, resolution.y));
        return centeredCoords;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 centeredCoords = screenUVToCentered(uv, u_resolution);
        // Calculate distance from the edge of the u_radius=1.0 circle
        // Negative values are inside the circle, positive values are outside.
        float distToEdge = circleSDF(centeredCoords, u_radius); // distToEdge = length(centeredCoords) - 1.0

        // --- Ring Shape Calculation ---
        // We want the glow to be strongest where distToEdge is close to 0.
        // It should fade out both inwards (distToEdge < 0) and outwards (distToEdge > 0).
        // u_glowWidth defines the approximate total width of the glow ring.

        float halfGlowWidth = u_glowWidth * 0.5; // Half of the desired total glow width

        // Glow strength should be 1.0 at distToEdge = 0.0, and fall off towards +/- halfGlowWidth.
        // Use smoothstep to create transitions.

        // Strength fading from 0 to 1 as distToEdge goes from -halfGlowWidth to 0
        // This makes the glow fade in as you approach the edge from the inside.
        float strengthInner = smoothstep(-halfGlowWidth, 0.0, distToEdge);

        // Strength fading from 1 to 0 as distToEdge goes from 0 to +halfGlowWidth
        // This makes the glow fade out as you move away from the edge towards the outside.
        float strengthOuter = 1.0 - smoothstep(0.0, halfGlowWidth, distToEdge);

        // The final strength is the minimum of the two fades.
        // This creates the band effect centered around distToEdge = 0.
        // If distToEdge is within [-halfGlowWidth, 0], strengthInner is active.
        // If distToEdge is within [0, +halfGlowWidth], strengthOuter is active.
        // Outside this range, at least one of them will be 0, making the min 0.
        float glowStrength = min(strengthInner, strengthOuter);

        // Apply a power curve for shaping the falloff.
        // pow(x, P) with P > 1 makes the center of the glow band sharper and the edges softer/faster falloff.
        // Use an exponent like 2.0 or 3.0. Let's try 2.0.
        glowStrength = pow(glowStrength, 2.0); // Adjust exponent for sharper/softer ring

        // Optimization: discard pixels with very low alpha if needed.
        // Pixels outside the [-halfGlowWidth, +halfGlowWidth] range already have glowStrength 0 due to the min().
        // We only need to discard if glowStrength is very close to zero due to the smoothstep/pow.
        if (glowStrength < 0.005) { // Adjust threshold if needed
             discard; // Discard pixels that are almost completely transparent
        }

        // --- Apply Color and Pulsing (Same as before) ---

        // Calculate angle for gradient
        float angle = atan(centeredCoords.y, centeredCoords.x);
        float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);

        // Add wave effects
        float wave1 = sin(normalizedAngle * 8.0 + u_time * u_waveSpeed) * u_waveAmplitude;
        float wave2 = sin(normalizedAngle * 5.0 - u_time * u_waveSpeed * 0.7) * u_waveAmplitude * 0.5;
        float wave3 = sin(normalizedAngle * 3.0 + u_time * u_waveSpeed * 0.5) * u_waveAmplitude * 0.8;

        float finalAngle = fract(normalizedAngle + wave1 + wave2 + wave3 + u_time * 0.05);

        // Color gradient
        vec3 purple1 = vec3(0.576, 0.200, 0.918); // #9333ea
        vec3 purple2 = vec3(0.659, 0.333, 0.969); // #a855f7
        vec3 pink1 = vec3(0.925, 0.282, 0.600);   // #ec4899
        vec3 pink2 = vec3(0.859, 0.153, 0.467);   // #db2777

        vec3 gradientColor;
        if (finalAngle < 0.25) {
            gradientColor = mix(purple1, purple2, finalAngle * 4.0);
        } else if (finalAngle < 0.5) {
            gradientColor = mix(purple2, pink1, (finalAngle - 0.25) * 4.0);
        } else if (finalAngle < 0.75) {
            gradientColor = mix(pink1, pink2, (finalAngle - 0.5) * 4.0);
        } else {
            gradientColor = mix(pink2, purple1, (finalAngle - 0.75) * 4.0);
        }

        // Add pulsing
        float pulse = 0.8 + 0.2 * sin(u_time * u_pulseSpeed); // Pulse between 0.6 and 1.0
        float finalIntensity = u_glowIntensity * pulse; // Scale overall intensity by pulse

        // Final color calculation
        vec3 finalColor = gradientColor * glowStrength * finalIntensity;
        float alpha = glowStrength * finalIntensity * 0.8; // Alpha is based on glow strength and intensity, cap max alpha

        gl_FragColor = vec4(finalColor, alpha);
    }
`;

// Rest of the React component code remains the same...

// Helper functions (same)
const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => { /* ... */ };
const createProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null => { /* ... */ };

export default function DynamicGlowCircle({
    size = 320,
    children,
    glowIntensity = 3.0,
    glowWidth = 0.2, // This controls the effective width of the ring
    waveSpeed = 1.0,
    waveAmplitude = 0.15,
    pulseSpeed = 0.8,
    initial,
    animate,
    variants,
}: DynamicGlowCircleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const positionBufferRef = useRef<WebGLBuffer | null>(null);
    const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});
    const animationFrameIdRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const [isWebGLReady, setIsWebGLReady] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    const setupWebGL = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
             return false;
        }

        if (glRef.current) {
            const gl = glRef.current;
            if (programRef.current) gl.deleteProgram(programRef.current);
            if (positionBufferRef.current) gl.deleteBuffer(positionBufferRef.current);
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
        }

        const gl = canvas.getContext('webgl', {
            alpha: true,
            premultipliedAlpha: false,
            antialias: true
        }) || canvas.getContext('experimental-webgl', {
            alpha: true,
            premultipliedAlpha: false,
            antialias: true
        });

        if (!gl) {
            console.error('WebGL not supported or context creation failed.');
            setShowFallback(true);
            return false;
        }
        glRef.current = gl;
        setShowFallback(false);

        const updateCanvasSize = () => {
            const rect = container.getBoundingClientRect();
            const devicePixelRatio = window.devicePixelRatio || 1;
            const displayWidth = Math.round(rect.width * devicePixelRatio);
            const displayHeight = Math.round(rect.height * devicePixelRatio);

            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        };

        updateCanvasSize();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) {
             setShowFallback(true);
             glRef.current = null;
             return false;
        }
        programRef.current = program;
        gl.useProgram(program);

        uniformsRef.current = {
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            time: gl.getUniformLocation(program, 'u_time'),
            glowIntensity: gl.getUniformLocation(program, 'u_glowIntensity'),
            glowWidth: gl.getUniformLocation(program, 'u_glowWidth'),
            waveSpeed: gl.getUniformLocation(program, 'u_waveSpeed'),
            waveAmplitude: gl.getUniformLocation(program, 'u_waveAmplitude'),
            pulseSpeed: gl.getUniformLocation(program, 'u_pulseSpeed'),
            radius: gl.getUniformLocation(program, 'u_radius'),
        };

        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);

        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error('Failed to create buffer');
            setShowFallback(true);
            gl.deleteProgram(programRef.current);
            programRef.current = null;
            glRef.current = null;
            return false;
        }
        positionBufferRef.current = buffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(container);
        (canvas as any).__resizeObserver = resizeObserver;

        setIsWebGLReady(true);
        return true;
    }, []);

    const render = useCallback(() => {
        const gl = glRef.current;
        const program = programRef.current;
        const uniforms = uniformsRef.current;

        if (!gl || !program) {
            return;
        }

        const currentTime = (Date.now() - startTimeRef.current) / 1000;

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(uniforms.time, currentTime);
        gl.uniform1f(uniforms.glowIntensity, glowIntensity);
        gl.uniform1f(uniforms.glowWidth, glowWidth);
        gl.uniform1f(uniforms.waveSpeed, waveSpeed);
        gl.uniform1f(uniforms.waveAmplitude, waveAmplitude);
        gl.uniform1f(uniforms.pulseSpeed, pulseSpeed);
        gl.uniform1f(uniforms.radius, 1.0); // This radius defines the circle edge that distToEdge is relative to

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationFrameIdRef.current = requestAnimationFrame(render);
    }, [glowIntensity, glowWidth, waveSpeed, waveAmplitude, pulseSpeed]);

    useEffect(() => {
        let setupTimeout: NodeJS.Timeout | null = null;

        setupTimeout = setTimeout(() => {
            const success = setupWebGL();
            if (success) {
                startTimeRef.current = Date.now();
                animationFrameIdRef.current = requestAnimationFrame(render);
            } else {
                 console.log('WebGL setup failed, showing fallback.');
            }
        }, 50); // Small delay to ensure refs are attached

        return () => {
            if (setupTimeout) clearTimeout(setupTimeout);

            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }

            const canvas = canvasRef.current;
            if (canvas && (canvas as any).__resizeObserver) {
                (canvas as any).__resizeObserver.disconnect();
            }

            const gl = glRef.current;
            if (gl) {
                if (programRef.current) gl.deleteProgram(programRef.current);
                if (positionBufferRef.current) gl.deleteBuffer(positionBufferRef.current);
                const ext = gl.getExtension('WEBGL_lose_context');
                 if (ext) ext.loseContext();
            }

            glRef.current = null;
            programRef.current = null;
            positionBufferRef.current = null;
            setIsWebGLReady(false);
            setShowFallback(false); // Ensure state is clean on unmount
        };
    }, [setupWebGL, render]);

    useEffect(() => {
        // This useEffect ensures the fallback is shown if WebGL never initializes
        // (e.g., browser support issue, or component is mounted/unmounted rapidly)
        if (!isWebGLReady && glRef.current === null) {
             // Wait a very short moment to give setupWebGL a chance if it's just delayed
             const fallbackTimer = setTimeout(() => {
                if (!glRef.current) { // Double check GL is still null
                     setShowFallback(true);
                }
             }, 100);

             return () => clearTimeout(fallbackTimer);
        }
        // If isWebGLReady becomes true, setShowFallback(false) is handled in setupWebGL
    }, [isWebGLReady]);


    return (
        <motion.div
            ref={containerRef}
            style={{ width: size, height: size }}
            className="relative rounded-full" // rounded-full applies to the outer container
            initial={initial}
            animate={animate}
            variants={variants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Canvas layer - positioned behind content */}
            {/* Hide canvas completely if showing fallback */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full pointer-events-none ${showFallback ? 'hidden' : ''}`}
                style={{ zIndex: 0 }}
            />

            {/* Content layer - positioned above canvas */}
             <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{ zIndex: 1 }} // Ensure content is above the canvas
             >
                {children} {/* The Image goes here */}
            </div>

            {/* Fallback CSS glow */}
            {showFallback && (
                <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                        // Use a conic gradient or radial gradient to create a base color ring
                        background: 'conic-gradient(from 0deg, #9333ea, #a855f7, #ec4899, #db2777, #9333ea)',
                        filter: 'blur(8px)',
                        transform: 'scale(1.1)', // Scale slightly larger than the container
                        zIndex: 0,
                        opacity: 0.6
                    }}
                />
            )}
        </motion.div>
    );
}
