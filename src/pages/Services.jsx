import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Mascotte from '../components/Mascotte';

function Services() {
  const [hover, setHover] = useState(null);

  const services = [
    { icon: '🌐', titre: 'Réseau à distance', description: 'Configuration et administration des réseaux, mise en place de VPN, diagnostic de pannes et sécurisation des infrastructures.', details: ['Configuration VPN', 'Administration réseau', 'Diagnostic de pannes', 'Sécurisation infrastructure', 'Surveillance du trafic'], color: '#00aa00' },
    { icon: '💻', titre: 'Systèmes à distance', description: 'Configuration des systèmes, installation de logiciels, gestion des utilisateurs et diagnostic des pannes informatiques.', details: ['Administration Linux/Windows', 'Installation logiciels', 'Gestion utilisateurs', 'Active Directory', 'Diagnostic système'], color: '#ffd700' },
    { icon: '🔧', titre: 'Assistance sur site', description: 'Installation de réseaux WiFi, dépannage informatique et configuration de routeurs pour entreprises et particuliers à Dakar.', details: ['Installation WiFi', 'Dépannage informatique', 'Configuration routeurs', 'Câblage réseau', 'Support technique'], color: '#00aa00' },
    { icon: '🔒', titre: 'Cybersécurité', description: 'Audit de sécurité, test de vulnérabilités et mise en place de solutions de protection pour vos systèmes.', details: ['Audit de sécurité', 'Test de vulnérabilités', 'Protection des données', 'Analyse des risques', 'Recommandations'], color: '#ffd700' },
    { icon: '🌍', titre: 'Création de sites web', description: 'Mise en place de sites vitrines et portfolios modernes, adaptés à vos besoins professionnels.', details: ['Sites vitrines', 'Portfolios', 'React / WordPress', 'Design responsive', 'Maintenance'], color: '#00aa00' },
    { icon: '📚', titre: 'Formation & Cours', description: 'Cours particuliers en informatique et réseaux pour étudiants et professionnels à Dakar.', details: ['Cours réseaux', 'Linux débutant', 'Cybersécurité', 'Support technique', 'À domicile ou en ligne'], color: '#ffd700' },
  ];

  return (
    <div style={{ background: '#060810', minHeight: '100vh', paddingTop: '70px' }}>
      <style>{`
        .service-card-wrap { background: rgba(10,15,30,0.8); border: 1px solid rgba(0,100,200,0.12); border-radius: 20px; padding: 35px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; cursor: default; }
        .service-card-wrap::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,100,200,0.03), rgba(255,215,0,0.03)); opacity: 0; transition: opacity 0.4s; }
        .service-card-wrap:hover { transform: translateY(-12px); border-color: rgba(255,215,0,0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,100,200,0.05); }
        .service-card-wrap:hover::after { opacity: 1; }
        .detail-item { display: flex; align-items: center; gap: 8px; color: #3a4a5a; font-size: 0.85rem; font-family: 'Rajdhani', sans-serif; padding: 4px 0; transition: color 0.3s; }
        .service-card-wrap:hover .detail-item { color: #8a9aaa; }
        .btn-primary { background: linear-gradient(135deg, #00aa00, #007700); color: #fff; padding: 16px 45px; border-radius: 50px; text-decoration: none; font-size: 15px; font-weight: 700; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s; display: inline-block; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,170,0,0.4); }
      `}</style>

      <section style={{ textAlign: 'center', padding: '80px 20px 40px', background: 'radial-gradient(ellipse at center, rgba(0,50,100,0.12) 0%, transparent 70%)', borderBottom: '1px solid rgba(0,100,200,0.1)' }}>
        <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>— Ce que je propose —</p>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffd700', fontWeight: 900, letterSpacing: '3px', marginBottom: '16px' }}>Mes Services</h1>
        <p style={{ color: '#5a6a7a', fontSize: '1.1rem', fontFamily: "'Rajdhani', sans-serif", maxWidth: '550px', margin: '0 auto 20px', lineHeight: 1.7 }}>Des prestations informatiques sérieuses et adaptées à vos besoins</p>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Mascotte
            variante="services"
            position="right"
            messages={["🛡️ Je protège vos systèmes !", "🌐 Configuration réseau pro !", "💻 Administration Windows & Linux !"]}
          />
        </div>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {services.map((service, index) => (
            <div key={index} className="service-card-wrap" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${service.color}, transparent)`, opacity: hover === index ? 1 : 0, transition: 'opacity 0.4s' }} />
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{service.icon}</div>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1rem', fontWeight: 700, color: hover === index ? '#ffd700' : '#c8d8e8', marginBottom: '12px', letterSpacing: '1px', transition: 'color 0.3s' }}>{service.titre}</h3>
              <p style={{ color: '#4a5a6a', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: "'Rajdhani', sans-serif", marginBottom: '20px' }}>{service.description}</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
                {service.details.map((detail, i) => (
                  <div key={i} className="detail-item">
                    <span style={{ color: service.color, fontSize: '0.7rem' }}>◆</span>{detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, rgba(0,30,60,0.3), rgba(6,8,16,0.9))', borderTop: '1px solid rgba(255,215,0,0.08)' }}>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#ffd700', fontWeight: 900, marginBottom: '16px' }}>Intéressé par mes services ?</h2>
        <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', marginBottom: '36px' }}>Contactez-moi pour discuter de votre projet</p>
        <Link to="/contact" className="btn-primary">🚀 Demander un devis gratuit</Link>
      </section>
    </div>
  );
}

export default Services;