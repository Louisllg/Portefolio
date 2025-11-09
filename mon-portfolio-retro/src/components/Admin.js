import React, { useEffect, useMemo, useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Admin() {
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [skills, setSkills] = useState([]);
  const [techIcons, setTechIcons] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const navigate = useNavigate();

  // Modals state
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Forms state
  const [timelineForm, setTimelineForm] = useState({ date: '', title: '', description: '', position: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', level: 50, position: 0 });
  const [iconForm, setIconForm] = useState({ name: '', iconName: '', position: 0 });
  const [projectForm, setProjectForm] = useState({ 
    title: '', 
    description: '', 
    functionalities: '', 
    githubLink: '', 
    images: [''] 
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const r = await fetch(`${API_URL}/api/me`, { credentials: 'include' });
        if (!r.ok) {
          navigate('/login');
          return;
        }
        const data = await r.json();
        setMe(data);
      } catch (e) {
        setError(e.message);
        navigate('/login');
      }
    };
    const fetchMessages = async () => {
      try {
        const r = await fetch(`${API_URL}/api/messages`, { credentials: 'include' });
        if (!r.ok) {
          navigate('/login');
          return;
        }
        const data = await r.json();
        setMessages(data);
      } catch (e) {
        setError(e.message);
      }
    };
    const fetchProjects = async () => {
      try {
        const r = await fetch(`${API_URL}/api/projects`, { credentials: 'include' });
        if (r.ok) {
          const data = await r.json();
          setProjects(data);
        }
      } catch (e) {
        setError(e.message);
      }
    };
    const fetchTimeline = async () => {
      try {
        const r = await fetch(`${API_URL}/api/timeline`, { credentials: 'include' });
        if (r.ok) {
          const data = await r.json();
          setTimeline(data);
        }
      } catch (e) {
        setError(e.message);
      }
    };
    const fetchSkills = async () => {
      try {
        const r = await fetch(`${API_URL}/api/skills`, { credentials: 'include' });
        if (r.ok) {
          const data = await r.json();
          setSkills(data.skills || []);
          setTechIcons(data.techIcons || []);
        }
      } catch (e) {
        setError(e.message);
      }
    };
    fetchMe();
    fetchMessages();
    fetchProjects();
    fetchTimeline();
    fetchSkills();
  }, [navigate]);

  const logout = async () => {
    try {
      const r = await fetch(`${API_URL}/api/logout`, { method: 'POST', credentials: 'include' });
      if (r.ok) {
        setMe(null);
        setMessages([]);
        navigate('/login');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter(m =>
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q))
    );
  }, [messages, query]);

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setError(null);
    } catch (e) {
      setError("Impossible de copier l'email");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      const r = await fetch(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!r.ok) throw new Error('Suppression refusée');
      setMessages(msgs => msgs.filter(m => m.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  // ===== TIMELINE CRUD =====
  const openTimelineModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setTimelineForm({ date: item.date, title: item.title, description: item.desc, position: item.position });
    } else {
      setEditingItem(null);
      setTimelineForm({ date: '', title: '', description: '', position: timeline.length });
    }
    setShowTimelineModal(true);
  };

  const closeTimelineModal = () => {
    setShowTimelineModal(false);
    setEditingItem(null);
    setTimelineForm({ date: '', title: '', description: '', position: 0 });
  };

  const saveTimeline = async () => {
    try {
      const url = editingItem 
        ? `${API_URL}/api/admin/timeline/${editingItem.id}` 
        : `${API_URL}/api/admin/timeline`;
      const method = editingItem ? 'PUT' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(timelineForm)
      });

      if (!r.ok) throw new Error('Erreur sauvegarde');

      // Refresh timeline
      const refresh = await fetch(`${API_URL}/api/timeline`, { credentials: 'include' });
      if (refresh.ok) {
        const data = await refresh.json();
        setTimeline(data);
      }

      closeTimelineModal();
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteTimelineEvent = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/timeline/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!r.ok) throw new Error('Suppression refusée');
      setTimeline(items => items.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  // ===== SKILL CRUD =====
  const openSkillModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setSkillForm({ name: item.name, level: item.level, position: item.position });
    } else {
      setEditingItem(null);
      setSkillForm({ name: '', level: 50, position: skills.length });
    }
    setShowSkillModal(true);
  };

  const closeSkillModal = () => {
    setShowSkillModal(false);
    setEditingItem(null);
    setSkillForm({ name: '', level: 50, position: 0 });
  };

  const saveSkill = async () => {
    try {
      const url = editingItem 
        ? `${API_URL}/api/admin/skills/${editingItem.id}` 
        : `${API_URL}/api/admin/skills`;
      const method = editingItem ? 'PUT' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(skillForm)
      });

      if (!r.ok) throw new Error('Erreur sauvegarde');

      // Refresh skills
      const refresh = await fetch(`${API_URL}/api/skills`, { credentials: 'include' });
      if (refresh.ok) {
        const data = await refresh.json();
        setSkills(data.skills || []);
      }

      closeSkillModal();
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Supprimer cette compétence ?')) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/skills/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!r.ok) throw new Error('Suppression refusée');
      setSkills(items => items.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  // ===== TECH ICON CRUD =====
  const openIconModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setIconForm({ name: item.name, iconName: item.iconName, position: item.position });
    } else {
      setEditingItem(null);
      setIconForm({ name: '', iconName: '', position: techIcons.length });
    }
    setShowIconModal(true);
  };

  const closeIconModal = () => {
    setShowIconModal(false);
    setEditingItem(null);
    setIconForm({ name: '', iconName: '', position: 0 });
  };

  const saveIcon = async () => {
    try {
      const url = editingItem 
        ? `${API_URL}/api/admin/tech-icons/${editingItem.id}` 
        : `${API_URL}/api/admin/tech-icons`;
      const method = editingItem ? 'PUT' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(iconForm)
      });

      if (!r.ok) throw new Error('Erreur sauvegarde');

      // Refresh icons
      const refresh = await fetch(`${API_URL}/api/skills`, { credentials: 'include' });
      if (refresh.ok) {
        const data = await refresh.json();
        setTechIcons(data.techIcons || []);
      }

      closeIconModal();
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteTechIcon = async (id) => {
    if (!window.confirm('Supprimer cette icône ?')) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/tech-icons/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!r.ok) throw new Error('Suppression refusée');
      setTechIcons(items => items.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  // ===== PROJECT CRUD =====
  const openProjectModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setProjectForm({ 
        title: item.title, 
        description: item.description, 
        functionalities: item.functionalities, 
        githubLink: item.githubLink || '', 
        images: item.images.length > 0 ? item.images : [''] 
      });
    } else {
      setEditingItem(null);
      setProjectForm({ title: '', description: '', functionalities: '', githubLink: '', images: [''] });
    }
    setShowProjectModal(true);
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    setEditingItem(null);
    setProjectForm({ title: '', description: '', functionalities: '', githubLink: '', images: [''] });
  };

  const addImageField = () => {
    setProjectForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    setProjectForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const updateImageField = (index, value) => {
    setProjectForm(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const saveProject = async () => {
    try {
      // Validation
      if (!projectForm.title || !projectForm.description || !projectForm.functionalities) {
        alert('Veuillez remplir tous les champs obligatoires (Titre, Description, Fonctionnalités)');
        return;
      }

      // Filter out empty image URLs
      const cleanedImages = projectForm.images.filter(img => img.trim() !== '');

      const url = editingItem 
        ? `${API_URL}/api/admin/projects/${editingItem.id}` 
        : `${API_URL}/api/admin/projects`;
      const method = editingItem ? 'PUT' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...projectForm, images: cleanedImages })
      });

      if (!r.ok) {
        const errorData = await r.json();
        throw new Error(errorData.error || 'Erreur sauvegarde');
      }

      // Refresh projects
      const refresh = await fetch(`${API_URL}/api/projects`, { credentials: 'include' });
      if (refresh.ok) {
        const data = await refresh.json();
        setProjects(data);
      }

      closeProjectModal();
      setError(null);
    } catch (e) {
      setError(e.message);
      alert('Erreur: ' + e.message);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!r.ok) throw new Error('Suppression refusée');
      setProjects(items => items.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="admin">
      <div className="admin-header">
        <h2>Espace Admin</h2>
        <button onClick={logout} className="logout-btn retro-btn">Déconnexion</button>
      </div>
      {me && (
        <p className="me-info">Connecté en tant que: <strong>{me.email}</strong></p>
      )}
      {error && <p className="error">{error}</p>}

      <div className="admin-tabs">
        <button className={activeTab === 'messages' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('messages')}>Messages</button>
        <button className={activeTab === 'projects' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('projects')}>Projets</button>
        <button className={activeTab === 'timeline' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('timeline')}>Timeline</button>
        <button className={activeTab === 'skills' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('skills')}>Compétences</button>
        <button className={activeTab === 'icons' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('icons')}>Icônes Techno</button>
      </div>

      {activeTab === 'messages' && (
        <div className="admin-card">
          <div className="controls">
            <input
              type="text"
              placeholder="Rechercher (nom, email, tel, message)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone || '-'}</td>
                    <td>{m.message}</td>
                    <td>
                      <button className="retro-btn" onClick={() => copyEmail(m.email)}>Copier email</button>
                      {' '}
                      <button className="retro-btn" onClick={() => deleteMessage(m.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="admin-card">
          <div className="card-header">
            <h3>Projets ({projects.length})</h3>
            <button onClick={() => openProjectModal()} className="retro-btn">+ Ajouter un projet</button>
          </div>
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Images</th>
                  <th>GitHub</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.title}</td>
                    <td>{p.description?.substring(0, 60)}...</td>
                    <td>{p.images.length} 📷</td>
                    <td>{p.githubLink ? '✓' : '-'}</td>
                    <td>
                      <button onClick={() => openProjectModal(p)} className="retro-btn">Éditer</button>
                      {' '}
                      <button onClick={() => deleteProject(p.id)} className="retro-btn danger-btn">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="admin-card">
          <div className="card-header">
            <h3>Timeline ({timeline.length})</h3>
            <button className="retro-btn" onClick={() => openTimelineModal()}>+ Ajouter</button>
          </div>
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.date}</td>
                    <td>{t.title}</td>
                    <td>{t.desc?.substring(0, 60)}...</td>
                    <td>{t.position}</td>
                    <td>
                      <button className="retro-btn" onClick={() => openTimelineModal(t)}>Éditer</button>
                      {' '}
                      <button className="retro-btn" onClick={() => deleteTimelineEvent(t.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="admin-card">
          <div className="card-header">
            <h3>Compétences ({skills.length})</h3>
            <button className="retro-btn" onClick={() => openSkillModal()}>+ Ajouter</button>
          </div>
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Niveau (%)</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.level}</td>
                    <td>{s.position}</td>
                    <td>
                      <button className="retro-btn" onClick={() => openSkillModal(s)}>Éditer</button>
                      {' '}
                      <button className="retro-btn" onClick={() => deleteSkill(s.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'icons' && (
        <div className="admin-card">
          <div className="card-header">
            <h3>Icônes Techno ({techIcons.length})</h3>
            <button className="retro-btn" onClick={() => openIconModal()}>+ Ajouter</button>
          </div>
          <div className="messages-table-wrapper">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Icône (react-icons)</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {techIcons.map(icon => (
                  <tr key={icon.id}>
                    <td>{icon.id}</td>
                    <td>{icon.name}</td>
                    <td>{icon.iconName}</td>
                    <td>{icon.position}</td>
                    <td>
                      <button className="retro-btn" onClick={() => openIconModal(icon)}>Éditer</button>
                      {' '}
                      <button className="retro-btn" onClick={() => deleteTechIcon(icon.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL TIMELINE */}
      {showTimelineModal && (
        <div className="modal-overlay" onClick={closeTimelineModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingItem ? 'Éditer événement' : 'Nouvel événement'}</h3>
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                placeholder="Ex: 2024"
                value={timelineForm.date}
                onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Titre</label>
              <input
                type="text"
                placeholder="Ex: Développeur Fullstack"
                value={timelineForm.title}
                onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Ex: Projets freelance en React.js & Symfony"
                value={timelineForm.description}
                onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Position (ordre d'affichage)</label>
              <input
                type="number"
                value={timelineForm.position}
                onChange={(e) => setTimelineForm({ ...timelineForm, position: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="modal-actions">
              <button className="retro-btn" onClick={saveTimeline}>Enregistrer</button>
              <button className="retro-btn" onClick={closeTimelineModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SKILL */}
      {showSkillModal && (
        <div className="modal-overlay" onClick={closeSkillModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingItem ? 'Éditer compétence' : 'Nouvelle compétence'}</h3>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                placeholder="Ex: Frontend"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Niveau (%) : {skillForm.level}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Position (ordre d'affichage)</label>
              <input
                type="number"
                value={skillForm.position}
                onChange={(e) => setSkillForm({ ...skillForm, position: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="modal-actions">
              <button className="retro-btn" onClick={saveSkill}>Enregistrer</button>
              <button className="retro-btn" onClick={closeSkillModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TECH ICON */}
      {showIconModal && (
        <div className="modal-overlay" onClick={closeIconModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingItem ? 'Éditer icône' : 'Nouvelle icône'}</h3>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                placeholder="Ex: React"
                value={iconForm.name}
                onChange={(e) => setIconForm({ ...iconForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Icône (react-icons)</label>
              <select
                value={iconForm.iconName}
                onChange={(e) => setIconForm({ ...iconForm, iconName: e.target.value })}
              >
                <option value="">Sélectionner...</option>
                <option value="FaReact">FaReact (React)</option>
                <option value="FaSymfony">FaSymfony (Symfony)</option>
                <option value="FaPhp">FaPhp (PHP)</option>
                <option value="FaNodeJs">FaNodeJs (Node.js)</option>
                <option value="FaJsSquare">FaJsSquare (JavaScript)</option>
                <option value="FaHtml5">FaHtml5 (HTML5)</option>
                <option value="FaCss3Alt">FaCss3Alt (CSS3)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Position (ordre d'affichage)</label>
              <input
                type="number"
                value={iconForm.position}
                onChange={(e) => setIconForm({ ...iconForm, position: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="modal-actions">
              <button className="retro-btn" onClick={saveIcon}>Enregistrer</button>
              <button className="retro-btn" onClick={closeIconModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Project */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={closeProjectModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Éditer le projet' : 'Nouveau projet'}</h2>
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="Titre du projet"
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Description du projet"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Fonctionnalités *</label>
              <textarea
                value={projectForm.functionalities}
                onChange={(e) => setProjectForm({ ...projectForm, functionalities: e.target.value })}
                placeholder="Liste des fonctionnalités (une par ligne ou séparées par des virgules)"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Lien GitHub</label>
              <input
                type="url"
                value={projectForm.githubLink}
                onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div className="form-group">
              <label>Images (URLs) 📷</label>
              <small style={{display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)'}}>
                Ajoutez les URLs des images hébergées (imgur, cloudinary, etc.)
              </small>
              {projectForm.images.map((img, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    placeholder={`URL image ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {projectForm.images.length > 1 && (
                    <button 
                      type="button"
                      className="retro-btn danger-btn" 
                      onClick={() => removeImageField(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="retro-btn" onClick={addImageField}>
                + Ajouter une image
              </button>
            </div>
            <div className="modal-actions">
              <button className="retro-btn" onClick={saveProject}>Enregistrer</button>
              <button className="retro-btn" onClick={closeProjectModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
