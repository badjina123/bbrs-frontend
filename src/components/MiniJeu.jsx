import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ENNEMIS_TYPES = [
  { emoji: '🦠', nom: 'Virus',   points: 10, couleur: '#ff4444', hp: 1 },
  { emoji: '🐛', nom: 'Bug',     points: 15, couleur: '#ffaa00', hp: 1 },
  { emoji: '💀', nom: 'Hacker',  points: 25, couleur: '#ff6600', hp: 2 },
  { emoji: '👾', nom: 'Malware', points: 40, couleur: '#ff00ff', hp: 3 },
  { emoji: '🕷️', nom: 'Spyware', points: 20, couleur: '#cc44ff', hp: 1 },
  { emoji: '💣', nom: 'Bombe',   points: 50, couleur: '#ff2222', hp: 1 },
];

const POWERUPS = [
  { emoji: '⚡', nom: 'Boost x3', couleur: '#ffd700', effet: 'triple' },
  { emoji: '🔥', nom: 'Feu',      couleur: '#ff6600', effet: 'fire'   },
  { emoji: '❄️',  nom: 'Gel',      couleur: '#00ccff', effet: 'freeze' },
  { emoji: '💊', nom: '+1 Vie',   couleur: '#00ff88', effet: 'vie'    },
];

const TUTO_STEPS = [
  { texte: "Salut ! Je suis REVE, ta guerrière cyber. Bienvenue dans CYBER DEFENSE !", emoji: '👋' },
  { texte: "Des virus, hackers et malwares envahissent le réseau ! Clique dessus VITE pour les éliminer !", emoji: '🦠' },
  { texte: "Certains ennemis ont plusieurs HP — tu dois cliquer plusieurs fois ! Les barres de vie t'aident.", emoji: '💀' },
  { texte: "Fais des COMBOS en cliquant rapidement ! x2, x3, x5... tes points explosent !", emoji: '⚡' },
  { texte: "Des power-ups apparaissent parfois — ATTRAPE-LES ! Triple points, Gel, +Vie !", emoji: '🎁' },
  { texte: "RECOMPENSES : 500pts = -10%, 1000pts = -20%, 2000pts = -30% sur mes prestations ! Bonne chance !", emoji: '🏆' },
];

const RECOMPENSES = [
  { seuil: 500,  code: 'CYBER10', reduction: '10%', desc: 'Réduction sur une prestation',       couleur: '#00aa00', emoji: '🥉' },
  { seuil: 1000, code: 'CYBER20', reduction: '20%', desc: 'Réduction + priorité de traitement', couleur: '#ffd700', emoji: '🥈' },
  { seuil: 2000, code: 'CYBER30', reduction: '30%', desc: 'Réduction + consultation offerte',   couleur: '#ff6600', emoji: '🥇' },
];

