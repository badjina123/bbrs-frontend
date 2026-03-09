import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const formRef = useRef();
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [statut, setStatut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatut(null);
    try {
      await emailjs.sendForm(
        'service_23jlrir',
        'template_rr1urvi',
        formRef.current,
        'WUp9An2JvFkFWqfJ3'
      );
      setStatut('success');
      setForm({ nom: '', email: '', sujet: '', message: '' });
    } catch (err) {
      setStatut('error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: '100%', padding: '14px 16px', marginBottom: '16px',
    background: focused === name ? 'rgba(0,50,100,0.15)' : 'rgba(10,15,30,0.6)',
    border: `1px solid ${focused === name ? 'rgba(0,150,255,0.4)' : 'rgba(0,100,200,0.15)'}`,
    borderRadius: '10px', color: '#c8d8e8', fontSize: '0.95rem',
    fontFamily: "'Rajdhani', sans-serif", outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.3s',
    boxShadow: focused === name ? '0 0 15px rgba(0,100,200,0.1)' : 'none'
  });

  return (
    <div translate="no" style={{ background: '#060810', minHeight: '100vh', paddingTop: '70px' }}>
      <style>{`
        @keyframes successPop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .contact-info-card { display: flex; gap: 16px; align-items: flex-start; background: rgba(10,15,30,0.8); border: 1px solid rgba(0,100,200,0.12); border-radius: 14px; padding: 20px; margin-bottom: 14px; transition: all 0.3s; }
        .contact-info-card:hover { border-color: rgba(0,150,255,0.3); transform: translateX(8px); background: rgba(0,30,60,0.4); }
        .btn-submit { width: 100%; padding: 16px; background: linear-gradient(135deg, #00aa00, #007700); color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,170,0,0.4); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <section style={{ textAlign: 'center', padding: '80px 20px 60px', background: 'radial-gradient(ellipse at center, rgba(0,50,100,0.12) 0%, transparent 70%)', borderBottom: '1px solid rgba(0,100,200,0.1)' }}>
        <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>— Travaillons ensemble —</p>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffd700', fontWeight: 900, letterSpacing: '3px', marginBottom: '16px' }}>Contact</h1>
        <p style={{ color: '#5a6a7a', fontSize: '1.1rem', fontFamily: "'Rajdhani', sans-serif" }}>Parlons de votre projet informatique</p>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '40px' }}>

          {/* ── INFOS ── */}
          <div translate="no">
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: '1rem', marginBottom: '30px', letterSpacing: '2px' }}>Mes coordonnées</h2>
            {[
              { icon: '📍', titre: 'Localisation', info: 'Dakar, Sénégal\nQuartier Fass Delorme, 10500' },
              { icon: '📧', titre: 'Email', info: 'rboussougouisidk@groupeisi.com' },
              { icon: '🕐', titre: 'Sur site — Dakar', info: 'Lundi — Vendredi : 08h00 - 18h00' },
              { icon: '🌐', titre: 'À distance', info: 'Lundi — Samedi : Disponible à toute heure' }
            ].map((item, i) => (
              <div key={i} className="contact-info-card">
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <h3 style={{ color: '#00aa00', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>{item.titre}</h3>
                  <p style={{ color: '#5a6a7a', fontSize: '0.85rem', fontFamily: "'Rajdhani', sans-serif", whiteSpace: 'pre-line', lineHeight: 1.6 }}>{item.info}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '24px', background: 'rgba(0,100,0,0.08)', border: '1px solid rgba(0,170,0,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00aa00', boxShadow: '0 0 10px #00aa00', flexShrink: 0 }} />
              <span style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}>Disponible pour de nouveaux projets</span>
            </div>
          </div>

          {/* ── FORMULAIRE ── */}
          <div translate="no" style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(0,100,200,0.12)', borderRadius: '20px', padding: '40px' }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: '1rem', marginBottom: '30px', letterSpacing: '2px' }}>Envoyez un message</h2>

            {statut === 'success' && (
              <div style={{ background: 'rgba(0,170,0,0.1)', border: '1px solid rgba(0,170,0,0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center', marginBottom: '20px', color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, animation: 'successPop 0.3s ease' }}>
                ✅ Message envoyé ! Je vous répondrai rapidement.
              </div>
            )}
            {statut === 'error' && (
              <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center', marginBottom: '20px', color: '#ff6060', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, animation: 'successPop 0.3s ease' }}>
                ❌ Erreur d'envoi. Réessayez ou contactez-moi par email.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} translate="no">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <input
                  translate="no"
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  value={form.nom}
                  onChange={handleChange}
                  onFocus={() => setFocused('nom')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('nom')}
                  autoComplete="off"
                  spellCheck="false"
                  required
                />
                <input
                  translate="no"
                  type="email"
                  name="email"
                  placeholder="Votre email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('email')}
                  autoComplete="off"
                  spellCheck="false"
                  required
                />
              </div>
              <input
                translate="no"
                type="text"
                name="sujet"
                placeholder="Sujet"
                value={form.sujet}
                onChange={handleChange}
                onFocus={() => setFocused('sujet')}
                onBlur={() => setFocused(null)}
                style={inputStyle('sujet')}
                autoComplete="off"
                spellCheck="false"
                required
              />
              <textarea
                translate="no"
                name="message"
                placeholder="Décrivez votre projet..."
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={5}
                style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '130px' }}
                spellCheck="false"
                required
              />
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
                  : '🚀 Envoyer le message'
                }
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Contact;