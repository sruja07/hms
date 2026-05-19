export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';\nimport { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: { appointments: true }
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: body
    });
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}
