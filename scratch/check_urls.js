const fs = require('fs');
const path = require('path');
const https = require('https');

const dataDir = path.join(__dirname, '../src/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));

const urls = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const regex = /(https:\/\/images\.unsplash\.com\/[^\s'"`]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push({ url: match[1], file });
  }
});

console.log(`Found ${urls.length} Unsplash URLs. Checking...`);

function checkUrl({ url, file }) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      if (res.statusCode >= 400) {
        console.log(`[BROKEN ${res.statusCode}] ${url} in ${file}`);
        resolve({ url, file, status: res.statusCode });
      } else {
        resolve({ url, file, status: res.statusCode });
      }
    });
    req.on('error', (err) => {
      console.log(`[ERROR ${err.message}] ${url} in ${file}`);
      resolve({ url, file, status: 'ERROR' });
    });
    req.on('timeout', () => {
      req.destroy();
      console.log(`[TIMEOUT] ${url} in ${file}`);
      resolve({ url, file, status: 'TIMEOUT' });
    });
    req.end();
  });
}

Promise.all(urls.map(checkUrl)).then((results) => {
  const broken = results.filter(r => r.status >= 400 || r.status === 'ERROR');
  console.log(`Finished checking. Total broken: ${broken.length}`);
});
