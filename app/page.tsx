import Hero from "@/components/hero"
import About from "@/components/about"
import Portfolio from "@/components/portfolio"
import Services from "@/components/services"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import PageTransition from "@/components/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-black text-white">
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <Contact />
        <Footer />
      </main>
    </PageTransition>
  )
}
