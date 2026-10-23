import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Lock,
  Mail,
  Building,
  Award,
  Phone,
  X,
  CheckCircle,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

import { KENYAN_COUNTIES_SCHOOLS } from '../data/curriculumData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, user } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user.name || '');
  const [schoolName, setSchoolName] = useState(user.schoolName || '');
  const [tscNumber, setTscNumber] = useState(user.tscNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '0707423879');
  const [role, setRole] = useState<'TEACHER' | 'HOD' | 'DEPUTY_PRINCIPAL' | 'PRINCIPAL'>(
    user.role || 'TEACHER'
  );
  const [department, setDepartment] = useState(user.department || 'Science & Mathematics');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (mode === 'REGISTER' && !name) {
      setErrorMsg('Please enter your full official name.');
      return;
    }

    // Call loginUser which dynamically personalizes greetings to user's registered name and role
    loginUser(email, name, schoolName, tscNumber, role, department);
  };

  const roleTitles = {
    TEACHER: 'Subject / Classroom Teacher',
    HOD: 'Head of Department (HoD)',
    DEPUTY_PRINCIPAL: 'Deputy Principal (Academics)',
    PRINCIPAL: 'Senior Principal / Head Teacher',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 md:p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {mode === 'LOGIN' ? 'Official Portal Sign In' : 'Register Kenyan Educator Account'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">IMANI TEACHERS CENTER</p>
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Options for <strong>Teachers, HoDs, Deputy Principals, and Principals</strong> to sign-in and officially authorize curriculum documents.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition text-center ${
              mode === 'LOGIN'
                ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => {
              setMode('REGISTER');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition text-center ${
              mode === 'REGISTER'
                ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </div>
          )}

          {/* Role Selection Dropdown (Options for HoD, Deputy Principal, Principal to sign-in) */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
            <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Educator Designation / Role:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="TEACHER">Teacher / Subject Facilitator</option>
              <option value="HOD">Head of Department (HoD)</option>
              <option value="DEPUTY_PRINCIPAL">Deputy Principal (Academics)</option>
              <option value="PRINCIPAL">Principal / Senior Head Teacher</option>
            </select>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-300">
              Signing in as <strong className="underline">{roleTitles[role]}</strong> allows direct digital approvals on Schemes of Work and Lesson Plans.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. Daveogolla@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Full Name & School Fields (Editable in both modes so HoDs and Principals can customize) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Name (Used on Document Approvals & Cover Page):
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mwalimu Dave Ogolla"
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select or Type Your School Name:
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                list="school-suggestions"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Type or select your school (e.g. Alliance, Pangani...)"
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <datalist id="school-suggestions">
                {KENYAN_COUNTIES_SCHOOLS.map((sch) => (
                  <option key={sch} value={sch} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                TSC Number (Optional):
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={tscNumber}
                  onChange={(e) => setTscNumber(e.target.value)}
                  placeholder="Optional (e.g. TSC/123456)"
                  className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                M-Pesa Phone Number:
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0707423879"
                  className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {mode === 'LOGIN'
                ? `Sign In as ${roleTitles[role]}`
                : `Create Account as ${roleTitles[role]}`}
            </span>
          </button>

          <p className="text-[11px] text-center text-slate-500 pt-1">
            {mode === 'LOGIN' ? "Need a new account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                setErrorMsg('');
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              {mode === 'LOGIN' ? 'Register here' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
