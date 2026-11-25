import React, { useState } from 'react';
import API from '../services/api';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  X,
  Stethoscope,
  Pill,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';

const PrescriptionModal = ({ appointment, isOpen, onClose, onPrescriptionAdded, isDoctorMode = false }) => {
  const existingRx = appointment?.prescription;

  // Form state for doctor writing a new prescription
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', notes: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !appointment) return null;

  const handleAddMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const handleRemoveMedicineRow = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError('Please provide a clinical diagnosis.');
      return;
    }

    const validMeds = medicines.filter((m) => m.name.trim() !== '');
    if (validMeds.length === 0) {
      setError('Please add at least one prescribed medicine.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await API.post(`/appointments/${appointment._id}/prescription`, {
        diagnosis,
        medicines: validMeds,
        notes,
      });

      if (onPrescriptionAdded) onPrescriptionAdded();
      onClose();
    } catch (err) {
      console.error('Failed to save prescription:', err);
      setError(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Topbar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                {isDoctorMode ? 'Write Clinical Prescription' : 'Medical Prescription Details'}
              </h3>
              <p className="text-[11px] text-slate-400">Appointment ID: #{appointment._id.slice(-6)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isDoctorMode && existingRx && (
              <button
                onClick={handlePrint}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center space-x-1"
                title="Print Prescription"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Clinic Official Header */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <span className="text-teal-600">Rx</span>
                  <span>MedCare Multi-Speciality Clinic</span>
                </h2>
                <p className="text-xs text-slate-500">450 Healthcare Blvd, Suite 100 • Tel: +1 (800) 456-7890</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-semibold text-slate-800">
                  Date:{' '}
                  {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p>Slot: {appointment.timeSlot}</p>
              </div>
            </div>

            {/* Doctor & Patient Brief Info */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                  Attending Doctor
                </p>
                <p className="font-bold text-slate-800 mt-0.5">{appointment.doctor?.user?.name || 'Doctor'}</p>
                <p className="text-slate-500">{appointment.doctor?.specialization}</p>
                <p className="text-[11px] text-slate-400">{appointment.doctor?.qualifications}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Patient Details</p>
                <p className="font-bold text-slate-800 mt-0.5">{appointment.patient?.name}</p>
                <p className="text-slate-500">
                  {appointment.patient?.gender || 'N/A'} • Blood: {appointment.patient?.bloodGroup || 'N/A'}
                </p>
                <p className="text-[11px] text-slate-400">Phone: {appointment.patient?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* VIEW MODE: If already prescribed */}
          {!isDoctorMode ? (
            existingRx ? (
              <div className="space-y-5">
                {/* Diagnosis */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Clinical Diagnosis
                  </h4>
                  <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl text-teal-900 font-semibold text-sm">
                    {existingRx.diagnosis}
                  </div>
                </div>

                {/* Medicines Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Prescribed Medicines
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Medicine Name</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {existingRx.medicines?.map((med, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-semibold text-slate-900">{med.name}</td>
                            <td className="p-2.5">{med.dosage}</td>
                            <td className="p-2.5 text-teal-700 font-medium">{med.frequency}</td>
                            <td className="p-2.5">{med.duration}</td>
                            <td className="p-2.5 text-slate-500">{med.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Advice Notes */}
                {existingRx.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Doctor's Advice & Directions
                    </h4>
                    <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {existingRx.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-sm font-medium">No prescription generated yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  The attending doctor will add your prescription after consultation.
                </p>
              </div>
            )
          ) : (
            /* DOCTOR WRITE MODE */
            <form onSubmit={handleSubmitPrescription} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Diagnosis input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Bronchitis, Contact Dermatitis"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
                />
              </div>

              {/* Dynamic Medicine Rows */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prescribed Medicines *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="flex items-center space-x-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medicines.map((med, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 sm:col-span-2 font-medium"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Dosage (500mg)"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Freq (1-0-1)"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        required
                      />
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          placeholder="Duration (5d)"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          required
                        />
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicineRow(index)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Advice / Dietary Restrictions / Follow-up Notes
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Drink plenty of fluids, avoid dairy for 3 days, review after 1 week if symptoms persist."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Finalize & Mark Consultation Completed'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
