import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const result = await response.json();
      if (response.ok) {
        navigate('/admin');
        return;
      } else {
        setStatus({ ok: false, message: result.error || 'Identifiants invalides' });
      }
    } catch (error) {
      setStatus({ ok: false, message: 'Erreur de connexion: ' + error.message });
    }
  };

  return (
    <div className="login">
      <button 
        onClick={() => navigate('/')} 
        className="back-btn"
        aria-label="Retour au portfolio"
      >
        ← Retour
      </button>
      <div className="login-card">
        <h2 className="login-title">Se connecter</h2>
        <p className="login-sub">Accès à l'espace administrateur</p>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="input-row password-row">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          <button type="submit" className="close-btn">Se connecter</button>
        </form>
        {status && (
          <p className={status.ok ? 'success' : 'error'}>{status.message}</p>
        )}
      </div>
    </div>
  );
}

export default Login; 