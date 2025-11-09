import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Projects.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        axios.get(`${apiUrl}/api/projects`)
            .then(response => setProjects(response.data))
            .catch(error => console.error("Erreur lors du chargement des projets :", error));
    }, []);

    const handleOpenProject = (project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
    };

    const handleClose = () => {
        setSelectedProject(null);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            selectedProject && selectedProject.images.length > 0
                ? (prevIndex + 1) % selectedProject.images.length
                : 0
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            selectedProject && selectedProject.images.length > 0
                ? (prevIndex - 1 + selectedProject.images.length) % selectedProject.images.length
                : 0
        );
    };

    useEffect(() => {
        if (selectedProject && selectedProject.images.length > 1) {
            const interval = setInterval(() => {
                nextImage();
            }, 5000);

            return () => clearInterval(interval); 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProject, currentImageIndex]);
    return (
        <div className="projects">
            <h2>Mes Projets</h2>
            <div className="carousel">
                {projects.map(project => (
                    <div key={project.id} className="project-card" onClick={() => handleOpenProject(project)}>
                        <h3>{project.title}</h3>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedProject.title}</h3>
                        <p>{selectedProject.description}</p>
                        <p><strong>Fonctionnalités :</strong> {selectedProject.functionalities}</p>

                        {selectedProject.images && selectedProject.images.length > 0 && (
                            <div className="carousel-container">
                                {selectedProject.images.length > 1 && (
                                    <button 
                                        className="carousel-btn left" 
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    >
                                        ‹
                                    </button>
                                )}
                                <img 
                                    src={selectedProject.images[currentImageIndex]}
                                    alt={`${selectedProject.title} ${currentImageIndex + 1}`}
                                    className="carousel-image"
                                    onClick={nextImage}
                                />
                                {selectedProject.images.length > 1 && (
                                    <button 
                                        className="carousel-btn right" 
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    >
                                        ›
                                    </button>
                                )}
                                {selectedProject.images.length > 1 && (
                                    <div className="carousel-indicators">
                                        {selectedProject.images.map((_, index) => (
                                            <span 
                                                key={index} 
                                                className={index === currentImageIndex ? 'active' : ''}
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedProject.githubLink && (
                            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <a 
                                    href={selectedProject.githubLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="github-link retro-btn"
                                >
                                    🔗 Voir sur GitHub
                                </a>
                            </div>
                        )}

                        <button onClick={handleClose} className="close-btn">Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;
