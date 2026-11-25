import React from 'react';
import { Activity, Phone, Clock, MapPin, Mail, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Clinic Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MedCare Clinic</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leading multi-doctor outpatient healthcare facility dedicated to comprehensive medical,
              dermatological, cardiac, and pediatric care under one roof.
            </p>
            <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency 24/7 Helpline: 911 / 112</span>
            </div>
          </div>

          {/* Clinical Departments */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Specialized OPD
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-teal-400 transition-colors">Cardiology & Vascular</li>
              <li className="hover:text-teal-400 transition-colors">Clinical & Cosmetic Dermatology</li>
              <li className="hover:text-teal-400 transition-colors">Pediatrics & Neonatology</li>
              <li className="hover:text-teal-400 transition-colors">Orthopedics & Joint Clinic</li>
              <li className="hover:text-teal-400 transition-colors">General Medicine & Diagnostics</li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Clinic Working Hours
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Monday – Friday</p>
                  <p className="text-xs">08:00 AM – 08:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">Saturday</p>
                  <p className="text-xs">09:00 AM – 04:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-400 font-medium">Sunday</p>
                  <p className="text-xs">Emergency Care Only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>450 Healthcare Boulevard, Suite 100</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (800) 456-7890</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>reception@medcare-clinic.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MedCare Multi-Speciality Clinic. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Rights</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Consultation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
