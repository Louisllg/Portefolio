import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setFeedback({ type: 'success', message: '✅ Message envoyé avec succès !' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFeedback({ type: 'error', message: 'Erreur : ' + result.error });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erreur de connexion : ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact" id="contact">
      <h2>Contactez-moi</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom *</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Votre nom complet"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="+33 6 12 34 56 78"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            placeholder="Décrivez votre projet ou posez votre question..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
        {feedback.message && (
          <div className={`contact-message ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Contact;
