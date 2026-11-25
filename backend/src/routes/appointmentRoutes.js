import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  addPrescription,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All appointment routes require authentication

router.post('/', authorize('patient'), bookAppointment);
router.get('/my', getMyAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);
router.post('/:id/prescription', authorize('doctor'), addPrescription);
router.put('/:id/cancel', cancelAppointment);

export default router;
