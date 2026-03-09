import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Mascotte from '../components/Mascotte';

function Apropos() {
  const [activeSkill, setActiveSkill] = useState(null);

  const competences = [
    { nom: 'Réseaux & Systèmes', niveau: 80, color: '#00aa00' },
    { nom: 'Cybersécurité / Kali Linux', niveau: 70, color: '#ffd700' },
    { nom: 'Administration Linux', niveau: 75, color: '#00aa00' },
    { nom: 'Windows Server / Active Directory', niveau: 72, color: '#ffd700' },
    { nom: 'Création Web / React', niveau: 65, color: '#00aa00' },
  ];

  return (
    <div style={{ background: '#060810', minHeight: '100vh', paddingTop: '70px' }}>
      <style>{`
        .info-card { background: rgba(10,15,30,0.8); border: 1px solid rgba(0,100,200,0.12); border-radius: 16px; padding: 30px; transition: all 0.3s; }
        .info-card:hover { border-color: rgba(255,215,0,0.25); box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,100,200,0.05); transform: translateY(-4px); }
        .btn-primary { background: linear-gradient(135deg, #00aa00, #007700); color: #fff; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 700; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s; display: inline-block; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,170,0,0.4); }
      `}</style>

      <section style={{ textAlign: 'center', padding: '80px 20px 40px', background: 'radial-gradient(ellipse at center, rgba(0,50,100,0.12) 0%, transparent 70%)', borderBottom: '1px solid rgba(0,100,200,0.1)' }}>
        <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>— Mon profil —</p>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffd700', fontWeight: 900, letterSpacing: '3px', marginBottom: '16px' }}>À propos de moi</h1>
        <p style={{ color: '#5a6a7a', fontSize: '1.1rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '20px' }}>Ingénieur Réseaux & Systèmes passionné</p>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Mascotte
            variante="apropos"
            position="left"
            messages={["🎓 Master en Réseaux & Systèmes !", "🚀 Passionnée de cybersécurité !", "📍 Basée à Dakar, Sénégal !"]}
          />
        </div>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div className="info-card" style={{ gridColumn: '1 / -1' }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: '1.1rem', marginBottom: '20px', letterSpacing: '2px' }}>👤 Qui suis-je ?</h2>
            <p style={{ color: '#7a8a9a', fontSize: '1rem', lineHeight: 1.9, fontFamily: "'Rajdhani', sans-serif", marginBottom: '14px' }}>
              Je suis <span style={{ color: '#ffd700', fontWeight: 700 }}>Reve</span>, ingénieur en réseaux et systèmes informatiques, titulaire d'un Master professionnel obtenu à l'Institut Supérieur d'Informatique (ISI) de Dakar. Passionné par la cybersécurité et les infrastructures IT, je propose des prestations sérieuses et adaptées à vos besoins.
            </p>
            <p style={{ color: '#7a8a9a', fontSize: '1rem', lineHeight: 1.9, fontFamily: "'Rajdhani', sans-serif" }}>
              Dans le cadre de mon mémoire, j'ai travaillé sur l'analyse et la sécurisation d'<span style={{ color: '#00aa00' }}>Active Directory Certificate Services (AD CS)</span>, ce qui m'a permis d'acquérir une expertise solide en cybersécurité et en gestion des infrastructures Windows Server.
            </p>
          </div>

          <div className="info-card">
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: '1.1rem', marginBottom: '24px', letterSpacing: '2px' }}>⚡ Compétences</h2>
            {competences.map((comp, i) => (
              <div key={i} style={{ marginBottom: '18px' }} onMouseEnter={() => setActiveSkill(i)} onMouseLeave={() => setActiveSkill(null)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: activeSkill === i ? '#c8d8e8' : '#7a8a9a', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", transition: 'color 0.3s' }}>{comp.nom}</span>
                  <span style={{ color: comp.color, fontSize: '0.9rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>{comp.niveau}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '10px', width: `${comp.niveau}%`, background: `linear-gradient(90deg, ${comp.color}, ${comp.color === '#00aa00' ? '#ffd700' : '#00aa00'})`, transition: 'width 1s ease', boxShadow: activeSkill === i ? `0 0 10px ${comp.color}` : 'none' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="info-card">
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: '1.1rem', marginBottom: '24px', letterSpacing: '2px' }}>🎓 Formation</h2>
            <div style={{ borderLeft: '2px solid #00aa00', paddingLeft: '20px', marginBottom: '30px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-25px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#00aa00', boxShadow: '0 0 10px #00aa00' }} />
                <h3 style={{ color: '#00aa00', fontSize: '1rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: '1px' }}>Master Professionnel</h3>
                <p style={{ color: '#ffd700', fontSize: '0.85rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '6px' }}>Réseaux & Systèmes</p>
                <p style={{ color: '#4a5a6a', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '10px' }}>ISI — Dakar, Sénégal</p>
                <p style={{ color: '#5a6a7a', fontSize: '0.85rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.7, background: 'rgba(0,100,200,0.05)', border: '1px solid rgba(0,100,200,0.1)', borderRadius: '8px', padding: '12px' }}>
                  Mémoire : Analyse, exploitation des vulnérabilités et stratégies de remédiation dans Active Directory Certificate Services.
                </p>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: '1.1rem', marginBottom: '20px', letterSpacing: '2px' }}>🕐 Disponibilité</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['📍', 'Sur site — Dakar', 'Lun–Ven : 08h–18h'], ['🌐', 'À distance', 'Lun–Sam : Disponible']].map(([icon, titre, info]) => (
                <div key={titre} style={{ background: 'rgba(0,100,200,0.05)', border: '1px solid rgba(0,100,200,0.12)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{icon}</div>
                  <div style={{ color: '#00aa00', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, marginBottom: '4px' }}>{titre}</div>
                  <div style={{ color: '#4a5a6a', fontSize: '0.78rem', fontFamily: "'Rajdhani', sans-serif" }}>{info}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/contact" className="btn-primary">✉️ Me contacter</Link>
        </div>
      </section>
    </div>
  );
}

export default Apropos;