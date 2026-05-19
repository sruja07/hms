# 🏥 Hospital Management System - Quick Reference

## ⚡ 5-Minute Setup

```bash
# Step 1: Update .env.local
# DATABASE_URL="mysql://root:PASSWORD@localhost:3306/hms"

# Step 2: Run setup
node complete-setup.js

# Step 3: Install & initialize
npm install
npx prisma generate
npx prisma db push
npm run db:seed

# Step 4: Start
npm run dev

# Visit: http://localhost:3000
```

---

## 📊 What You Get

✅ **6 Database Tables** - Patient, Doctor, Appointment, Ward, Bed, Bill  
✅ **12 API Endpoints** - Full CRUD for all modules  
✅ **Dashboard** - Real-time statistics  
✅ **Sidebar Nav** - Easy module switching  
✅ **Sample Data** - 5+ records per table  
✅ **Responsive Design** - Mobile + desktop

---

## 🔗 API Quick Reference

```
Patients:      /api/patients (GET, POST, PUT, DELETE)
Doctors:       /api/doctors (GET, POST, PUT)
Appointments:  /api/appointments (GET, POST, PUT)
Wards:         /api/wards (GET, POST, PUT)
Beds:          /api/beds (GET, POST, PUT)
Bills:         /api/bills (GET, POST, PUT)
```

---

## 🗂️ Key Files

```
.env.local              → Database config
package.json            → Dependencies
src/app/layout.tsx      → Sidebar navigation
src/app/page.tsx        → Dashboard
src/app/api/*/route.ts  → API endpoints
prisma/schema.prisma    → Database schema
prisma/seed.js          → Sample data
```

---

## 📋 Common Commands

```bash
npm run dev             # Start server
npm run build          # Build for production
npm start              # Start production
npm run db:push        # Sync database
npm run db:seed        # Populate sample data
npx prisma studio     # Visual database editor
```

---

## 🧪 Test API with curl

```bash
# Get patients
curl http://localhost:3000/api/patients

# Create patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","age":30,"gender":"Male","contact":"9999999999","address":"Test","bloodGroup":"O+"}'

# Get patient by ID
curl http://localhost:3000/api/patients/1
```

---

## 🚨 Troubleshooting

| Problem             | Solution                           |
| ------------------- | ---------------------------------- |
| DB connection error | Check DATABASE_URL in .env.local   |
| Port 3000 in use    | npm run dev -- -p 3001             |
| Prisma not found    | npm install && npx prisma generate |
| MariaDB not running | Start MySQL/MariaDB service        |

---

## 📊 Database Tables

| Table            | Fields                                          | Relations             |
| ---------------- | ----------------------------------------------- | --------------------- |
| **Patients**     | name, age, gender, contact, address, bloodGroup | → Appointments, Bills |
| **Doctors**      | name, specialization, contact, availability     | → Appointments        |
| **Appointments** | patientId, doctorId, date, time, status         | ← Patient, Doctor     |
| **Wards**        | name, totalBeds                                 | → Beds                |
| **Beds**         | wardId, bedNumber, status                       | ← Ward                |
| **Bills**        | patientId, amount, paymentStatus                | ← Patient             |

---

## 💾 Sample Data

- **5 Patients** - Indian names, various blood groups
- **5 Doctors** - Different specializations
- **5 Wards** - With varying bed counts
- **10 Beds** - Mix of available & occupied
- **5 Appointments** - Various statuses
- **5 Bills** - Different payment statuses

---

## 📱 Dashboard Stats

Shows real-time:

- Total patients count
- Total doctors count
- Today's appointments count
- Available beds count
- Quick action buttons

---

## 🎯 Navigation Menu

```
📊 Dashboard
👥 Patients
👨‍⚕️ Doctors
📅 Appointments
🏥 Wards & Beds
💳 Billing
```

---

## 📦 Tech Stack

| Component | Technology            |
| --------- | --------------------- |
| Frontend  | Next.js 16 + React 19 |
| Backend   | Node.js API Routes    |
| Database  | MariaDB               |
| ORM       | Prisma                |
| Styling   | Tailwind CSS          |
| Language  | TypeScript            |

---

## ✨ Features

✅ Patient Management (Add, View, Edit, Delete)  
✅ Doctor Management (Add, View)  
✅ Appointment Booking (Schedule, Status Update)  
✅ Ward & Bed Management (Add Wards, Manage Beds)  
✅ Billing System (Generate, Track Payments)  
✅ Admin Dashboard (KPIs)  
✅ Responsive UI  
✅ Error Handling  
✅ Type Safety

---

## 🔐 API Status Codes

```
200 - Success
201 - Created
400 - Bad Request
404 - Not Found
500 - Server Error
```

---

## 📈 Future Enhancements

- User authentication
- Role-based access
- Email notifications
- Advanced reporting
- Mobile app
- Real-time updates

---

## 📚 Documentation

- **README.md** - Overview
- **SETUP_GUIDE.md** - Installation
- **COMPLETE_SETUP_INSTRUCTIONS.md** - Detailed guide
- **HMS_SYSTEM_GUIDE.md** - Full reference
- **PROJECT_SUMMARY.md** - Implementation summary

---

## 🎉 Ready to Go!

```bash
node complete-setup.js && npm install && npm run dev
```

Visit: **http://localhost:3000**

---

**Last Updated**: 2024 | **Status**: ✅ Production Ready
