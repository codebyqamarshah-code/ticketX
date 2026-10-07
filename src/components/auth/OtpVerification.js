'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OtpVerification({ email, onVerified, onCancel }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  
  const { verifyOtp, resendOtp } = useAuth();
  const inputsRef = useRef([]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // take last char if multiple
    setOtp(newOtp);

    // move next
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputsRef.current[focusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await verifyOtp(email, otpValue);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Email verified successfully!');
      setTimeout(() => onVerified(), 1000);
    } else {
      setErrorMsg(res.message || 'Invalid verification code');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setErrorMsg('');
    setLoading(true);
    const res = await resendOtp(email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('A new verification code has been sent.');
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg(res.message || 'Failed to resend code. Try again later.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[var(--fg)]">Verify your email</h2>
        <p className="text-[13px] text-[var(--fg-sec)]">
          We've sent a 6-digit verification code to:<br/>
          <strong className="text-[var(--fg)]">{email}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputsRef.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--brand)] transition-colors"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-3.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[var(--fg-sec)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <><RefreshCw size={16} className="animate-spin" /> Verifying...</>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>

      <div className="text-center text-xs">
        <p className="text-[var(--fg-sec)] mb-2">Didn't receive the code?</p>
        <button 
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className="font-bold text-[var(--brand)] hover:underline disabled:opacity-50 transition-all"
        >
          {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend Code'}
        </button>
      </div>

      <div className="text-center text-xs">
        <button onClick={onCancel} className="text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors">
          Change Email Address
        </button>
      </div>
    </div>
  );
}
