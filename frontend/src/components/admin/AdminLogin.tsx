"use client";
import React, { useState } from 'react';
import { Lock, Sparkles, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi, setAuthToken, setStoredUser } from '../../lib/api';
import { AdminUser } from '../../types/artwork';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the studio password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login(password.trim());
      setAuthToken(res.token);
      setStoredUser(res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Incorrect password. Access denied.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#B79A5A]/30 p-8 sm:p-10 animate-fade-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#B79A5A] text-[#B79A5A] mb-4 shadow-xs">
            <Sparkles size={24} />
          </div>
          <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold block">
            Studio Admin Portal
          </span>
          <h1 className="text-2xl font-serif text-[#263248] font-bold mt-1">
            InderPushp
          </h1>
          <p className="text-xs font-sans text-[#4B5568] mt-1.5">
            Enter the studio password to manage collections & atelier
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2.5 shadow-xs">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password-Only Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
              Studio Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5568]/60"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-xl text-[#263248] placeholder:text-[#4B5568]/40 focus:outline-hidden focus:border-[#B79A5A] focus:ring-2 focus:ring-[#B79A5A]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5568]/60 hover:text-[#263248] transition-colors p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3 rounded-xl bg-[#263248] hover:bg-[#384055] text-white font-sans text-xs tracking-wider uppercase font-semibold transition-all shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Studio Dashboard</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#FAF7F0] pt-4">
          <a
            href="/"
            className="text-xs font-sans text-[#4B5568] hover:text-[#B79A5A] transition-colors"
          >
            ← Return to Public Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
