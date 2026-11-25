import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Appointment from '../models/Appointment.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_db';

const defaultSchedule = [
  { dayOfWeek: 'Monday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30, isActive: true },
  { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30, isActive: true },
  { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30, isActive: true },
  { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30, isActive: true },
  { dayOfWeek: 'Friday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30, isActive: true },
  { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30, isActive: true },
];

const seedData = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing clinic collections
    await User.deleteMany({});
    await DoctorProfile.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Clinic Administrator',
      email: 'admin@medcare.com',
      password: 'Admin@1234',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      gender: 'other',
    });
    console.log(`Created Admin: ${admin.email}`);

    // 2. Create Doctors
    const doctorsData = [
      {
        user: {
          name: 'Dr. Sarah Jenkins',
          email: 'dr.sarah@medcare.com',
          password: 'Doctor@1234',
          role: 'doctor',
          phone: '+1 (555) 123-4567',
          gender: 'female',
        },
        profile: {
          specialization: 'Cardiology',
          qualifications: 'MBBS, MD (Cardiology), FACC',
          experienceYears: 12,
          consultationFee: 80,
          roomNumber: 'Suite 101',
          rating: 4.9,
          reviewsCount: 88,
          bio: 'Specialist in non-invasive cardiology, preventive heart healthcare, echocardiography, and vascular disease management.',
          schedule: defaultSchedule,
        },
      },
      {
        user: {
          name: 'Dr. Marcus Vance',
          email: 'dr.marcus@medcare.com',
          password: 'Doctor@1234',
          role: 'doctor',
          phone: '+1 (555) 234-5678',
          gender: 'male',
        },
        profile: {
          specialization: 'Dermatology',
          qualifications: 'MBBS, MD (Dermatology), Board Certified',
          experienceYears: 9,
          consultationFee: 65,
          roomNumber: 'Suite 104',
          rating: 4.8,
          reviewsCount: 74,
          bio: 'Expert in clinical dermatology, acne treatments, allergic skin conditions, and clinical skincare procedures.',
          schedule: defaultSchedule,
        },
      },
      {
        user: {
          name: 'Dr. Emily Chen',
          email: 'dr.emily@medcare.com',
          password: 'Doctor@1234',
          role: 'doctor',
          phone: '+1 (555) 345-6789',
          gender: 'female',
        },
        profile: {
          specialization: 'Pediatrics',
          qualifications: 'MBBS, DCH, MRCPCH',
          experienceYears: 10,
          consultationFee: 60,
          roomNumber: 'Suite 202',
          rating: 4.95,
          reviewsCount: 112,
          bio: 'Compassionate care for infants, children, and adolescents. Special interest in childhood asthma and growth monitoring.',
          schedule: defaultSchedule,
        },
      },
      {
        user: {
          name: 'Dr. James Wilson',
          email: 'dr.james@medcare.com',
          password: 'Doctor@1234',
          role: 'doctor',
          phone: '+1 (555) 456-7890',
          gender: 'male',
        },
        profile: {
          specialization: 'Orthopedics',
          qualifications: 'MBBS, MS (Orthopedics), Joint Fellow',
          experienceYears: 15,
          consultationFee: 90,
          roomNumber: 'Suite 205',
          rating: 4.85,
          reviewsCount: 96,
          bio: 'Dedicated to joint preservation, sports injury rehabilitation, arthritis treatments, and spinal assessment.',
          schedule: defaultSchedule,
        },
      },
    ];

    const createdDoctorProfiles = [];
    for (const d of doctorsData) {
      const u = await User.create(d.user);
      const dp = await DoctorProfile.create({ ...d.profile, user: u._id });
      createdDoctorProfiles.push(dp);
      console.log(`Created Doctor: ${u.name} (${d.profile.specialization})`);
    }

    // 3. Create Patients
    const patient1 = await User.create({
      name: 'Alex Johnson',
      email: 'patient@medcare.com',
      password: 'Patient@1234',
      role: 'patient',
      phone: '+1 (555) 888-9999',
      gender: 'male',
      bloodGroup: 'O+',
      dob: new Date('1992-05-14'),
      address: '742 Evergreen Terrace, Springfield',
    });

    const patient2 = await User.create({
      name: 'Maria Garcia',
      email: 'maria@medcare.com',
      password: 'Patient@1234',
      role: 'patient',
      phone: '+1 (555) 777-6666',
      gender: 'female',
      bloodGroup: 'A+',
      dob: new Date('1988-11-20'),
      address: '104 Lincoln Ave, Metropolis',
    });
    console.log(`Created Patients: ${patient1.name}, ${patient2.name}`);

    // 4. Create Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);

    // Upcoming appointment for Alex with Dr. Sarah
    await Appointment.create({
      patient: patient1._id,
      doctor: createdDoctorProfiles[0]._id,
      appointmentDate: tomorrow,
      timeSlot: '10:00 - 10:30',
      symptoms: 'Occasional chest tightness and palpitations during morning jog',
      fee: createdDoctorProfiles[0].consultationFee,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    // Completed past appointment for Alex with Dr. Marcus (with prescription!)
    await Appointment.create({
      patient: patient1._id,
      doctor: createdDoctorProfiles[1]._id,
      appointmentDate: pastDate,
      timeSlot: '11:00 - 11:30',
      symptoms: 'Persistent dry rash on inner forearm',
      fee: createdDoctorProfiles[1].consultationFee,
      status: 'completed',
      paymentStatus: 'paid',
      prescription: {
        diagnosis: 'Mild Contact Dermatitis / Xerosis',
        medicines: [
          {
            name: 'Hydrocortisone Cream 1%',
            dosage: 'Thin layer',
            frequency: 'Twice daily',
            duration: '7 days',
            notes: 'Apply after gentle cleansing',
          },
          {
            name: 'Cetirizine 10mg',
            dosage: '1 Tablet',
            frequency: '0-0-1 (Night only)',
            duration: '5 days',
            notes: 'Take before sleep if itching persists',
          },
        ],
        testsAdvised: ['Patch allergy test (optional if no relief in 10 days)'],
        notes: 'Avoid harsh scented soaps. Keep skin hydrated with ceramide moisturizer.',
        prescribedAt: pastDate,
      },
    });

    // Upcoming appointment for Maria with Dr. Emily
    await Appointment.create({
      patient: patient2._id,
      doctor: createdDoctorProfiles[2]._id,
      appointmentDate: tomorrow,
      timeSlot: '14:00 - 14:30',
      symptoms: 'Child seasonal cough and mild fever checkup',
      fee: createdDoctorProfiles[2].consultationFee,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    console.log('Sample appointments created successfully!');
    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
