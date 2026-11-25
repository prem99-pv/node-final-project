import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String, required: true, default: '09:00' },
  endTime: { type: String, required: true, default: '17:00' },
  slotDurationMinutes: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
});

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, 'Qualifications are required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: 0,
    },
    roomNumber: {
      type: String,
      default: 'OPD-1',
    },
    bio: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    schedule: [availabilitySlotSchema],
  },
  { timestamps: true }
);

export default mongoose.model('DoctorProfile', doctorProfileSchema);
