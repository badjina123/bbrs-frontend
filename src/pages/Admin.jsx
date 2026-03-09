import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

const API = 'https://bbrs-backend.onrender.com/api';

function Admin() {
  const [phase, setPhase] = useState('login');
  const [token, setToken] = useState(() => sessionStorage.getItem('bbrs_token') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [articleForm, setArticleForm] = useState({ titre: '', extrait: '', contenu: '', categorie: 'Réseau', image: '', fichier: null, publie: false });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFichier, setUploadingFichier] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [fichierInfo, setFichierInfo] = useState(null);
  const timerRef = useRef(null);
  const tokenRef = useRef(token);
  const imageInputRef = useRef(null);
  const fichierInputRef = useRef(null);

  const showMsg = (texte, type = 'success') => {
    setMsg({ texte, type });
    setTimeout(() => setMsg(null), 4000);
  };

  useEffect(() => {
    if (token) {
      tokenRef.current = token;
      setPhase('dashboard');
      chargerArticles(token);
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const chargerArticles = async (t) => {
    try {
      const r = await fetch(API + '/articles/all', {
        headers: { Authorization: 'Bearer ' + (t || tokenRef.current) }
      });
      if (r.ok) setArticles(await r.json());
    } catch (e) {
      showMsg('Erreur chargement articles', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const r = await fetch(API + '/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tokenRef.current },
        body: formData
      });
      const data = await r.json();
      if (r.ok) {
        setArticleForm(prev => ({ ...prev, image: data.url }));
        setImagePreview(URL.createObjectURL(file));
        showMsg('Image uploadée !');
      } else {
        showMsg('Erreur upload image', 'error');
      }
    } catch (e) {
      showMsg('Erreur upload', 'error');
    }
    setUploadingImage(false);
  };

  const handleFichierUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFichier(true);
    try {
      const formData = new FormData();
      formData.append('fichier', file);
      const r = await fetch(API + '/upload/fichier', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tokenRef.current },
        body: formData
      });
      const data = await r.json();
      if (r.ok) {
        setArticleForm(prev => ({ ...prev, fichier: { url: data.url, nom: data.nom, mimetype: data.mimetype } }));
        setFichierInfo({ nom: data.nom, mimetype: data.mimetype });
        showMsg('Fichier uploadé : ' + data.nom);
      } else {
        showMsg('Erreur upload fichier', 'error');
      }
    } catch (e) {
      showMsg('Erreur upload', 'error');
    }
    setUploadingFichier(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await r.json();
      if (r.ok) {
        sessionStorage.setItem('bbrs_token', data.token);
        setToken(data.token);
        tokenRef.current = data.token;
        setPhase('dashboard');
        chargerArticles(data.token);
      } else {
        showMsg(data.error || 'Identifiants invalides', 'error');
      }
    } catch (e) {
      showMsg('Serveur inaccessible', 'error');
    }
    setLoading(false);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(API + '/reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await r.json();
      if (r.ok) {
        await emailjs.send('service_23jlrir', 'template_tz04sok', { code: data.code, email: resetEmail }, 'WUp9An2JvFkFWqfJ3');
        setPhase('reset_code');
        setCodeTimer(600);
        timerRef.current = setInterval(() => {
          setCodeTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
        }, 1000);
        showMsg('Code envoye sur ' + resetEmail);
      } else {
        showMsg(data.error || 'Email non reconnu', 'error');
      }
    } catch (e) {
      showMsg('Erreur envoi', 'error');
    }
    setLoading(false);
  };

  const handleResetVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(API + '/reset/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode })
      });
      const data = await r.json();
      if (r.ok) { clearInterval(timerRef.current); setPhase('reset_password'); showMsg('Code correct !'); }
      else showMsg(data.error || 'Code incorrect', 'error');
    } catch (e) {
      showMsg('Erreur verification', 'error');
    }
    setLoading(false);
  };

  const handleResetChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { showMsg('Mots de passe differents', 'error'); return; }
    if (newPassword.length < 8) { showMsg('Minimum 8 caracteres', 'error'); return; }
    setLoading(true);
    try {
      const r = await fetch(API + '/reset/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword })
      });
      const data = await r.json();
      if (r.ok) {
        showMsg('Mot de passe mis a jour ! Connecte-toi.');
        setTimeout(() => { setPhase('login'); setResetEmail(''); setResetCode(''); setNewPassword(''); setConfirmPassword(''); }, 2000);
      } else showMsg(data.error || 'Erreur', 'error');
    } catch (e) {
      showMsg('Erreur serveur', 'error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bbrs_token');
    setToken(''); setPhase('login'); setArticles([]);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? API + '/articles/' + editingId : API + '/articles';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokenRef.current },
        body: JSON.stringify(articleForm)
      });
      if (r.ok) {
        showMsg(editingId ? 'Article modifie !' : articleForm.publie ? 'Article publié !' : 'Article sauvegardé en brouillon !');
        resetForm();
        chargerArticles();
      } else {
        showMsg('Erreur sauvegarde', 'error');
      }
    } catch (e) {
      showMsg('Erreur serveur', 'error');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setArticleForm({ titre: '', extrait: '', contenu: '', categorie: 'Réseau', image: '', fichier: null, publie: false });
    setEditingId(null);
    setShowForm(false);
    setImagePreview('');
    setFichierInfo(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (fichierInputRef.current) fichierInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      const r = await fetch(API + '/articles/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + tokenRef.current }
      });
      if (r.ok) { showMsg('Article supprime !'); chargerArticles(); }
    } catch (e) {
      showMsg('Erreur suppression', 'error');
    }
  };

  const handleEdit = (a) => {
    setArticleForm({ titre: a.titre, extrait: a.extrait || '', contenu: a.contenu || '', categorie: a.categorie, image: a.image || '', fichier: a.fichier || null, publie: a.publie });
    setEditingId(a.id);
    setShowForm(true);
    setImagePreview(a.image ? 'https://bbrs-backend.onrender.com' + a.image : '');
    setFichierInfo(a.fichier ? { nom: a.fichier.nom, mimetype: a.fichier.mimetype } : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (s) => Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);

  const getFileIcon = (mimetype) => {
    if (!mimetype) return '📎';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word') || mimetype.includes('doc')) return '📝';
    if (mimetype.includes('image')) return '🖼️';
    return '📎';
  };

  const cardStyle = { background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(0,100,200,0.2)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px' };
  const inputStyle = { width: '100%', padding: '14px 16px', background: 'rgba(0,20,50,0.5)', border: '1px solid rgba(0,100,200,0.2)', borderRadius: '10px', color: '#c8d8e8', fontSize: '0.95rem', fontFamily: "'Rajdhani', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '16px' };
  const btnPrimary = { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00aa00, #007700)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase' };
  const btnSecondary = { background: 'transparent', color: '#7a8a9a', border: '1px solid #333', borderRadius: '8px', padding: '8px 18px', fontSize: '0.85rem', fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', marginTop: '12px' };
  const labelStyle = { color: '#7a8a9a', fontSize: '0.8rem', letterSpacing: '1px', display: 'block', marginBottom: '6px', fontFamily: "'Rajdhani', sans-serif" };

  const MsgBanner = () => msg ? (
    <div style={{ background: msg.type === 'error' ? 'rgba(255,50,50,0.15)' : 'rgba(0,170,0,0.15)', border: '1px solid ' + (msg.type === 'error' ? 'rgba(255,50,50,0.4)' : 'rgba(0,170,0,0.4)'), borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: msg.type === 'error' ? '#ff8080' : '#00ff88', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem', fontWeight: 700 }}>
      {msg.type === 'error' ? 'Erreur : ' : 'OK : '}{msg.texte}
    </div>
  ) : null;

  if (phase === 'login') return (
    <div style={{ background: '#060810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔐</div>
          <h1 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '1.3rem', fontWeight: 900, letterSpacing: '3px' }}>ADMIN BBRS</h1>
          <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem', marginTop: '6px' }}>Espace administration</p>
        </div>
        <MsgBanner />
        <form onSubmit={handleLogin} translate="no">
          <label style={labelStyle}>Nom utilisateur</label>
          <input translate="no" style={inputStyle} type="text" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} placeholder="admin" required autoComplete="off" spellCheck="false" />
          <label style={labelStyle}>Mot de passe</label>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input translate="no" style={{ ...inputStyle, marginBottom: 0, paddingRight: '48px' }} type={showPassword ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" required spellCheck="false" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#7a8a9a', cursor: 'pointer', fontSize: '1.1rem' }}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" style={btnPrimary} disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => { setPhase('reset_email'); setMsg(null); }} style={{ background: 'none', border: 'none', color: '#4a8aff', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>Mot de passe oublie ?</button>
        </div>
      </div>
    </div>
  );

  if (phase === 'reset_email') return (
    <div style={{ background: '#060810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📧</div>
          <h1 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '1.1rem', fontWeight: 900, letterSpacing: '2px' }}>RESET MOT DE PASSE</h1>
        </div>
        <MsgBanner />
        <form onSubmit={handleResetRequest} translate="no">
          <label style={labelStyle}>Email administrateur</label>
          <input translate="no" style={inputStyle} type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="rboussougouisidk@groupeisi.com" required autoComplete="off" spellCheck="false" />
          <button type="submit" style={btnPrimary} disabled={loading}>{loading ? 'Envoi...' : 'Envoyer le code'}</button>
        </form>
        <div style={{ textAlign: 'center' }}><button onClick={() => setPhase('login')} style={btnSecondary}>Retour connexion</button></div>
      </div>
    </div>
  );

  if (phase === 'reset_code') return (
    <div style={{ background: '#060810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔢</div>
          <h1 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '1.1rem', fontWeight: 900, letterSpacing: '2px' }}>ENTRE TON CODE</h1>
          <div style={{ marginTop: '10px', color: codeTimer < 60 ? '#ff4444' : '#00aa00', fontFamily: "'Orbitron', sans-serif", fontSize: '1.2rem', fontWeight: 700 }}>{codeTimer > 0 ? formatTimer(codeTimer) : 'Code expire !'}</div>
        </div>
        <MsgBanner />
        <form onSubmit={handleResetVerify} translate="no">
          <input translate="no" style={{ ...inputStyle, textAlign: 'center', fontSize: '2rem', fontFamily: "'Orbitron', sans-serif", letterSpacing: '8px', fontWeight: 700 }} type="text" value={resetCode} onChange={e => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} required autoComplete="off" spellCheck="false" />
          <button type="submit" style={{ ...btnPrimary, opacity: resetCode.length !== 6 ? 0.5 : 1 }} disabled={loading || resetCode.length !== 6 || codeTimer === 0}>{loading ? 'Verification...' : 'Verifier le code'}</button>
        </form>
        <div style={{ textAlign: 'center' }}><button onClick={() => setPhase('reset_email')} style={btnSecondary}>Renvoyer un code</button></div>
      </div>
    </div>
  );

  if (phase === 'reset_password') return (
    <div style={{ background: '#060810', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔑</div>
          <h1 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '1.1rem', fontWeight: 900, letterSpacing: '2px' }}>NOUVEAU MOT DE PASSE</h1>
        </div>
        <MsgBanner />
        <form onSubmit={handleResetChange} translate="no">
          <label style={labelStyle}>Nouveau mot de passe</label>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input translate="no" style={{ ...inputStyle, marginBottom: 0, paddingRight: '48px' }} type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" required minLength={8} spellCheck="false" />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#7a8a9a', cursor: 'pointer', fontSize: '1.1rem' }}>{showNewPassword ? '🙈' : '👁️'}</button>
          </div>
          <label style={labelStyle}>Confirmer</label>
          <input translate="no" style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmer" required spellCheck="false" />
          <button type="submit" style={{ ...btnPrimary, opacity: (newPassword.length < 8 || newPassword !== confirmPassword) ? 0.5 : 1 }} disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}>{loading ? 'Mise a jour...' : 'Changer le mot de passe'}</button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#060810', minHeight: '100vh', paddingTop: '70px' }}>
      <style>{`
        .article-card { background: rgba(10,15,30,0.8); border: 1px solid rgba(0,100,200,0.15); border-radius: 14px; padding: 20px; margin-bottom: 16px; transition: all 0.3s; }
        .article-card:hover { border-color: rgba(255,215,0,0.3); transform: translateX(4px); }
        .btn-edit { background: rgba(255,215,0,0.1); color: #ffd700; border: 1px solid rgba(255,215,0,0.3); border-radius: 8px; padding: 8px 16px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700; }
        .btn-delete { background: rgba(255,50,50,0.1); color: #ff6060; border: 1px solid rgba(255,50,50,0.3); border-radius: 8px; padding: 8px 16px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700; margin-left: 8px; }
        .upload-zone { border: 2px dashed rgba(0,170,0,0.3); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; margin-bottom: 16px; }
        .upload-zone:hover { border-color: #00aa00; background: rgba(0,170,0,0.05); }
      `}</style>

      <div style={{ background: 'rgba(6,8,20,0.98)', borderBottom: '1px solid rgba(255,215,0,0.15)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '1.2rem', fontWeight: 900, letterSpacing: '3px' }}>DASHBOARD ADMIN</h1>
          <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem' }}>{articles.length} article(s)</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }} style={{ background: 'linear-gradient(135deg, #00aa00, #007700)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            {showForm ? 'Annuler' : '+ Nouvel article'}
          </button>
          <button onClick={handleLogout} style={{ background: 'rgba(255,50,50,0.1)', color: '#ff6060', border: '1px solid rgba(255,50,50,0.3)', borderRadius: '10px', padding: '10px 20px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Deconnexion</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <MsgBanner />

        {showForm && (
          <div style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(0,100,200,0.2)', borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '0.95rem', letterSpacing: '2px', marginBottom: '24px' }}>
              {editingId ? "MODIFIER L'ARTICLE" : 'NOUVEL ARTICLE'}
            </h2>
            <form onSubmit={handleArticleSubmit} translate="no">
              <label style={labelStyle}>Titre</label>
              <input translate="no" style={inputStyle} type="text" value={articleForm.titre} onChange={e => setArticleForm({ ...articleForm, titre: e.target.value })} placeholder="Titre de l'article" required spellCheck="false" />
              <label style={labelStyle}>Extrait</label>
              <input translate="no" style={inputStyle} type="text" value={articleForm.extrait} onChange={e => setArticleForm({ ...articleForm, extrait: e.target.value })} placeholder="Courte description" spellCheck="false" />
              <label style={labelStyle}>Categorie</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={articleForm.categorie} onChange={e => setArticleForm({ ...articleForm, categorie: e.target.value })}>
                {['Réseau', 'Cybersécurité', 'Système', 'Linux', 'Windows', 'Cloud', 'Tutoriel', 'Actualité'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <label style={labelStyle}>Contenu</label>
              <textarea translate="no" style={{ ...inputStyle, minHeight: '200px', resize: 'vertical' }} value={articleForm.contenu} onChange={e => setArticleForm({ ...articleForm, contenu: e.target.value })} placeholder="Contenu de l'article..." spellCheck="false" />
              <label style={labelStyle}>Image de couverture</label>
              <div className="upload-zone" onClick={() => imageInputRef.current.click()}>
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="preview" style={{ maxHeight: '150px', borderRadius: '8px', marginBottom: '8px' }} />
                    <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem' }}>Image chargée — Cliquer pour changer</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
                    <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem' }}>
                      {uploadingImage ? 'Upload en cours...' : 'Cliquer pour choisir une image'}
                    </p>
                  </div>
                )}
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              <label style={labelStyle}>Fichier joint (PDF, Word)</label>
              <div className="upload-zone" onClick={() => fichierInputRef.current.click()}>
                {fichierInfo ? (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{getFileIcon(fichierInfo.mimetype)}</div>
                    <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem' }}>{fichierInfo.nom}</p>
                    <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem' }}>Cliquer pour changer</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📎</div>
                    <p style={{ color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem' }}>
                      {uploadingFichier ? 'Upload en cours...' : 'Cliquer pour joindre un fichier (PDF, Word, Excel)'}
                    </p>
                  </div>
                )}
              </div>
              <input ref={fichierInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFichierUpload} style={{ display: 'none' }} />
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px', marginTop: '8px' }}>
                <input type="checkbox" checked={articleForm.publie} onChange={e => setArticleForm({ ...articleForm, publie: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#00aa00' }} />
                <span style={{ color: articleForm.publie ? '#00aa00' : '#7a8a9a', fontWeight: 700 }}>
                  {articleForm.publie ? 'Publier immediatement' : 'Sauvegarder en brouillon'}
                </span>
              </label>
              <button type="submit" style={btnPrimary} disabled={loading || uploadingImage || uploadingFichier}>
                {loading ? 'Sauvegarde...' : editingId ? 'Modifier' : articleForm.publie ? 'Publier' : 'Sauvegarder'}
              </button>
            </form>
          </div>
        )}

        <h2 style={{ color: '#ffd700', fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px' }}>
          MES ARTICLES ({articles.length})
        </h2>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#5a6a7a', fontFamily: "'Rajdhani', sans-serif", padding: '40px' }}>Aucun article.</div>
        ) : (
          articles.map(a => (
            <div key={a.id} className="article-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: a.publie ? 'rgba(0,170,0,0.15)' : 'rgba(255,170,0,0.15)', color: a.publie ? '#00aa00' : '#ffaa00', border: '1px solid ' + (a.publie ? 'rgba(0,170,0,0.3)' : 'rgba(255,170,0,0.3)'), borderRadius: '20px', padding: '2px 10px', fontSize: '0.7rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                      {a.publie ? 'Publié' : 'Brouillon'}
                    </span>
                    <span style={{ color: '#4a5a6a', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif" }}>{a.categorie}</span>
                    {a.fichier && <span style={{ color: '#ffd700', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif" }}>{getFileIcon(a.fichier.mimetype)} Fichier joint</span>}
                  </div>
                  <h3 style={{ color: '#d8e8f8', fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{a.titre}</h3>
                  {a.extrait && <p style={{ color: '#4a5a6a', fontSize: '0.8rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '4px' }}>{a.extrait.slice(0, 80)}...</p>}
                  <p style={{ color: '#3a4a5a', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif" }}>{new Date(a.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn-edit" onClick={() => handleEdit(a)}>Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(a.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
