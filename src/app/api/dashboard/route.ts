import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalPatients = await prisma.patient.count();
    const totalDoctors = await prisma.doctor.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const availableBeds = await prisma.bed.count({
      where: {
        isOccupied: false,
      },
    });

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      todayAppointments,
      availableBeds
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
