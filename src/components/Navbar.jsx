import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [['/', 'Accueil'], ['/services', 'Services'], ['/apropos', 'À propos'], ['/blog', 'Blog'], ['/contact', 'Contact']];

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255,215,0,0.3), 0 0 20px rgba(255,215,0,0.1); }
          50% { box-shadow: 0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.2); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 5px rgba(0,170,0,0.3); }
          50% { box-shadow: 0 0 20px rgba(0,170,0,0.7); }
        }
        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 0;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ffd700, #00aa00);
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: #ffd700; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: #00aa00; }
        .nav-link.active::after { width: 100%; }
        .nav-link.active:hover { color: #ffd700; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 5px; }
        .hamburger span { display: block; width: 25px; height: 2px; background: #ffd700; transition: all 0.3s; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(0,170,0,0.2)',
        transition: 'all 0.4s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ position: 'relative' }}>
              <img src="/logo.png" alt="BBRS Morphix IT" style={{
                width: '50px', height: '50px', borderRadius: '50%',
                border: '2px solid #ffd700',
                animation: 'glow 3s ease-in-out infinite',
                transition: 'transform 0.3s'
              }} />
              <div style={{
                position: 'absolute', bottom: '0', right: '0',
                width: '12px', height: '12px', borderRadius: '50%',
                background: '#00aa00', border: '2px solid #000',
                animation: 'pulse-green 2s infinite'
              }} />
            </div>
            <div>
              <div style={{ color: '#ffd700', fontSize: '16px', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', lineHeight: 1 }}>BBRS Morphix</div>
              <div style={{ color: '#00aa00', fontSize: '10px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '3px', textTransform: 'uppercase' }}>IT Solutions</div>
            </div>
          </Link>

          {/* Links desktop */}
          <ul className="nav-links-desktop" style={{ display: 'flex', gap: '35px', listStyle: 'none', margin: 0, padding: 0 }}>
            {links.map(([path, label]) => (
              <li key={path}>
                <Link to={path} className={`nav-link${location.pathname === path ? ' active' : ''}`}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Hamburger mobile */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div style={{
            background: 'rgba(0,0,0,0.97)', borderTop: '1px solid rgba(255,215,0,0.2)',
            padding: '20px 30px', animation: 'slideDown 0.3s ease'
          }}>
            {links.map(([path, label]) => (
              <Link key={path} to={path} className={`nav-link${location.pathname === path ? ' active' : ''}`}
                style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;