const fs = require('fs');
const path = require('path');

function fix(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      fix(p);
    } else if (f === 'route.ts') {
      let content = fs.readFileSync(p, 'utf8');
      // If NextResponse is used but not imported, add the import
      if (content.includes('NextResponse') && !content.includes("from 'next/server'")) {
        content = content.replace(
          "import prisma from '@/lib/prisma';",
          "import { NextResponse } from 'next/server';\nimport prisma from '@/lib/prisma';"
        );
        fs.writeFileSync(p, content, 'utf8');
        console.log('Fixed:', p);
      }
    }
  });
}

fix('src/app/api');