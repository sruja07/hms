# Hospital Management System - Setup & Implementation

## Quick Start

### 1. Install Dependencies

```bash
npm install @prisma/client prisma mysql2
```

### 2. Create Prisma Directory and Files

Create the following directory structure:

```
prisma/
├── schema.prisma
└── seed.js
```

### 3. Copy Schema

Create `prisma/schema.prisma` with the content provided below (see SCHEMA section).

### 4. Configure Database

Update `.env.local`:

```
DATABASE_URL="mysql://root:YOURPASSWORD@localhost:3306/hms"
```

Replace `YOURPASSWORD` with your actual MariaDB root password.

### 5. Push Schema to Database

```bash
npx prisma db push
```

### 6. Run Seed Script

```bash
npm run db:seed
```

### 7. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## DATABASE SCHEMA

### Prisma Schema (prisma/schema.prisma)

```prisma
// This is your Prisma schema file,
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
```

---

## SEED SCRIPT

Create `prisma/seed.js`:

```javascript
const { PrismaClient } = require("@prisma/client");
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
        name: "Rajesh Kumar",
        age: 45,
        gender: "Male",
        contact: "9876543210",
        address: "123 MG Road, Bangalore",
        bloodGroup: "O+",
      },
      {
        name: "Priya Sharma",
        age: 32,
        gender: "Female",
        contact: "9123456789",
        address: "456 Park Avenue, Mumbai",
        bloodGroup: "A+",
      },
      {
        name: "Amit Patel",
        age: 58,
        gender: "Male",
        contact: "8765432109",
        address: "789 Elm Street, Delhi",
        bloodGroup: "B+",
      },
      {
        name: "Neha Singh",
        age: 27,
        gender: "Female",
        contact: "7654321098",
        address: "321 Oak Lane, Hyderabad",
        bloodGroup: "AB+",
      },
      {
        name: "Vikram Desai",
        age: 52,
        gender: "Male",
        contact: "6543210987",
        address: "654 Pine Road, Pune",
        bloodGroup: "O-",
      },
    ],
  });

  // Create Doctors
  const doctors = await prisma.doctor.createMany({
    data: [
      {
        name: "Dr. Anuj Mehta",
        specialization: "Cardiology",
        contact: "9999888777",
        availability: "Monday-Friday 9AM-5PM",
      },
      {
        name: "Dr. Kavya Nair",
        specialization: "Neurology",
        contact: "8888777666",
        availability: "Monday-Friday 10AM-6PM",
      },
      {
        name: "Dr. Suresh Kumar",
        specialization: "Orthopedics",
        contact: "7777666555",
        availability: "Tuesday-Saturday 8AM-4PM",
      },
      {
        name: "Dr. Arjun Verma",
        specialization: "Pediatrics",
        contact: "6666555444",
        availability: "Monday-Thursday 9AM-5PM",
      },
      {
        name: "Dr. Sneha Gupta",
        specialization: "Dermatology",
        contact: "5555444333",
        availability: "Wednesday-Friday 2PM-6PM",
      },
    ],
  });

  // Create Wards
  const wards = await prisma.ward.createMany({
    data: [
      { name: "General Ward", totalBeds: 10 },
      { name: "ICU", totalBeds: 5 },
      { name: "Pediatric Ward", totalBeds: 8 },
      { name: "Cardiac Ward", totalBeds: 6 },
      { name: "Orthopedic Ward", totalBeds: 7 },
    ],
  });

  // Create Beds
  const beds = await prisma.bed.createMany({
    data: [
      { wardId: 1, bedNumber: "G-101", status: "available" },
      { wardId: 1, bedNumber: "G-102", status: "occupied" },
      { wardId: 1, bedNumber: "G-103", status: "available" },
      { wardId: 2, bedNumber: "ICU-101", status: "occupied" },
      { wardId: 2, bedNumber: "ICU-102", status: "available" },
      { wardId: 3, bedNumber: "PED-101", status: "available" },
      { wardId: 3, bedNumber: "PED-102", status: "available" },
      { wardId: 4, bedNumber: "CARD-101", status: "occupied" },
      { wardId: 4, bedNumber: "CARD-102", status: "available" },
      { wardId: 5, bedNumber: "ORTHO-101", status: "available" },
    ],
  });

  // Create Appointments
  await prisma.appointment.createMany({
    data: [
      {
        patientId: 1,
        doctorId: 1,
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        time: "10:00 AM",
        status: "pending",
      },
      {
        patientId: 2,
        doctorId: 2,
        date: new Date(),
        time: "2:00 PM",
        status: "confirmed",
      },
      {
        patientId: 3,
        doctorId: 3,
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        time: "11:00 AM",
        status: "pending",
      },
      {
        patientId: 4,
        doctorId: 4,
        date: new Date(),
        time: "3:00 PM",
        status: "completed",
      },
      {
        patientId: 5,
        doctorId: 5,
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        time: "4:00 PM",
        status: "pending",
      },
    ],
  });

  // Create Bills
  await prisma.bill.createMany({
    data: [
      { patientId: 1, amount: 5000, paymentStatus: "unpaid" },
      { patientId: 2, amount: 3500, paymentStatus: "paid" },
      { patientId: 3, amount: 7200, paymentStatus: "unpaid" },
      { patientId: 4, amount: 2500, paymentStatus: "paid" },
      { patientId: 5, amount: 4800, paymentStatus: "unpaid" },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## FRONTEND IMPLEMENTATION

### 1. Root Layout with Sidebar

Create `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hospital Management System',
  description: 'Comprehensive Hospital Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex">
        <nav className="w-64 bg-blue-900 text-white min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">HMS</h1>
            <p className="text-sm text-blue-200">Hospital Management</p>
          </div>
          <ul className="space-y-2">
            <li>
              <a href="/" className="block p-3 rounded hover:bg-blue-800">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/patients" className="block p-3 rounded hover:bg-blue-800">
                Patients
              </a>
            </li>
            <li>
              <a href="/doctors" className="block p-3 rounded hover:bg-blue-800">
                Doctors
              </a>
            </li>
            <li>
              <a href="/appointments" className="block p-3 rounded hover:bg-blue-800">
                Appointments
              </a>
            </li>
            <li>
              <a href="/wards" className="block p-3 rounded hover:bg-blue-800">
                Wards & Beds
              </a>
            </li>
            <li>
              <a href="/billing" className="block p-3 rounded hover:bg-blue-800">
                Billing
              </a>
            </li>
          </ul>
        </nav>
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </body>
    </html>
  );
}
```

### 2. API Routes

Create `src/app/api/patients/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const patient = await prisma.patient.create({
    data: body,
  });
  return NextResponse.json(patient, { status: 201 });
}
```

Create `src/app/api/patients/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const patient = await prisma.patient.findUnique({
    where: { id: parseInt(params.id) },
    include: { appointments: true, bills: true },
  });
  return NextResponse.json(patient);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const patient = await prisma.patient.update({
    where: { id: parseInt(params.id) },
    data: body,
  });
  return NextResponse.json(patient);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.patient.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ success: true });
}
```

Create similar routes for:

- `src/app/api/doctors/route.ts`
- `src/app/api/doctors/[id]/route.ts`
- `src/app/api/appointments/route.ts`
- `src/app/api/appointments/[id]/route.ts`
- `src/app/api/wards/route.ts`
- `src/app/api/wards/[id]/route.ts`
- `src/app/api/beds/route.ts`
- `src/app/api/bills/route.ts`

### 3. Dashboard Page

Create `src/app/page.tsx`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const todayAppointments = await prisma.appointment.count({
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0)),
      },
    },
  });
  const availableBeds = await prisma.bed.count({
    where: { status: 'available' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total Patients</p>
          <p className="text-3xl font-bold text-blue-600">{patientCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total Doctors</p>
          <p className="text-3xl font-bold text-green-600">{doctorCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Today's Appointments</p>
          <p className="text-3xl font-bold text-purple-600">{todayAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Available Beds</p>
          <p className="text-3xl font-bold text-orange-600">{availableBeds}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## NEXT STEPS

1. Copy the Prisma schema and seed script files
2. Create API routes for all modules
3. Build React components for each module
4. Test all functionality

For complete implementations of all pages and API routes, see the continuation below.
