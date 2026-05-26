import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, ArrowRight, ShieldCheck, Zap, CreditCard, Clock, Crown, Sparkles, Trophy } from 'lucide-react';
import { PITCH_PRICING } from '../constants/fields';
import MapSection from '../components/MapSection';
import VIPModal from '../components/VIPModal';

// Particles for celebration festival atmosphere in Hero Section
const CELEBRATION_PARTICLES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  size: Math.random() * 8 + 4,
  x: Math.random() * 100, // horizontal start position percentage
  delay: Math.random() * 8,
  duration: Math.random() * 12 + 8, // slower rise
  color: i % 3 === 0 ? 'bg-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : i % 3 === 1 ? 'bg-yellow-400/40 shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-teal-400/40 shadow-[0_0_8px_rgba(45,212,191,0.4)]'
}));

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
          <rect x="160" h="80" width="80" height="80" fill="#ffffff" />
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

const PitchVectorPreview = ({ field }) => {
  const is5 = field.type?.includes('5') || field.type?.toLowerCase().includes('5');
  const is11 = field.type?.includes('11') || field.type?.toLowerCase().includes('11');
  
  if (is5) return <Pitch5VectorSVG field={field} />;
  if (is11) return <Pitch11VectorSVG field={field} />;
  return <Pitch7VectorSVG field={field} />;
};

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 100,
    totalFields: 20,
    totalBookings: 5000,
    averageRating: 4.9
  });

  const [reviews, setReviews] = useState([]);
  const [topPitches, setTopPitches] = useState([]);
  const [isVIPModalOpen, setIsVIPModalOpen] = useState(false);
  const [openMatches, setOpenMatches] = useState([]);
  const [neymarSrc, setNeymarSrc] = useState("/neymar-greenscreen.png");

  useEffect(() => {
    const img = new Image();
    img.src = "/neymar-greenscreen.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample background color from top-left corner
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        
        // Generous threshold to clear background and ensure clean edges
        const threshold = 120;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
          );
          
          if (dist < threshold) {
            data[i+3] = 0; // Transparent
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        setNeymarSrc(canvas.toDataURL());
      } catch (e) {
        console.error("Failed to chroma-key Neymar background:", e);
      }
    };
  }, []);

  const [searchData, setSearchData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '17:00',
    type: 'Sân 7'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stats/overview');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
      }
    };
    
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reviews/latest');
        const result = await response.json();
        if (result.success) {
          setReviews(result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy đánh giá:", error);
      }
    };

    const fetchTopPitches = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fields/top-booked');
        const result = await response.json();
        if (result.success) {
          setTopPitches(result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy sân đặt nhiều:", error);
      }
    };

    const fetchOpenMatches = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/matches');
        const result = await response.json();
        if (result.data) {
          setOpenMatches(result.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Lỗi lấy kèo bóng:", error);
      }
    };

    fetchStats();
    fetchReviews();
    fetchTopPitches();
    fetchOpenMatches();
  }, []);

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      
      {/* 1. PHẦN BANNER CHÍNH (HERO SECTION) [CAO CẤP] */}
      <section className="relative min-h-[850px] flex items-center justify-center text-center text-white px-6 pb-32 pt-20 overflow-hidden">
        {/* Ảnh nền & Lớp phủ Gradient điện ảnh */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <motion.img 
            src="/hero-fans.png" 
            alt="Hero Banner" 
            className="w-full h-full object-cover origin-center"
            animate={{
              scale: [1, 1.08, 1.02, 1.08, 1],
              x: [0, -15, 10, -5, 0],
              y: [0, 8, -8, 5, 0],
              rotate: [0, 0.4, -0.4, 0.2, 0]
            }}
            transition={{
              duration: 35,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          {/* Lớp phủ Gradient xanh lá đậm để đảm bảo chữ hiển thị rõ nét */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#012213]/90 via-[#012f1a]/70 to-white" />
        </div>

        {/* Siêu sao Neymar Jr rê bóng cắt nền lơ lửng */}
        <motion.div 
          className="absolute top-10 left-[-3%] w-72 h-72 md:w-[500px] md:h-[500px] pointer-events-none z-10 filter drop-shadow-[0_30px_55px_rgba(0,0,0,0.6)] hidden lg:block"
          animate={{
            y: [0, -25, 0],
            rotate: [-2, 2, -2], // extremely elegant premium swaying
            scale: [1, 1.03, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Chữ nghệ thuật thể thao NEYMAR JR cách điệu */}
          <div className="absolute top-[4%] left-[14%] select-none rotate-[-8deg] z-0 font-extrabold text-2xl md:text-3xl tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-300 to-yellow-400 drop-shadow-[0_6px_12px_rgba(0,0,0,0.95)] opacity-95 pr-4 whitespace-nowrap">
            NEYMAR JR
            <div className="text-[9px] md:text-[10px] text-center not-italic tracking-widest text-white mt-0.5 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
              ★ SELEÇÃO #10 ★
            </div>
          </div>

          <img 
            src={neymarSrc} 
            alt="Neymar Jr Dribbling" 
            className="w-full h-full object-contain select-none relative z-10"
          />
        </motion.div>

        {/* Các hạt sáng lấp lánh ăn mừng lơ lửng */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {CELEBRATION_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute rounded-full ${p.color}`}
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
              }}
              initial={{ y: "110vh", opacity: 0 }}
              animate={{
                y: "-15vh",
                opacity: [0, 0.9, 0.9, 0],
                x: [`${p.x}%`, `${p.x + (Math.random() * 14 - 7)}%`]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-6xl w-full pt-0 -mt-16 md:-mt-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 shadow-2xl"
          >
            <motion.img 
              src="/kasport-logo.png" 
              alt="KaSport Logo" 
              className="w-5.5 h-5.5 object-contain shrink-0 rounded-md"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Hệ thống đặt sân chuyên nghiệp nhất</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[7rem] font-black mb-6 leading-[0.85] tracking-tighter text-white italic uppercase drop-shadow-2xl"
          >
            ĐAM MÊ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 filter drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              SÂN KASPORT
            </span> 
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-emerald-50 mb-16 max-w-2xl mx-auto font-medium drop-shadow-md"
          >
            Xem lịch trống trực tuyến và đặt sân ngay hôm nay.
          </motion.p>
          
          {/* THANH TÌM KIẾM ĐẶT SÂN NHANH CAO CẤP */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mt-24 md:mt-44 relative z-20 px-4 md:px-0"
          >
            <div className="bg-white rounded-[1.5rem] p-2 shadow-[0_25px_50px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-1.5 text-left relative overflow-hidden border border-gray-100/80">
              {/* Hiệu ứng phản chiếu kính mờ tinh tế */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-t-[1.5rem]"></div>
 
              {/* Ô nhập Ngày thi đấu */}
              <div className="flex-1 w-full py-3 px-4 hover:bg-gray-50 rounded-[1.2rem] transition-colors group cursor-pointer border-b md:border-b-0 md:border-r border-gray-100/60">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Ngày thi đấu</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors shrink-0">
                    <Calendar size={15} />
                  </div>
                  <input 
                    type="date" 
                    className="w-full font-black text-gray-900 border-none outline-none cursor-pointer bg-transparent text-sm"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                  />
                </div>
              </div>
 
              {/* Ô nhập Giờ bóng lăn */}
              <div className="flex-1 w-full py-3 px-4 hover:bg-gray-50 rounded-[1.2rem] transition-colors group cursor-pointer border-b md:border-b-0 md:border-r border-gray-100/60">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Giờ bóng lăn</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                    <Clock size={15} />
                  </div>
                  <input 
                    type="time" 
                    className="w-full font-black text-gray-900 border-none outline-none cursor-pointer bg-transparent text-sm"
                    value={searchData.time}
                    onChange={(e) => setSearchData({...searchData, time: e.target.value})}
                  />
                </div>
              </div>
 
              {/* Ô lựa chọn Loại sân */}
              <div className="flex-1 w-full py-3 px-4 hover:bg-gray-50 rounded-[1.2rem] transition-colors group cursor-pointer">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Loại sân</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors shrink-0">
                    <MapPin size={15} />
                  </div>
                  <select 
                    className="w-full font-black text-gray-900 border-none outline-none cursor-pointer bg-transparent text-sm appearance-none"
                    value={searchData.type}
                    onChange={(e) => setSearchData({...searchData, type: e.target.value})}
                  >
                    <option value="Sân 5">Sân 5 Người</option>
                    <option value="Sân 7">Sân 7 Người</option>
                    <option value="Sân 11">Sân 11 Người</option>
                  </select>
                </div>
              </div>
 
              {/* Nút Tìm sân */}
              <Link 
                to="/fields" 
                state={{ searchData }}
                className="w-full md:w-auto h-[68px] bg-emerald-600 text-white px-8 rounded-[1.2rem] font-black text-sm uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-decoration-none group shrink-0 relative overflow-hidden"
              >
                <span className="relative z-10">TÌM SÂN</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                
                {/* Hiệu ứng ánh sáng lướt qua nút */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. LIVE STATISTICS */}
      <section className="relative z-20 -mt-16 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] border border-white p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center md:border-r border-gray-100 last:border-0 pb-4 md:pb-0">
            <p className="text-3xl md:text-5xl font-black text-gray-900 italic tracking-tighter mb-1">{stats.totalUsers}+</p>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Thành viên</p>
          </div>
          <div className="text-center md:border-r border-gray-100 last:border-0 pb-4 md:pb-0">
            <p className="text-3xl md:text-5xl font-black text-gray-900 italic tracking-tighter mb-1">{stats.totalFields}+</p>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sân cỏ chuẩn FIFA</p>
          </div>
          <div className="text-center md:border-r border-gray-100 last:border-0 pb-4 md:pb-0">
            <p className="text-3xl md:text-5xl font-black text-gray-900 italic tracking-tighter mb-1">
              {stats.totalBookings >= 1000 ? `${(stats.totalBookings / 1000).toFixed(1)}k+` : `${stats.totalBookings}+`}
            </p>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Trận đấu mỗi tháng</p>
          </div>
          <div className="text-center last:border-0">
            <p className="text-3xl md:text-5xl font-black text-gray-900 italic tracking-tighter mb-1">{stats.averageRating}/5</p>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Đánh giá hài lòng</p>
          </div>
        </motion.div>
      </section>

      {/* 3. FEATURED FIELDS */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">KHÁM PHÁ HỆ THỐNG</p>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter italic leading-none uppercase">
                SÂN ĐƯỢC <span className="text-emerald-500">ĐẶT NHIỀU</span> NHẤT
              </h2>
            </div>
            <Link to="/fields" className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-all flex items-center gap-2 group text-decoration-none">
              Xem tất cả sân <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {(topPitches.length > 0 ? topPitches : [
              { id: 1, type: '5_nguoi', label: 'Sân 5 - 01', min_price: 180000, max_price: 350000, rating: '4.8' },
              { id: 11, type: '7_nguoi', label: 'Sân 7 - 01', min_price: 350000, max_price: 600000, rating: '5.0' },
              { id: 21, type: '11_nguoi', label: 'Sân 11 - 01', min_price: 800000, max_price: 1500000, rating: '4.9' }
            ]).map((item, idx) => {
              // Logic hình ảnh
              const getImg = (type) => {
                if (type === '5_nguoi' || type === 'Sân 5') return "/field5.png";
                if (type === '7_nguoi' || type === 'Sân 7') return "/field7.png";
                if (type === '11_nguoi' || type === 'Sân 11') return "/field11.png";
                return "/field5.png";
              };

              const priceStr = item.min_price 
                ? `${(item.min_price/1000).toLocaleString()}k - ${(item.max_price/1000).toLocaleString()}k`
                : item.price; // Fallback for mock price

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-[300px] overflow-hidden">
                    <PitchVectorPreview field={{ id: item.id, name: item.label, type: item.type }} />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900">
                        {item.type.includes('5') ? 'Sân 5' : item.type.includes('11') ? 'Sân 11' : 'Sân 7'}
                      </span>
                      <span className="bg-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white">HOT</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                       <div className="flex items-center gap-2 text-orange-400 mb-1">
                          <span className="text-sm font-black">★ {item.rating}</span>
                       </div>
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{item.label}</h3>
                    </div>
                  </div>
                  
                  <div className="p-8 text-left">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Giá thuê sân</p>
                        <p className="text-xl font-black text-emerald-600 italic tracking-tighter text-left">{priceStr}<span className="text-[10px] font-bold text-gray-400 ml-1">/trận</span></p>
                      </div>
                    </div>
                    <Link 
                      to="/fields" 
                      state={{ searchData: { type: item.type.includes('5') ? 'Sân 5' : item.type.includes('11') ? 'Sân 11' : 'Sân 7' } }}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 text-decoration-none"
                    >
                      Chi tiết & Đặt sân <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.5 VIP MEMBERSHIP PROMOTION BANNER */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.012 }}
            onClick={() => setIsVIPModalOpen(true)}
            className="w-full bg-gradient-to-br from-[#002616] via-[#002b17] to-[#00140c] rounded-[3rem] p-8 md:p-12 text-left relative overflow-hidden cursor-pointer shadow-xl group hover:shadow-2xl transition-all duration-500 border border-[#faea18]/15"
          >
            {/* Ambient Background Light/Glow */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-700/10 rounded-full opacity-40 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center select-none">
              
              {/* LEFT COLUMN: Text, Features & CTA (60% equivalent) */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-[#faea18] text-[#002616] px-3.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm">
                    <Crown size={10} className="fill-[#002616]" /> VIP MEMBERSHIP
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                  NÂNG CẤP VIP GOLD
                </h2>
                
                <p className="text-xs md:text-sm text-emerald-100/70 font-medium leading-relaxed font-sans mb-8 max-w-xl">
                  Ưu tiên nhận thông báo kèo mới sớm nhất 30 phút, giữ chỗ sân nhanh chóng, ghim bài đăng tìm đối thủ/tìm đồng đội lên đầu bảng và nhận diện huy hiệu VIP đặc quyền!
                </p>

                {/* Premium Specs Mini-Pills */}
                <div className="flex flex-wrap gap-2.5 mb-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-emerald-200 uppercase tracking-wider">
                    <Zap size={12} className="text-[#faea18] fill-[#faea18]" /> Ưu tiên 30p
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-emerald-200 uppercase tracking-wider">
                    <Crown size={12} className="text-[#faea18]" /> Badge Gold
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-emerald-200 uppercase tracking-wider">
                    <Sparkles size={12} className="text-[#faea18]" /> Ghim kèo VIP
                  </div>
                </div>

                {/* Pricing & CTA Button */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-emerald-800/40 w-fit">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Chỉ với</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#faea18] italic tracking-tighter">50.000đ</span>
                      <span className="text-[10px] font-bold text-emerald-200">/tháng</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#faea18] text-[#002616] hover:bg-[#fffb96] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-none cursor-pointer shadow-lg shadow-yellow-500/10 italic shrink-0"
                  >
                    Nâng cấp ngay 
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>

              {/* RIGHT COLUMN: Premium Visual Object (40% equivalent) */}
              <div className="lg:col-span-5 flex items-center justify-center relative min-h-[220px] lg:min-h-[280px]">
                
                {/* Golden Radial Glow */}
                <div className="absolute w-60 h-60 bg-[#faea18]/10 blur-[60px] rounded-full scale-110 pointer-events-none animate-pulse" />
                
                {/* Floating 3D VIP Gold Card */}
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [-1, 2, -1] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "easeInOut" 
                  }}
                  className="w-[260px] h-[155px] rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 p-5 shadow-[0_25px_60px_-15px_rgba(250,204,21,0.3)] relative overflow-hidden border border-yellow-300/40 select-none flex flex-col justify-between"
                >
                  {/* Glossy Satin Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-black tracking-widest text-yellow-950/80 leading-none">KASPORT</span>
                      <span className="text-[6px] font-extrabold tracking-[0.25em] text-yellow-950/60 uppercase mt-0.5">Complex Platform</span>
                    </div>
                    {/* Metal Gold Chip */}
                    <div className="w-9 h-6 bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-100 rounded border border-yellow-300/50 shadow-inner flex flex-col justify-between p-0.5">
                      <div className="h-[1px] bg-yellow-600/30 w-full" />
                      <div className="h-[1px] bg-yellow-600/30 w-full" />
                      <div className="h-[1px] bg-yellow-600/30 w-full" />
                    </div>
                  </div>

                  {/* Card Middle: VIP Status */}
                  <div className="my-2 relative z-10 flex items-center gap-1.5 pl-0.5">
                    <Crown size={14} className="text-yellow-950 fill-yellow-950/20" />
                    <span className="text-[11px] font-black tracking-[0.25em] text-yellow-950 uppercase leading-none">
                      VIP GOLD MEMBER
                    </span>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-end justify-between relative z-10">
                    <div className="flex flex-col text-left">
                      <span className="text-[6px] font-bold text-yellow-950/60 uppercase tracking-widest mb-0.5">MÃ THÀNH VIÊN</span>
                      <span className="text-[10px] font-black tracking-widest text-yellow-950 font-mono leading-none">
                        KSP 8888 9999
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex -space-x-1.5 mb-1.5">
                        <div className="w-5 h-5 rounded-full border border-yellow-500/20 bg-yellow-950/10 flex items-center justify-center text-[7px] font-black text-yellow-950">★</div>
                        <div className="w-5 h-5 rounded-full border border-yellow-500/20 bg-yellow-950/20 flex items-center justify-center text-[7px] font-black text-yellow-950">★</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. COMMUNITY & LIVE MATCHMAKING */}
      <section className="py-32 px-6 md:px-12 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2 text-left">
            <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">CỘNG ĐỒNG HKSPORT</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic leading-none mb-8 uppercase">
              KÈO BÓNG <br/>
              <span className="text-emerald-500">ĐANG MỞ</span> TRỰC TIẾP
            </h2>
            <p className="text-gray-500 font-medium mb-10 max-w-md">
              Hàng trăm kèo giao lưu mỗi ngày. Đừng để đôi chân nghỉ ngơi, hãy tìm đối thủ hoặc đồng đội ngay lập tức!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/matches" className="inline-flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all text-decoration-none shadow-sm flex-1">
                 Tìm đối thủ <ArrowRight size={16} />
              </Link>
              <Link to="/teammates" className="inline-flex items-center justify-center gap-3 bg-white border-2 border-emerald-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-emerald-800 hover:border-emerald-500 hover:bg-emerald-50 hover:-translate-y-1 transition-all text-decoration-none shadow-sm flex-1">
                 Tìm đồng đội <ArrowRight size={16} />
              </Link>
            </div>
            
          </div>
          
          <div className="md:w-1/2 relative w-full">
             <div className="flex flex-col gap-6 relative z-10 w-full">
                {openMatches.length > 0 ? (
                  openMatches.map((match, idx) => (
                    <motion.div 
                      key={match.id}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-white p-6 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between gap-4 w-full md:max-w-[450px] ${idx % 2 !== 0 ? 'md:ml-auto' : ''} hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.15)] transition-all duration-500 cursor-pointer`}
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black italic shadow-inner shrink-0 overflow-hidden">
                             {match.team_logo ? (
                               <img src={match.team_logo} alt="Team" className="w-full h-full object-cover" />
                             ) : (
                               match.team_name ? match.team_name[0] : 'K'
                             )}
                          </div>
                          <div className="text-left">
                             <p className="text-xs font-black text-gray-900 italic leading-none mb-1 uppercase truncate max-w-[150px]">{match.team_name}</p>
                             <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${match.match_type === 'find_opponent' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {match.match_type === 'find_opponent' ? 'Tìm đối' : 'Tìm người'}
                                </span>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter shrink-0">{match.match_date ? new Date(match.match_date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}) : ''} - {match.start_time?.slice(0,5)}</p>
                             </div>
                          </div>
                       </div>
                       <div className="text-right shrink-0">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{match.field_name || 'Sân HKSPORT'}</p>
                          <Link to={`/matches/${match.id}`} className="text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-0.5 hover:text-emerald-600 hover:border-emerald-600 transition-all text-decoration-none">Tham gia</Link>
                       </div>
                    </motion.div>
                  ))
                ) : (
                  /* Fallback if no matches found */
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Hiện chưa có kèo nào đang mở</p>
                     <div className="flex flex-col sm:flex-row gap-3">
                       <Link to="/matches" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-200 px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all text-decoration-none">Tìm đối thủ</Link>
                       <Link to="/teammates" className="text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-200 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all text-decoration-none">Tìm đồng đội</Link>
                     </div>
                  </div>
                )}
             </div>
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[100px] rounded-full" />
          </div>
        </div>
      </section>



      {/* 5. TESTIMONIALS */}
      <section className="pb-32 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-20 italic uppercase tracking-tighter">CỘNG ĐỒNG TIN DÙNG</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {reviews.length > 0 ? (
                 reviews.slice(0, 3).map((review) => (
                   <div key={review.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all text-left border border-gray-100">
                      <div className="flex gap-1 mb-6 text-orange-400">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="text-xs">
                            {s <= review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 font-medium mb-8 leading-relaxed italic">"{review.comment}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black italic text-lg">
                          {review.user_name ? review.user_name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 italic uppercase tracking-tighter">{review.user_name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.pitch_name}</p>
                        </div>
                      </div>
                   </div>
                 ))
               ) : (
                 [
                   { name: "Nguyễn Văn Phủi", role: "Đội trưởng FC Bát Xát", text: "Nền tảng đặt sân tuyệt vời nhất từng dùng. Lịch trống cực kỳ chuẩn xác, hỗ trợ thanh toán cọc nhanh chóng." },
                   { name: "Lê Văn Bóng", role: "Quản lý Giải phủi T5", text: "Từ khi dùng HKSPORT, việc tìm sân cho giải đấu trở nên quá đơn giản. Các chủ sân ở đây rất nhiệt tình." },
                   { name: "Trần Thế Kèo", role: "Vận động viên phong trào", text: "Giao diện hiện đại, dễ thao tác ngay cả trên điện thoại. Tôi rất thích các mã giảm giá vào khung giờ sáng." }
                 ].map((item, idx) => (
                   <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all text-left border border-gray-100">
                      <div className="flex gap-1 mb-6 text-orange-400">
                        {[1,2,3,4,5].map(s => <span key={s} className="text-xs">★</span>)}
                      </div>
                      <p className="text-gray-600 font-medium mb-8 leading-relaxed italic">"{item.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black italic text-lg">
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 italic uppercase tracking-tighter">{item.name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.role}</p>
                        </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section className="py-32 px-6 md:px-12 bg-[#002211] text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6">QUY TRÌNH HKSPORT</p>
          <h2 className="text-4xl md:text-6xl font-black mb-20 tracking-tighter italic uppercase underline decoration-emerald-500 underline-offset-8">3 BƯỚC BÓNG LĂN</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                 <div className="w-24 h-24 bg-emerald-800/30 rounded-3xl flex items-center justify-center text-4xl font-black italic border border-emerald-700/50">01</div>
                 <div className="absolute -top-4 -right-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                    <Search size={20} />
                 </div>
              </div>
              <h3 className="text-xl font-black italic uppercase mb-4 tracking-tighter">Chọn sân</h3>
              <p className="text-emerald-200/40 text-xs font-medium leading-relaxed uppercase tracking-widest text-center">Tìm sân trống, xem giá <br/>& vị trí trực quan.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                 <div className="w-24 h-24 bg-emerald-800/30 rounded-3xl flex items-center justify-center text-4xl font-black italic border border-emerald-700/50">02</div>
                 <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Zap size={20} />
                 </div>
              </div>
              <h3 className="text-xl font-black italic uppercase mb-4 tracking-tighter">Đặt ngay</h3>
              <p className="text-emerald-200/40 text-xs font-medium leading-relaxed uppercase tracking-widest text-center">Chọn khung giờ vàng <br/>& thanh toán cọc.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                 <div className="w-24 h-24 bg-emerald-800/30 rounded-3xl flex items-center justify-center text-4xl font-black italic border border-emerald-700/50">03</div>
                 <div className="absolute -top-4 -right-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                    <CreditCard size={20} />
                 </div>
              </div>
              <h3 className="text-xl font-black italic uppercase mb-4 tracking-tighter">Bóng lăn</h3>
              <p className="text-emerald-200/40 text-xs font-medium leading-relaxed uppercase tracking-widest text-center">Nhận mã sân tức thì <br/>& sẵn sàng ra sân!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES/BENEFITS */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 text-left">TẠI SAO CHỌN HKSPORT?</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic leading-none mb-10 uppercase text-left"> 
              TRẢI NGHIỆM <br/> ĐẶT SÂN <span className="text-emerald-500">ĐỈNH CAO</span>
            </h2>
            
            <div className="space-y-10 text-left">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 mb-1">Xác nhận 30 giây</h4>
                  <p className="text-gray-500 text-sm font-medium">Hệ thống tự động xử lý đơn hàng, nhận mã sân ngay lập tức qua tin nhắn.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 mb-1">Bảo hiểm trận đấu</h4>
                  <p className="text-gray-500 text-sm font-medium">Hoàn tiền 100% nếu có sự cố về sân bãi hoặc lỗi hệ thống từ phía chủ sân.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 mb-1">Giá luôn gốc</h4>
                  <p className="text-gray-500 text-sm font-medium">Cam kết giá niêm yết từ chủ sân, hỗ trợ tích điểm đổi Voucher hàng tháng.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
             {/* BẢNG ĐIỀU KHIỂN SỐ LIỆU QUAY LẠI THỰC TẾ (REAL-TIME SAAS DASHBOARD) */}
             <div className="rounded-[3rem] bg-gradient-to-br from-slate-900 to-emerald-950 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-emerald-500/20 text-white min-h-[420px] flex flex-col justify-between relative overflow-hidden group text-left">
                {/* Các luồng sáng phát quang lộng lẫy phía nền */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                   {/* Đầu bảng điều khiển */}
                   <div className="flex justify-between items-center mb-6">
                      <div>
                         <p className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Thống kê thực tế</p>
                         <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">HIỆU SUẤT QUAY LẠI</h3>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-[9px] font-black text-emerald-400 animate-pulse tracking-widest uppercase">
                         DỮ LIỆU THẬT
                      </div>
                   </div>

                   {/* Chỉ số chính */}
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tỷ lệ Retention</p>
                         <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-emerald-400">99.2%</span>
                            <span className="text-[9px] text-emerald-500 font-bold">▲ 0.8%</span>
                         </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng Đơn Đặt Sân</p>
                         <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white">{stats.totalBookings || '5,280'}</span>
                            <span className="text-[9px] text-slate-400 font-bold ml-0.5">lượt</span>
                         </div>
                      </div>
                   </div>

                   {/* Danh sách khách hàng thân thiết hàng đầu */}
                   <div className="space-y-3">
                      <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">KHÁCH HÀNG THÂN THIẾT GẦN ĐÂY</p>
                      
                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-800/40 flex items-center justify-center font-black text-xs text-emerald-300 border border-emerald-500/20">
                               L
                            </div>
                            <div>
                               <p className="text-xs font-black text-white uppercase tracking-tight">Nguyễn Thành Long</p>
                               <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Khách Kim Cương • Sân 7</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black text-white">32 Trận</p>
                            <p className="text-[8px] text-slate-400 font-medium">Quay lại: 100%</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-800/40 flex items-center justify-center font-black text-xs text-teal-300 border border-teal-500/20">
                               Đ
                            </div>
                            <div>
                               <p className="text-xs font-black text-white uppercase tracking-tight">Trần Anh Đức</p>
                               <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Khách Vàng • Sân 5</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black text-white">24 Trận</p>
                            <p className="text-[8px] text-slate-400 font-medium">Quay lại: 98.4%</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-800/40 flex items-center justify-center font-black text-xs text-blue-300 border border-blue-500/20">
                               H
                            </div>
                            <div>
                               <p className="text-xs font-black text-white uppercase tracking-tight">Lê Minh Hoàng</p>
                               <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Khách Kim Cương • Sân 7</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black text-white">19 Trận</p>
                            <p className="text-[8px] text-slate-400 font-medium">Quay lại: 100%</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Biểu đồ mô phỏng tăng trưởng */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex gap-1.5 items-end h-8 w-2/3">
                      <div className="bg-emerald-500/20 w-full h-1/3 rounded-sm"></div>
                      <div className="bg-emerald-500/30 w-full h-1/2 rounded-sm"></div>
                      <div className="bg-emerald-500/40 w-full h-2/3 rounded-sm"></div>
                      <div className="bg-emerald-500/60 w-full h-3/4 rounded-sm"></div>
                      <div className="bg-emerald-500/80 w-full h-5/6 rounded-sm"></div>
                      <div className="bg-emerald-500 w-full h-full rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   </div>
                   <p className="text-[8px] font-black tracking-widest text-slate-500 uppercase">XU HƯỚNG GIỮ CHÂN KHÁCH HÀNG</p>
                 </div>
             </div>
          </div>
        </div>
      </section>


      {/* 7. MAP SYSTEM SECTION */}
      <MapSection />

      {/* Global VIP details modal */}
      <VIPModal isOpen={isVIPModalOpen} onClose={() => setIsVIPModalOpen(false)} />
    </div>
  );
};

export default Home;
