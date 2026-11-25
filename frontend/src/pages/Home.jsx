import React, { useState, useEffect } from 'react';
import API from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Search,
  Star,
  Award,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  HeartPulse,
  Sparkles,
  Users,
} from 'lucide-react';

const specialties = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics'];

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoctorForBooking, setActiveDoctorForBooking] = useState(null);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const url =
        selectedSpecialty === 'All'
          ? '/doctors'
          : `/doctors?specialization=${encodeURIComponent(selectedSpecialty)}`;
      const res = await API.get(url);
      setDoctors(res.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.user?.name.toLowerCase().includes(query) ||
      doc.specialization.toLowerCase().includes(query) ||
      doc.qualifications.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Booking Success Toast */}
      {bookingSuccessAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center space-x-3 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Consultation Confirmed!</p>
            <p className="opacity-90">View appointment details in your Patient Dashboard.</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/70 via-transparent to-emerald-50/40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Premier Multi-Doctor Outpatient Healthcare Facility</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Compassionate Care by{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Leading Medical Specialists
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                Connect with experienced cardiologists, dermatologists, pediatricians, and surgeons under
                one roof. Instant slot booking with digital prescriptions and zero waiting queues.
              </p>

              {/* Quick Trust Metrics */}
              <div className="pt-4 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-100">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15+</p>
                  <p className="text-xs text-slate-500 font-medium">Specialist Doctors</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">4.9 ★</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Patient Rating</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Digital Health Records</p>
                </div>
              </div>
            </div>

            {/* Right Feature Card / Banner */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-2xl shadow-teal-700/20">
                <div className="space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <HeartPulse className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Same-Day OPD Visits</h3>
                      <p className="text-xs text-teal-100">Walk-in or pre-booked consultation</p>
                    </div>
                  </div>

                  <p className="text-xs text-teal-50 leading-relaxed">
                    Our clinic provides rapid-access consultations with dedicated laboratory testing and
                    in-house pharmacy dispatch for patient convenience.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2 text-xs text-teal-100">
                      <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>Verified Board-Certified Specialists Only</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-teal-100">
                      <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>Instant Digital Prescriptions & Pharmacy Notes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-teal-100">
                      <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>Transparent Consultation Fees (No Hidden Costs)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Doctor Discovery & Booking Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Attending Doctors
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Select your required specialty and book an instant time slot.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>

          {/* Specialty Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-400 hover:text-teal-700'
                }`}
              >
                {spec === 'All' ? 'All Specialties' : spec}
              </button>
            ))}
          </div>

          {/* Doctor Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-500 text-xs font-medium mt-3">Loading clinic doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No doctors found</h3>
              <p className="text-xs text-slate-400 mt-1">Try selecting another specialty or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-teal-300 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar & Specialization Tag */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-500/20">
                          {doc.user?.name ? doc.user.name.replace('Dr. ', '').charAt(0) : 'D'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {doc.user?.name}
                          </h3>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-100 mt-0.5">
                            {doc.specialization}
                          </span>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <div className="flex items-center space-x-1 px-2 py-1 bg-amber-50 rounded-lg border border-amber-200/60 text-amber-700 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating || 4.9}</span>
                      </div>
                    </div>

                    {/* Qualifications & OPD Room */}
                    <div className="pt-2 text-xs space-y-1.5 border-t border-slate-100 text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.qualifications}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Clinic {doc.roomNumber || 'Room 101'}</span>
                        <span className="text-slate-300">•</span>
                        <span>{doc.experienceYears} Years Exp.</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {doc.bio || 'Comprehensive clinical consultation and diagnostic assessment.'}
                    </p>
                  </div>

                  {/* Bottom Action: Fee & Book Button */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</p>
                      <p className="text-lg font-extrabold text-slate-900">${doc.consultationFee}</p>
                    </div>

                    <button
                      onClick={() => setActiveDoctorForBooking(doc)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {activeDoctorForBooking && (
        <BookingModal
          doctor={activeDoctorForBooking}
          isOpen={!!activeDoctorForBooking}
          onClose={() => setActiveDoctorForBooking(null)}
          onSuccess={() => {
            setBookingSuccessAlert(true);
            setTimeout(() => setBookingSuccessAlert(false), 5000);
          }}
        />
      )}
    </div>
  );
};

export default Home;
