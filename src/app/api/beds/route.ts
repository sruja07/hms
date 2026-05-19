import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bed = await prisma.bed.create({
      data: body,
    });
    return NextResponse.json(bed, { status: 201 });
  } catch (error) {
    console.error('Error creating bed:', error);
    return NextResponse.json({ error: 'Failed to create bed' }, { status: 500 });
  }
}
