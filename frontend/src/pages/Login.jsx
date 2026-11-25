import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, AlertCircle, ArrowRight, Sparkles, ShieldCheck, Stethoscope, User } from 'lucide-react';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      const loggedUser = await demoLogin(role);
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      setError('Demo login failed. Make sure server is running and seeded.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 text-center border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-500/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinic Portal Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your patient appointments, doctor schedule, or admin panel.
          </p>
        </div>

        {/* 1-Click Instant Demo Credentials */}
        <div className="px-8 pt-5 pb-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Test Logins (Evaluator Quick Access)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('patient')}
                className="py-1.5 px-2 bg-white hover:bg-teal-50 hover:text-teal-700 text-[11px] font-bold text-slate-700 border border-slate-200 rounded-xl transition-all shadow-xs flex flex-col items-center"
              >
                <User className="w-3.5 h-3.5 text-teal-600 mb-0.5" />
                <span>Patient</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('doctor')}
                className="py-1.5 px-2 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-[11px] font-bold text-slate-700 border border-slate-200 rounded-xl transition-all shadow-xs flex flex-col items-center"
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                <span>Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 bg-white hover:bg-purple-50 hover:text-purple-700 text-[11px] font-bold text-slate-700 border border-slate-200 rounded-xl transition-all shadow-xs flex flex-col items-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 mb-0.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@medcare.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
              Register as Patient
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
