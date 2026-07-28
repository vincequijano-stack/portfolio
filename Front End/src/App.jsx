import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import BeamsBackground from './components/BeamsBackground.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Certificates from './components/Certificates.jsx';
import Services from './components/Services.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) {
        const progress = (window.scrollY / total) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-Triggered Reveal Animations via IntersectionObserver
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    const highlights = document.querySelectorAll('.highlight-underline');
    const hlObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    highlights.forEach((el) => hlObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      hlObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Reading Progress */}
      <div
        id="reading-progress"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          zIndex: 9999,
          background: 'linear-gradient(90deg, #FFFFFF, #888888)',
          transition: 'width 0.1s',
        }}
      ></div>

      <Header />
      <BeamsBackground />

      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Certificates />
        <Services />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
