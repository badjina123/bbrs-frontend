import React, { useState, useEffect, useRef } from 'react';
import avatar from './avatar.gif';

const questions = [
  "👋 Salut ! Comment vous allez aujourd'hui ?",
  "🤔 Vous cherchez un expert en cybersécurité ?",
  "💻 Besoin d'aide avec votre réseau ?",
  "🚀 On travaille ensemble sur un projet ?",
];

const reponses = {
  bien: "Super ! 😄 Je suis là si vous avez besoin d'aide !",
  mal: "Oh non ! 😢 Peut-être qu'un bon projet IT va vous remonter le moral ?",
  bonjour: "Bonjour ! 👋 Bienvenue sur BBRS Morphix IT !",
  salut: "Salut salut ! 😎 Qu'est-ce que je peux faire pour vous ?",
  oui: "Parfait ! 🎉 Contactez-nous via le formulaire Contact !",
  non: "Pas de problème ! 😄 Je suis là si vous changez d'avis !",
  service: "On propose : Cybersécurité, Réseaux, Administration système ! 💪",
  prix: "Les tarifs dépendent du projet. Contactez-nous pour un devis gratuit ! 📩",
  contact: "Allez dans l'onglet Contact et envoyez-nous un message ! 📧",
  default: "Hmm 🤔 Je ne suis qu'un petit robot ! Essayez de me parler autrement 😄"
};

const getReponse = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes('bien') || m.includes('super') || m.includes('top')) return reponses.bien;
  if (m.includes('mal') || m.includes('pas bien') || m.includes('fatigue')) return reponses.mal;
  if (m.includes('bonjour') || m.includes('bonsoir')) return reponses.bonjour;
  if (m.includes('salut') || m.includes('hello') || m.includes('hi')) return reponses.salut;
  if (m.includes('oui') || m.includes('yes') || m.includes('ok')) return reponses.oui;
  if (m.includes('non') || m.includes('no') || m.includes('pas')) return reponses.non;
  if (m.includes('service') || m.includes('offre') || m.includes('propose')) return reponses.service;
  if (m.includes('prix') || m.includes('tarif') || m.includes('cout') || m.includes('coût')) return reponses.prix;
  if (m.includes('contact') || m.includes('joindre') || m.includes('appel')) return reponses.contact;
  return reponses.default;
};

function ChatBot() {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [bounce, setBounce] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ouvert) {
        setBounce(true);
        setTimeout(() => setBounce(false), 1000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [ouvert]);

  useEffect(() => {
    if (ouvert && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ type: 'bot', text: questions[0] }]);
        setQuestionIndex(1);
      }, 500);
    }
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return;
    const interval = setInterval(() => {
      const nextQ = questions[questionIndex % questions.length];
      setMessages(prev => [...prev, { type: 'bot', text: nextQ }]);
      setQuestionIndex(prev => prev + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, [ouvert, questionIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyer = () => {
    if (!input.trim()) return;
    const userMsg = { type: 'user', text: input };
    const botMsg = { type: 'bot', text: getReponse(input) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') envoyer();
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>

      {!ouvert && (
        <div style={{
          position: 'absolute', bottom: '90px', right: '0',
          background: '#111', border: '2px solid #00aa00',
          borderRadius: '15px 15px 0 15px', padding: '10px 14px',
          color: '#ffd700', fontSize: '13px', whiteSpace: 'nowrap',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
          boxShadow: '0 0 15px rgba(0,170,0,0.3)'
        }}>
          💬 Besoin d'aide ? Clique !
        </div>
      )}

      {ouvert && (
        <div style={{
          width: '320px', height: '420px',
          background: '#0a0a0a', border: '2px solid #00aa00',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 0 30px rgba(0,170,0,0.4)',
          position: 'absolute', bottom: '90px', right: '0',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #001a00, #003300)',
            padding: '12px 16px', display: 'flex', alignItems: 'center',
            gap: '10px', borderBottom: '1px solid #00aa00'
          }}>
            <img
              src={avatar}
              alt="bot"
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #00aa00', objectFit: 'cover' }}
            />
            <div>
              <div style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '12px', fontWeight: 700 }}>MorphixBot ✨</div>
              <div style={{ color: '#00aa00', fontSize: '11px', fontFamily: "'Rajdhani', sans-serif" }}>● En ligne</div>
            </div>
            <button onClick={() => setOuvert(false)} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: '#666', fontSize: '18px', cursor: 'pointer'
            }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end', gap: '6px'
              }}>
                {msg.type === 'bot' && (
                  <img src={avatar} alt="bot" style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{
                  maxWidth: '75%', padding: '8px 12px',
                  borderRadius: msg.type === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  background: msg.type === 'user' ? 'linear-gradient(135deg, #00aa00, #007700)' : 'rgba(255,255,255,0.05)',
                  border: msg.type === 'bot' ? '1px solid rgba(0,170,0,0.2)' : 'none',
                  color: '#e8e8e8', fontSize: '13px', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.5
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid rgba(0,170,0,0.2)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Écrivez un message..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,170,0,0.3)',
                borderRadius: '20px', padding: '8px 14px', color: '#e8e8e8',
                fontSize: '13px', fontFamily: "'Rajdhani', sans-serif", outline: 'none'
              }}
            />
            <button onClick={envoyer} style={{
              background: 'linear-gradient(135deg, #00aa00, #007700)', border: 'none',
              borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer',
              color: '#fff', fontSize: '16px'
            }}>→</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOuvert(!ouvert)}
        style={{
          width: '65px', height: '65px', borderRadius: '50%',
          border: '3px solid #ffd700', cursor: 'pointer', overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0,170,0,0.5)',
          transition: 'all 0.3s', padding: 0,
          animation: bounce ? 'bounce 0.5s ease' : 'none'
        }}
      >
        <img src={avatar} alt="chat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}

export default ChatBot;