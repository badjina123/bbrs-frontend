import React, { useState, useEffect } from 'react';

const globalStyles = `
  @keyframes mascFloat { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
  @keyframes mascBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes swordSlash { 0%,100%{transform:rotate(-10deg);} 50%{transform:rotate(10deg);} }
  @keyframes shieldBob { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-5px) rotate(3deg);} }
  @keyframes eyeGlow { 0%,100%{opacity:0.85;} 50%{opacity:1;} }
  @keyframes auraGlow { 0%,100%{opacity:0.3; transform:scale(1);} 50%{opacity:0.7; transform:scale(1.08);} }
  @keyframes bubblePop { 0%{transform:scale(0.8);opacity:0;} 100%{transform:scale(1);opacity:1;} }
  @keyframes armorShimmer { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
  @keyframes capeFlow { 0%,100%{transform:skewX(0deg) scaleX(1);} 50%{transform:skewX(3deg) scaleX(1.03);} }
  @keyframes tailSway { 0%,100%{transform:rotate(-8deg);} 50%{transform:rotate(8deg);} }
  @keyframes screenFlicker { 0%,100%{opacity:1;} 92%{opacity:1;} 93%{opacity:0.6;} 94%{opacity:1;} }
  @keyframes typingCursor { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes screenGlow { 0%,100%{filter:drop-shadow(0 0 4px #00ff88);} 50%{filter:drop-shadow(0 0 12px #00ff88);} }
  @keyframes screenGlowGold { 0%,100%{filter:drop-shadow(0 0 4px #ffd700);} 50%{filter:drop-shadow(0 0 12px #ffd700);} }
  @keyframes screenGlowPurple { 0%,100%{filter:drop-shadow(0 0 4px #8833ff);} 50%{filter:drop-shadow(0 0 12px #8833ff);} }
  @keyframes scanLine { 0%{transform:translateY(0);opacity:0.4;} 100%{transform:translateY(30px);opacity:0;} }
  .masc-float { animation: mascFloat 3s ease-in-out infinite; }
  .masc-blink { animation: mascBlink 0.7s infinite; display:inline-block; }
  .masc-sword { animation: swordSlash 2s ease-in-out infinite; transform-origin: 50% 80%; }
  .masc-shield { animation: shieldBob 2.5s ease-in-out infinite; }
  .masc-aura { animation: auraGlow 2s ease-in-out infinite; }
  .masc-armor { animation: armorShimmer 2s ease-in-out infinite; }
  .masc-cape { animation: capeFlow 3s ease-in-out infinite; transform-origin: top center; }
  .masc-tail { animation: tailSway 2s ease-in-out infinite; transform-origin: top center; }
  .screen-gold { animation: screenFlicker 4s infinite, screenGlowGold 2s ease-in-out infinite; }
  .screen-green { animation: screenFlicker 5s infinite, screenGlow 2s ease-in-out infinite; }
  .screen-purple { animation: screenFlicker 6s infinite, screenGlowPurple 2s ease-in-out infinite; }
`;

