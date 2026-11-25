import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Stethoscope,
  Info,
} from 'lucide-react';

const BookingModal = ({ doctor, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow's date formatted as YYYY-MM-DD
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowStr());
  const [slotsData, setSlotsData] = useState({ slots: [], isDoctorWorking: true, message: '' });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch slots whenever doctor or date changes
  useEffect(() => {
    if (!doctor || !isOpen) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError('');
      setSelectedSlot('');
      try {
        const res = await API.get(`/doctors/${doctor._id}/slots?date=${selectedDate}`);
        setSlotsData(res.data);
      } catch (err) {
        console.error('Error fetching doctor slots:', err);
        setError('Failed to fetch available time slots. Please try another date.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [doctor, selectedDate, isOpen]);

  if (!isOpen || !doctor) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'patient') {
      setError('Only patient accounts can book appointments. Please switch to a patient account.');
      return;
    }

    if (!selectedSlot) {
      setError('Please choose an available time slot.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await API.post('/appointments', {
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        symptoms: symptoms || 'General medical consultation',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Booking failed. Slot may have been taken.');
    } finally {
      setSubmitting(false);
    }
  };

  const minDateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Book Consultation</h3>
              <p className="text-xs text-teal-100">{doctor.user?.name} • {doctor.specialization}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Consultation Fee & Location Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div>
              <span className="font-medium text-slate-500">OPD Room: </span>
              <span className="font-semibold text-slate-800">{doctor.roomNumber}</span>
            </div>
            <div className="flex items-center font-bold text-teal-700 text-sm">
              <span>Consultation Fee: ${doctor.consultationFee}</span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Appointment Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={minDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Slots Picker */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Time Slot
              </label>
              {slotsData.dayOfWeek && (
                <span className="text-[11px] font-medium text-teal-600">
                  {slotsData.dayOfWeek} Schedule
                </span>
              )}
            </div>

            {loadingSlots ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading doctor's open slots...</div>
            ) : !slotsData.isDoctorWorking ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{slotsData.message || 'Doctor is off duty on this day. Please pick another date.'}</span>
              </div>
            ) : slotsData.slots && slotsData.slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {slotsData.slots.map((slot) => {
                  const isSelected = selectedSlot === slot.timeSlot;
                  const isBooked = slot.isBooked;

                  return (
                    <button
                      key={slot.timeSlot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot.timeSlot)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center flex items-center justify-center space-x-1 ${
                        isBooked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50/50'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{slot.timeSlot}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">No available slots found for this date.</p>
            )}
          </div>

          {/* Reason / Symptoms */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Symptoms / Reason for Visit (Optional)
            </label>
            <textarea
              rows="2"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Mild headache, allergy flareup, routine cardiac checkup"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSlot || !slotsData.isDoctorWorking}
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center space-x-1.5"
            >
              {submitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Appointment (${doctor.consultationFee})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
