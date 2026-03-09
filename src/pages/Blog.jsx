import React, { useState, useEffect } from 'react';

const API_URL = 'https://bbrs-backend.onrender.com';

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

  const getFileIcon = (mimetype) => {
    if (!mimetype) return '📎';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word') || mimetype.includes('doc')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('sheet')) return '📊';
    if (mimetype.includes('image')) return '🖼️';
    return '📎';
  };

  const getFileLabel = (mimetype) => {
    if (!mimetype) return 'Fichier joint';
    if (mimetype.includes('pdf')) return 'Document PDF';
    if (mimetype.includes('word') || mimetype.includes('doc')) return 'Document Word';
    if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'Fichier Excel';
    return 'Fichier joint';
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '70px' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .article-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(0,170,0,0.12);
          border-radius: 18px; padding: 0; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer; position: relative;
          animation: fadeInUp 0.5s ease both;
        }
        .article-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #00aa00, #ffd700);
          transform: scaleX(0); transition: transform 0.4s; transform-origin: left; z-index: 1;
        }
        .article-card:hover { transform: translateY(-8px); border-color: rgba(255,215,0,0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .article-card:hover::before { transform: scaleX(1); }
        .card-cover { width: 100%; height: 180px; object-fit: cover; display: block; }
        .card-cover-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg, rgba(0,80,0,0.3), rgba(0,30,60,0.5)); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .card-body { padding: 20px; }
        .cat-btn {
          padding: 8px 20px; border-radius: 25px; border: 1px solid rgba(0,170,0,0.2);
          background: transparent; color: #666; font-size: 0.82rem; cursor: pointer;
          font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; font-weight: 600;
          transition: all 0.3s; text-transform: uppercase;
        }
        .cat-btn:hover { border-color: rgba(0,170,0,0.5); color: #00aa00; }
        .cat-btn.active { background: rgba(0,170,0,0.15); border-color: #00aa00; color: #00aa00; box-shadow: 0 0 15px rgba(0,170,0,0.15); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(10px); animation: fadeInUp 0.2s ease; }
        .modal-box { background: #0a0f0a; border: 1px solid rgba(0,170,0,0.2); border-radius: 20px; max-width: 750px; width: 100%; max-height: 88vh; overflow-y: auto; position: relative; }
        .modal-image { width: 100%; max-height: 280px; object-fit: cover; border-radius: 20px 20px 0 0; display: block; }
        .modal-content { padding: 32px; }
        .download-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #00aa00, #007700); color: #fff; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 0.9rem; font-weight: 700; font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; transition: all 0.3s; }
        .download-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,170,0,0.4); }
        .fichier-box { background: rgba(255,215,0,0.04); border: 1px solid rgba(255,215,0,0.15); border-radius: 12px; padding: 16px; margin-top: 20px; }
        .fichier-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.15); }
      `}</style>

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
                {article.image
                  ? <img src={article.image} alt={article.titre} className="card-cover" onError={e => e.target.style.display = 'none'} />
                  : <div className="card-cover-placeholder">
                      {article.fichier ? getFileIcon(article.fichier.mimetype) : '📰'}
                    </div>
                }
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: 'rgba(0,170,0,0.1)', border: '1px solid rgba(0,170,0,0.2)', color: '#00aa00', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', fontWeight: 700 }}>{article.categorie || 'Général'}</span>
                    {article.fichier && (
                      <span style={{ color: '#ffd700', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getFileIcon(article.fichier.mimetype)} PDF
                      </span>
                    )}
                  </div>
                  <h3 style={{ color: '#e8e8e8', fontSize: '1.05rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, marginBottom: '10px', lineHeight: 1.4, letterSpacing: '0.5px' }}>{article.titre}</h3>
                  {article.extrait && (
                    <p style={{ color: '#666', fontSize: '0.88rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.7, marginBottom: '14px' }}>
                      {article.extrait.length > 100 ? article.extrait.slice(0, 100) + '...' : article.extrait}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#444', fontSize: '0.78rem', fontFamily: "'Rajdhani', sans-serif" }}>{formatDate(article.dateCreation)}</span>
                    <span style={{ color: '#00aa00', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>Lire →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {articleSelectionne && (
        <div className="modal-overlay" onClick={() => setArticleSelectionne(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {articleSelectionne.image && (
              <img src={articleSelectionne.image} alt={articleSelectionne.titre} className="modal-image" onError={e => e.target.style.display = 'none'} />
            )}
            <div className="modal-content">
              <button onClick={() => setArticleSelectionne(null)} style={{ position: 'absolute', top: '16px', right: '20px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              <span style={{ background: 'rgba(0,170,0,0.1)', border: '1px solid rgba(0,170,0,0.2)', color: '#00aa00', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px', fontWeight: 700 }}>{articleSelectionne.categorie || 'Général'}</span>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffd700', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 900, margin: '16px 0', lineHeight: 1.3 }}>{articleSelectionne.titre}</h2>
              <span style={{ color: '#555', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif" }}>📅 {formatDate(articleSelectionne.dateCreation)}</span>
              {articleSelectionne.extrait && (
                <p style={{ color: '#888', fontSize: '1rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.8, margin: '20px 0', padding: '16px', background: 'rgba(0,170,0,0.04)', border: '1px solid rgba(0,170,0,0.1)', borderRadius: '10px', borderLeft: '3px solid #00aa00' }}>
                  {articleSelectionne.extrait}
                </p>
              )}
              {articleSelectionne.contenu && (
                <div style={{ color: '#777', fontSize: '0.95rem', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.9, whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                  {articleSelectionne.contenu}
                </div>
              )}
              {articleSelectionne.fichier && articleSelectionne.fichier.url && (
                <div className="fichier-box">
                  <p style={{ color: '#888', fontSize: '0.82rem', fontFamily: "'Rajdhani', sans-serif", marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Fichier joint</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="fichier-icon">{getFileIcon(articleSelectionne.fichier.mimetype)}</div>
                      <div>
                        <p style={{ color: '#e8e8e8', fontSize: '0.9rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, marginBottom: '2px' }}>{articleSelectionne.fichier.nom || 'Fichier joint'}</p>
                        <p style={{ color: '#555', fontSize: '0.78rem', fontFamily: "'Rajdhani', sans-serif" }}>{getFileLabel(articleSelectionne.fichier.mimetype)}</p>
                      </div>
                    </div>
                    <a href={articleSelectionne.fichier.url} target="_blank" rel="noreferrer" className="download-btn">⬇️ Télécharger</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
