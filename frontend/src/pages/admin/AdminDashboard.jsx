import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  ShieldCheck,
  Users,
  Calendar,
  DollarSign,
  UserPlus,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  X,
  Activity,
  UserCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, doctors, appointments, patients
  const [loading, setLoading] = useState(true);

  // New Doctor Modal State
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: 'Doctor@1234',
    phone: '',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD',
    experienceYears: 5,
    consultationFee: 75,
    roomNumber: 'Suite 101',
    bio: '',
  });
  const [savingDoctor, setSavingDoctor] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/doctors'),
        API.get('/admin/patients'),
        API.get('/appointments/my'),
      ]);
      setStats(statsRes.data.stats);
      setDoctors(doctorsRes.data.doctors || []);
      setPatients(patientsRes.data.patients || []);
      setAppointments(appointmentsRes.data.appointments || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctorSubmit = async (e) => {
    e.preventDefault();
    setSavingDoctor(true);
    try {
      await API.post('/admin/doctors', doctorForm);
      setIsAddDoctorOpen(false);
      setDoctorForm({
        name: '',
        email: '',
        password: 'Doctor@1234',
        phone: '',
        specialization: 'Cardiology',
        qualifications: 'MBBS, MD',
        experienceYears: 5,
        consultationFee: 75,
        roomNumber: 'Suite 101',
        bio: '',
      });
      loadAllAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create doctor');
    } finally {
      setSavingDoctor(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the clinic?')) return;
    try {
      await API.delete(`/admin/doctors/${doctorId}`);
      loadAllAdminData();
    } catch (error) {
      alert('Failed to delete doctor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinic Administration</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized management for medical practitioners, appointments, and hospital operations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddDoctorOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Doctor</span>
          </button>
        </div>

        {/* Global Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinic Revenue</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">${stats?.totalRevenue || 0}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Doctors</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{doctors.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{patients.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Bookings</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{appointments.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Overview & Recent' },
            { id: 'doctors', label: `Manage Doctors (${doctors.length})` },
            { id: 'appointments', label: `All Appointments (${appointments.length})` },
            { id: 'patients', label: `Patients List (${patients.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Status Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Appointment Status Distribution</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-center">
                  <p className="text-xs font-bold text-teal-600 uppercase">Confirmed</p>
                  <p className="text-xl font-black text-teal-900 mt-1">
                    {stats?.statusBreakdown?.confirmed || 0}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <p className="text-xs font-bold text-emerald-600 uppercase">Completed</p>
                  <p className="text-xl font-black text-emerald-900 mt-1">
                    {stats?.statusBreakdown?.completed || 0}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                  <p className="text-xs font-bold text-rose-600 uppercase">Cancelled</p>
                  <p className="text-xl font-black text-rose-900 mt-1">
                    {stats?.statusBreakdown?.cancelled || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Latest Clinic Appointments</h3>
              <div className="space-y-3">
                {appointments.slice(0, 4).map((app) => (
                  <div
                    key={app._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{app.patient?.name}</p>
                      <p className="text-slate-500">
                        Dr. {app.doctor?.user?.name} • {app.timeSlot}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Specialty</th>
                    <th className="p-3">Qualifications</th>
                    <th className="p-3">Room</th>
                    <th className="p-3">Fee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {doctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{doc.user?.name}</td>
                      <td className="p-3 font-semibold text-teal-700">{doc.specialization}</td>
                      <td className="p-3 text-slate-500">{doc.qualifications}</td>
                      <td className="p-3 font-medium">{doc.roomNumber}</td>
                      <td className="p-3 font-bold">${doc.consultationFee}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            doc.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {doc.isAvailable ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteDoctor(doc._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ALL APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Attending Doctor</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Fee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{app.patient?.name}</td>
                      <td className="p-3 font-medium text-slate-800">{app.doctor?.user?.name}</td>
                      <td className="p-3">
                        {new Date(app.appointmentDate).toLocaleDateString()} • {app.timeSlot}
                      </td>
                      <td className="p-3 font-bold">${app.fee}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : app.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 max-w-xs truncate">{app.symptoms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PATIENTS */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Gender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3 text-slate-500">{p.email}</td>
                      <td className="p-3 font-medium">{p.phone || '-'}</td>
                      <td className="p-3 font-bold text-rose-600">{p.bloodGroup || 'O+'}</td>
                      <td className="p-3 capitalize">{p.gender || 'Other'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Onboard Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-purple-700 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-sm">Onboard New Doctor</h3>
              </div>
              <button
                onClick={() => setIsAddDoctorOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctorSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    placeholder="Dr. Robert Green"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    placeholder="doctor@medcare.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Specialization
                  </label>
                  <select
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorForm.qualifications}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                    placeholder="MBBS, MD"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Fee ($)</label>
                  <input
                    type="number"
                    required
                    value={doctorForm.consultationFee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Room</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.roomNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    required
                    value={doctorForm.experienceYears}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Bio / Focus</label>
                <textarea
                  rows="2"
                  value={doctorForm.bio}
                  onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                  placeholder="Specialist credentials and clinical interests..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDoctor}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20"
                >
                  {savingDoctor ? 'Creating...' : 'Onboard Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
