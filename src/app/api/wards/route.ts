export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const wards = await prisma.ward.findMany({
      include: { beds: true }
    });
    return NextResponse.json(wards);
  } catch (error) {
    console.error('Error fetching wards:', error);
    return NextResponse.json({ error: 'Failed to fetch wards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ward = await prisma.ward.create({
      data: body,
    });
    return NextResponse.json(ward, { status: 201 });
  } catch (error) {
    console.error('Error creating ward:', error);
    return NextResponse.json({ error: 'Failed to create ward' }, { status: 500 });
  }
}

