'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type InputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
  toggle?: () => void;
};

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  isPassword,
  toggle,
}: InputProps) => {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-800 focus:border-red-900 rounded px-4 py-2 text-white outline-none"
      />

      {isPassword && toggle && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-2 text-gray-500"
        >
          {type === 'password' ? <Eye /> : <EyeOff />}
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

  const handleChange = (key: keyof typeof form, value: string) => {
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
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) return setError(error.message);

    alert('Verification email sent!');
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        placeholder="Full Name"
        value={form.name}
        onChange={(v) => handleChange('name', v)}
      />

      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(v) => handleChange('email', v)}
      />

      <Input
        type={show.password ? 'text' : 'password'}
        placeholder="Password"
        value={form.password}
        onChange={(v) => handleChange('password', v)}
        isPassword
        toggle={() =>
          setShow((s) => ({ ...s, password: !s.password }))
        }
      />

      <Input
        type={show.confirm ? 'text' : 'password'}
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(v) => handleChange('confirmPassword', v)}
        isPassword
        toggle={() =>
          setShow((s) => ({ ...s, confirm: !s.confirm }))
        }
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-900 hover:bg-red-800 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}