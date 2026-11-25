import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// Helper to convert "HH:mm" to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper to convert minutes to "HH:mm"
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// @desc    Get all doctors with filtering and search
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, search, isAvailable } = req.query;
    const filter = {};

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    if (specialization && specialization !== 'All') {
      filter.specialization = { $regex: new RegExp(`^${specialization}$`, 'i') };
    }

    let doctors = await DoctorProfile.find(filter)
      .populate('user', 'name email phone avatar')
      .sort({ rating: -1, experienceYears: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      doctors = doctors.filter(
        (doc) =>
          doc.user?.name.match(searchRegex) ||
          doc.specialization.match(searchRegex) ||
          doc.qualifications.match(searchRegex)
      );
    }

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor profile
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id).populate(
      'user',
      'name email phone avatar gender'
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor available slots for a specific date
// @route   GET /api/doctors/:id/slots?date=YYYY-MM-DD
// @access  Public / Authenticated
export const getDoctorAvailableSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Please provide a date query parameter (YYYY-MM-DD)' });
    }

    const doctor = await DoctorProfile.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Determine day of the week
    const targetDate = new Date(date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[targetDate.getUTCDay()];

    // Find schedule for this day
    const daySchedule = doctor.schedule.find(
      (s) => s.dayOfWeek.toLowerCase() === dayName.toLowerCase() && s.isActive
    );

    if (!daySchedule) {
      return res.json({
        success: true,
        date,
        dayOfWeek: dayName,
        isDoctorWorking: false,
        message: `Doctor does not have scheduled hours on ${dayName}s`,
        slots: [],
      });
    }

    // Generate slots
    const startMins = timeToMinutes(daySchedule.startTime);
    const endMins = timeToMinutes(daySchedule.endTime);
    const duration = daySchedule.slotDurationMinutes || 30;

    const allSlots = [];
    for (let current = startMins; current + duration <= endMins; current += duration) {
      const slotStart = minutesToTime(current);
      const slotEnd = minutesToTime(current + duration);
      allSlots.push(`${slotStart} - ${slotEnd}`);
    }

    // Query booked appointments on this date for this doctor
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    }).select('timeSlot');

    const bookedSlotSet = new Set(bookedAppointments.map((app) => app.timeSlot));

    const computedSlots = allSlots.map((slot) => ({
      timeSlot: slot,
      isBooked: bookedSlotSet.has(slot),
    }));

    res.json({
      success: true,
      date,
      dayOfWeek: dayName,
      isDoctorWorking: true,
      totalSlots: computedSlots.length,
      availableCount: computedSlots.filter((s) => !s.isBooked).length,
      slots: computedSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current doctor's own profile
// @route   PUT /api/doctors/my-profile
// @access  Private (Doctor only)
export const updateMyProfile = async (req, res, next) => {
  try {
    let profile = await DoctorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { specialization, qualifications, experienceYears, consultationFee, roomNumber, bio, isAvailable } =
      req.body;

    if (specialization) profile.specialization = specialization;
    if (qualifications) profile.qualifications = qualifications;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;
    if (consultationFee !== undefined) profile.consultationFee = consultationFee;
    if (roomNumber) profile.roomNumber = roomNumber;
    if (bio !== undefined) profile.bio = bio;
    if (isAvailable !== undefined) profile.isAvailable = isAvailable;

    const updatedProfile = await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor's weekly availability schedule
// @route   PUT /api/doctors/my-schedule
// @access  Private (Doctor only)
export const updateMySchedule = async (req, res, next) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { schedule } = req.body;
    if (!Array.isArray(schedule)) {
      return res.status(400).json({ message: 'Schedule must be an array of day slots' });
    }

    profile.schedule = schedule;
    await profile.save();

    res.json({
      success: true,
      message: 'Working schedule updated successfully',
      schedule: profile.schedule,
    });
  } catch (error) {
    next(error);
  }
};
