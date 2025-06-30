import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Blog from "./components/sections/Blog";
import Contact from "./components/sections/Contact";
import MobileNavigation from "./components/ui/MobileNavigation";
import ThemeToggle from "./components/ui/ThemeToggle";
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-right" />
      <MobileNavigation />
      <ThemeToggle />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Blog />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 font-mono text-sm">
            <span className="text-green-400">$</span> Built with Next.js & ❤️
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2025 Bouchiba Ahmed Seddik. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
