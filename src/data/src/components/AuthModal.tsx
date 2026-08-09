import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Mail,
  Lock,
  Phone,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  LogIn,
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { User, UserRole, ApartmentComplex } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  apartments: ApartmentComplex[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  apartments,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('customer');

  // Form Fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedApartmentId, setSelectedApartmentId] = useState(apartments[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser: User) => {
    onSuccess(demoUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please fill in email and password.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin Credentials Validation
    if (role === 'admin' || cleanEmail === 'naveedahmedm@gmail.com') {
      if (cleanEmail === 'naveedahmedm@gmail.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'u-admin',
          email: 'naveedahmedm@gmail.com',
          fullName: 'Naveed Ahmed (Operations Manager)',
          phone: '+91 98765 43210',
          role: 'admin',
        };
        onSuccess(adminUser);
        onClose();
        return;
      } else if (cleanEmail === 'naveedahmedm@gmail.com' && password !== 'admin123') {
        setErrorMsg('Invalid admin password. (Hint: use password admin123)');
        return;
      } else if (role === 'admin' && password !== 'admin123') {
        setErrorMsg('Invalid admin password. For admin access, use naveedahmedm@gmail.com / admin123');
        return;
      }
    }

    if (mode === 'signup' && (!fullName || !phone)) {
      setErrorMsg('Please fill in your full name and phone number.');
      return;
    }

    const matchedApt = apartments.find((a) => a.id === selectedApartmentId);

    const authenticatedUser: User = {
      id: `u-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName || cleanEmail.split('@')[0],
      phone: phone || '+91 98000 00000',
      role,
      apartmentId: selectedApartmentId,
      apartmentName: matchedApt?.name,
    };

    onSuccess(authenticatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide text-cyan-400">AquaDoor Portal</span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create AquaDoor Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access doorstep car detailing for Bangalore apartment complexes.
          </p>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-slate-950/90 p-4 border-b border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>1-Click Demo Logins</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(DEMO_USERS[0])}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left transition-all hover:border-cyan-500/50 group"
            >
              <span className="text-[10px] font-bold text-cyan-400 uppercase block">Customer Demo</span>
              <span className="text-xs font-semibold text-white block truncate">{DEMO_USERS[0].fullName}</span>
              <span className="text-[10px] text-slate-400 block truncate">Whitefield Zone</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(DEMO_USERS[1])}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all hover:border-amber-400 group"
            >
              <span className="text-[10px] font-bold text-amber-400 uppercase block">Admin / Ops Demo</span>
              <span className="text-xs font-semibold text-white block truncate">Operations Manager</span>
              <span className="text-[10px] text-slate-400 block truncate">Full Management</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Role Choice */}
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1.5">Account Role:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('customer');
                  setEmail('priya.sharma@example.in');
                  setPassword('customer123');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  role === 'customer'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-xs font-bold block">Sign In as Customer</span>
                  <span className="text-[10px] opacity-70 block">Priya Sharma (Demo)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setEmail('naveedahmedm@gmail.com');
                  setPassword('admin123');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-bold block">Sign In as Admin</span>
                  <span className="text-[10px] opacity-70 block">naveedahmedm@gmail.com</span>
                </div>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@example.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Phone Number (Bangalore)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="+91 98123 45678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && role === 'customer' && (
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Select Apartment Complex</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <select
                  value={selectedApartmentId}
                  onChange={(e) => setSelectedApartmentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {apartments.map((apt) => (
                    <option key={apt.id} value={apt.id} className="bg-slate-900">
                      {apt.name} ({apt.area})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'admin'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            <span>{mode === 'signin' ? `Sign In as ${role === 'admin' ? 'Admin' : 'Customer'}` : 'Complete Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
