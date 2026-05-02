'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

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

  const handleChange = (key: string, value: string) => {
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

  const Input = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    isPassword,
    toggle,
  }: any) => (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-800 focus:border-red-900 rounded px-4 py-2 text-white outline-none"
      />
      {isPassword && (
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

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        placeholder="Full Name"
        value={form.name}
        onChange={(v: string) => handleChange('name', v)}
      />

      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(v: string) => handleChange('email', v)}
      />

      <Input
        type={show.password ? 'text' : 'password'}
        placeholder="Password"
        value={form.password}
        onChange={(v: string) => handleChange('password', v)}
        isPassword
        toggle={() => setShow((s) => ({ ...s, password: !s.password }))}
      />

      <Input
        type={show.confirm ? 'text' : 'password'}
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(v: string) => handleChange('confirmPassword', v)}
        isPassword
        toggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
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