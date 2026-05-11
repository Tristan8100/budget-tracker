'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type InputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
  toggle?: () => void;
  icon?: React.ReactNode;
};

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  isPassword,
  toggle,
  icon,
}: InputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      {isPassword && toggle && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {type === 'password' ? (
            <Eye size={18} />
          ) : (
            <EyeOff size={18} />
          )}
        </button>
      )}
    </div>
  );
};

export function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      return setError(error.message);
    }

    alert('Verification email sent!');
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter your details below to continue
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(v) => handleChange('name', v)}
            icon={<User size={16} />}
          />

          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(v) => handleChange('email', v)}
            icon={<Mail size={16} />}
          />

          <Input
            type={show.password ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={(v) => handleChange('password', v)}
            isPassword
            toggle={() =>
              setShow((s) => ({
                ...s,
                password: !s.password,
              }))
            }
            icon={<LockKeyhole size={16} />}
          />

          <Input
            type={show.confirm ? 'text' : 'password'}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(v) =>
              handleChange('confirmPassword', v)
            }
            isPassword
            toggle={() =>
              setShow((s) => ({
                ...s,
                confirm: !s.confirm,
              }))
            }
            icon={<LockKeyhole size={16} />}
          />

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}