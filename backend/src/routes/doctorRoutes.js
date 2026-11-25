import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailableSlots,
  updateMyProfile,
  updateMySchedule,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getDoctorAvailableSlots);

// Doctor-only private routes
router.put('/my-profile', protect, authorize('doctor'), updateMyProfile);
router.put('/my-schedule', protect, authorize('doctor'), updateMySchedule);

export default router;