function MiniJeu() {
  const [phase, setPhase] = useState('tuto');
  const [tutoStep, setTutoStep] = useState(0);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [vies, setVies] = useState(3);
  const [ennemis, setEnnemis] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [niveau, setNiveau] = useState(1);
  const [combo, setCombo] = useState(0);
  const [multiplicateur, setMultiplicateur] = useState(1);
  const [freeze, setFreeze] = useState(false);
  const [shake, setShake] = useState(false);
  const [flashMsg, setFlashMsg] = useState(null);
  const [mascotteTip, setMascotteTip] = useState('');
  const [showMascotte, setShowMascotte] = useState(false);
  const [recompense, setRecompense] = useState(null);
  const [recompensesDebloquees, setRecompensesDebloquees] = useState([]);
  const [codeCopie, setCodeCopie] = useState(false);
  const [showRecompensePopup, setShowRecompensePopup] = useState(false);

  const zoneRef = useRef(null);
  const intervalSpawnRef = useRef(null);
  const intervalTickRef = useRef(null);
  const intervalPowerupRef = useRef(null);
  const idRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef(null);
  const multRef = useRef(1);
  const freezeRef = useRef(false);
  const scoreRef = useRef(0);
  const viesRef = useRef(3);
  const recompensesRef = useRef([]);

  const stopAll = useCallback(() => {
    clearInterval(intervalSpawnRef.current);
    clearInterval(intervalTickRef.current);
    clearInterval(intervalPowerupRef.current);
  }, []);

  const showTip = useCallback((msg, duree = 3000) => {
    setMascotteTip(msg);
    setShowMascotte(true);
    setTimeout(() => setShowMascotte(false), duree);
  }, []);

  const triggerFlash = (msg, color) => {
    setFlashMsg({ msg, color });
    setTimeout(() => setFlashMsg(null), 900);
  };

  const resetCombo = useCallback(() => {
    comboRef.current = 0;
    setCombo(0);
    multRef.current = 1;
    setMultiplicateur(1);
  }, []);

  const verifierRecompenses = useCallback((scoreActuel) => {
    RECOMPENSES.forEach(r => {
      if (scoreActuel >= r.seuil && !recompensesRef.current.includes(r.code)) {
        recompensesRef.current = [...recompensesRef.current, r.code];
        setRecompensesDebloquees(prev => [...prev, r.code]);
        setRecompense(r);
        setShowRecompensePopup(true);
        stopAll();
      }
    });
  }, [stopAll]);

  const demarrer = useCallback(() => {
    stopAll();
    setScore(0); scoreRef.current = 0;
    setVies(3); viesRef.current = 3;
    setEnnemis([]); setPowerups([]); setExplosions([]);
    setNiveau(1); setCombo(0); setMultiplicateur(1);
    setFreeze(false); freezeRef.current = false;
    comboRef.current = 0; multRef.current = 1;
    recompensesRef.current = [];
    setRecompensesDebloquees([]);
    setShowRecompensePopup(false);
    setRecompense(null);
    setPhase('jeu');
    setTimeout(() => showTip('Le combat commence ! Clique vite !', 2500), 500);
  }, [stopAll, showTip]);

  const continuerApresRecompense = useCallback(() => {
    setShowRecompensePopup(false);
    setPhase('jeu');
    setTimeout(() => showTip('Continue ! La prochaine recompense t\'attend !', 2000), 300);
  }, [showTip]);

  useEffect(() => {
    if (phase !== 'jeu') return;
    const vitesse = Math.max(600, 1600 - niveau * 120);
    intervalSpawnRef.current = setInterval(() => {
      const zone = zoneRef.current;
      if (!zone) return;
      const w = zone.offsetWidth;
      const type = ENNEMIS_TYPES[Math.floor(Math.random() * Math.min(ENNEMIS_TYPES.length, 2 + niveau))];
      setEnnemis(prev => [...prev, {
        id: idRef.current++,
        x: Math.random() * (w - 70) + 10,
        y: -60,
        ...type,
        hpMax: type.hp,
        hpActuel: type.hp,
        vy: (0.8 + Math.random() * 0.8 + niveau * 0.2),
        taille: 44 + Math.random() * 20,
        rotDir: Math.random() > 0.5 ? 1 : -1,
      }]);
    }, vitesse);
    return () => clearInterval(intervalSpawnRef.current);
  }, [phase, niveau]);

  useEffect(() => {
    if (phase !== 'jeu') return;
    intervalPowerupRef.current = setInterval(() => {
      const zone = zoneRef.current;
      if (!zone) return;
      const w = zone.offsetWidth;
      const pu = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
      setPowerups(prev => [...prev, {
        id: idRef.current++,
        x: Math.random() * (w - 60) + 10,
        y: -50,
        vy: 0.9,
        ...pu,
      }]);
    }, Math.max(5000, 8000 - niveau * 400));
    return () => clearInterval(intervalPowerupRef.current);
  }, [phase, niveau]);

  useEffect(() => {
    if (phase !== 'jeu') return;
    intervalTickRef.current = setInterval(() => {
      const zone = zoneRef.current;
      if (!zone) return;
      const h = zone.offsetHeight;
      if (!freezeRef.current) {
        setEnnemis(prev => {
          let perdus = 0;
          const survivants = prev.reduce((acc, e) => {
            const ny = e.y + e.vy;
            if (ny > h) { perdus++; return acc; }
            return [...acc, { ...e, y: ny }];
          }, []);
          if (perdus > 0) {
            viesRef.current = Math.max(0, viesRef.current - perdus);
            setVies(viesRef.current);
            setShake(true);
            setTimeout(() => setShake(false), 400);
            resetCombo();
            if (viesRef.current <= 0) { stopAll(); setPhase('gameover'); }
          }
          return survivants;
        });
      }
      setPowerups(prev => prev.filter(p => p.y < h).map(p => ({ ...p, y: p.y + p.vy })));
      setScore(s => {
        const ns = s + Math.floor(niveau * 0.3);
        scoreRef.current = ns;
        setNiveau(Math.floor(ns / 300) + 1);
        verifierRecompenses(ns);
        return ns;
      });
    }, 25);
    return () => clearInterval(intervalTickRef.current);
  }, [phase, resetCombo, stopAll, niveau, verifierRecompenses]);

  const cliquerEnnemi = useCallback((id, x, y, points, hpActuel) => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboRef.current += 1;
    setCombo(comboRef.current);
    const newMult = comboRef.current >= 10 ? 5 : comboRef.current >= 5 ? 3 : comboRef.current >= 3 ? 2 : 1;
    multRef.current = newMult;
    setMultiplicateur(newMult);
    comboTimerRef.current = setTimeout(() => resetCombo(), 2000);
    const newHp = hpActuel - 1;
    if (newHp <= 0) {
      const gain = points * multRef.current;
      const ns = scoreRef.current + gain;
      scoreRef.current = ns;
      setScore(ns);
      setEnnemis(prev => prev.filter(e => e.id !== id));
      const expId = Date.now() + Math.random();
      setExplosions(prev => [...prev, { id: expId, x, y, gain, mult: multRef.current }]);
      setTimeout(() => setExplosions(prev => prev.filter(e => e.id !== expId)), 700);
      if (comboRef.current === 3) triggerFlash('COMBO x2 !', '#ff6600');
      if (comboRef.current === 5) { triggerFlash('COMBO x3 !', '#ffd700'); showTip('INCROYABLE ! x3 !', 1500); }
      if (comboRef.current === 10) { triggerFlash('COMBO x5 !', '#00ff88'); showTip('INARRETABLE !', 2000); }
      if (ns > highscore) setHighscore(ns);
      verifierRecompenses(ns);
    } else {
      setEnnemis(prev => prev.map(e => e.id === id ? { ...e, hpActuel: newHp } : e));
    }
  }, [resetCombo, showTip, highscore, verifierRecompenses]);

  const cliquerPowerup = useCallback((id, effet) => {
    setPowerups(prev => prev.filter(p => p.id !== id));
    if (effet === 'triple') {
      multRef.current = 3; setMultiplicateur(3);
      triggerFlash('Triple Points !', '#ffd700');
      showTip('Triple points active !', 2000);
      setTimeout(() => { multRef.current = 1; setMultiplicateur(1); }, 5000);
    } else if (effet === 'freeze') {
      freezeRef.current = true; setFreeze(true);
      triggerFlash('Gel active !', '#00ccff');
      showTip('Ennemis geles !', 2000);
      setTimeout(() => { freezeRef.current = false; setFreeze(false); }, 4000);
    } else if (effet === 'fire') {
      setEnnemis([]);
      triggerFlash('Tout brule !', '#ff6600');
      showTip('Tous les ennemis elimines !', 2000);
      const ns = scoreRef.current + 100;
      scoreRef.current = ns;
      setScore(ns);
      verifierRecompenses(ns);
    } else if (effet === 'vie') {
      viesRef.current = Math.min(5, viesRef.current + 1);
      setVies(viesRef.current);
      triggerFlash('+1 Vie !', '#00ff88');
      showTip('Vie recuperee !', 2000);
    }
  }, [showTip, verifierRecompenses]);

  const copierCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopie(true);
      setTimeout(() => setCodeCopie(false), 2000);
    });
  };

  useEffect(() => {
    if (phase !== 'jeu') return;
    if (niveau === 2) showTip('Niveau 2 ! Les ennemis accelerent !', 2000);
    if (niveau === 3) showTip('Niveau 3 ! Hackers resistants !', 2000);
    if (niveau === 5) showTip('Niveau 5 ! Vraie guerriere cyber !', 2000);
  }, [niveau, phase, showTip]);

  const prochaineRecompense = RECOMPENSES.find(r => !recompensesDebloquees.includes(r.code));

  const btnStyle = {
    width: '100%', padding: '12px',
    borderRadius: '10px',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.95rem', fontWeight: 700,
    cursor: 'pointer', letterSpacing: '2px',
    marginBottom: '10px', transition: 'all 0.3s',
    textAlign: 'center', display: 'block',
    textDecoration: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', fontFamily: "'Rajdhani', sans-serif", position: 'relative' }}>
      <style>{`
        @keyframes explode { 0%{transform:scale(0.5);opacity:1;} 100%{transform:scale(2.8);opacity:0;} }
        @keyframes floatScore { 0%{transform:translateY(0);opacity:1;} 100%{transform:translateY(-70px);opacity:0;} }
        @keyframes enemyWobble { 0%,100%{transform:rotate(-8deg) scale(1);} 50%{transform:rotate(8deg) scale(1.12);} }
        @keyframes puFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-6px) scale(1.15);} }
        @keyframes shakeAnim { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-5px);} 80%{transform:translateX(5px);} }
        @keyframes flashAnim { 0%{opacity:0;transform:scale(0.6);} 30%{opacity:1;transform:scale(1.2);} 70%{opacity:1;transform:scale(1);} 100%{opacity:0;transform:scale(0.9);} }
        @keyframes mascSlide { 0%{transform:translateY(20px);opacity:0;} 100%{transform:translateY(0);opacity:1;} }
        @keyframes tutoIn { 0%{transform:scale(0.9);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        @keyframes popupIn { 0%{transform:scale(0.7) translateY(30px);opacity:0;} 60%{transform:scale(1.05) translateY(-5px);} 100%{transform:scale(1) translateY(0);opacity:1;} }
        @keyframes codeShine { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1;} 100%{transform:translateY(400px) rotate(720deg);opacity:0;} }
        .ennemi-btn { cursor:crosshair; user-select:none; position:absolute; display:flex; flex-direction:column; align-items:center; }
        .ennemi-btn:active { transform:scale(0.75) !important; }
        .pu-btn { cursor:pointer; user-select:none; position:absolute; animation:puFloat 1.5s ease-in-out infinite; }
        .code-promo-text { background: linear-gradient(90deg, #ffd700, #ffaa00, #ffd700); background-size: 200% auto; animation: codeShine 2s linear infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Orbitron', sans-serif; font-size: 2rem; font-weight: 900; letter-spacing: 4px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, rgba(6,8,20,0.98), rgba(10,15,30,0.98))', border: '1px solid rgba(255,215,0,0.25)', borderRadius: '18px 18px 0 0', padding: '14px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: prochaineRecompense ? '10px' : '0' }}>
          <div>
            <div style={{ color: '#ffd700', fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Score</div>
            <div style={{ color: '#fff', fontSize: '1.6rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, lineHeight: 1 }}>{score.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#00aa00', fontSize: '0.7rem', letterSpacing: '3px' }}>NIVEAU</div>
            <div style={{ color: '#00ff88', fontSize: '1.6rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, lineHeight: 1 }}>{niveau}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ff4444', fontSize: '0.7rem', letterSpacing: '3px' }}>VIES</div>
            <div style={{ fontSize: '1.3rem', lineHeight: 1 }}>{'❤️'.repeat(Math.max(0, vies))}{'🖤'.repeat(Math.max(0, 3 - vies))}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ff6600', fontSize: '0.7rem', letterSpacing: '3px' }}>COMBO</div>
            <div style={{ color: multiplicateur > 1 ? '#ff6600' : '#444', fontSize: '1.4rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, lineHeight: 1 }}>
              {combo > 0 ? 'x' + multiplicateur : '—'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#8833ff', fontSize: '0.7rem', letterSpacing: '3px' }}>RECORD</div>
            <div style={{ color: '#cc88ff', fontSize: '1.3rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, lineHeight: 1 }}>{highscore.toLocaleString()}</div>
          </div>
        </div>
        {prochaineRecompense && phase === 'jeu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#7a8a9a', fontSize: '0.7rem' }}>Prochain cadeau {prochaineRecompense.emoji}</span>
              <span style={{ color: prochaineRecompense.couleur, fontSize: '0.7rem', fontWeight: 700 }}>{score}/{prochaineRecompense.seuil} pts</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: Math.min(100, (score / prochaineRecompense.seuil) * 100) + '%', background: 'linear-gradient(90deg, ' + prochaineRecompense.couleur + ', #ffffff44)', borderRadius: '10px', transition: 'width 0.3s ease', boxShadow: '0 0 8px ' + prochaineRecompense.couleur }} />
            </div>
          </div>
        )}
      </div>

      {/* ZONE DE JEU */}
      <div
        ref={zoneRef}
        style={{
          position: 'relative', width: '100%', height: '420px',
          background: freeze ? 'radial-gradient(ellipse at center, #001830 0%, #000810 100%)' : 'radial-gradient(ellipse at center, #060c1a 0%, #020408 100%)',
          border: '1px solid rgba(255,215,0,0.12)', borderTop: 'none',
          overflow: 'hidden', cursor: 'crosshair',
          animation: shake ? 'shakeAnim 0.4s ease' : 'none',
        }}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
          <defs><pattern id="g3" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={freeze ? '#00ccff' : '#00ff88'} strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#g3)"/>
        </svg>

        {freeze && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,150,255,0.06)', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: '#00ccff', fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', letterSpacing: '3px', fontWeight: 700 }}>GEL ACTIF</div>
          </div>
        )}

        {flashMsg && (
          <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, animation: 'flashAnim 0.9s ease forwards', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <div style={{ color: flashMsg.color, fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 900, textShadow: '0 0 20px ' + flashMsg.color }}>{flashMsg.msg}</div>
          </div>
        )}

        {/* TUTO */}
        {phase === 'tuto' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '20px', animation: 'tutoIn 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', maxWidth: '500px' }}>
              <svg viewBox="0 0 80 100" width="80" height="100" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 15px #ffd700aa)' }}>
                <ellipse cx="40" cy="88" rx="30" ry="10" fill="#ffd700" opacity="0.25"/>
                <rect x="28" y="55" width="24" height="30" rx="5" fill="#1a0a0a" stroke="#ffd700" strokeWidth="1"/>
                <path d="M28 58 Q40 52 52 58 L52 72 Q40 76 28 72Z" fill="#2a1200" stroke="#ffd700" strokeWidth="0.6"/>
                <circle cx="40" cy="66" r="3" fill="#ff6600" stroke="#ffd700" strokeWidth="0.6"/>
                <rect x="36" y="48" width="8" height="10" rx="3" fill="#4a2010"/>
                <ellipse cx="40" cy="37" rx="16" ry="17" fill="#4a2010"/>
                <path d="M26 33 Q22 25 24 16 Q30 8 40 7 Q50 8 56 16 Q58 25 54 33" fill="#0a0205"/>
                <path d="M26 33 Q20 44 22 58" stroke="#0d0308" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M54 33 Q60 44 58 58" stroke="#0d0308" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <ellipse cx="40" cy="40" rx="13" ry="14" fill="#5c2d0a"/>
                <ellipse cx="34" cy="38" rx="5" ry="6" fill="#001a00"/>
                <ellipse cx="34" cy="38.5" rx="3.5" ry="4.5" fill="#00cc55"/>
                <circle cx="35.5" cy="36" r="1.8" fill="white" opacity="0.9"/>
                <ellipse cx="46" cy="38" rx="5" ry="6" fill="#001a00"/>
                <ellipse cx="46" cy="38.5" rx="3.5" ry="4.5" fill="#00cc55"/>
                <circle cx="47.5" cy="36" r="1.8" fill="white" opacity="0.9"/>
                <path d="M36 47 Q40 50 44 47" stroke="#cc4422" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              <div style={{ background: 'rgba(0,8,24,0.97)', border: '2px solid #ffd700', borderRadius: '20px 20px 20px 0', padding: '18px 22px', flex: 1, boxShadow: '0 0 25px rgba(255,215,0,0.2)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>{TUTO_STEPS[tutoStep].emoji}</div>
                <p style={{ color: '#d8e8f8', fontFamily: "'Rajdhani', sans-serif", fontSize: '14px', lineHeight: 1.7, margin: 0, textAlign: 'center' }}>
                  {TUTO_STEPS[tutoStep].texte}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {TUTO_STEPS.map((_, i) => (
                <div key={i} style={{ width: i === tutoStep ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === tutoStep ? '#ffd700' : i < tutoStep ? '#00aa00' : '#333', transition: 'all 0.3s' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {tutoStep > 0 && (
                <button onClick={() => setTutoStep(t => t - 1)} style={{ background: 'transparent', color: '#7a8a9a', border: '1px solid #333', borderRadius: '50px', padding: '10px 24px', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer' }}>
                  Precedent
                </button>
              )}
              {tutoStep < TUTO_STEPS.length - 1 ? (
                <button onClick={() => setTutoStep(t => t + 1)} style={{ background: 'linear-gradient(135deg, #1a3a6a, #0a2a4a)', color: '#fff', border: '1px solid rgba(0,150,255,0.4)', borderRadius: '50px', padding: '10px 28px', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', fontWeight: 700 }}>
                  Suivant
                </button>
              ) : (
                <button onClick={demarrer} style={{ background: 'linear-gradient(135deg, #00aa00, #007700)', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 40px', fontSize: '1rem', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', letterSpacing: '3px', textTransform: 'uppercase', boxShadow: '0 0 25px rgba(0,170,0,0.5)' }}>
                  JOUER !
                </button>
              )}
              {tutoStep < TUTO_STEPS.length - 1 && (
                <button onClick={demarrer} style={{ background: 'transparent', color: '#5a6a7a', border: '1px solid #2a3a4a', borderRadius: '50px', padding: '10px 24px', fontSize: '0.85rem', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer' }}>
                  Passer
                </button>
              )}
            </div>
          </div>
        )}

        {/* POPUP RECOMPENSE */}
        {showRecompensePopup && recompense && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: Math.floor(Math.random() * 100) + '%',
                top: '-20px',
                width: '8px', height: '8px',
                background: ['#ffd700','#00ff88','#ff6600','#ff4444','#cc66ff'][i % 5],
                borderRadius: i % 2 === 0 ? '50%' : '0',
                animation: 'confettiFall ' + (1.5 + i * 0.1) + 's ease ' + (i * 0.05) + 's forwards',
                pointerEvents: 'none',
              }} />
            ))}
            <div style={{ background: 'linear-gradient(135deg, #060810, #0a1020)', border: '2px solid ' + recompense.couleur, borderRadius: '24px', padding: '36px 32px', maxWidth: '380px', width: '90%', textAlign: 'center', animation: 'popupIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', boxShadow: '0 0 60px ' + recompense.couleur + '44', zIndex: 31, position: 'relative' }}>
              <div style={{ fontSize: '4rem', marginBottom: '8px', filter: 'drop-shadow(0 0 20px ' + recompense.couleur + ')' }}>{recompense.emoji}</div>
              <div style={{ color: recompense.couleur, fontFamily: "'Orbitron', sans-serif", fontSize: '1rem', letterSpacing: '3px', marginBottom: '4px', textTransform: 'uppercase' }}>Felicitations !</div>
              <h3 style={{ color: '#fff', fontFamily: "'Orbitron', sans-serif", fontSize: '1.3rem', fontWeight: 900, marginBottom: '6px' }}>
                {recompense.reduction} de reduction !
              </h3>
              <p style={{ color: '#7a8a9a', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '24px', lineHeight: 1.6 }}>
                {recompense.desc}
                <br />
                <span style={{ color: recompense.couleur }}>Score atteint : {recompense.seuil} pts</span>
              </p>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1.5px dashed ' + recompense.couleur, borderRadius: '14px', padding: '16px 24px', marginBottom: '20px' }}>
                <div style={{ color: '#7a8a9a', fontSize: '0.7rem', letterSpacing: '3px', marginBottom: '8px', textTransform: 'uppercase' }}>Ton code promo</div>
                <div className="code-promo-text">{recompense.code}</div>
                <div style={{ color: '#5a6a7a', fontSize: '0.75rem', marginTop: '6px', fontFamily: "'Rajdhani', sans-serif" }}>A mentionner lors de votre contact</div>
              </div>
              <button
                onClick={() => copierCode(recompense.code)}
                style={{ ...btnStyle, background: codeCopie ? 'linear-gradient(135deg, #007700, #005500)' : 'rgba(255,215,0,0.1)', border: '1px solid ' + recompense.couleur, color: codeCopie ? '#00ff88' : recompense.couleur }}
              >
                {codeCopie ? 'Code copie !' : 'Copier le code'}
              </button>
              <Link
                to="/contact"
                style={{ ...btnStyle, background: 'linear-gradient(135deg, #00aa00, #007700)', color: '#fff', border: 'none', boxShadow: '0 0 20px rgba(0,170,0,0.3)' }}
              >
                Contacter maintenant
              </Link>
              <button
                onClick={continuerApresRecompense}
                style={{ ...btnStyle, background: 'transparent', color: '#5a6a7a', border: '1px solid #2a3a4a', marginBottom: 0 }}
              >
                Continuer a jouer
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {phase === 'gameover' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: 'rgba(0,0,0,0.9)', animation: 'tutoIn 0.4s ease' }}>
            <div style={{ fontSize: '3rem' }}>💥</div>
            <div style={{ color: '#ff4444', fontFamily: "'Orbitron', sans-serif", fontSize: '1.8rem', fontWeight: 900, letterSpacing: '3px' }}>GAME OVER</div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#7a8a9a', fontSize: '0.7rem', letterSpacing: '2px' }}>SCORE FINAL</div>
                <div style={{ color: '#ffd700', fontSize: '1.6rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 900 }}>{score.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#7a8a9a', fontSize: '0.7rem', letterSpacing: '2px' }}>NIVEAU ATTEINT</div>
                <div style={{ color: '#00ff88', fontSize: '1.6rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 900 }}>{niveau}</div>
              </div>
            </div>
            {recompensesDebloquees.length > 0 && (
              <div style={{ background: 'rgba(0,170,0,0.1)', border: '1px solid rgba(0,170,0,0.3)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center', maxWidth: '320px' }}>
                <div style={{ color: '#00aa00', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '8px' }}>TES CODES GAGNES</div>
                {recompensesDebloquees.map(code => (
                  <div key={code} style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '3px', marginBottom: '4px' }}>{code}</div>
                ))}
                <div style={{ color: '#5a6a7a', fontSize: '0.75rem', marginTop: '6px', fontFamily: "'Rajdhani', sans-serif" }}>Utilise-les sur la page Contact !</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={demarrer} style={{ background: 'linear-gradient(135deg, #aa2200, #ff4400)', color: '#fff', border: 'none', borderRadius: '50px', padding: '13px 36px', fontSize: '1rem', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '2px', cursor: 'pointer' }}>
                REJOUER
              </button>
              <button onClick={() => { setTutoStep(0); setPhase('tuto'); }} style={{ background: 'transparent', color: '#7a8a9a', border: '1px solid #333', borderRadius: '50px', padding: '13px 28px', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer' }}>
                Tuto
              </button>
            </div>
          </div>
        )}

        {/* ENNEMIS */}
        {phase === 'jeu' && ennemis.map(e => (
          <div key={e.id} className="ennemi-btn"
            style={{ left: e.x, top: e.y, width: e.taille, filter: 'drop-shadow(0 0 8px ' + e.couleur + ')' }}
            onClick={() => cliquerEnnemi(e.id, e.x, e.y, e.points, e.hpActuel)}
          >
            {e.hpMax > 1 && (
              <div style={{ width: e.taille, height: '5px', background: '#111', borderRadius: '3px', marginBottom: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: ((e.hpActuel / e.hpMax) * 100) + '%', background: e.hpActuel > 1 ? '#00ff88' : '#ff4444', borderRadius: '3px', transition: 'width 0.2s' }} />
              </div>
            )}
            <span style={{ fontSize: (e.taille * 0.58) + 'px', display: 'block', textAlign: 'center', animation: 'enemyWobble 0.5s ease-in-out infinite' }}>{e.emoji}</span>
            <span style={{ fontSize: '8px', color: e.couleur, fontWeight: 700, display: 'block', textAlign: 'center' }}>{e.nom}</span>
          </div>
        ))}

        {/* POWERUPS */}
        {phase === 'jeu' && powerups.map(p => (
          <div key={p.id} className="pu-btn"
            style={{ left: p.x, top: p.y, filter: 'drop-shadow(0 0 12px ' + p.couleur + ')' }}
            onClick={() => cliquerPowerup(p.id, p.effet)}
          >
            <div style={{ background: 'rgba(0,0,0,0.7)', border: '2px solid ' + p.couleur, borderRadius: '12px', padding: '6px 10px', textAlign: 'center' }}>
              <span style={{ fontSize: '1.6rem', display: 'block' }}>{p.emoji}</span>
              <span style={{ fontSize: '8px', color: p.couleur, fontWeight: 700 }}>{p.nom}</span>
            </div>
          </div>
        ))}

        {/* EXPLOSIONS */}
        {explosions.map(ex => (
          <div key={ex.id} style={{ position: 'absolute', left: ex.x, top: ex.y, pointerEvents: 'none', zIndex: 15 }}>
            <div style={{ animation: 'explode 0.6s ease forwards', fontSize: '1.8rem' }}>💥</div>
            <div style={{ animation: 'floatScore 0.7s ease forwards', color: ex.mult > 1 ? '#ff6600' : '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: ex.mult > 1 ? '16px' : '13px', fontWeight: 900, whiteSpace: 'nowrap' }}>
              +{ex.gain}{ex.mult > 1 ? ' x' + ex.mult : ''}
            </div>
          </div>
        ))}

        {/* MASCOTTE TIPS */}
        {showMascotte && phase === 'jeu' && (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'flex-end', gap: '10px', zIndex: 20, animation: 'mascSlide 0.3s ease' }}>
            <svg viewBox="0 0 50 60" width="50" height="60" style={{ filter: 'drop-shadow(0 0 8px #ffd700aa)', flexShrink: 0 }}>
              <ellipse cx="25" cy="53" rx="18" ry="6" fill="#ffd700" opacity="0.2"/>
              <rect x="16" y="32" width="18" height="18" rx="4" fill="#1a0a0a" stroke="#ffd700" strokeWidth="0.8"/>
              <path d="M16 35 Q25 30 34 35 L34 44 Q25 47 16 44Z" fill="#2a1200" stroke="#ffd700" strokeWidth="0.5"/>
              <rect x="21" y="26" width="8" height="8" rx="2.5" fill="#4a2010"/>
              <ellipse cx="25" cy="19" rx="11" ry="12" fill="#4a2010"/>
              <path d="M15 16 Q12 10 14 5 Q19 1 25 1 Q31 1 36 5 Q38 10 35 16" fill="#0a0205"/>
              <path d="M15 16 Q11 22 12 32" stroke="#0d0308" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M35 16 Q39 22 38 32" stroke="#0d0308" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <ellipse cx="25" cy="21" rx="9" ry="10" fill="#5c2d0a"/>
              <ellipse cx="21" cy="20" rx="3.5" ry="4" fill="#001a00"/>
              <ellipse cx="21" cy="20.5" rx="2.5" ry="3" fill="#00cc55"/>
              <circle cx="22" cy="18.5" r="1.5" fill="white" opacity="0.9"/>
              <ellipse cx="29" cy="20" rx="3.5" ry="4" fill="#001a00"/>
              <ellipse cx="29" cy="20.5" rx="2.5" ry="3" fill="#00cc55"/>
              <circle cx="30" cy="18.5" r="1.5" fill="white" opacity="0.9"/>
              <path d="M22 28 Q25 30 28 28" stroke="#cc4422" strokeWidth="1" fill="none" strokeLinecap="round"/>
            </svg>
            <div style={{ background: 'rgba(0,8,24,0.97)', border: '1.5px solid #ffd700', borderRadius: '16px 16px 16px 0', padding: '10px 14px', maxWidth: '200px' }}>
              <p style={{ color: '#d8e8f8', fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', lineHeight: 1.5, margin: 0 }}>{mascotteTip}</p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: 'rgba(6,8,20,0.98)', border: '1px solid rgba(255,215,0,0.15)', borderTop: 'none', borderRadius: '0 0 18px 18px', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          {ENNEMIS_TYPES.slice(0, 4).map(e => (
            <div key={e.nom} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem' }}>{e.emoji}</div>
              <div style={{ color: e.couleur, fontSize: '0.6rem', fontWeight: 700 }}>{e.points}pts</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {RECOMPENSES.map(r => (
            <div key={r.code} style={{ textAlign: 'center', opacity: recompensesDebloquees.includes(r.code) ? 1 : 0.4 }}>
              <div style={{ fontSize: '1rem' }}>{r.emoji}</div>
              <div style={{ color: r.couleur, fontSize: '0.6rem', fontWeight: 700 }}>{r.seuil}pts</div>
            </div>
          ))}
        </div>
        {phase === 'jeu' && (
          <button onClick={() => { stopAll(); setPhase('tuto'); setTutoStep(0); }} style={{ background: 'transparent', color: '#5a6a7a', border: '1px solid #2a3a4a', borderRadius: '20px', padding: '6px 16px', fontSize: '0.8rem', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer' }}>
            Regles
          </button>
        )}
      </div>
    </div>
  );
}

export default MiniJeu;