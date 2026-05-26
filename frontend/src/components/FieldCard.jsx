import React from 'react';
import { Wifi, Car, Coffee, ShieldCheck, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PITCH_PRICING } from '../constants/fields';

const getPitchStyle = (id, name, pitchType = '5') => {
  const numMatch = name?.match(/\d+/);
  const index = numMatch ? parseInt(numMatch[0], 10) : (parseInt(id, 10) || 1);
  const grassPattern = index % 4;
  
  let playerCount = 5;
  if (pitchType.includes('7')) {
    playerCount = 7;
  } else if (pitchType.includes('11')) {
    playerCount = 11;
  }
  
  const jerseyThemes = [
    { a: '#ea580c', b: '#2563eb' }, // Orange vs Blue
    { a: '#db2777', b: '#9333ea' }, // Pink vs Purple
    { a: '#eab308', b: '#1e293b' }, // Yellow vs Dark Blue
    { a: '#ffffff', b: '#dc2626' }, // White vs Red
  ];
  const jerseys = jerseyThemes[index % jerseyThemes.length];

  const teamA = [];
  const teamB = [];

  // Goalkeepers
  teamA.push({ x: 38, y: 120 });
  teamB.push({ x: 362, y: 120 });

  if (playerCount === 5) {
    const variations = [
      {
        a: [{x: 95, y: 75}, {x: 95, y: 165}, {x: 145, y: 120}, {x: 180, y: 120}],
        b: [{x: 305, y: 75}, {x: 305, y: 165}, {x: 255, y: 120}, {x: 220, y: 120}]
      },
      {
        a: [{x: 95, y: 120}, {x: 140, y: 75}, {x: 140, y: 165}, {x: 185, y: 120}],
        b: [{x: 305, y: 120}, {x: 260, y: 75}, {x: 260, y: 165}, {x: 215, y: 120}]
      },
      {
        a: [{x: 95, y: 80}, {x: 95, y: 160}, {x: 160, y: 80}, {x: 160, y: 160}],
        b: [{x: 305, y: 80}, {x: 305, y: 160}, {x: 240, y: 80}, {x: 240, y: 160}]
      }
    ];
    const chosen = variations[index % variations.length];
    teamA.push(...chosen.a);
    teamB.push(...chosen.b);
  } else if (playerCount === 7) {
    const variations = [
      {
        a: [{x: 80, y: 60}, {x: 80, y: 120}, {x: 80, y: 180}, {x: 140, y: 80}, {x: 140, y: 160}, {x: 180, y: 120}],
        b: [{x: 320, y: 60}, {x: 320, y: 120}, {x: 320, y: 180}, {x: 260, y: 80}, {x: 260, y: 160}, {x: 220, y: 120}]
      },
      {
        a: [{x: 85, y: 80}, {x: 85, y: 160}, {x: 135, y: 60}, {x: 135, y: 120}, {x: 135, y: 180}, {x: 180, y: 120}],
        b: [{x: 315, y: 80}, {x: 315, y: 160}, {x: 265, y: 60}, {x: 265, y: 120}, {x: 265, y: 180}, {x: 220, y: 120}]
      },
      {
        a: [{x: 80, y: 60}, {x: 80, y: 120}, {x: 80, y: 180}, {x: 135, y: 120}, {x: 175, y: 80}, {x: 175, y: 160}],
        b: [{x: 320, y: 60}, {x: 320, y: 120}, {x: 320, y: 180}, {x: 265, y: 120}, {x: 225, y: 80}, {x: 225, y: 160}]
      }
    ];
    const chosen = variations[index % variations.length];
    teamA.push(...chosen.a);
    teamB.push(...chosen.b);
  } else {
    const variations = [
      {
        a: [{x: 75, y: 50}, {x: 75, y: 95}, {x: 75, y: 145}, {x: 75, y: 190}, {x: 130, y: 50}, {x: 130, y: 95}, {x: 130, y: 145}, {x: 130, y: 190}, {x: 175, y: 90}, {x: 175, y: 150}],
        b: [{x: 325, y: 50}, {x: 325, y: 95}, {x: 325, y: 145}, {x: 325, y: 190}, {x: 270, y: 50}, {x: 270, y: 95}, {x: 270, y: 145}, {x: 270, y: 190}, {x: 225, y: 90}, {x: 225, y: 150}]
      },
      {
        a: [{x: 75, y: 50}, {x: 75, y: 95}, {x: 75, y: 145}, {x: 75, y: 190}, {x: 130, y: 70}, {x: 130, y: 120}, {x: 130, y: 170}, {x: 180, y: 60}, {x: 185, y: 120}, {x: 180, y: 180}],
        b: [{x: 325, y: 50}, {x: 325, y: 95}, {x: 325, y: 145}, {x: 325, y: 190}, {x: 270, y: 70}, {x: 270, y: 120}, {x: 270, y: 170}, {x: 220, y: 60}, {x: 215, y: 120}, {x: 220, y: 180}]
      },
      {
        a: [{x: 75, y: 70}, {x: 75, y: 120}, {x: 75, y: 170}, {x: 125, y: 45}, {x: 125, y: 80}, {x: 125, y: 120}, {x: 125, y: 160}, {x: 125, y: 195}, {x: 175, y: 90}, {x: 175, y: 150}],
        b: [{x: 325, y: 70}, {x: 325, y: 120}, {x: 325, y: 170}, {x: 275, y: 45}, {x: 275, y: 80}, {x: 275, y: 120}, {x: 275, y: 160}, {x: 275, y: 195}, {x: 225, y: 90}, {x: 225, y: 150}]
      }
    ];
    const chosen = variations[index % variations.length];
    teamA.push(...chosen.a);
    teamB.push(...chosen.b);
  }

  const ballPos = { x: 200, y: 120 };

  return { grassPattern, ballPos, teamA, teamB, jerseys, index };
};

