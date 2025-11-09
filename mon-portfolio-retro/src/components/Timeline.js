import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './Timeline.css';

const Timeline = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const r = await fetch('http://localhost:8000/api/timeline');
        if (r.ok) {
          const data = await r.json();
          setEvents(data);
        }
      } catch (e) {
        console.error('Erreur chargement timeline:', e);
      }
    };
    fetchTimeline();
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="timeline" ref={ref}>
      <h2>Mon Parcours</h2>
      <div className="timeline-tetris">
        {events.map((event, index) => (
          <div
            className={`tetris-block ${inView ? 'animate' : ''}`}
            key={index}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <span className="tetris-date">{event.date}</span>
            <div className="tetris-content">
              <h3>{event.title}</h3>
              <p>{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
