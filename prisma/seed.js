const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.bill.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.hospital.deleteMany();

  // Create Patients
  console.log("👥 Creating patients...");
  await prisma.patient.createMany({
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
  console.log("👨‍⚕️  Creating doctors...");
  await prisma.doctor.createMany({
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
  console.log("🏥 Creating wards...");
  await prisma.ward.createMany({
    data: [
      { name: "General Ward", totalBeds: 10 },
      { name: "ICU", totalBeds: 5 },
      { name: "Pediatric Ward", totalBeds: 8 },
      { name: "Cardiac Ward", totalBeds: 6 },
      { name: "Orthopedic Ward", totalBeds: 7 },
    ],
  });

  // Create Beds
  console.log("🛏️  Creating beds...");
  await prisma.bed.createMany({
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
  console.log("📅 Creating appointments...");
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
  console.log("💳 Creating bills...");
  await prisma.bill.createMany({
    data: [
      { patientId: 1, amount: 5000, paymentStatus: "unpaid" },
      { patientId: 2, amount: 3500, paymentStatus: "paid" },
      { patientId: 3, amount: 7200, paymentStatus: "unpaid" },
      { patientId: 4, amount: 2500, paymentStatus: "paid" },
      { patientId: 5, amount: 4800, paymentStatus: "unpaid" },
    ],
  });

  // Create Hospitals
  console.log("🏥 Creating hospitals...");
  await prisma.hospital.createMany({
    data: [
      {
        name: "HealthSync Premier Hospital",
        city: "Chennai",
        address: "154, Tech Park Road, Kilpauk, Chennai, Tamil Nadu 600010",
        contact: "080-6297-2772",
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "HealthSync Diagnostics Center",
        city: "Chennai",
        address: "645, High Street, Tondiarpet, Chennai, Tamil Nadu 600081",
        contact: "080-6297-2775",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "HealthSync Pediatrics Wing",
        city: "Chennai",
        address: "15, Medical District, Thousand Lights, Chennai, Tamil Nadu 600006",
        contact: "080-6297-2777",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "HealthSync Core Care",
        city: "Delhi",
        address: "Sarita Vihar, Medical Corridor, New Delhi 110076",
        contact: "080-6297-2778",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "HealthSync Multispeciality",
        city: "Mumbai",
        address: "Sector 23, Tech City, Navi Mumbai 400701",
        contact: "080-6297-2779",
        image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Apollo Hospital Bangalore",
        city: "Bangalore",
        address: "154/9 Bangalore Poojanahalli Rd, Newbury Street, Bangalore 560045",
        contact: "080-4060-9090",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Max Healthcare Hyderabad",
        city: "Hyderabad",
        address: "Banjara Hills, Road No.1, Hyderabad 500034",
        contact: "040-6666-6666",
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Fortis Hospital Pune",
        city: "Pune",
        address: "Baner, Pune 411045",
        contact: "020-6610-5050",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Ruby Hall Clinic Pune",
        city: "Pune",
        address: "Sassoon Road, Pune 411001",
        contact: "020-2610-5050",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Kolkata Medical Center",
        city: "Kolkata",
        address: "Alipore, Kolkata 700027",
        contact: "033-2479-8000",
        image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Indore Care Hospital",
        city: "Indore",
        address: "South Tukoganj, Indore 452001",
        contact: "0731-428-5000",
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Ahmedabad Health Center",
        city: "Ahmedabad",
        address: "Satellite, Ahmedabad 380015",
        contact: "079-6555-5000",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Bhopal Medical Institute",
        city: "Bhopal",
        address: "Arera Colony, Bhopal 462016",
        contact: "0755-431-7000",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Bhubaneswar Super Specialty",
        city: "Bhubaneswar",
        address: "Jaydev Vihar, Bhubaneswar 751013",
        contact: "0674-301-0000",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=300",
      },
      {
        name: "Guwahati Medical Services",
        city: "Guwahati",
        address: "Panjabari, Guwahati 781037",
        contact: "0361-262-3000",
        image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400&h=300",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
