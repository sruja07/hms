# Complete HMS Setup Instructions

## Step 1: Run Setup Script

Execute the setup script to create all directories and files:

```bash
node complete-setup.js
```

This will create:

- `prisma/schema.prisma`
- `prisma/seed.js`
- All necessary directories

## Step 2: Install Dependencies

```bash
npm install
```

Installs:

- Prisma Client
- Prisma CLI
- MySQL2
- Tailwind CSS (already configured)

## Step 3: Configure Database

Edit `.env.local`:

```
DATABASE_URL="mysql://root:YOURPASSWORD@localhost:3306/hms"
```

Replace `YOURPASSWORD` with your MariaDB password.

## Step 4: Initialize Database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## File Locations for API Routes

All files have already been created in `src/app/api/`:

```
src/app/api/
├── patients/
│   ├── route.ts         ✓ Created
│   └── [id]/route.ts    ✓ Created
├── doctors/
│   ├── route.ts         ✓ Created
│   └── [id]/route.ts    ✓ Created
├── appointments/
│   ├── route.ts         ✓ Created
│   └── [id]/route.ts    ✓ Created
├── wards/
│   ├── route.ts         ✓ Created
│   └── [id]/route.ts    ✓ Created
├── beds/
│   ├── route.ts         ✓ Created
│   └── [id]/route.ts    ✓ Created
└── bills/
    ├── route.ts         ✓ Created
    └── [id]/route.ts    ✓ Created
```

---

## Frontend Pages to Create (Optional - Examples Below)

### Example: Patients List Page

Create `src/app/patients/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      fetchPatients();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <a
          href="/patients/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Patient
        </a>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Age</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Blood Group</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="px-6 py-3">{patient.name}</td>
                  <td className="px-6 py-3">{patient.age}</td>
                  <td className="px-6 py-3">{patient.contact}</td>
                  <td className="px-6 py-3">{patient.bloodGroup}</td>
                  <td className="px-6 py-3">
                    <a
                      href={`/patients/${patient.id}`}
                      className="text-blue-600 mr-3 hover:underline"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

### Example: Add Patient Form

Create `src/app/patients/add/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    address: '',
    bloodGroup: 'O+',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Patient added successfully!');
        router.push('/patients');
      } else {
        alert('Failed to add patient');
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Patient</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## Available Features

✅ **Complete Backend API** - All 12 CRUD endpoints  
✅ **Database Schema** - 6 tables with relationships  
✅ **Sample Data** - Realistic Indian data (5 rows per table)  
✅ **Dashboard** - Real-time statistics  
✅ **Responsive UI** - Tailwind CSS styling  
✅ **Sidebar Navigation** - Easy module switching

---

## Database Statistics After Setup

| Table        | Records |
| ------------ | ------- |
| Patients     | 5       |
| Doctors      | 5       |
| Appointments | 5       |
| Wards        | 5       |
| Beds         | 10      |
| Bills        | 5       |

---

## API Testing with curl

### Get all patients

```bash
curl http://localhost:3000/api/patients
```

### Create new patient

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":30,"gender":"Male","contact":"9999999999","address":"New York","bloodGroup":"O+"}'
```

### Get patient by ID

```bash
curl http://localhost:3000/api/patients/1
```

### Update patient

```bash
curl -X PUT http://localhost:3000/api/patients/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

### Delete patient

```bash
curl -X DELETE http://localhost:3000/api/patients/1
```

---

## Environment Setup

Your `.env.local` should look like:

```
DATABASE_URL="mysql://root:password@localhost:3306/hms"
```

Replace:

- `root` - Your MySQL username
- `password` - Your MySQL password
- `localhost` - Your database host
- `3306` - Your MySQL port
- `hms` - Your database name

---

## Troubleshooting Commands

### Check if MariaDB is running

```bash
mysql -u root -p -h localhost
```

### View database

```bash
npx prisma studio
```

### Reset database

```bash
npx prisma db push --force-reset
npm run db:seed
```

### View logs

Check browser console (F12) and terminal for errors

---

## Next: Build More Pages

The system is now ready for additional pages:

1. **Doctors Management** - List, add doctors
2. **Appointments** - Book, view, update appointments
3. **Ward Management** - Manage wards and beds
4. **Billing** - Create and track bills
5. **Reports** - Advanced analytics

All API endpoints are ready and fully functional!
