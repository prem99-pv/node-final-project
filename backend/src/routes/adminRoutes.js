import express from 'express';
import {
  getAdminStats,
  createDoctor,
  updateDoctorByAdmin,
  deleteDoctorByAdmin,
  getAllPatients,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All routes here require Admin role

router.get('/stats', getAdminStats);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctorByAdmin);
router.delete('/doctors/:id', deleteDoctorByAdmin);
router.get('/patients', getAllPatients);

export default router;
