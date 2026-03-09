import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Mascotte from '../components/Mascotte';
import MiniJeu from '../components/MiniJeu';

function Accueil() {
  const [texte, setTexte] = useState('');
  const [particules, setParticules] = useState([]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = ['Ingénieur Réseaux & Systèmes', 'Expert Cybersécurité', 'Administrateur Linux/Windows', 'Créateur de Solutions IT'];

  useEffect(() => {
    let i = 0;
    const currentPhrase = phrases[phraseIndex];
    setTexte('');
    const interval = setInterval(() => {
      setTexte(currentPhrase.slice(0, i));
      i++;
      if (i > currentPhrase.length) {
        clearInterval(interval);
        setTimeout(() => setPhraseIndex(prev => (prev + 1) % phrases.length), 2000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [phraseIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setParticules(Array.from({ length: 30 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 4 + 1, duration: Math.random() * 4 + 3,
      delay: Math.random() * 4,
      color: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#00aa00' : '#1a3a6a'
    })));
  }, []);

  return (
    <div style={{ background: '#060810', minHeight: '100vh' }}>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; } 50% { transform: translateY(-40px) scale(1.2); opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes borderGlow { 0%, 100% { border-color: rgba(0,170,0,0.4); box-shadow: 0 0 10px rgba(0,170,0,0.1); } 50% { border-color: rgba(255,215,0,0.6); box-shadow: 0 0 25px rgba(255,215,0,0.2); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hero-title { font-family: 'Orbitron', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; background: linear-gradient(135deg, #ffd700 0%, #ffaa00 40%, #00aa00 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite, fadeInDown 1s ease forwards; letter-spacing: 4px; line-height: 1.1; }
        .btn-primary { background: linear-gradient(135deg, #00aa00, #007700); color: #fff; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-size: 15px; font-weight: 700; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s; border: 2px solid transparent; position: relative; overflow: hidden; display: inline-block; }
        .btn-primary::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: left 0.5s; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,170,0,0.4); }
        .btn-primary:hover::before { left: 100%; }
        .btn-secondary { background: transparent; color: #ffd700; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-size: 15px; font-weight: 700; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; text-transform: uppercase; border: 2px solid #ffd700; transition: all 0.3s; display: inline-block; }
        .btn-secondary:hover { background: #ffd700; color: #000; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,215,0,0.3); }
        .stat-card { background: rgba(10,15,30,0.8); border: 1px solid rgba(0,170,0,0.2); border-radius: 16px; padding: 30px 20px; text-align: center; transition: all 0.3s; animation: borderGlow 3s ease-in-out infinite; }
        .stat-card:hover { transform: translateY(-8px); background: rgba(20,25,50,0.9); border-color: rgba(255,215,0,0.4); }
        .service-card { background: rgba(10,15,30,0.8); border: 1px solid rgba(0,170,0,0.2); border-radius: 20px; padding: 35px 25px; transition: all 0.4s; position: relative; overflow: hidden; }
        .service-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, #00aa00, #ffd700); transform: scaleX(0); transition: transform 0.4s; }
        .service-card:hover { transform: translateY(-10px); border-color: rgba(255,215,0,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
        .service-card:hover::before { transform: scaleX(1); }
        .en-savoir-plus { margin-top: 20px; color: #00aa00; font-size: 0.85rem; font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; text-decoration: none; display: inline-block; transition: all 0.3s; }
        .en-savoir-plus:hover { color: #ffd700; transform: translateX(4px); }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 20px 80px', background: 'radial-gradient(ellipse at 50% 40%, rgba(0,50,100,0.15) 0%, rgba(0,80,0,0.1) 50%, rgba(0,0,0,0) 70%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', border: '1px solid rgba(0,100,200,0.07)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotate 30s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', border: '1px solid rgba(255,215,0,0.05)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'rotate 20s linear infinite reverse', pointerEvents: 'none' }} />
        {particules.map(p => (
          <div key={p.id} style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px`, background: p.color, borderRadius: '50%', animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`, pointerEvents: 'none' }} />
        ))}

        <div style={{ animation: 'scaleIn 0.8s ease forwards', fontSize: '80px', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(255,100,0,0.5))', position: 'relative', zIndex: 1 }}>🔥</div>
        <h1 className="hero-title" style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>BBRS Morphix IT</h1>
        <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '3px', marginBottom: '20px', minHeight: '40px', animation: 'fadeInUp 1s 0.5s ease both', position: 'relative', zIndex: 1 }}>
          {texte}<span style={{ animation: 'blink 1s infinite' }}>|</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#7a8a9a', marginBottom: '30px', maxWidth: '550px', lineHeight: 1.8, fontFamily: "'Rajdhani', sans-serif", animation: 'fadeInUp 1s 0.8s ease both', position: 'relative', zIndex: 1 }}>
          Transformons vos besoins informatiques en solutions concrètes et sécurisées
        </p>

        {/* MASCOTTE */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '30px' }}>
          <Mascotte
            variante="accueil"
            position="left"
            messages={["👋 Bienvenue sur BBRS Morphix IT !", "🔐 Experte en cybersécurité à Dakar !", "💡 Je sécurise votre infrastructure !"]}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeInUp 1s 1s ease both', position: 'relative', zIndex: 1 }}>
          <Link to="/services" className="btn-primary">⚡ Voir mes services</Link>
          <Link to="/contact" className="btn-secondary">✉️ Me contacter</Link>
        </div>

        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(180deg, transparent, #00aa00)', animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '80px 40px', background: 'rgba(6,8,16,0.95)', borderTop: '1px solid rgba(0,100,200,0.1)', borderBottom: '1px solid rgba(0,100,200,0.1)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            ['🎓', 'Master', 'Réseaux & Systèmes', '#ffd700'],
            ['🔒', 'Kali Linux', 'Cybersécurité', '#00aa00'],
            ['🌍', 'Remote', 'Disponible 6j/7', '#ffd700'],
            ['⚡', 'Réactif', 'Support rapide', '#00aa00']
          ].map(([icon, titre, desc, color]) => (
            <div key={titre} className="stat-card">
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ color, fontSize: '1.2rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: '6px' }}>{titre}</h3>
              <p style={{ color: '#4a5a6a', fontSize: '0.85rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES APERÇU ── */}
      <section style={{ padding: '100px 40px', background: '#080c14' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>— Ce que je fais —</p>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#ffd700', fontWeight: 900, letterSpacing: '2px' }}>Mes Services</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              ['🌐', 'Réseau à distance', 'Configuration VPN, administration réseau, diagnostic de pannes et sécurisation des infrastructures.'],
              ['💻', 'Systèmes à distance', 'Administration Linux/Windows, gestion des utilisateurs et diagnostic des pannes.'],
              ['🔧', 'Assistance sur site', 'Installation WiFi, dépannage, configuration routeurs à Dakar.'],
              ['🔒', 'Cybersécurité', 'Audit de sécurité, test de vulnérabilités et solutions de protection.']
            ].map(([icon, titre, desc]) => (
              <div key={titre} className="service-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{icon}</div>
                <h3 style={{ color: '#ffd700', fontSize: '1.1rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: '12px', letterSpacing: '1px' }}>{titre}</h3>
                <p style={{ color: '#5a6a7a', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: "'Rajdhani', sans-serif" }}>{desc}</p>
                <Link to="/services" className="en-savoir-plus">En savoir plus →</Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/services" className="btn-secondary">Voir tous mes services →</Link>
          </div>
        </div>
      </section>

      {/* ── MINI JEU ── */}
      <section style={{ padding: '80px 40px', background: '#060810', borderTop: '1px solid rgba(0,100,200,0.1)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>— Défends le réseau —</p>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#ffd700', fontWeight: 900, letterSpacing: '2px', marginBottom: '8px' }}>Cyber Defense 🎮</h2>
            <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem' }}>Élimine les menaces avant qu'elles ne s'infiltrent !</p>
          </div>
          <MiniJeu />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,30,60,0.4) 0%, rgba(6,8,16,0.9) 50%, rgba(0,40,10,0.3) 100%)', borderTop: '1px solid rgba(255,215,0,0.1)' }}>
        <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px' }}>Prêt à démarrer ?</p>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#ffd700', fontWeight: 900, marginBottom: '20px' }}>Parlons de votre projet</h2>
        <p style={{ color: '#5a6a7a', fontSize: '1rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>Disponible à Dakar et à distance. Réponse rapide garantie.</p>
        <Link to="/contact" className="btn-primary">🚀 Démarrer maintenant</Link>
      </section>
    </div>
  );
}

export default Accueil;