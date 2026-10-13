'use client';

import React, { useRef, useEffect } from 'react';

export default function OtpInput({ value = '', onChange, length = 6, autoFocus = true, disabled = false }) {
  const inputRefs = useRef([]);

  // Split value into array of length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, ''); // Digits only
    if (!val) {
      // Clear this digit
      const nextDigits = [...digits];
      nextDigits[index] = '';
      onChange(nextDigits.join(''));
      return;
    }

    // Single digit input
    const char = val.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = char;
    const combined = nextDigits.join('');
    onChange(combined);

    // Auto-advance to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current is empty, go back and clear previous
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        onChange(nextDigits.join(''));
        inputRefs.current[index - 1]?.focus();
        e.preventDefault();
      } else if (digits[index]) {
        // Clear current
        const nextDigits = [...digits];
        nextDigits[index] = '';
        onChange(nextDigits.join(''));
        e.preventDefault();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 py-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = !!digits[index];
        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[index]}
            disabled={disabled}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-11 h-14 sm:w-12 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all duration-200 focus:outline-none focus:scale-105 ${
              isFilled
                ? 'border-rose-500/80 bg-rose-500/5 text-[var(--fg)] shadow-sm shadow-rose-500/10'
                : 'border-[var(--border)] bg-[var(--bg-sec)] text-[var(--fg)] focus:border-rose-600 focus:ring-2 focus:ring-rose-600/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        );
      })}
    </div>
  );
}
