import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Appointment from '../models/Appointment.js';

// @desc    Get clinic overview analytics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalDoctors = await DoctorProfile.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();

    // Today's appointments
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    const todayAppointmentsCount = await Appointment.countDocuments({
      appointmentDate: { $gte: startOfToday, $lte: endOfToday },
    });

    // Breakdown by status
    const statusCounts = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusMap = { confirmed: 0, completed: 0, cancelled: 0, pending: 0 };
    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    // Revenue calculation (from completed and confirmed appointments)
    const revenueResult = await Appointment.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$fee' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        todayAppointmentsCount,
        totalRevenue,
        statusBreakdown: statusMap,
      },
      recentAppointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new doctor account and profile
// @route   POST /api/admin/doctors
// @access  Private (Admin only)
export const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      specialization,
      qualifications,
      experienceYears,
      consultationFee,
      roomNumber,
      bio,
      schedule,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 1. Create User
    const user = await User.create({
      name,
      email,
      password: password || 'Doctor@1234',
      role: 'doctor',
      phone,
      gender,
    });

    // Default 5-day schedule if not provided
    const defaultSchedule = [
      { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isActive: true },
      { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isActive: true },
      { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isActive: true },
      { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isActive: true },
      { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isActive: true },
    ];

    // 2. Create Doctor Profile
    const profile = await DoctorProfile.create({
      user: user._id,
      specialization,
      qualifications,
      experienceYears: experienceYears || 3,
      consultationFee: consultationFee || 50,
      roomNumber: roomNumber || 'OPD-1',
      bio: bio || '',
      schedule: schedule && schedule.length > 0 ? schedule : defaultSchedule,
    });

    const populatedDoctor = await DoctorProfile.findById(profile._id).populate('user', '-password');

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update any doctor profile by admin
// @route   PUT /api/admin/doctors/:id
// @access  Private (Admin only)
export const updateDoctorByAdmin = async (req, res, next) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const {
      name,
      phone,
      specialization,
      qualifications,
      experienceYears,
      consultationFee,
      roomNumber,
      bio,
      isAvailable,
      schedule,
    } = req.body;

    if (name || phone) {
      const user = await User.findById(profile.user);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        await user.save();
      }
    }

    if (specialization) profile.specialization = specialization;
    if (qualifications) profile.qualifications = qualifications;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;
    if (consultationFee !== undefined) profile.consultationFee = consultationFee;
    if (roomNumber) profile.roomNumber = roomNumber;
    if (bio !== undefined) profile.bio = bio;
    if (isAvailable !== undefined) profile.isAvailable = isAvailable;
    if (schedule) profile.schedule = schedule;

    const updated = await profile.save();
    const populated = await DoctorProfile.findById(updated._id).populate('user', '-password');

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      doctor: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private (Admin only)
export const deleteDoctorByAdmin = async (req, res, next) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    await User.findByIdAndDelete(profile.user);
    await DoctorProfile.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Doctor removed from clinic database' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin only)
export const getAllPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, patients });
  } catch (error) {
    next(error);
  }
};
