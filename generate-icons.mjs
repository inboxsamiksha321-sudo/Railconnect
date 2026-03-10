import sharp from 'sharp'

const svg192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="32" fill="#1a3a6b"/>
  <text x="96" y="130" font-family="Arial" font-size="72" font-weight="bold" fill="white" text-anchor="middle">RC</text>
</svg>`

const svg512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="80" fill="#1a3a6b"/>
  <text x="256" y="360" font-family="Arial" font-size="180" font-weight="bold" fill="white" text-anchor="middle">RC</text>
</svg>`

await sharp(Buffer.from(svg192)).png().toFile('public/pwa-192x192.png')
console.log('192x192 done!')

await sharp(Buffer.from(svg512)).png().toFile('public/pwa-512x512.png')
console.log('512x512 done!')