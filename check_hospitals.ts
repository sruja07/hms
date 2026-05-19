import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.hospital.count().then(c => {
  console.log('Hospital count:', c);
  return p.hospital.findMany({ take: 3 });
}).then(rows => {
  console.log('Sample rows:', JSON.stringify(rows, null, 2));
}).catch(e => console.error(e)).finally(() => p.$disconnect());
