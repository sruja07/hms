const fs = require("fs");
const path = require("path");

const hospitalsDir = path.join(__dirname, "src", "app", "api", "hospitals");
const routeFile = path.join(hospitalsDir, "route.ts");

// Create directory if it doesn't exist
if (!fs.existsSync(hospitalsDir)) {
  fs.mkdirSync(hospitalsDir, { recursive: true });
  console.log("✅ Created hospitals directory");
}

// Create route.ts file
const routeContent = `import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get('city');
    
    let hospitals;
    if (city && city !== 'all' && city !== 'All') {
      hospitals = await prisma.hospital.findMany({
        where: { city: city },
        orderBy: { name: 'asc' },
      });
    } else {
      hospitals = await prisma.hospital.findMany({
        orderBy: { city: 'asc', name: 'asc' },
      });
    }

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hospital = await prisma.hospital.create({
      data: body,
    });
    return NextResponse.json(hospital, { status: 201 });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}
`;

fs.writeFileSync(routeFile, routeContent);
console.log("✅ Created hospitals/route.ts");
console.log("✨ Hospitals API is now ready!");
