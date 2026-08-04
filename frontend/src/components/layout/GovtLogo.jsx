import React, { useState } from 'react';

/**
 * Official Seal of the Government of Bangladesh Component
 */
export default function GovtLogo({ className = '', style = {} }) {
  const [imgError, setImgError] = useState(false);

  // Official logo image URLs
  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/8/84/Government_Seal_of_Bangladesh.svg";

  if (!imgError) {
    return (
      <img
        src={logoUrl}
        alt="Seal of Bangladesh Government"
        className={className}
        onError={() => setImgError(true)}
        style={{
          width: '2.75rem',
          height: '2.75rem',
          objectFit: 'contain',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          padding: '2px',
          flexShrink: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          ...style
        }}
      />
    );
  }

  // Pure SVG Fallback (rendered directly in DOM without external HTTP requests)
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 200 200"
      className={className}
      style={{
        display: 'block',
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        ...style
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Green Border */}
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#006A4E" strokeWidth="6" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#006A4E" strokeWidth="3" />
      
      {/* Inner Red Circle */}
      <circle cx="100" cy="100" r="64" fill="#F42A41" />

      {/* Yellow Bangladesh Map shape representation */}
      <path
        d="M92 52 C98 50 108 55 106 62 C104 68 115 72 118 78 C122 84 128 88 122 96 C118 102 124 110 128 118 C124 125 118 132 114 138 C110 134 104 126 102 120 C98 122 94 130 90 126 C86 120 90 114 88 108 C84 104 76 102 78 94 C80 88 84 84 86 78 C88 70 86 62 92 52 Z"
        fill="#FFD700"
      />

      {/* Bengali Ring Text */}
      <text x="100" y="28" textAnchor="middle" fill="#006A4E" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
        গণপ্রজাতন্ত্রী বাংলাদেশ
      </text>
      <text x="100" y="186" textAnchor="middle" fill="#006A4E" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
        সরকার
      </text>

      {/* 4 Red Stars (2 left, 2 right) */}
      <polygon points="28,90 31,98 39,98 32,103 35,111 28,106 21,111 24,103 17,98 25,98" fill="#F42A41" />
      <polygon points="34,120 37,128 45,128 38,133 41,141 34,136 27,141 30,133 23,128 31,128" fill="#F42A41" />

      <polygon points="172,90 175,98 183,98 176,103 179,111 172,106 165,111 168,103 161,98 169,98" fill="#F42A41" />
      <polygon points="166,120 169,128 177,128 170,133 173,141 166,136 159,141 162,133 155,128 163,128" fill="#F42A41" />
    </svg>
  );
}
