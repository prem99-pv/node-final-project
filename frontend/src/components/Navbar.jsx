import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Calendar,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Stethoscope,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    setDemoMenuOpen(false);
    if (role === 'admin') navigate('/admin');
    else if (role === 'doctor') navigate('/doctor');
    else navigate('/patient');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'doctor') return '/doctor';
    return '/patient';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Clinic Branding */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                MedCare
              </span>
              <span className="block text-[10px] font-semibold text-teal-600 uppercase tracking-widest -mt-1">
                Multi-Doctor Clinic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Doctors & Specialties
            </Link>

            {user && (
              <Link
                to={getDashboardLink()}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(getDashboardLink())
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {user.role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                ) : user.role === 'doctor' ? (
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Calendar className="w-4 h-4 text-teal-600" />
                )}
                <span>
                  {user.role === 'admin'
                    ? 'Admin Portal'
                    : user.role === 'doctor'
                    ? 'Doctor Dashboard'
                    : 'My Appointments'}
                </span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                title="Switch demo roles instantly"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Switcher</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Instant Demo Login
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('patient')}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <span>Patient (Alex)</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('doctor')}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Doctor (Dr. Sarah)</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Admin (Manager)</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 text-left hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-teal-600 font-medium capitalize">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Doctors & Specialties
          </Link>
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-teal-700 bg-teal-50"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Sign Out ({user.name})
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2 border border-slate-300 rounded-xl text-slate-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2 bg-teal-600 text-white rounded-xl font-medium shadow"
              >
                Register / Book
              </Link>
            </div>
          )}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 mb-2">Instant Demo Switches:</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleDemoSwitch('patient');
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md font-medium"
              >
                Patient
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('doctor');
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium"
              >
                Doctor
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
