export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const bed = await prisma.bed.update({
      where: { id: parseInt(id) },
      data: body
    });
    return NextResponse.json(bed);
  } catch (error) {
    console.error('Error updating bed:', error);
    return NextResponse.json({ error: 'Failed to update bed' }, { status: 500 });
  }
}
