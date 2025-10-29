import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const comics = [
  {
    id: 'quete-mystique',
    title: 'La Quête Mystique',
    color: '#8B4789',
    accentColor: '#D4AF37'
  },
  {
    id: 'cosmos-perdu',
    title: 'Cosmos Perdu',
    color: '#1E3A8A',
    accentColor: '#60A5FA'
  },
  {
    id: 'ombres-urbaines',
    title: 'Ombres Urbaines',
    color: '#1F2937',
    accentColor: '#F59E0B'
  }
];

const generateCoverSVG = (title, color, accentColor) => {
  return `<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${title}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="800" height="1200" fill="url(#grad-${title})"/>

  <!-- Decorative elements -->
  <circle cx="400" cy="300" r="150" fill="${accentColor}" opacity="0.15"/>
  <circle cx="150" cy="900" r="100" fill="${accentColor}" opacity="0.1"/>
  <circle cx="650" cy="1000" r="80" fill="${accentColor}" opacity="0.12"/>

  <!-- Border -->
  <rect x="30" y="30" width="740" height="1140" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.4"/>
  <rect x="40" y="40" width="720" height="1120" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>

  <!-- Title area -->
  <rect x="100" y="480" width="600" height="240" fill="rgba(0,0,0,0.5)" rx="10"/>

  <!-- Title text -->
  <text x="400" y="600" font-family="serif" font-size="56" font-weight="bold" fill="${accentColor}" text-anchor="middle" filter="url(#shadow)">
    ${title}
  </text>

  <!-- Subtitle -->
  <text x="400" y="660" font-family="sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" opacity="0.8">
    BANDE DESSINÉE
  </text>
</svg>`;
};

const generatePageSVG = (pageNumber, comicTitle, color, accentColor) => {
  const isOdd = pageNumber % 2 === 1;
  const bgColor = isOdd ? '#F5F5F5' : '#FFFFFF';

  return `<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1200" fill="${bgColor}"/>

  <!-- Page border -->
  <rect x="40" y="60" width="720" height="1080" fill="none" stroke="#333333" stroke-width="2"/>

  <!-- Content panels -->
  <rect x="80" y="100" width="640" height="300" fill="#E5E5E5" stroke="#666666" stroke-width="2"/>
  <text x="400" y="240" font-family="sans-serif" font-size="32" fill="#666666" text-anchor="middle">
    Panel 1
  </text>
  <text x="400" y="280" font-family="sans-serif" font-size="20" fill="#999999" text-anchor="middle">
    ${comicTitle}
  </text>

  <rect x="80" y="440" width="300" height="280" fill="#E5E5E5" stroke="#666666" stroke-width="2"/>
  <text x="230" y="580" font-family="sans-serif" font-size="28" fill="#666666" text-anchor="middle">
    Panel 2
  </text>

  <rect x="420" y="440" width="300" height="280" fill="#E5E5E5" stroke="#666666" stroke-width="2"/>
  <text x="570" y="580" font-family="sans-serif" font-size="28" fill="#666666" text-anchor="middle">
    Panel 3
  </text>

  <rect x="80" y="760" width="640" height="300" fill="#E5E5E5" stroke="#666666" stroke-width="2"/>
  <text x="400" y="910" font-family="sans-serif" font-size="32" fill="#666666" text-anchor="middle">
    Panel 4
  </text>

  <!-- Page number -->
  <text x="${isOdd ? '720' : '80'}" y="1150" font-family="sans-serif" font-size="24" fill="#333333" text-anchor="middle">
    ${pageNumber}
  </text>

  <!-- Accent decoration -->
  <circle cx="${isOdd ? '700' : '100'}" cy="100" r="30" fill="${accentColor}" opacity="0.3"/>
</svg>`;
};

// Create directories and generate images
comics.forEach(comic => {
  const comicDir = path.join(__dirname, 'public', 'comics', comic.id);

  // Create directory if it doesn't exist
  if (!fs.existsSync(comicDir)) {
    fs.mkdirSync(comicDir, { recursive: true });
  }

  // Generate cover
  const coverSVG = generateCoverSVG(comic.title, comic.color, comic.accentColor);
  fs.writeFileSync(path.join(comicDir, 'cover.jpg.svg'), coverSVG);
  console.log(`✓ Generated cover for ${comic.title}`);

  // Generate 6 pages
  for (let i = 1; i <= 6; i++) {
    const pageSVG = generatePageSVG(i, comic.title, comic.color, comic.accentColor);
    fs.writeFileSync(path.join(comicDir, `${i}.jpg.svg`), pageSVG);
  }
  console.log(`✓ Generated 6 pages for ${comic.title}`);
});

console.log('\n✅ All placeholder images generated successfully!');
console.log('\nNote: SVG files are named with .jpg.svg extension.');
console.log('Update comics.json to use .jpg.svg extension, or rename files to .svg');
