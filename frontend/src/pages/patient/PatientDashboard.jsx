import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import PrescriptionModal from '../../components/PrescriptionModal';
import {
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Activity,
  HeartPulse,
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming or past

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments/my');
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await API.put(`/appointments/${id}/cancel`, { reason: 'Cancelled by patient' });
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );
  const displayedAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const totalPrescriptions = appointments.filter((a) => a.prescription && a.prescription.diagnosis).length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-500/20">
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Blood Group: <span className="font-semibold text-slate-700">{user?.bloodGroup || 'O+'}</span> •
                Email: <span className="font-semibold text-slate-700">{user?.email}</span>
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Visits</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{upcomingAppointments.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Past Consultations</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                {appointments.filter((a) => a.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Digital Prescriptions</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalPrescriptions}</p>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Section Tabs */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Upcoming Visits ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'past'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Past History ({pastAppointments.length})
              </button>
            </div>
          </div>

          {/* List or Table */}
          <div className="p-6">
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">Loading your appointments...</div>
            ) : displayedAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <HeartPulse className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-700">
                  {activeTab === 'upcoming'
                    ? 'No upcoming appointments scheduled'
                    : 'No past consultations found'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Book a consultation anytime with our clinic doctors.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedAppointments.map((app) => {
                  const doctorName = app.doctor?.user?.name || 'Dr. Specialist';
                  const spec = app.doctor?.specialization || 'General';
                  const room = app.doctor?.roomNumber || 'Room 101';
                  const dateStr = new Date(app.appointmentDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={app._id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-teal-300 bg-white transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Top: Status & Date */}
                        <div className="flex items-center justify-between">
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
                          <span className="text-xs font-semibold text-slate-500">{dateStr}</span>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0">
                            {doctorName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{doctorName}</h4>
                            <p className="text-xs text-teal-600 font-medium">{spec}</p>
                            <p className="text-[11px] text-slate-400">Clinic {room}</p>
                          </div>
                        </div>

                        {/* Time Slot & Symptoms */}
                        <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
                          <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            <span>Slot: {app.timeSlot}</span>
                          </div>
                          <p className="text-slate-500 line-clamp-1">
                            <span className="font-medium text-slate-700">Reason:</span> {app.symptoms}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        {app.prescription?.diagnosis ? (
                          <button
                            onClick={() => setSelectedAppointmentForRx(app)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center space-x-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Rx Prescription</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Prescription pending</span>
                        )}

                        {app.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelAppointment(app._id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                          >
                            Cancel Visit
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

      {/* Prescription Viewer Modal */}
      {selectedAppointmentForRx && (
        <PrescriptionModal
          appointment={selectedAppointmentForRx}
          isOpen={!!selectedAppointmentForRx}
          onClose={() => setSelectedAppointmentForRx(null)}
          isDoctorMode={false}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
