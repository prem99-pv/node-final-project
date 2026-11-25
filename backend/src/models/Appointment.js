import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. "500mg"
  frequency: { type: String, required: true }, // e.g. "1-0-1 (After Food)"
  duration: { type: String, required: true }, // e.g. "5 days"
  notes: { type: String, default: '' },
});

const prescriptionSchema = new mongoose.Schema({
  diagnosis: { type: String, default: '' },
  medicines: [medicineSchema],
  testsAdvised: [{ type: String }],
  notes: { type: String, default: '' },
  prescribedAt: { type: Date, default: Date.now },
});

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorProfile',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true, // Format: "HH:mm - HH:mm"
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    symptoms: {
      type: String,
      default: 'Routine Consultation',
    },
    fee: {
      type: Number,
      required: true,
      default: 50,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'paid',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    prescription: {
      type: prescriptionSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
