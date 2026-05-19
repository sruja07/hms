#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Create prisma directory
const prismaDir = path.join(__dirname, "prisma");
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Create schema.prisma
const schemaContent = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Patient {
  id        Int     @id @default(autoincrement())
  name      String
  age       Int
  gender    String
  contact   String
  address   String
  bloodGroup String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  appointments Appointment[]
  bills        Bill[]

  @@map("patients")
}

model Doctor {
  id            Int     @id @default(autoincrement())
  name          String
  specialization String
  contact       String
  availability  String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  appointments Appointment[]

  @@map("doctors")
}

model Appointment {
  id        Int     @id @default(autoincrement())
  patientId Int
  doctorId  Int
  date      DateTime
  time      String
  status    String  @default("pending") // pending, confirmed, completed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  doctor  Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade)

  @@map("appointments")
}

model Ward {
  id        Int     @id @default(autoincrement())
  name      String
  totalBeds Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  beds Bed[]

  @@map("wards")
}

model Bed {
  id        Int     @id @default(autoincrement())
  wardId    Int
  bedNumber String
  status    String  @default("available") // available, occupied
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ward Ward @relation(fields: [wardId], references: [id], onDelete: Cascade)

  @@map("beds")
}

model Bill {
  id        Int     @id @default(autoincrement())
  patientId Int
  amount    Float
  paymentStatus String @default("unpaid") // paid, unpaid
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("bills")
}
`;

fs.writeFileSync(path.join(prismaDir, "schema.prisma"), schemaContent);
console.log("✓ Created prisma/schema.prisma");

// Create seed.js
const seedContent = `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bill.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();

  // Create Patients
  const patients = await prisma.patient.createMany({
    data: [
      {
        name: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        contact: '9876543210',
        address: '123 MG Road, Bangalore',
        bloodGroup: 'O+',
      },
      {
        name: 'Priya Sharma',
        age: 32,
        gender: 'Female',
        contact: '9123456789',
        address: '456 Park Avenue, Mumbai',
        bloodGroup: 'A+',
      },
      {
        name: 'Amit Patel',
        age: 58,
        gender: 'Male',
        contact: '8765432109',
        address: '789 Elm Street, Delhi',
        bloodGroup: 'B+',
      },
      {
        name: 'Neha Singh',
        age: 27,
        gender: 'Female',
        contact: '7654321098',
        address: '321 Oak Lane, Hyderabad',
        bloodGroup: 'AB+',
      },
      {
        name: 'Vikram Desai',
        age: 52,
        gender: 'Male',
        contact: '6543210987',
        address: '654 Pine Road, Pune',
        bloodGroup: 'O-',
      },
    ],
  });

  // Create Doctors
  const doctors = await prisma.doctor.createMany({
    data: [
      {
        name: 'Dr. Anuj Mehta',
        specialization: 'Cardiology',
        contact: '9999888777',
        availability: 'Monday-Friday 9AM-5PM',
      },
      {
        name: 'Dr. Kavya Nair',
        specialization: 'Neurology',
        contact: '8888777666',
        availability: 'Monday-Friday 10AM-6PM',
      },
      {
        name: 'Dr. Suresh Kumar',
        specialization: 'Orthopedics',
        contact: '7777666555',
        availability: 'Tuesday-Saturday 8AM-4PM',
      },
      {
        name: 'Dr. Arjun Verma',
        specialization: 'Pediatrics',
        contact: '6666555444',
        availability: 'Monday-Thursday 9AM-5PM',
      },
      {
        name: 'Dr. Sneha Gupta',
        specialization: 'Dermatology',
        contact: '5555444333',
        availability: 'Wednesday-Friday 2PM-6PM',
      },
    ],
  });

  // Create Wards
  const wards = await prisma.ward.createMany({
    data: [
      { name: 'General Ward', totalBeds: 10 },
      { name: 'ICU', totalBeds: 5 },
      { name: 'Pediatric Ward', totalBeds: 8 },
      { name: 'Cardiac Ward', totalBeds: 6 },
      { name: 'Orthopedic Ward', totalBeds: 7 },
    ],
  });

  // Create Beds
  const beds = await prisma.bed.createMany({
    data: [
      { wardId: 1, bedNumber: 'G-101', status: 'available' },
      { wardId: 1, bedNumber: 'G-102', status: 'occupied' },
      { wardId: 1, bedNumber: 'G-103', status: 'available' },
      { wardId: 2, bedNumber: 'ICU-101', status: 'occupied' },
      { wardId: 2, bedNumber: 'ICU-102', status: 'available' },
      { wardId: 3, bedNumber: 'PED-101', status: 'available' },
      { wardId: 3, bedNumber: 'PED-102', status: 'available' },
      { wardId: 4, bedNumber: 'CARD-101', status: 'occupied' },
      { wardId: 4, bedNumber: 'CARD-102', status: 'available' },
      { wardId: 5, bedNumber: 'ORTHO-101', status: 'available' },
    ],
  });

  // Create Appointments
  await prisma.appointment.createMany({
    data: [
      {
        patientId: 1,
        doctorId: 1,
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        time: '10:00 AM',
        status: 'pending',
      },
      {
        patientId: 2,
        doctorId: 2,
        date: new Date(),
        time: '2:00 PM',
        status: 'confirmed',
      },
      {
        patientId: 3,
        doctorId: 3,
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        time: '11:00 AM',
        status: 'pending',
      },
      {
        patientId: 4,
        doctorId: 4,
        date: new Date(),
        time: '3:00 PM',
        status: 'completed',
      },
      {
        patientId: 5,
        doctorId: 5,
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        time: '4:00 PM',
        status: 'pending',
      },
    ],
  });

  // Create Bills
  await prisma.bill.createMany({
    data: [
      { patientId: 1, amount: 5000, paymentStatus: 'unpaid' },
      { patientId: 2, amount: 3500, paymentStatus: 'paid' },
      { patientId: 3, amount: 7200, paymentStatus: 'unpaid' },
      { patientId: 4, amount: 2500, paymentStatus: 'paid' },
      { patientId: 5, amount: 4800, paymentStatus: 'unpaid' },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\$disconnect();
  });
`;

fs.writeFileSync(path.join(prismaDir, "seed.js"), seedContent);
console.log("✓ Created prisma/seed.js");

console.log("\n✓ Prisma setup complete!");
console.log("Next, run: npm install @prisma/client prisma mysql2");
