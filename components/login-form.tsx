'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    if (userError) return setError(userError.message);

    if (userData?.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (['user', 'band_member'].includes(userData?.role)) {
      router.push('/member/dashboard');
    } else {
      setError('Unknown user role');
    }
  };

  const Input = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    isPassword,
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
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-2 text-gray-500"
        >
          {type === 'password' ? <Eye /> : <EyeOff />}
        </button>
      )}
    </div>
  );

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(v: string) => handleChange('email', v)}
      />

      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={form.password}
        onChange={(v: string) => handleChange('password', v)}
        isPassword
      />

      <div className="text-right">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-gray-400 hover:text-red-900"
        >
          Forgot password?
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-900 hover:bg-red-800 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Entering...' : 'Enter'}
      </button>
    </form>
  );
}