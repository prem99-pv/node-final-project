import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'Doctor, date, and time slot are required' });
    }

    const doctor = await DoctorProfile.findById(doctorId).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Selected doctor not found' });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({ message: 'Doctor is currently not accepting appointments' });
    }

    // Check for double booking
    const bookingDate = new Date(appointmentDate);
    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingBooking = await Appointment.findOne({
      doctor: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'This time slot has already been booked. Please choose another slot.',
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      appointmentDate: bookingDate,
      timeSlot,
      symptoms: symptoms || 'General Consultation',
      fee: doctor.consultationFee,
      status: 'confirmed',
      paymentStatus: 'paid', // Simulated instant checkout
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user appointments (Patient or Doctor perspective)
// @route   GET /api/appointments/my
// @access  Private
export const getMyAppointments = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
      if (!doctorProfile) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      filter.doctor = doctorProfile._id;
    } else if (req.user.role === 'admin') {
      // Admin can query all or pass query params
      if (req.query.status) filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone gender bloodGroup dob')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      })
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone gender dob bloodGroup')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' },
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Access control: Only participant or admin
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
    const isDoctor = doctorProfile && appointment.doctor._id.toString() === doctorProfile._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to view this appointment' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor or Admin)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (['confirmed', 'completed', 'cancelled'].includes(status)) {
      appointment.status = status;
    }

    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
    }

    const updated = await appointment.save();

    res.json({
      success: true,
      message: `Appointment marked as ${status}`,
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add prescription to appointment
// @route   POST /api/appointments/:id/prescription
// @access  Private (Doctor only)
export const addPrescription = async (req, res, next) => {
  try {
    const { diagnosis, medicines, testsAdvised, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
    if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ message: 'Only the attending doctor can add a prescription' });
    }

    appointment.prescription = {
      diagnosis,
      medicines: medicines || [],
      testsAdvised: testsAdvised || [],
      notes: notes || '',
      prescribedAt: new Date(),
    };
    appointment.status = 'completed';

    const saved = await appointment.save();

    res.json({
      success: true,
      message: 'Prescription added and consultation marked completed',
      appointment: saved,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient, Doctor, or Admin)
export const cancelAppointment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Completed appointments cannot be cancelled' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'Cancelled by user';

    const updated = await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};