// ══════════════════════════════════════════════════════
// GUERRIÈRE 1 — ACCUEIL — Épée de feu + laptop doré
// ══════════════════════════════════════════════════════
function GuerriereAccueil() {
  return (
    <svg viewBox="0 0 200 220" width="180" height="198" xmlns="http://www.w3.org/2000/svg">
      {/* Aura */}
      <ellipse className="masc-aura" cx="100" cy="195" rx="70" ry="20" fill="#ffd700" opacity="0.2"/>

      {/* Cape */}
      <g className="masc-cape">
        <path d="M62 128 Q44 158 48 188 Q68 198 100 196 Q132 198 152 188 Q156 158 138 128" fill="#1a0500" stroke="#ffd70044" strokeWidth="1"/>
        <path d="M66 132 Q52 160 55 184 Q74 193 100 191 Q126 193 145 184 Q148 160 134 132" fill="#2a0800"/>
      </g>

      {/* Corps */}
      <rect x="72" y="126" width="56" height="60" rx="8" fill="#1a0a0a" stroke="#ffd700" strokeWidth="1.2"/>
      <g className="masc-armor">
        <path d="M72 130 Q100 118 128 130 L128 160 Q100 168 72 160Z" fill="#2a1200" stroke="#ffd700" strokeWidth="0.8"/>
        <path d="M84 133 Q100 127 116 133 L116 154 Q100 158 84 154Z" fill="#3a1800" stroke="#ffd70055" strokeWidth="0.5"/>
        <line x1="100" y1="126" x2="100" y2="162" stroke="#ffd70044" strokeWidth="1"/>
        <path d="M80 140 Q100 135 120 140" stroke="#ffd70055" strokeWidth="0.8" fill="none"/>
        <circle cx="100" cy="146" r="5" fill="#ff6600" stroke="#ffd700" strokeWidth="0.8"/>
        <circle cx="100" cy="146" r="2.5" fill="#ffaa00"/>
      </g>

      {/* Cou */}
      <rect x="91" y="113" width="18" height="16" rx="4" fill="#4a2010"/>

      {/* Tête */}
      <ellipse cx="100" cy="90" rx="34" ry="36" fill="#4a2010"/>

      {/* Cheveux */}
      <path d="M68 82 Q54 65 57 38 Q66 12 100 10 Q134 12 143 38 Q146 65 132 82" fill="#0a0205"/>
      <path d="M68 82 Q50 108 52 142 Q54 166 58 186" stroke="#0d0308" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M132 82 Q150 108 148 142 Q146 166 142 186" stroke="#0d0308" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M70 82 Q55 108 57 140" stroke="#ffd70033" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M130 82 Q145 108 143 140" stroke="#ffd70033" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M68 78 Q76 60 88 64 Q100 67 112 64 Q124 60 132 78" fill="#0d0308"/>
      <path d="M68 74 Q100 68 132 74" stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="100" cy="69" r="4.5" fill="#ffd700" stroke="#ffaa00" strokeWidth="1"/>
      <circle cx="100" cy="69" r="2" fill="#fff5a0"/>

      {/* Visage */}
      <ellipse cx="100" cy="94" rx="28" ry="30" fill="#5c2d0a"/>

      {/* Yeux manga */}
      <g className="masc-armor">
        <ellipse cx="86" cy="90" rx="10" ry="11" fill="#0a0400"/>
        <ellipse cx="86" cy="91" rx="8" ry="9" fill="#1a0800"/>
        <ellipse cx="86" cy="91" rx="6" ry="7" fill="#00cc55"/>
        <ellipse cx="86" cy="91" rx="3.5" ry="4.5" fill="#004422"/>
        <circle cx="86" cy="91" r="2" fill="#001a0d"/>
        <circle cx="88.5" cy="87" r="3" fill="white" opacity="0.9"/>
        <circle cx="83" cy="94" r="1.2" fill="white" opacity="0.5"/>
        <path d="M76 86 Q80 81 86 81 Q92 81 96 86" stroke="#0a0a0a" strokeWidth="2.5" fill="#0a0a0a" strokeLinecap="round"/>

        <ellipse cx="114" cy="90" rx="10" ry="11" fill="#0a0400"/>
        <ellipse cx="114" cy="91" rx="8" ry="9" fill="#1a0800"/>
        <ellipse cx="114" cy="91" rx="6" ry="7" fill="#00cc55"/>
        <ellipse cx="114" cy="91" rx="3.5" ry="4.5" fill="#004422"/>
        <circle cx="114" cy="91" r="2" fill="#001a0d"/>
        <circle cx="116.5" cy="87" r="3" fill="white" opacity="0.9"/>
        <circle cx="111" cy="94" r="1.2" fill="white" opacity="0.5"/>
        <path d="M104 86 Q108 81 114 81 Q120 81 124 86" stroke="#0a0a0a" strokeWidth="2.5" fill="#0a0a0a" strokeLinecap="round"/>
      </g>

      <path d="M76 79 Q82 75 90 77" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M110 77 Q118 75 124 79" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M96 98 Q100 101 104 98" stroke="#3a1808" strokeWidth="1.2" fill="none"/>
      <path d="M88 110 Q100 117 112 110" stroke="#cc4422" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="76" cy="104" rx="7" ry="5" fill="#ff6644" opacity="0.2"/>
      <ellipse cx="124" cy="104" rx="7" ry="5" fill="#ff6644" opacity="0.2"/>

      {/* Bras gauche */}
      <rect x="46" y="126" width="26" height="12" rx="6" fill="#1a0a0a" stroke="#ffd700" strokeWidth="0.8"/>
      <ellipse cx="46" cy="132" rx="10" ry="10" fill="#4a2010"/>

      {/* LAPTOP DORÉ — bras gauche tient l'écran */}
      <g className="screen-gold">
        {/* Base laptop */}
        <rect x="8" y="155" width="52" height="32" rx="3" fill="#1a1000" stroke="#ffd700" strokeWidth="1.2"/>
        {/* Charnière */}
        <rect x="8" y="153" width="52" height="4" rx="2" fill="#2a1a00" stroke="#ffd70066" strokeWidth="0.5"/>
        {/* Écran */}
        <rect x="10" y="118" width="48" height="36" rx="3" fill="#0a0800" stroke="#ffd700" strokeWidth="1.2"/>
        <rect x="12" y="120" width="44" height="32" rx="2" fill="#0d1000"/>
        {/* Contenu écran — terminal doré */}
        <rect x="13" y="121" width="42" height="30" rx="1" fill="#080900"/>
        <text x="15" y="129" fill="#ffd700" fontSize="4" fontFamily="monospace">$ ping revesyndie.com</text>
        <text x="15" y="135" fill="#00ff88" fontSize="4" fontFamily="monospace">PING: 12ms ✓</text>
        <text x="15" y="141" fill="#ffd700" fontSize="4" fontFamily="monospace">$ nmap -sV target</text>
        <text x="15" y="147" fill="#ff6600" fontSize="4" fontFamily="monospace">Scanning ports...</text>
        {/* Curseur clignotant */}
        <rect x="15" y="149" width="6" height="1" fill="#ffd700" opacity="0.8" className="masc-blink"/>
        {/* Scan line */}
        <rect x="12" y="120" width="44" height="2" fill="#ffd700" opacity="0.06" className="masc-armor"/>
        {/* Logo pomme/logo */}
        <circle cx="34" cy="157" r="3" fill="#ffd700" opacity="0.6"/>
        {/* Clavier */}
        <rect x="12" y="160" width="40" height="18" rx="1" fill="#120e00"/>
        {[0,1,2,3].map(r => [0,1,2,3,4,5,6,7,8].map(c => (
          <rect key={`${r}-${c}`} x={13+c*4.5} y={161+r*4} width="3.5" height="3" rx="0.5" fill="#1a1400" stroke="#ffd70022" strokeWidth="0.3"/>
        )))}
        {/* Trackpad */}
        <rect x="24" y="178" width="12" height="7" rx="1.5" fill="#1a1400" stroke="#ffd70033" strokeWidth="0.5"/>
      </g>

      {/* Bras droit + épée */}
      <rect x="128" y="118" width="14" height="26" rx="6" fill="#1a0a0a" stroke="#ffd700" strokeWidth="0.8"/>
      <ellipse cx="144" cy="130" rx="10" ry="10" fill="#4a2010"/>
      <g className="masc-sword">
        <rect x="148" y="28" width="7" height="90" rx="2.5" fill="url(#fireGrad1)"/>
        <path d="M148 28 Q143 16 148 4 Q152 16 155 28Z" fill="#ff6600" opacity="0.85"/>
        <path d="M150 22 Q146 10 150 0 Q154 10 156 22Z" fill="#ffaa00" opacity="0.7"/>
        <path d="M152 16 Q149 6 152 -2 Q155 6 157 16Z" fill="#ffff00" opacity="0.5"/>
        <rect x="141" y="112" width="28" height="7" rx="3" fill="#ffd700" stroke="#ffaa00" strokeWidth="0.8"/>
        <circle cx="155" cy="115.5" r="3.5" fill="#ff6600"/>
        <rect x="148" y="117" width="12" height="22" rx="4" fill="#5a2200" stroke="#ffd700" strokeWidth="0.8"/>
        <line x1="151" y1="119" x2="151" y2="137" stroke="#ffd70055" strokeWidth="1"/>
        <line x1="157" y1="119" x2="157" y2="137" stroke="#ffd70055" strokeWidth="1"/>
      </g>
      <defs>
        <linearGradient id="fireGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="20%" stopColor="#ffff00"/>
          <stop offset="50%" stopColor="#ff6600"/>
          <stop offset="100%" stopColor="#ffd700"/>
        </linearGradient>
      </defs>

      {/* Jambes */}
      <rect x="76" y="180" width="20" height="32" rx="6" fill="#0d0505" stroke="#ffd70033" strokeWidth="0.8"/>
      <rect x="104" y="180" width="20" height="32" rx="6" fill="#0d0505" stroke="#ffd70033" strokeWidth="0.8"/>
      <ellipse cx="86" cy="212" rx="13" ry="6" fill="#1a0800" stroke="#ffd70055" strokeWidth="0.8"/>
      <ellipse cx="114" cy="212" rx="13" ry="6" fill="#1a0800" stroke="#ffd70055" strokeWidth="0.8"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════
// GUERRIÈRE 2 — SERVICES — Armure cyber + laptop vert
// ══════════════════════════════════════════════════════
function GuerriereServices() {
  return (
    <svg viewBox="0 0 200 220" width="180" height="198" xmlns="http://www.w3.org/2000/svg">
      <ellipse className="masc-aura" cx="100" cy="195" rx="70" ry="20" fill="#00ff88" opacity="0.18"/>

      {/* Corps armure */}
      <rect x="68" y="122" width="64" height="66" rx="8" fill="#0a1a0a" stroke="#00aa00" strokeWidth="1.2"/>
      <g className="masc-armor">
        <path d="M68 128 Q100 114 132 128 L132 160 Q100 170 68 160Z" fill="#0d2a0d" stroke="#00ff88" strokeWidth="0.8"/>
        <rect x="76" y="132" width="20" height="10" rx="2" fill="#0a1a0a" stroke="#00ff8866" strokeWidth="0.5"/>
        <rect x="104" y="132" width="20" height="10" rx="2" fill="#0a1a0a" stroke="#00ff8866" strokeWidth="0.5"/>
        <rect x="76" y="146" width="48" height="8" rx="2" fill="#0a1a0a" stroke="#00ff8844" strokeWidth="0.5"/>
        <rect x="76" y="158" width="48" height="8" rx="2" fill="#0a1a0a" stroke="#00ff8833" strokeWidth="0.5"/>
        <line x1="68" y1="140" x2="132" y2="140" stroke="#00ff8820" strokeWidth="0.8"/>
        <line x1="68" y1="152" x2="132" y2="152" stroke="#00ff8820" strokeWidth="0.8"/>
        <circle cx="100" cy="143" r="7" fill="#001a00" stroke="#00ff88" strokeWidth="1.2"/>
        <circle cx="100" cy="143" r="3.5" fill="#00ff88" opacity="0.85"/>
        <circle cx="100" cy="143" r="1.8" fill="#ffffff" opacity="0.9"/>
      </g>

      <rect x="91" y="110" width="18" height="16" rx="4" fill="#4a2010"/>
      <ellipse cx="100" cy="88" rx="34" ry="36" fill="#4a2010"/>

      {/* Cheveux queue */}
      <path d="M68 80 Q54 62 58 34 Q68 8 100 6 Q132 8 142 34 Q146 62 132 80" fill="#0a0010"/>
      <path d="M68 80 Q56 102 58 130" stroke="#0d0015" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M132 80 Q144 102 142 130" stroke="#0d0015" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <g className="masc-tail">
        <path d="M132 80 Q152 96 155 126 Q157 148 148 170" stroke="#0a0010" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M132 80 Q153 98 156 128 Q158 150 149 172" stroke="#00ff8822" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </g>
      <path d="M68 76 Q78 58 90 62 Q100 65 110 62 Q122 58 132 76" fill="#0d0015"/>
      <path d="M68 72 Q100 65 132 72" stroke="#00aa00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <rect x="90" y="63" width="20" height="6" rx="3" fill="#001a00" stroke="#00ff88" strokeWidth="0.8"/>
      <line x1="90" y1="66" x2="110" y2="66" stroke="#00ff88" strokeWidth="0.6"/>

      <ellipse cx="100" cy="92" rx="28" ry="30" fill="#5c2d0a"/>

      {/* Yeux cyber */}
      <g>
        <ellipse cx="86" cy="88" rx="10" ry="11" fill="#001500"/>
        <ellipse cx="86" cy="89" rx="8" ry="9" fill="#002200"/>
        <ellipse cx="86" cy="89" rx="6" ry="7" fill="#00dd66"/>
        <ellipse cx="86" cy="89" rx="3.5" ry="4.5" fill="#004422"/>
        <circle cx="86" cy="89" r="1.8" fill="#000"/>
        <circle cx="88.5" cy="85" r="3" fill="white" opacity="0.9"/>
        <rect x="77" y="86" width="18" height="1.2" fill="#00ff8830"/>
        <path d="M76 84 Q80 79 86 79 Q92 79 96 84" stroke="#001500" strokeWidth="3" fill="#001500" strokeLinecap="round"/>

        <ellipse cx="114" cy="88" rx="10" ry="11" fill="#001500"/>
        <ellipse cx="114" cy="89" rx="8" ry="9" fill="#002200"/>
        <ellipse cx="114" cy="89" rx="6" ry="7" fill="#00dd66"/>
        <ellipse cx="114" cy="89" rx="3.5" ry="4.5" fill="#004422"/>
        <circle cx="114" cy="89" r="1.8" fill="#000"/>
        <circle cx="116.5" cy="85" r="3" fill="white" opacity="0.9"/>
        <rect x="105" y="86" width="18" height="1.2" fill="#00ff8830"/>
        <path d="M104 84 Q108 79 114 79 Q120 79 124 84" stroke="#001500" strokeWidth="3" fill="#001500" strokeLinecap="round"/>
      </g>

      <path d="M76 77 Q83 73 92 75" stroke="#0a0010" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M108 75 Q117 73 124 77" stroke="#0a0010" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M97 98 Q100 101 103 98" stroke="#3a1808" strokeWidth="1.2" fill="none"/>
      <path d="M89 108 Q100 114 111 108" stroke="#cc4422" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Bras gauche + BOUCLIER */}
      <rect x="44" y="122" width="24" height="14" rx="6" fill="#0a1a0a" stroke="#00aa00" strokeWidth="0.8"/>
      <ellipse cx="44" cy="129" rx="10" ry="10" fill="#4a2010"/>
      <g className="masc-shield">
        <path d="M12 112 Q12 94 26 91 Q40 94 40 112 Q40 134 26 142 Q12 134 12 112Z" fill="#0a1a0a" stroke="#00ff88" strokeWidth="2"/>
        <path d="M18 112 Q18 99 26 97 Q34 99 34 112 Q34 128 26 134 Q18 128 18 112Z" fill="#00ff8811"/>
        <path d="M22 106 L26 101 L30 106 L30 118 L26 122 L22 118Z" fill="none" stroke="#00ff88" strokeWidth="1.2"/>
        <circle cx="26" cy="112" r="4" fill="#00ff8844"/>
        <line x1="22" y1="112" x2="30" y2="112" stroke="#00ff88" strokeWidth="0.8"/>
        <line x1="26" y1="108" x2="26" y2="116" stroke="#00ff88" strokeWidth="0.8"/>
      </g>

      {/* Bras droit + LAPTOP CYBER */}
      <rect x="132" y="122" width="24" height="14" rx="6" fill="#0a1a0a" stroke="#00aa00" strokeWidth="0.8"/>
      <ellipse cx="156" cy="129" rx="10" ry="10" fill="#4a2010"/>
      <g className="screen-green">
        {/* Base */}
        <rect x="148" y="160" width="46" height="28" rx="3" fill="#061206" stroke="#00aa00" strokeWidth="1.2"/>
        {/* Charnière */}
        <rect x="148" y="158" width="46" height="4" rx="2" fill="#0a1a0a" stroke="#00ff8855" strokeWidth="0.5"/>
        {/* Écran */}
        <rect x="150" y="124" width="42" height="34" rx="3" fill="#040d04" stroke="#00aa00" strokeWidth="1.2"/>
        <rect x="152" y="126" width="38" height="30" rx="2" fill="#050f05"/>
        {/* Contenu — monitoring réseau */}
        <rect x="153" y="127" width="36" height="28" rx="1" fill="#040a04"/>
        <text x="155" y="133" fill="#00ff88" fontSize="3.5" fontFamily="monospace">NETWORK MONITOR</text>
        <line x1="153" y1="135" x2="189" y2="135" stroke="#00ff8833" strokeWidth="0.5"/>
        <text x="155" y="140" fill="#00aa44" fontSize="3.2" fontFamily="monospace">CPU: 12% ████░░</text>
        <text x="155" y="145" fill="#00aa44" fontSize="3.2" fontFamily="monospace">RAM: 45% ████░░</text>
        <text x="155" y="150" fill="#00ff88" fontSize="3.2" fontFamily="monospace">NET: ↑2MB ↓8MB</text>
        <text x="155" y="155" fill="#ffaa00" fontSize="3.2" fontFamily="monospace">! Intrusion détectée</text>
        <rect x="153" y="127" width="36" height="2" fill="#00ff88" opacity="0.05" className="masc-armor"/>
        {/* Logo */}
        <circle cx="171" cy="163" r="3" fill="#00aa00" opacity="0.5"/>
        {/* Clavier */}
        <rect x="152" y="166" width="34" height="16" rx="1" fill="#040d04"/>
        {[0,1,2,3].map(r => [0,1,2,3,4,5,6].map(c => (
          <rect key={`g${r}-${c}`} x={153+c*4.5} y={167+r*3.8} width="3.5" height="3" rx="0.5" fill="#061206" stroke="#00ff8822" strokeWidth="0.3"/>
        )))}
        <rect x="160" y="178" width="10" height="6" rx="1.5" fill="#061206" stroke="#00ff8833" strokeWidth="0.4"/>
      </g>

      {/* Jambes */}
      <rect x="74" y="182" width="20" height="30" rx="6" fill="#0a1a0a" stroke="#00aa0033" strokeWidth="0.8"/>
      <rect x="106" y="182" width="20" height="30" rx="6" fill="#0a1a0a" stroke="#00aa0033" strokeWidth="0.8"/>
      <ellipse cx="84" cy="212" rx="13" ry="6" fill="#061206" stroke="#00aa0055" strokeWidth="0.8"/>
      <ellipse cx="116" cy="212" rx="13" ry="6" fill="#061206" stroke="#00aa0055" strokeWidth="0.8"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════
// GUERRIÈRE 3 — À PROPOS — Hoodie + laptop violet
// ══════════════════════════════════════════════════════
function GuerriereApropos() {
  return (
    <svg viewBox="0 0 200 220" width="180" height="198" xmlns="http://www.w3.org/2000/svg">
      <ellipse className="masc-aura" cx="100" cy="195" rx="70" ry="20" fill="#8833ff" opacity="0.18"/>

      {/* Corps hoodie */}
      <rect x="68" y="122" width="64" height="66" rx="10" fill="#1a0a2a" stroke="#8833ff55" strokeWidth="1.2"/>
      <path d="M68 128 Q100 116 132 128 L132 162 Q100 172 68 162Z" fill="#220a35" stroke="#8833ff" strokeWidth="0.5"/>
      <path d="M100 124 L100 168" stroke="#8833ff33" strokeWidth="1.5"/>
      <rect x="78" y="146" width="44" height="18" rx="6" fill="#1a0820" stroke="#8833ff44" strokeWidth="0.8"/>
      <text x="100" y="158" textAnchor="middle" fill="#8833ff" fontSize="11" fontWeight="bold" fontFamily="monospace">IT</text>

      <rect x="91" y="110" width="18" height="16" rx="4" fill="#4a2010"/>
      <ellipse cx="100" cy="88" rx="34" ry="36" fill="#4a2010"/>

      {/* Cheveux longs ondulés */}
      <path d="M66 78 Q50 60 54 32 Q64 6 100 4 Q136 6 146 32 Q150 60 134 78" fill="#100508"/>
      <path d="M66 78 Q46 106 48 142 Q50 168 54 188" stroke="#150810" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M134 78 Q154 106 152 142 Q150 168 146 188" stroke="#150810" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M68 80 Q50 108 52 142" stroke="#8833ff44" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M132 80 Q150 108 148 142" stroke="#8833ff44" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M66 74 Q76 56 88 60 Q100 63 112 60 Q124 56 134 74" fill="#100508"/>
      <path d="M69 72 Q76 58 84 62" stroke="#8833ff22" strokeWidth="2" fill="none"/>
      <path d="M131 72 Q124 58 116 62" stroke="#8833ff22" strokeWidth="2" fill="none"/>
      <rect x="66" y="66" width="20" height="6" rx="3" fill="#8833ff" stroke="#cc66ff" strokeWidth="0.8"/>
      <circle cx="76" cy="69" r="2.5" fill="#cc66ff"/>
      <circle cx="66" cy="69" r="1.5" fill="#aa44ff" opacity="0.6"/>

      <ellipse cx="100" cy="92" rx="28" ry="30" fill="#5c2d0a"/>

      {/* Yeux manga doux */}
      <g>
        <ellipse cx="86" cy="88" rx="10" ry="12" fill="#0a0208"/>
        <ellipse cx="86" cy="89" rx="8.5" ry="10" fill="#150310"/>
        <ellipse cx="86" cy="89" rx="6.5" ry="7.5" fill="#9933ff"/>
        <ellipse cx="86" cy="90" rx="4" ry="5" fill="#5500aa"/>
        <circle cx="86" cy="90" r="2.2" fill="#1a0033"/>
        <circle cx="89" cy="85" r="3.5" fill="white" opacity="0.95"/>
        <circle cx="82.5" cy="93" r="1.5" fill="white" opacity="0.5"/>
        <path d="M76 84 Q80 78 86 78 Q92 78 96 84" stroke="#0a0208" strokeWidth="3" fill="#0a0208" strokeLinecap="round"/>
        <line x1="78" y1="84" x2="76" y2="79" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="82" y1="80" x2="81" y2="75" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="86" y1="79" x2="86" y2="74" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="90" y1="80" x2="91" y2="75" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="94" y1="84" x2="96" y2="79" stroke="#0a0208" strokeWidth="1.8"/>

        <ellipse cx="114" cy="88" rx="10" ry="12" fill="#0a0208"/>
        <ellipse cx="114" cy="89" rx="8.5" ry="10" fill="#150310"/>
        <ellipse cx="114" cy="89" rx="6.5" ry="7.5" fill="#9933ff"/>
        <ellipse cx="114" cy="90" rx="4" ry="5" fill="#5500aa"/>
        <circle cx="114" cy="90" r="2.2" fill="#1a0033"/>
        <circle cx="117" cy="85" r="3.5" fill="white" opacity="0.95"/>
        <circle cx="110.5" cy="93" r="1.5" fill="white" opacity="0.5"/>
        <path d="M104 84 Q108 78 114 78 Q120 78 124 84" stroke="#0a0208" strokeWidth="3" fill="#0a0208" strokeLinecap="round"/>
        <line x1="106" y1="84" x2="104" y2="79" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="110" y1="80" x2="109" y2="75" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="114" y1="79" x2="114" y2="74" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="118" y1="80" x2="119" y2="75" stroke="#0a0208" strokeWidth="1.8"/>
        <line x1="122" y1="84" x2="124" y2="79" stroke="#0a0208" strokeWidth="1.8"/>
      </g>

      <path d="M76 77 Q82 73 92 75" stroke="#150308" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M108 75 Q118 73 124 77" stroke="#150308" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M97 98 Q100 101 103 98" stroke="#3a1808" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M88 109 Q100 116 112 109" stroke="#cc4422" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M91 110 Q100 114 109 110" fill="#ff8866" opacity="0.45"/>
      <ellipse cx="76" cy="104" rx="8" ry="6" fill="#ff6644" opacity="0.18"/>
      <ellipse cx="124" cy="104" rx="8" ry="6" fill="#ff6644" opacity="0.18"/>

      {/* Bras gauche */}
      <rect x="44" y="122" width="24" height="14" rx="6" fill="#1a0a2a" stroke="#8833ff55" strokeWidth="0.8"/>
      <ellipse cx="44" cy="129" rx="10" ry="10" fill="#4a2010"/>

      {/* Bras droit + LAPTOP VIOLET */}
      <rect x="132" y="122" width="24" height="14" rx="6" fill="#1a0a2a" stroke="#8833ff55" strokeWidth="0.8"/>
      <ellipse cx="156" cy="129" rx="10" ry="10" fill="#4a2010"/>
      <g className="screen-purple">
        {/* Base */}
        <rect x="148" y="158" width="46" height="30" rx="3" fill="#0d0520" stroke="#8833ff" strokeWidth="1.2"/>
        {/* Charnière */}
        <rect x="148" y="156" width="46" height="4" rx="2" fill="#150830" stroke="#8833ff44" strokeWidth="0.5"/>
        {/* Écran */}
        <rect x="150" y="122" width="42" height="34" rx="3" fill="#080310" stroke="#8833ff" strokeWidth="1.2"/>
        <rect x="152" y="124" width="38" height="30" rx="2" fill="#0a0415"/>
        {/* Contenu — code/apprentissage */}
        <rect x="153" y="125" width="36" height="28" rx="1" fill="#08030e"/>
        <text x="155" y="131" fill="#cc66ff" fontSize="3.5" fontFamily="monospace">BBRS Morphix IT</text>
        <line x1="153" y1="133" x2="189" y2="133" stroke="#8833ff33" strokeWidth="0.5"/>
        <text x="155" y="138" fill="#8833ff" fontSize="3.2" fontFamily="monospace">{'>'} Master Réseaux</text>
        <text x="155" y="143" fill="#8833ff" fontSize="3.2" fontFamily="monospace">{'>'} Cybersécurité</text>
        <text x="155" y="148" fill="#cc66ff" fontSize="3.2" fontFamily="monospace">{'>'} AD CS Expert</text>
        <text x="155" y="153" fill="#aa44ff" fontSize="3.2" fontFamily="monospace">{'>'} Dakar, Sénégal_</text>
        <rect x="153" y="125" width="36" height="2" fill="#8833ff" opacity="0.05" className="masc-armor"/>
        {/* Logo */}
        <circle cx="171" cy="161" r="3" fill="#8833ff" opacity="0.5"/>
        {/* Clavier */}
        <rect x="152" y="164" width="34" height="18" rx="1" fill="#080315"/>
        {[0,1,2,3].map(r => [0,1,2,3,4,5,6].map(c => (
          <rect key={`p${r}-${c}`} x={153+c*4.5} y={165+r*4} width="3.5" height="3" rx="0.5" fill="#0d0520" stroke="#8833ff22" strokeWidth="0.3"/>
        )))}
        <rect x="160" y="178" width="10" height="6" rx="1.5" fill="#0d0520" stroke="#8833ff33" strokeWidth="0.4"/>
      </g>

      {/* Jambes */}
      <rect x="74" y="182" width="20" height="30" rx="6" fill="#1a0a2a" stroke="#8833ff22" strokeWidth="0.8"/>
      <rect x="106" y="182" width="20" height="30" rx="6" fill="#1a0a2a" stroke="#8833ff22" strokeWidth="0.8"/>
      <ellipse cx="84" cy="212" rx="13" ry="6" fill="#0d0518" stroke="#8833ff44" strokeWidth="0.8"/>
      <ellipse cx="116" cy="212" rx="13" ry="6" fill="#0d0518" stroke="#8833ff44" strokeWidth="0.8"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════
function Mascotte({ messages, position = 'left', variante = 'accueil' }) {
  const [texteAffiche, setTexteAffiche] = useState('');
  const [indexMessage, setIndexMessage] = useState(0);
  const [indexChar, setIndexChar] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = 'mascotte-global-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = globalStyles;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (indexChar < messages[indexMessage].length) {
      const timer = setTimeout(() => {
        setTexteAffiche(prev => prev + messages[indexMessage][indexChar]);
        setIndexChar(prev => prev + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setTexteAffiche('');
          setIndexChar(0);
          setIndexMessage(prev => (prev + 1) % messages.length);
          setVisible(true);
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [indexChar, indexMessage, messages]);

  const isLeft = position === 'left';
  const PersonnageMap = {
    accueil:  <GuerriereAccueil />,
    services: <GuerriereServices />,
    apropos:  <GuerriereApropos />,
  };
  const bordureColor = { accueil: '#ffd700', services: '#00aa00', apropos: '#8833ff' };
  const couleur = bordureColor[variante] || '#ffd700';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: '16px',
      flexDirection: isLeft ? 'row' : 'row-reverse',
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
      margin: '20px 0'
    }}>
      <div className="masc-float" style={{ flexShrink: 0, filter: `drop-shadow(0 0 18px ${couleur}55)` }}>
        {PersonnageMap[variante] || <GuerriereAccueil />}
      </div>
      <div style={{
        background: 'rgba(0,8,24,0.96)',
        border: `1.5px solid ${couleur}`,
        borderRadius: isLeft ? '20px 20px 20px 0' : '20px 20px 0 20px',
        padding: '16px 20px', maxWidth: '220px',
        boxShadow: `0 0 25px ${couleur}22`,
      }}>
        <p style={{
          color: '#d8e8f8', fontFamily: "'Rajdhani', sans-serif",
          fontSize: '15px', lineHeight: 1.6, margin: 0, minHeight: '22px'
        }}>
          {texteAffiche}
          <span className="masc-blink" style={{
            width: '2px', height: '16px',
            background: couleur, marginLeft: '2px', verticalAlign: 'middle'
          }} />
        </p>
      </div>
    </div>
  );
}

export default Mascotte;