import React, { useState, useEffect } from 'react';
import '../App.css';
import Navbar from '../components/Navbar';
import Presentation from '../components/Presentation';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Timeline from '../components/Timeline';

function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadTime = 3500; // Durée minimum pour voir l'animation
    
    // Simule le chargement progressif
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Incréments plus petits pour effet plus visible
        const increment = Math.random() * 8 + 3;
        return Math.min(prev + increment, 100);
      });
    }, 180);

    // Attendre que le DOM soit chargé + minimum de temps
    const checkReady = () => {
      const elapsed = Date.now() - startTime;
      if (document.readyState === 'complete' && elapsed >= minLoadTime) {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          clearInterval(progressInterval);
        }, 300);
      } else {
        requestAnimationFrame(checkReady);
      }
    };

    if (document.readyState === 'complete') {
      checkReady();
    } else {
      window.addEventListener('load', checkReady);
    }

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('load', checkReady);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="terminal-boot">
          <div className="boot-line">
            <span className="boot-label">SYSTEM</span>
            <span className="boot-status">Initialisation...</span>
          </div>
          <div className="boot-line">
            <span className="boot-label">CORE</span>
            <span className="boot-status">Chargement des modules</span>
          </div>
          <div className="boot-line">
            <span className="boot-label">UI</span>
            <span className="boot-status">Préparation de l'interface</span>
          </div>
          <div className="boot-progress-bar">
            <div className="boot-progress-fill" style={{ width: `${progress}%` }}>
              <span className="boot-percentage">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="boot-message">Portfolio Louis Le Gouge</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <section id="presentation">
        <Presentation />
      </section>
      <section id="timeline">
        <Timeline />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
}

export default Home; 