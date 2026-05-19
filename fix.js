const fs = require('fs');
const path = require('path');

function fix(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      fix(p);
    } else if (f === 'route.ts') {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/export const dynamic = 'force-dynamic';\r?\n/g, '');
      c = "export const dynamic = 'force-dynamic';\n" + c;
      fs.writeFileSync(p, c);
      console.log('Fixed:', p);
    }
  });
}

fix('src/app/api');