const JerseyIcon = ({ color }) => (
  <g>
    <path 
      d="M -6,-4 L -4,-4 L -3,-2 L 3,-2 L 4,-4 L 6,-4 L 5,1 L 3,1 L 3,6 L -3,6 L -3,1 L -5,1 Z" 
      fill={color} 
      stroke="#ffffff" 
      strokeWidth="0.8" 
    />
    <path d="M -1.5,-2 A 1.5,1.5 0 0,0 1.5,-2" stroke="#ffffff" strokeWidth="0.8" fill="none" />
  </g>
);

const Pitch5VectorSVG = ({ field }) => {
  const { grassPattern, ballPos, teamA, teamB, jerseys, index } = getPitchStyle(field.id, field.name, '5');
  const displayNum = index < 10 ? `0${index}` : index;
  
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pitch5Grad-${field.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <filter id={`glow-${field.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`lineGrad-${field.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="240" fill={`url(#pitch5Grad-${field.id})`} />
      
      <g opacity="0.15">
        <circle cx="200" cy="120" r="180" fill="none" stroke="#ffffff" strokeWidth="30" />
        <circle cx="200" cy="120" r="100" fill="none" stroke="#ffffff" strokeWidth="25" />
      </g>
      
      <text x="310" y="80" fill="rgba(255,255,255,0.06)" fontSize="72" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
        {displayNum}
      </text>
      
      <rect x="20" y="15" width="360" height="210" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" rx="4" />
      <line x1="200" y1="15" x2="200" y2="225" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="35" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="3" fill="#ffffff" />
      
      <path d="M 20 70 L 60 70 A 50 50 0 0 1 60 170 L 20 170" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="50" cy="120" r="2.5" fill="#ffffff" />
      <rect x="10" y="95" width="10" height="50" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 380 70 L 340 70 A 50 50 0 0 0 340 170 L 380 170" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="350" cy="120" r="2.5" fill="#ffffff" />
      <rect x="380" y="95" width="10" height="50" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 30 15 A 10 10 0 0 1 20 25" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 20 215 A 10 10 0 0 1 30 225" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 370 225 A 10 10 0 0 1 380 215" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 380 25 A 10 10 0 0 1 370 15" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      
      {teamA.map((p, idx) => (
        <g key={`ta-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.a} />
        </g>
      ))}
      
      {teamB.map((p, idx) => (
        <g key={`tb-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.b} />
        </g>
      ))}
      
      <circle cx={ballPos.x} cy={ballPos.y} r="6" fill="#ffffff" filter={`url(#glow-${field.id})`} />
      <circle cx={ballPos.x} cy={ballPos.y} r="4" fill="#0f172a" />
      <circle cx={ballPos.x} cy={ballPos.y} r="2" fill="#ffffff" />
    </svg>
  );
};

const Pitch7VectorSVG = ({ field }) => {
  const { grassPattern, ballPos, teamA, teamB, jerseys, index } = getPitchStyle(field.id, field.name, '7');
  const displayNum = index < 10 ? `0${index}` : index;
  
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pitch7Grad-${field.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id={`glow-${field.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`lineGrad-${field.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="240" fill={`url(#pitch7Grad-${field.id})`} />
      
      {grassPattern === 0 && (
        <g opacity="0.15">
          <rect x="0" width="40" height="240" fill="#ffffff" />
          <rect x="80" width="40" height="240" fill="#ffffff" />
          <rect x="160" width="40" height="240" fill="#ffffff" />
          <rect x="240" width="40" height="240" fill="#ffffff" />
          <rect x="320" width="40" height="240" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 1 && (
        <g opacity="0.12">
          <rect x="0" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="80" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="240" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="0" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="160" width="80" height="80" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 2 && (
        <g opacity="0.12">
          <rect x="0" y="0" width="400" height="30" fill="#ffffff" />
          <rect x="0" y="60" width="400" height="30" fill="#ffffff" />
          <rect x="0" y="120" width="400" height="30" fill="#ffffff" />
          <rect x="0" y="180" width="400" height="30" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 3 && (
        <g opacity="0.12">
          <circle cx="200" cy="120" r="180" fill="none" stroke="#ffffff" strokeWidth="30" />
          <circle cx="200" cy="120" r="100" fill="none" stroke="#ffffff" strokeWidth="25" />
        </g>
      )}
      
      <text x="310" y="80" fill="rgba(255,255,255,0.06)" fontSize="72" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
        {displayNum}
      </text>
      
      <rect x="20" y="15" width="360" height="210" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" rx="4" />
      <line x1="200" y1="15" x2="200" y2="225" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="35" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="3" fill="#ffffff" />
      
      <rect x="20" y="55" width="55" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="20" y="80" width="22" height="80" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="60" cy="120" r="2.5" fill="#ffffff" />
      <rect x="10" y="90" width="10" height="60" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <rect x="325" y="55" width="55" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="358" y="80" width="22" height="80" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="340" cy="120" r="2.5" fill="#ffffff" />
      <rect x="380" y="90" width="10" height="60" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 30 15 A 10 10 0 0 1 20 25" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 20 215 A 10 10 0 0 1 30 225" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 370 225 A 10 10 0 0 1 380 215" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 380 25 A 10 10 0 0 1 370 15" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      
      {teamA.map((p, idx) => (
        <g key={`ta-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.a} />
        </g>
      ))}
      
      {teamB.map((p, idx) => (
        <g key={`tb-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.b} />
        </g>
      ))}
      
      <circle cx={ballPos.x} cy={ballPos.y} r="6" fill="#ffffff" filter={`url(#glow-${field.id})`} />
      <circle cx={ballPos.x} cy={ballPos.y} r="4" fill="#0f172a" />
      <circle cx={ballPos.x} cy={ballPos.y} r="2" fill="#ffffff" />
    </svg>
  );
};

const Pitch11VectorSVG = ({ field }) => {
  const { grassPattern, ballPos, teamA, teamB, jerseys, index } = getPitchStyle(field.id, field.name, '11');
  const displayNum = index < 10 ? `0${index}` : index;
  
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pitch11Grad-${field.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="40%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <filter id={`glow-${field.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`lineGrad-${field.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="240" fill={`url(#pitch11Grad-${field.id})`} />
      
      {grassPattern === 0 && (
        <g opacity="0.08">
          <polygon points="0,0 80,0 0,80" fill="#ffffff" />
          <polygon points="120,0 240,0 0,240 0,160" fill="#ffffff" />
          <polygon points="280,0 400,0 400,80 160,240 80,240" fill="#ffffff" />
          <polygon points="400,160 400,240 320,240" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 1 && (
        <g opacity="0.12">
          <rect x="0" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="0" width="80" height="80" fill="#ffffff" />
          <rect x="80" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="240" y="80" width="80" height="80" fill="#ffffff" />
          <rect x="0" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="160" y="160" width="80" height="80" fill="#ffffff" />
          <rect x="320" y="160" width="80" height="80" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 2 && (
        <g opacity="0.15">
          <rect y="0" width="400" height="40" fill="#ffffff" />
          <rect y="80" width="400" height="40" fill="#ffffff" />
          <rect y="160" width="400" height="40" fill="#ffffff" />
        </g>
      )}
      {grassPattern === 3 && (
        <g opacity="0.12">
          <circle cx="200" cy="120" r="180" fill="none" stroke="#ffffff" strokeWidth="30" />
          <circle cx="200" cy="120" r="100" fill="none" stroke="#ffffff" strokeWidth="25" />
        </g>
      )}
      
      <text x="310" y="80" fill="rgba(255,255,255,0.06)" fontSize="72" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
        {displayNum}
      </text>
      
      <rect x="8" y="7" width="384" height="226" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="20" />
      <rect x="12" y="10" width="376" height="220" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" rx="16" />
      
      <rect x="25" y="20" width="350" height="200" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" rx="2" />
      <line x1="200" y1="20" x2="200" y2="220" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="35" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <circle cx="200" cy="120" r="3" fill="#ffffff" />
      
      <path d="M 90 90 A 30 30 0 0 1 90 150" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="25" y="55" width="65" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="25" y="85" width="22" height="70" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="65" cy="120" r="2.5" fill="#ffffff" />
      <rect x="15" y="92" width="10" height="56" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 310 90 A 30 30 0 0 0 310 150" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="310" y="55" width="65" height="130" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      <rect x="353" y="85" width="22" height="70" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <circle cx="335" cy="120" r="2.5" fill="#ffffff" />
      <rect x="375" y="92" width="10" height="56" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2.5" />
      
      <path d="M 33 20 A 8 8 0 0 1 25 28" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 25 212 A 8 8 0 0 1 33 220" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 367 220 A 8 8 0 0 1 375 212" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      <path d="M 375 28 A 8 8 0 0 1 367 20" fill="none" stroke={`url(#lineGrad-${field.id})`} strokeWidth="2" />
      
      {teamA.map((p, idx) => (
        <g key={`ta-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.a} />
        </g>
      ))}
      
      {teamB.map((p, idx) => (
        <g key={`tb-${idx}`} transform={`translate(${p.x}, ${p.y})`}>
          <JerseyIcon color={jerseys.b} />
        </g>
      ))}
      
      <circle cx={ballPos.x} cy={ballPos.y} r="6" fill="#ffffff" filter={`url(#glow-${field.id})`} />
      <circle cx={ballPos.x} cy={ballPos.y} r="4" fill="#0f172a" />
      <circle cx={ballPos.x} cy={ballPos.y} r="2" fill="#ffffff" />
    </svg>
  );
};

export default function FieldCard({ field, index = 0 }) {
  // Logic hiển thị ảnh dựa trên loại sân để tạo sự đa dạng cho 30 thẻ sân
  const getFieldImage = (type) => {
    // Sử dụng ảnh cục bộ từ thư mục public để đảm bảo hiển thị 100%
    if (type === '5_nguoi') return "/field5.png";
    if (type === '7_nguoi') return "/field7.png";
    if (type === '11_nguoi') return "/field11.png";
    return "/field5.png";
  };

  const pitchType = field?.type || '';
  const pitchCategory = pitchType.includes('5') ? 'Sân 5' : pitchType.includes('11') ? 'Sân 11' : 'Sân 7';
  const pricing = PITCH_PRICING[pitchCategory] || PITCH_PRICING['Sân 5'];
  const minPrice = pricing?.day?.weekday || 0;
  const maxPrice = pricing?.night?.weekend || 0;

  // Mock amenities based on database schema
  const amenities = [
    { icon: <Wifi size={14} />, label: 'Wifi' },
    { icon: <Car size={14} />, label: 'Gửi xe' },
    { icon: <Coffee size={14} />, label: 'Căng tin' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col md:flex-row gap-8 p-6 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.15)] transition-all duration-500 group overflow-hidden relative text-left"
    >
      {/* Photo Gallery / Main Image */}
      <div className="w-full md:w-64 h-64 rounded-[2rem] overflow-hidden bg-emerald-950 flex-shrink-0 relative shadow-inner flex items-center justify-center">
        {field.type === '5_nguoi' ? (
          <Pitch5VectorSVG field={field} />
        ) : field.type === '7_nguoi' ? (
          <Pitch7VectorSVG field={field} />
        ) : field.type === '11_nguoi' ? (
          <Pitch11VectorSVG field={field} />
        ) : (
          <img 
            src={getFieldImage(field.type)} 
            alt={field.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4 z-10">
           <span className="bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
             {pitchCategory}
           </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2 text-left z-10">
        <div className="text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2 text-left">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-none group-hover:text-emerald-600 transition-colors text-left drop-shadow-sm">
              {field.name}
            </h3>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             📍 {field.address || "Chi nhánh chính - HKSPORT"}
          </p>
          
          <div className="mt-4 mb-2">
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Sân cỏ nhân tạo chất lượng cao, hệ thống chiếu sáng tiêu chuẩn.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-gray-100/60 text-left">
          <div className="flex items-baseline gap-2 text-left">
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Khoảng giá thuê</span>
                <p className="text-3xl font-black text-emerald-600 italic tracking-tighter leading-none">
                   {(minPrice/1000).toLocaleString()}k - {(maxPrice/1000).toLocaleString()}k
                   <span className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest italic">/trận</span>
                </p>
              </div>
          </div>
          <div className="flex flex-1 gap-3">
             <Link 
                to={`/fields/${field.id}`} 
                state={{ category: pitchCategory }} 
                className="flex-1 text-decoration-none"
             >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-full py-4 border-2 border-emerald-100/50 text-emerald-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-center block no-underline leading-none flex items-center justify-center bg-white cursor-pointer shadow-sm hover:shadow-md"
                >
                   Chi tiết
                </motion.button>
             </Link>
             <Link 
                to="/booking" 
                state={{ 
                  fieldId: field.id, 
                  pitchId: field.id,
                  pitch: field.name,
                  category: pitchCategory 
                }} 
                className="flex-1 text-decoration-none"
             >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)] border-none cursor-pointer text-center block no-underline leading-none flex items-center justify-center"
                >
                   Đặt sân ngay
                </motion.button>
             </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
