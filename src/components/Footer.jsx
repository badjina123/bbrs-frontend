import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: '#040608', borderTop: '1px solid rgba(0,100,200,0.1)', fontFamily: "'Rajdhani', sans-serif" }}>
      <style>{`
        @keyframes pulse-green { 0%,100% { opacity:0.6; box-shadow: 0 0 5px rgba(0,170,0,0.3); } 50% { opacity:1; box-shadow: 0 0 15px rgba(0,170,0,0.7); } }
        .footer-link { color: #3a4a5a; text-decoration: none; font-size: 0.9rem; letter-spacing: 1px; transition: all 0.3s; display: block; margin-bottom: 10px; }
        .footer-link:hover { color: #00aa00; transform: translateX(4px); }
        .social-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(0,100,200,0.05); border: 1px solid rgba(0,100,200,0.15); font-size: 1.1rem; transition: all 0.3s; text-decoration: none; }
        .social-btn:hover { background: rgba(0,100,200,0.15); border-color: rgba(0,150,255,0.4); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,100,200,0.2); }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid rgba(255,215,0,0.4)' }} />
              <div>
                <div style={{ color: '#ffd700', fontSize: '1rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>BBRS Morphix IT</div>
                <div style={{ color: '#00aa00', fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase' }}>IT Solutions</div>
              </div>
            </div>
            <p style={{ color: '#2a3a4a', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: '280px', marginBottom: '20px' }}>
              Ingénieur Réseaux & Systèmes à Dakar. Cybersécurité, administration système et solutions IT sur mesure.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn">💻</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn">🔗</a>
              <a href="mailto:rboussougouisidk@groupeisi.com" className="social-btn">✉️</a>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#ffd700', fontSize: '0.8rem', fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Navigation</h4>
            {[['/', 'Accueil'], ['/services', 'Services'], ['/apropos', 'À propos'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link key={path} to={path} className="footer-link">{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#ffd700', fontSize: '0.8rem', fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Services</h4>
            {['Réseau à distance', 'Administration système', 'Cybersécurité', 'Site web', 'Formation IT'].map(s => (
              <Link key={s} to="/services" className="footer-link">{s}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#ffd700', fontSize: '0.8rem', fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Contact</h4>
            <div style={{ color: '#2a3a4a', fontSize: '0.88rem', lineHeight: 2 }}>
              <p>📍 Dakar, Sénégal</p>
              <p>🕐 Lun–Ven : 08h–18h</p>
              <p>🌐 Remote : Lun–Sam</p>
              <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,100,0,0.08)', border: '1px solid rgba(0,170,0,0.2)', borderRadius: '20px', padding: '6px 14px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00aa00', animation: 'pulse-green 2s infinite' }} />
                <span style={{ color: '#00aa00', fontSize: '0.8rem', fontWeight: 700 }}>Disponible</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(0,100,200,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#1a2a3a', fontSize: '0.82rem' }}>© {year} BBRS Morphix IT — Tous droits réservés</p>
          <p style={{ color: '#1a2a3a', fontSize: '0.82rem' }}>Conçu avec 🔥 à Dakar, Sénégal</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;