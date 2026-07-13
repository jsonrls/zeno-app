"use client";

import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordValidation, getPasswordStrengthColor, getPasswordStrengthText } from '@/lib/passwordValidation';

interface PasswordValidationProps {
  validation: PasswordValidation;
  password: string;
  showStrength?: boolean;
}

export default function PasswordValidationComponent({ 
  validation, 
  password, 
  showStrength = true 
}: PasswordValidationProps) {
  if (!password) return null;

  const requirements = [
    { key: 'minLength', text: 'At least 8 characters', met: validation.requirements.minLength },
    { key: 'hasUppercase', text: 'One uppercase letter', met: validation.requirements.hasUppercase },
    { key: 'hasLowercase', text: 'One lowercase letter', met: validation.requirements.hasLowercase },
    { key: 'hasNumber', text: 'One number', met: validation.requirements.hasNumber },
    { key: 'hasSpecialChar', text: 'One special character', met: validation.requirements.hasSpecialChar },
  ];

  return (
    <div className="mt-2 space-y-3">
      {/* Password Strength Bar */}
      {showStrength && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-ink">Password Strength</span>
            <span className={`text-sm font-medium ${
              validation.strength === 'strong' ? 'text-green-700' :
              validation.strength === 'medium' ? 'text-amber-700' : 'text-red-700'
            }`}>
              {getPasswordStrengthText(validation.strength)}
            </span>
          </div>
          <div className="w-full bg-ink/10 h-1.5">
            <div
              className={`h-1.5 transition-all duration-300 ${getPasswordStrengthColor(validation.strength)}`}
              style={{ width: `${validation.score}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements List */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-ink">Password must contain:</p>
        <div className="grid grid-cols-1 gap-1">
          {requirements.map((req) => (
            <div
              key={req.key}
              className={`flex items-center font-mono text-xs transition-colors ${
                req.met ? 'text-green-700' : 'text-ink-soft'
              }`}
            >
              {req.met ? (
                <Check className="h-3 w-3 mr-2 text-green-600" />
              ) : (
                <X className="h-3 w-3 mr-2 text-ink-soft/50" />
              )}
              <span className={req.met ? 'line-through' : ''}>{req.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Status */}
      {validation.isValid && (
        <div className="flex items-center text-green-700 text-sm font-medium">
          <Check className="h-4 w-4 mr-2" />
          Password meets requirements
        </div>
      )}
    </div>
  );
}
