import React from 'react';
import './Presentation.css';

function Presentation() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="presentation" id="presentation">
      <div className="presentation-content">
        <p className="presentation-greeting">Salut, c'est</p>
        
        <h1>Louis Le Gouge</h1>
        
        <p className="presentation-description">
          Développeur <span className="highlight">Fullstack</span> passionné par le <span className="highlight">code propre</span> et les interfaces <span className="highlight">modernes</span>
        </p>

        <div className="presentation-cta">
          <button className="presentation-btn btn-primary" onClick={scrollToProjects}>
            Voir mes projets
          </button>
          <button className="presentation-btn btn-secondary" onClick={scrollToContact}>
            Me contacter
          </button>
        </div>
      </div>

      <div className="scroll-indicator" onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}>
        <span>SCROLL</span>
        <div className="arrow"></div>
      </div>
    </div>
  );
}

export default Presentation;
