import { NextResponse, NextRequest } from 'next/server';
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
        orderBy: [{ city: 'asc' }, { name: 'asc' }],
      });
    }

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals', details: String(error) }, { status: 500 });
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
