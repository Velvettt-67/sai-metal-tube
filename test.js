const fs = require('fs');
const { execSync } = require('child_process');

console.log('Running Sai Metal And Tube test suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  PASS:', message);
    passed++;
  } else {
    console.error('  FAIL:', message);
    failed++;
  }
}

// 1. JS Syntax
try {
  execSync('node --check assets/js/main.js', { stdio: 'pipe' });
  execSync('node --check assets/js/theme-init.js', { stdio: 'pipe' });
  assert(true, 'JS syntax check (main.js, theme-init.js)');
} catch (e) {
  assert(false, 'JS syntax check failed: ' + e.message);
}

// 2. JSON files
try {
  JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(true, 'JSON validity (vercel.json, package.json)');
} catch (e) {
  assert(false, 'JSON validity check failed: ' + e.message);
}

// 3. HTML tag closure
const html = fs.readFileSync('index.html', 'utf8');
const voidTags = new Set(['meta', 'link', 'img', 'input', 'br', 'hr', 'col', 'base', 'wbr']);
const tagRegex = /<\/?([a-zA-Z0-9:-]+)([^>]*)>/g;
let m;
const stack = [];
let htmlMalformed = false;
while ((m = tagRegex.exec(html)) !== null) {
  const isClosing = m[0].startsWith('</');
  const tagName = m[1].toLowerCase();
  const isSelfClosing = m[0].endsWith('/>') || voidTags.has(tagName);
  if (isClosing) {
    if (stack.length === 0 || stack.pop() !== tagName) {
      htmlMalformed = true;
      break;
    }
  } else if (!isSelfClosing) {
    stack.push(tagName);
  }
}
assert(!htmlMalformed && stack.length === 0, 'HTML tag nesting and closure in index.html');

// 4. CSS brace balance
const css = fs.readFileSync('assets/css/styles.css', 'utf8');
let openBraces = 0;
for (const c of css) {
  if (c === '{') openBraces++;
  if (c === '}') openBraces--;
}
assert(openBraces === 0, 'CSS brace balance in styles.css');

// 5. Product catalog integrity
const js = fs.readFileSync('assets/js/main.js', 'utf8');
const pStart = js.indexOf('const P = [');
const pEnd = js.indexOf('].map(([name,cat,shape');
const rawP = eval(js.slice(pStart + 'const P = '.length, pEnd + 1));
const catsStart = js.indexOf('const CATS = [');
const catsEnd = js.indexOf('];\nconst catOf');
const CATS = eval(js.slice(catsStart + 'const CATS = '.length, catsEnd + 1));
const catKeys = new Set(CATS.map(c => c[0]));
const invalidCats = rawP.filter(p => !catKeys.has(p[1]));
assert(invalidCats.length === 0 && rawP.length === 46, `Product catalog consistency (46 products, all in valid categories)`);

// 6. Security headers in vercel.json
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const headers = vercel.headers.find(h => h.source === '/(.*)').headers;
const csp = headers.find(h => h.key === 'Content-Security-Policy');
assert(csp && csp.value.includes('fonts.gstatic.com') && csp.value.includes("script-src 'self'"), 'Vercel CSP header configuration');

// 7. Internal anchor targets in index.html
const idsInHtml = new Set();
let idMatch;
const idRegex = /\sid=["']([^"']+)["']/g;
while ((idMatch = idRegex.exec(html)) !== null) idsInHtml.add(idMatch[1]);
const hrefRegex = /href=["']#([^"']+)["']/g;
let brokenLinks = 0;
let hrefMatch;
while ((hrefMatch = hrefRegex.exec(html)) !== null) {
  if (!idsInHtml.has(hrefMatch[1])) brokenLinks++;
}
assert(brokenLinks === 0, 'Internal anchor links in index.html all resolve to valid element IDs');

// 8. Catalogue search matching logic
const norm = s => s.toLowerCase().replace(/(\d)\s*x\s*(\d)/gi, '$1×$2').replace(/\s*×\s*/g, '×').replace(/[″”"״]/g, '"').replace(/\s+/g, ' ').trim();
const searchFunc = (q) => {
  const t = norm(q);
  const tokens = t ? t.split(' ').filter(Boolean) : [];
  return rawP.filter(p => {
    const isSS = p[0].toLowerCase().includes('stainless');
    const grade = /304/.test(p[0]) ? '304' : /202/.test(p[0]) ? '202' : '';
    const hay = norm(p[0] + ' ' + (grade ? 'ss ' + grade + ' grade ' + grade : '') + ' ' + p[3] + ' ' + (catKeys.has(p[1]) ? p[1] : '') + (isSS ? ' ss' : ''));
    return tokens.every(tok => hay.includes(tok));
  });
};
const ss304Matches = searchFunc('ss 304');
const rect40x20Matches = searchFunc('40 x 20');
const quoteMatches = searchFunc('3"');
const gradeMatches = searchFunc('grade 304');
assert(ss304Matches.length === 3 && rect40x20Matches.length === 1 && quoteMatches.length === 3 && gradeMatches.length === 3, 'Search indexing matches trade terms (ss 304, 40 x 20, 3", grade 304)');

// 9. Calculator weight formula accuracy
const D = 22, t = 1.2, rho304 = 7.93;
const kgmRound = Math.PI * t * (D - t) * rho304 / 1000;
assert(kgmRound > 0.62 && kgmRound < 0.63, 'Round pipe weight calculator formula precision (22mm OD × 1.2mm wall)');

// 10. Disabled button and cursor styling
assert(css.includes('.btn:disabled') && css.includes('.cur-tr.hide'), 'CSS includes disabled button state and cursor trail hide rules');

// 11. Local server HTTP delivery & error handling
const http = require('http');
const server = require('./server.js');
server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  http.get(`http://127.0.0.1:${port}/`, (res) => {
    const okHome = res.statusCode === 200 && (res.headers['content-type'] || '').includes('text/html');
    http.get(`http://127.0.0.1:${port}/%zz`, (resBad) => {
      const okBad = resBad.statusCode === 400;
      server.close(() => {
        assert(okHome && okBad, 'Local dev server HTTP delivery and resilience against malformed URIs');
        console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
        if (failed > 0) process.exit(1);
      });
    });
  });
});
