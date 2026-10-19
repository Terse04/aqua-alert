import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataService } from '@/lib/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDemo = DataService.isDemoMode();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSupabaseConfigured() && supabase) {
        // Authenticate against live Supabase Auth
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (authError || !data.user) {
          throw new Error(authError?.message || 'Invalid administrator credentials.');
        }

        // Verify against admin_users table for authorized admin role
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (adminErr || !adminRecord) {
          await supabase.auth.signOut();
          throw new Error('Access denied: Your account lacks verified administrator privileges.');
        }

        DataService.setAdminSession({
          email: data.user.email || email,
          role: adminRecord.role || 'administrator',
        });
      } else {
        // Demo Mode Authentication
        if (
          email.trim().toLowerCase() === 'admin@aquaalert.org' &&
          password.trim() === 'AquaAdmin#2024'
        ) {
          DataService.setAdminSession({
            email: 'admin@aquaalert.org',
            role: 'CEP Lead Administrator',
          });
        } else {
          throw new Error(
            'Invalid credentials in demo mode. Use admin@aquaalert.org / AquaAdmin#2024 or click "Fill Demo Credentials" below.'
          );
        }
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@aquaalert.org');
    setPassword('AquaAdmin#2024');
    setError(null);
  };

  return (
    <div className="py-12 sm:py-20 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-8 sm:p-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F8F7] text-[#087EBC] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
            Administrator Sign In
          </h1>
          <p className="text-xs text-gray-500">
            Protected management portal for authorized CEP coordinators and field team leads.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aquaalert.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pwd" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/15 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Authorization...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper Button */}
        {isDemo && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-xl border border-sky-200 bg-sky-50 text-xs font-semibold text-[#087EBC] hover:bg-sky-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#087EBC]" />
              <span>Autofill Demo Admin Credentials</span>
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              Demo credentials: <code className="text-gray-600 font-mono">admin@aquaalert.org</code> / <code className="text-gray-600 font-mono">AquaAdmin#2024</code>
            </p>
          </div>
        )}

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <span>
            Public registration is intentionally disabled. Administrator roles are granted via database allowlist to prevent unauthorized privilege escalation.
          </span>
        </div>
      </div>
    </div>
  );
};
