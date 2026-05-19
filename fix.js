const fs = require('fs');
const path = require('path');

function fix(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      fix(p);
    } else if (f === 'route.ts') {
      let content = fs.readFileSync(p, 'utf8');
      // Remove any existing force-dynamic lines
      content = content.split('\n').filter(l => !l.includes('force-dynamic')).join('\n');
      // Add it at the very top
      content = "export const dynamic = 'force-dynamic';\n" + content;
      fs.writeFileSync(p, content, 'utf8');
      console.log('Fixed:', p);
    }
  });
}

fix('src/app/api');