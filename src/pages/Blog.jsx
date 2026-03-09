import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Blog() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(['Tous']);
  const [categorie, setCategorie] = useState('Tous');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [articleSelectionne, setArticleSelectionne] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then(r => r.json())
      .then(data => {
        const arts = Array.isArray(data) ? data : [];
        const cats = ['Tous', ...new Set(arts.map(a => a.categorie).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => setCategories(['Tous']));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/articles`)
      .then(r => r.json())
      .then(data => {
        let arts = Array.isArray(data) ? data : [];
        if (categorie !== 'Tous') arts = arts.filter(a => a.categorie === categorie);
        if (search) arts = arts.filter(a =>
          (a.titre || '').toLowerCase().includes(search.toLowerCase()) ||
          (a.extrait || '').toLowerCase().includes(search.toLowerCase())
        );
        setArticles(arts);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [categorie, search]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const getFileIcon = (url) => {
    if (!url) return '📎';
    if (url.includes('.pdf')) return '📄';
    if (url.includes('.doc')) return '📝';
    if (url.match(/\.(jpg|jpeg|png|gif|webp)/)) return '🖼️';
    if (url.includes('.zip')) return '🗜️';
    return '📎';
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '70px' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .article-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(0,170,0,0.12);
          border-radius: 18px; padding: 28px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer; position: relative; overflow: hidden;
          animation: fadeInUp 0.5s ease both;
        }
        .article-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #00aa00, #ffd700);
          transform: scaleX(0); transition: transform 0.4s; transform-origin: left;
        }
        .article-card:hover { transform: translateY(-8px); border-color: rgba(255,215,0,0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .article-card:hover::before { transform: scaleX(1); }
        .cat-btn {
          padding: 8px 20px; border-radius: 25px; border: 1px solid rgba(0,170,0,0.2);
          background: transparent; color: #666; font-size: 0.82rem; cursor: pointer;
          font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; font-weight: 600;
          transition: all 0.3s; text-transform: uppercase;
        }
        .cat-btn:hover { border-color: rgba(0,170,0,0.5); color: #00aa00; }
        .cat-btn.active { background: rgba(0,170,0,0.15); border-color: #00aa00; color: #00aa00; box-shadow: 0 0 15px rgba(0,170,0,0.15); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px); animation: fadeInUp 0.2s ease; }
        .modal-box { background: #0a0f0a; border: 1px solid rgba(0,170,0,0.2); border-radius: 20px; max-width: 750px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 40px; position: relative; }
        .download-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #00aa00, #007700); color: #fff; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 0.9rem; font-weight: 700; font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; transition: all 0.3s; }
        .download-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,170,0,0.4); }
      `}</style>

      {/* HEADER */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px', background: 'radial-gradient(ellipse at center, rgba(0,60,0,0.15) 0%, transparent 70%)', borderBottom: '1px solid rgba(0,170,0,0.1)' }}>
        <p style={{ color: '#00aa00', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '4px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>— Ressources & actualités —</p>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffd700', fontWeight: 900, letterSpacing: '3px', marginBottom: '30px' }}>🔥 Blog BBRS Morphix IT</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto 30px' }}>
          <input type="text" placeholder="Rechercher un article..." value={searchInput} onChange={e => setSearchInput(e.target.value)}
            style={{ flex: 1, padding: '14px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,170,0,0.2)', borderRight: 'none', borderRadius: '30px 0 0 30px', color: '#e8e8e8', fontSize: '0.95rem', fontFamily: "'Rajdhani', sans-serif", outline: 'none' }} />
          <button type="submit" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #00aa00, #007700)', border: 'none', borderRadius: '0 30px 30px 0', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>🔍</button>
        </form>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategorie(cat)} className={`cat-btn${categorie === cat ? ' active' : ''}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#00aa00' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,170,0,0.2)', borderTop: '3px solid #00aa00', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '2px' }}>Chargement...</p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#444' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', letterSpacing: '1px' }}>Aucun article pour le moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {articles.map((article, i) => (
              <div key={article.id} className="article-card" style={{ animationDelay: `${i * 0.08}s` }} onClick={() => setArticleSelectionne(article)}>
                {article.image && (
                  <img src={`${API_URL}${article.image}`} alt={article.titre}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }}
                    onError={e => e.target.style.display = 'none'} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ background: 'rgba(0,170,0,0.1)', border: '1px solid rgba(0,170,0,0.2)', color: '#00aa00', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', fontWeight: 700 }}>{article.categorie || 'Général'}</span>
                </div>
                <h3 style={{ color: '#e8e8e8', fontSize: '1.05rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: '12px', lineHeight: 1.4, letterSpacing: '0.5px' }}>{article.titre}</h3>
                {article.extrait && (
                  <p style={{ color: '#666', fontSize: '0.88rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.7, marginBottom: '16px' }}>
                    {article.extrait.length > 100 ? article.extrait.slice(0, 100) + '...' : article.extrait}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#444', fontSize: '0.78rem', fontFamily: "'Rajdhani', sans-serif" }}>{formatDate(article.dateCreation)}</span>
                  <span style={{ color: '#00aa00', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>Lire →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {articleSelectionne && (
        <div className="modal-overlay" onClick={() => setArticleSelectionne(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setArticleSelectionne(null)} style={{ position: 'absolute', top: '16px', right: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            <span style={{ background: 'rgba(0,170,0,0.1)', border: '1px solid rgba(0,170,0,0.2)', color: '#00aa00', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', fontWeight: 700 }}>{articleSelectionne.categorie || 'Général'}</span>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 900, margin: '16px 0', lineHeight: 1.3 }}>{articleSelectionne.titre}</h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ color: '#555', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif" }}>📅 {formatDate(articleSelectionne.dateCreation)}</span>
            </div>
            {articleSelectionne.extrait && (
              <p style={{ color: '#888', fontSize: '1rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.8, marginBottom: '20px', padding: '16px', background: 'rgba(0,170,0,0.04)', border: '1px solid rgba(0,170,0,0.1)', borderRadius: '10px', borderLeft: '3px solid #00aa00' }}>
                {articleSelectionne.extrait}
              </p>
            )}
            {articleSelectionne.contenu && (
              <div style={{ color: '#777', fontSize: '0.95rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.9, whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                {articleSelectionne.contenu}
              </div>
            )}
            {articleSelectionne.image && (
              <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
                <p style={{ color: '#888', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '10px', letterSpacing: '1px' }}>FICHIER JOINT</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getFileIcon(articleSelectionne.image)}</span>
                    <span style={{ color: '#e8e8e8', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif" }}>Fichier joint</span>
                  </div>
                  <a href={`${API_URL}${articleSelectionne.image}`} target="_blank" rel="noreferrer" className="download-btn">⬇️ Télécharger</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;