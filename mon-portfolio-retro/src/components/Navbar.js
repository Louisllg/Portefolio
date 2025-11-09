import React, { useState, useEffect } from 'react';
import './Navbar.css';
import CV from '../assets/CV_louislegouge.pdf';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Détecter la section active
      const sections = ['presentation', 'timeline', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand" onClick={scrollToTop}>
        &lt;LOUIS.DEV /&gt;
      </div>

      <div className={`burger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={isMenuOpen ? 'active' : ''}>
        <li>
          <a 
            href="#presentation" 
            className={activeSection === 'presentation' ? 'active' : ''}
            onClick={closeMenu}
          >
            Présentation
          </a>
        </li>
        <li>
          <a 
            href="#timeline" 
            className={activeSection === 'timeline' ? 'active' : ''}
            onClick={closeMenu}
          >
            Parcours
          </a>
        </li>
        <li>
          <a 
            href="#skills" 
            className={activeSection === 'skills' ? 'active' : ''}
            onClick={closeMenu}
          >
            Compétences
          </a>
        </li>
        <li>
          <a 
            href="#projects" 
            className={activeSection === 'projects' ? 'active' : ''}
            onClick={closeMenu}
          >
            Projets
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            className={activeSection === 'contact' ? 'active' : ''}
            onClick={closeMenu}
          >
            Contact
          </a>
        </li>
        <li>
          <a href="/login" className="nav-btn" onClick={closeMenu}>
            Login
          </a>
        </li>
        <li>
          <a href={CV} download="CV_Louis_Legouge.pdf" className="nav-btn" onClick={closeMenu}>
            CV
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
