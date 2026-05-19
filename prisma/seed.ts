import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Clear hospitals first to prevent duplicates on re-seed
  await prisma.hospital.deleteMany();


  // Create Wards
  const generalWard = await prisma.ward.create({
    data: { name: 'General Ward', type: 'General' }
  });
  const icuWard = await prisma.ward.create({
    data: { name: 'ICU', type: 'Intensive Care' }
  });
  const maternityWard = await prisma.ward.create({
    data: { name: 'Maternity Ward', type: 'Maternity' }
  });

  // Create Beds
  const wards = [generalWard, icuWard, maternityWard];
  let bedCount = 1;
  for (const ward of wards) {
    for (let i = 0; i < 4; i++) {
      await prisma.bed.create({
        data: {
          wardId: ward.id,
          bedNumber: `B-${bedCount++}`,
          isOccupied: Math.random() > 0.5
        }
      });
    }
  }

  // Create Doctors
  const docs = [
    { name: 'Dr. Suresh Iyer', specialization: 'Cardiologist', contact: '9876543210', availability: 'Mon-Fri 10AM-2PM' },
    { name: 'Dr. Meena Nair', specialization: 'Neurologist', contact: '9876543211', availability: 'Mon,Wed,Fri 9AM-1PM' },
    { name: 'Dr. Arun Verma', specialization: 'Orthopedic', contact: '9876543212', availability: 'Tue-Sat 11AM-4PM' },
    { name: 'Dr. Kavitha Rao', specialization: 'Gynecologist', contact: '9876543213', availability: 'Mon-Thu 10AM-1PM' },
    { name: 'Dr. Ravi Shankar', specialization: 'General Physician', contact: '9876543214', availability: 'Mon-Sat 9AM-5PM' }
  ];
  
  const createdDoctors = await Promise.all(docs.map(doc => prisma.doctor.create({ data: doc })));

  // Create Patients
  const pats = [
    { name: 'Rajesh Kumar', age: 45, gender: 'Male', contact: '8765432109', address: '123 MG Road, Mumbai', bloodGroup: 'O+' },
    { name: 'Priya Sharma', age: 32, gender: 'Female', contact: '8765432108', address: '45 Park Street, Delhi', bloodGroup: 'A+' },
    { name: 'Amit Patel', age: 28, gender: 'Male', contact: '8765432107', address: '78 Ring Road, Ahmedabad', bloodGroup: 'B+' },
    { name: 'Sunita Reddy', age: 50, gender: 'Female', contact: '8765432106', address: '12 Banjara Hills, Hyderabad', bloodGroup: 'AB+' },
    { name: 'Vikram Singh', age: 60, gender: 'Male', contact: '8765432105', address: '89 Civil Lines, Jaipur', bloodGroup: 'O-' }
  ];

  const createdPatients = await Promise.all(pats.map(pat => prisma.patient.create({ data: pat })));

  // Create Appointments
  const statuses = ['pending', 'confirmed', 'completed'];
  for (let i = 0; i < 5; i++) {
    await prisma.appointment.create({
      data: {
        patientId: createdPatients[i].id,
        doctorId: createdDoctors[i % createdDoctors.length].id,
        date: new Date(new Date().setDate(new Date().getDate() + i)),
        time: '10:00 AM',
        status: statuses[i % statuses.length]
      }
    });
  }

  // Create Bills
  const paymentStatuses = ['paid', 'unpaid'];
  for (let i = 0; i < 5; i++) {
    await prisma.bill.create({
      data: {
        patientId: createdPatients[i].id,
        amount: Math.floor(Math.random() * 5000) + 1000,
        paymentStatus: paymentStatuses[i % paymentStatuses.length],
        description: `Consultation and tests`
      }
    });
  }

  // Create Hospitals for all cities
  const hospitalData = [
    // Ahmedabad
    { name: 'Tulsi Sterling Hospital', city: 'Ahmedabad', address: 'Off Gurukul Road, Memnagar, Ahmedabad, Gujarat 380052', contact: '+91 79 4006 1000', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Apollo Hospital', city: 'Ahmedabad', address: 'Plot No. 1A, GIDC Bhat, Gandhinagar, Ahmedabad, Gujarat 382428', contact: '+91 79 6670 1800', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Zydus Hospital', city: 'Ahmedabad', address: 'Nr. Sola Bridge, S.G. Highway, Ahmedabad, Gujarat 380054', contact: '+91 79 6619 0200', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop' },
    // Bangalore
    { name: 'Tulsi Manipal Hospital', city: 'Bangalore', address: '98, HAL Airport Road, Bengaluru, Karnataka 560017', contact: '+91 80 2502 4444', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Fortis Hospital', city: 'Bangalore', address: '14, Cunningham Road, Vasanth Nagar, Bengaluru, Karnataka 560052', contact: '+91 80 6621 4444', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Narayana Health City', city: 'Bangalore', address: '258/A, Bommasandra Industrial Area, Anekal Taluk, Bengaluru, Karnataka 560099', contact: '+91 80 7122 2222', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop' },
    // Bhopal
    { name: 'Tulsi AIIMS Bhopal', city: 'Bhopal', address: 'Saket Nagar, Bhopal, Madhya Pradesh 462020', contact: '+91 755 2672 335', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Bansal Hospital', city: 'Bhopal', address: 'C Sector, Shahpura, Bhopal, Madhya Pradesh 462016', contact: '+91 755 4273 500', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop' },
    // Bhubaneswar
    { name: 'Tulsi AIIMS Bhubaneswar', city: 'Bhubaneswar', address: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019', contact: '+91 674 2476 789', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Apollo Hospital Bhubaneswar', city: 'Bhubaneswar', address: 'Plot No. 251, Sainik School Road, Unit 15, Bhubaneswar, Odisha 751005', contact: '+91 674 6661 0200', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop' },
    // Chennai
    { name: 'Tulsi Apollo Hospital Chennai', city: 'Chennai', address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006', contact: '+91 44 2829 0200', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Fortis Malar Hospital', city: 'Chennai', address: '52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020', contact: '+91 44 4289 2222', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop' },
    { name: 'Tulsi MIOT International', city: 'Chennai', address: '4/112, Mt. Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600089', contact: '+91 44 2249 2288', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop' },
    // Delhi
    { name: 'Tulsi AIIMS Delhi', city: 'Delhi', address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029', contact: '+91 11 2658 8500', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Max Super Speciality Hospital', city: 'Delhi', address: '1 Press Enclave Road, Saket, New Delhi 110017', contact: '+91 11 2651 5050', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Fortis Escorts Heart Institute', city: 'Delhi', address: 'Okhla Road, New Delhi 110025', contact: '+91 11 4713 5000', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop' },
    // Guwahati
    { name: 'Tulsi Gauhati Medical College & Hospital', city: 'Guwahati', address: 'Bhangagarh, Guwahati, Assam 781032', contact: '+91 361 2529 457', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Nemcare Hospital', city: 'Guwahati', address: 'G.S. Road, Christianbasti, Guwahati, Assam 781005', contact: '+91 361 2343 301', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop' },
    // Hyderabad
    { name: 'Tulsi Apollo Hospital Hyderabad', city: 'Hyderabad', address: 'Jubilee Hills, Hyderabad, Telangana 500033', contact: '+91 40 2360 7777', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Yashoda Hospital', city: 'Hyderabad', address: 'Alexander Road, Koti, Hyderabad, Telangana 500095', contact: '+91 40 4567 4567', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop' },
    { name: 'Tulsi KIMS Hospital', city: 'Hyderabad', address: '1-8-31/1, Minister Road, Secunderabad, Telangana 500003', contact: '+91 40 4488 5000', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop' },
    // Indore
    { name: 'Tulsi Bombay Hospital Indore', city: 'Indore', address: 'Ring Road, Indore, Madhya Pradesh 452010', contact: '+91 731 2570 222', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Choithram Hospital', city: 'Indore', address: 'Manik Bagh Road, Indore, Madhya Pradesh 452001', contact: '+91 731 2362 100', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop' },
    // Kolkata
    { name: 'Tulsi Apollo Gleneagles Hospital', city: 'Kolkata', address: '58, Canal Circular Road, Kadapara, Phool Bagan, Kolkata 700054', contact: '+91 33 2320 3040', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Fortis Hospital Kolkata', city: 'Kolkata', address: '730, Anandapur, E.M. Bypass Road, Kolkata 700107', contact: '+91 33 6628 4444', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop' },
    { name: 'Tulsi AMRI Hospital', city: 'Kolkata', address: 'JC-16 & 17, Sector III, Salt Lake City, Kolkata 700098', contact: '+91 33 6606 3800', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop' },
    // Mumbai
    { name: 'Tulsi Lilavati Hospital', city: 'Mumbai', address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050', contact: '+91 22 2675 1000', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Kokilaben Hospital', city: 'Mumbai', address: 'Four Bunglows, Andheri West, Mumbai 400053', contact: '+91 22 4269 6969', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Fortis Hospital Mumbai', city: 'Mumbai', address: 'Mulund Goregaon Link Road, Mumbai 400078', contact: '+91 22 4120 1111', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop' },
    // Pune
    { name: 'Tulsi Ruby Hall Clinic', city: 'Pune', address: '40, Sassoon Road, Pune, Maharashtra 411001', contact: '+91 20 6645 5555', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop' },
    { name: 'Tulsi Jehangir Hospital', city: 'Pune', address: '32, Sassoon Road, Pune, Maharashtra 411001', contact: '+91 20 6681 5000', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop' },
    { name: 'Tulsi KEM Hospital Pune', city: 'Pune', address: 'Rasta Peth, Sardar Moodliar Road, Pune, Maharashtra 411011', contact: '+91 20 2612 6300', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop' },
  ];

  await prisma.hospital.createMany({ data: hospitalData });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
