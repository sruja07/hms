# HMS - Complete Setup & Implementation Guide

## Step-by-Step Installation

### Step 1: Setup Database URL

Edit `.env.local` in the project root:

```
DATABASE_URL="mysql://root:YOURPASSWORD@localhost:3306/hms"
```

### Step 2: Run Project Setup

```bash
node setup-project.js
```

This script will create:

- All necessary directories
- `prisma/schema.prisma` - Database schema
- `prisma/seed.js` - Seed script with sample data

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Push Schema to Database

```bash
npx prisma db push
```

Answer `yes` when prompted to create the database.

### Step 6: Seed the Database

```bash
npm run db:seed
```

This will populate:

- 5 Patients
- 5 Doctors
- 5 Wards with 10 Beds
- 5 Appointments
- 5 Bills

### Step 7: Start the Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Complete File Structure After Setup

```
hms/
├── .env.local                          # Database URL
├── package.json                        # Dependencies
├── setup-project.js                    # Setup script
├── prisma/
│   ├── schema.prisma                  # Database schema
│   └── seed.js                        # Seed script
├── src/
│   └── app/
│       ├── api/
│       │   ├── patients/
│       │   │   ├── route.ts           # GET/POST patients
│       │   │   └── [id]/route.ts      # GET/PUT/DELETE patient
│       │   ├── doctors/
│       │   │   ├── route.ts           # GET/POST doctors
│       │   │   └── [id]/route.ts      # GET/PUT doctor
│       │   ├── appointments/
│       │   │   ├── route.ts           # GET/POST appointments
│       │   │   └── [id]/route.ts      # GET/PUT appointment
│       │   ├── wards/
│       │   │   ├── route.ts           # GET/POST wards
│       │   │   └── [id]/route.ts      # GET/PUT ward
│       │   ├── beds/
│       │   │   ├── route.ts           # GET/POST beds
│       │   │   └── [id]/route.ts      # GET/PUT bed
│       │   └── bills/
│       │       ├── route.ts           # GET/POST bills
│       │       └── [id]/route.ts      # GET/PUT bill
│       ├── patients/                  # Patient pages (to be created)
│       ├── doctors/                   # Doctor pages (to be created)
│       ├── appointments/              # Appointment pages (to be created)
│       ├── wards/                     # Ward pages (to be created)
│       ├── billing/                   # Billing pages (to be created)
│       ├── layout.tsx                 # Main layout with sidebar
│       ├── page.tsx                   # Dashboard
│       └── globals.css                # Tailwind styles
```

## Database Tables Created

| Table        | Fields                                                                    |
| ------------ | ------------------------------------------------------------------------- |
| patients     | id, name, age, gender, contact, address, bloodGroup, createdAt, updatedAt |
| doctors      | id, name, specialization, contact, availability, createdAt, updatedAt     |
| appointments | id, patientId, doctorId, date, time, status, createdAt, updatedAt         |
| wards        | id, name, totalBeds, createdAt, updatedAt                                 |
| beds         | id, wardId, bedNumber, status, createdAt, updatedAt                       |
| bills        | id, patientId, amount, paymentStatus, createdAt, updatedAt                |

## Sample Data Seeded

### Patients

1. Rajesh Kumar - 45, Male, O+
2. Priya Sharma - 32, Female, A+
3. Amit Patel - 58, Male, B+
4. Neha Singh - 27, Female, AB+
5. Vikram Desai - 52, Male, O-

### Doctors

1. Dr. Anuj Mehta - Cardiology
2. Dr. Kavya Nair - Neurology
3. Dr. Suresh Kumar - Orthopedics
4. Dr. Arjun Verma - Pediatrics
5. Dr. Sneha Gupta - Dermatology

### Wards

1. General Ward - 10 beds
2. ICU - 5 beds
3. Pediatric Ward - 8 beds
4. Cardiac Ward - 6 beds
5. Orthopedic Ward - 7 beds

## Available API Endpoints

### Patients

```
GET    /api/patients              - List all patients
POST   /api/patients              - Create new patient
GET    /api/patients/[id]         - Get patient details
PUT    /api/patients/[id]         - Update patient
DELETE /api/patients/[id]         - Delete patient
```

### Doctors

```
GET    /api/doctors               - List all doctors
POST   /api/doctors               - Create new doctor
GET    /api/doctors/[id]          - Get doctor details
PUT    /api/doctors/[id]          - Update doctor
```

### Appointments

```
GET    /api/appointments          - List all appointments
POST   /api/appointments          - Create appointment
GET    /api/appointments/[id]     - Get appointment details
PUT    /api/appointments/[id]     - Update appointment status
```

### Wards

```
GET    /api/wards                 - List all wards
POST   /api/wards                 - Create new ward
GET    /api/wards/[id]            - Get ward details
PUT    /api/wards/[id]            - Update ward
```

### Beds

```
GET    /api/beds                  - List all beds
POST   /api/beds                  - Add bed to ward
GET    /api/beds/[id]             - Get bed details
PUT    /api/beds/[id]             - Update bed status
```

### Bills

```
GET    /api/bills                 - List all bills
POST   /api/bills                 - Create new bill
GET    /api/bills/[id]            - Get bill details
PUT    /api/bills/[id]            - Update bill payment status
```

## Dashboard Features

- **Patient Statistics**: Total patient count
- **Doctor Statistics**: Total doctor count
- **Today's Appointments**: Count of appointments for today
- **Bed Availability**: Number of available beds across all wards
- **Quick Actions**: Buttons to add patient, doctor, book appointment, add ward

## Navigation Sidebar

The application has a clean sidebar navigation with:

- 📊 Dashboard
- 👥 Patients
- 👨‍⚕️ Doctors
- 📅 Appointments
- 🏥 Wards & Beds
- 💳 Billing

## Next: Frontend Pages (To be completed)

The frontend pages for each module still need to be created:

### Patients Pages

- `/patients` - List patients with search & pagination
- `/patients/add` - Add new patient form
- `/patients/[id]` - Patient details & edit form

### Doctors Pages

- `/doctors` - List all doctors
- `/doctors/add` - Add new doctor form

### Appointments Pages

- `/appointments` - List appointments with filters
- `/appointments/book` - Book new appointment

### Wards Pages

- `/wards` - List wards and beds
- `/wards/add` - Add new ward
- Manage bed status

### Billing Pages

- `/billing` - List all bills
- `/billing/create` - Create new bill
- View bill details

## Troubleshooting

**Issue: Database connection failed**

- Verify MariaDB is running
- Check DATABASE_URL credentials
- Ensure database `hms` exists

**Issue: Prisma schema error**

- Run: `npx prisma generate` first
- Check for typos in .env.local
- Ensure MySQL user has CREATE permission

**Issue: Port 3000 already in use**

- Run: `npm run dev -- -p 3001`
- Or kill the process using port 3000

**Issue: Prisma Client not found**

- Run: `npm install @prisma/client prisma`
- Run: `npx prisma generate`

## Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start prod server
npm run lint                   # Run ESLint

# Database
npm run db:push               # Push schema changes
npm run db:seed               # Seed sample data
npx prisma studio            # Open Prisma Studio (visual DB editor)
npx prisma generate          # Generate Prisma Client
```

## Tech Stack Versions

- Next.js 16.2.6
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Prisma 5
- MySQL2 3
