import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaReact, FaNodeJs, FaSymfony, FaHtml5, FaCss3Alt, FaJsSquare, FaPhp } from 'react-icons/fa';
import './Skills.css';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [techIconsData, setTechIconsData] = useState([]);
  const [animateBars, setAnimateBars] = useState(false);

  // Mapping des noms d'icônes vers les composants React Icons
  const iconMap = {
    FaReact: <FaReact />,
    FaSymfony: <FaSymfony />,
    FaPhp: <FaPhp />,
    FaNodeJs: <FaNodeJs />,
    FaJsSquare: <FaJsSquare />,
    FaHtml5: <FaHtml5 />,
    FaCss3Alt: <FaCss3Alt />
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const r = await fetch('http://localhost:8000/api/skills');
        if (r.ok) {
          const data = await r.json();
          setSkills(data.skills || []);
          setTechIconsData(data.techIcons || []);
        }
      } catch (e) {
        console.error('Erreur chargement skills:', e);
      }
    };
    fetchSkills();
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      setAnimateBars(true);
    }
  }, [inView]);

  return (
    <div className="skills" ref={ref}>
      <h2>Mes compétences</h2>

      {skills.map((skill, index) => (
        <div className="skill-bar" key={index}>
          <span>{skill.name}</span>
          <div className="progress">
            <div
              className={`progress-fill ${animateBars ? 'animate' : ''}`}
              style={{
                width: animateBars ? `${skill.level}%` : '0%',
              }}
            >
              <span>{skill.level}%</span>
            </div>
          </div>
        </div>
      ))}

      <div className={`tech-icons ${animateBars ? 'animate' : ''}`}>
        {techIconsData.map((tech, index) => (
          <div className="tech-icon" key={index}>
            {iconMap[tech.iconName] || <FaReact />}
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
