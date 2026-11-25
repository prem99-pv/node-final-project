import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PrescriptionModal from '../../components/PrescriptionModal';
import {
  Stethoscope,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle,
  FilePlus,
  DollarSign,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [appRes, meRes] = await Promise.all([
        API.get('/appointments/my'),
        API.get('/auth/me'),
      ]);
      setAppointments(appRes.data.appointments || []);
      setDoctorProfile(meRes.data.doctorProfile);
    } catch (error) {
      console.error('Error loading doctor dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!doctorProfile) return;
    try {
      const res = await API.put('/doctors/my-profile', {
        isAvailable: !doctorProfile.isAvailable,
      });
      setDoctorProfile(res.data.doctor);
    } catch (error) {
      alert('Failed to update availability status');
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      loadDoctorData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  // Metrics
  const totalAppointments = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'confirmed').length;
  const totalEarnings = completedCount * (doctorProfile?.consultationFee || 0);

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Doctor Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-500/20">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {doctorProfile?.specialization || 'Attending Doctor'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Room: <span className="font-semibold text-slate-700">{doctorProfile?.roomNumber}</span> •
                Fee:{' '}
                <span className="font-semibold text-slate-700">${doctorProfile?.consultationFee}/visit</span> •
                Experience: <span className="font-semibold text-slate-700">{doctorProfile?.experienceYears} yrs</span>
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Accepting Bookings:</span>
            <button
              onClick={handleToggleAvailability}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                doctorProfile?.isAvailable
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-300 text-slate-600'
              }`}
            >
              {doctorProfile?.isAvailable ? (
                <>
                  <ToggleRight className="w-4 h-4" />
                  <span>On Duty</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  <span>On Leave</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Doctor Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalAppointments}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue Pending</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consulted</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{completedCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">${totalEarnings}</p>
            </div>
          </div>
        </div>

        {/* Patient Appointment Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Patient Consultation Queue
            </h3>
            <div className="flex space-x-2">
              {['all', 'confirmed', 'completed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    statusFilter === tab
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="p-6">
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">Loading patient schedule...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-700">No appointments matching this filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((app) => {
                  const patient = app.patient || {};
                  const dateStr = new Date(app.appointmentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={app._id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Patient info & symptoms */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              app.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : app.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-teal-50 text-teal-700 border border-teal-200'
                            }`}
                          >
                            {app.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {dateStr} • Slot: {app.timeSlot}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{patient.name}</h4>
                          <p className="text-xs text-slate-500">
                            Gender: {patient.gender || 'N/A'} • Blood: {patient.bloodGroup || 'N/A'} •
                            Phone: {patient.phone || 'N/A'} • Email: {patient.email}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700">
                          <span className="font-bold text-slate-800">Reported Symptoms: </span>
                          <span>{app.symptoms || 'General Checkup'}</span>
                        </div>
                      </div>

                      {/* Doctor Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0">
                        {app.status === 'confirmed' && (
                          <button
                            onClick={() => setSelectedAppointmentForRx(app)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center space-x-1.5"
                          >
                            <FilePlus className="w-4 h-4" />
                            <span>Prescribe & Complete</span>
                          </button>
                        )}

                        {app.prescription?.diagnosis && (
                          <button
                            onClick={() => setSelectedAppointmentForRx(app)}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200"
                          >
                            View Prescription
                          </button>
                        )}

                        {app.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Form / Viewer Modal */}
      {selectedAppointmentForRx && (
        <PrescriptionModal
          appointment={selectedAppointmentForRx}
          isOpen={!!selectedAppointmentForRx}
          onClose={() => setSelectedAppointmentForRx(null)}
          onPrescriptionAdded={() => loadDoctorData()}
          isDoctorMode={selectedAppointmentForRx.status === 'confirmed'}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
