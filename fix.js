const fs = require('fs');
const path = require('path');

function fix(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      fix(p);
    } else if (f === 'route.ts') {
      let lines = fs.readFileSync(p, 'utf8').split('\n');
      lines = lines.filter(l => !l.includes('force-dynamic'));
      lines.unshift("export const dynamic = 'force-dynamic';");
      fs.writeFileSync(p, lines.join('\n'));
      console.log('Fixed:', p);
    }
  });
}

fix('src/app/api');