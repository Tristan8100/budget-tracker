'use client';

import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type InputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  icon?: React.ReactNode;
};

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  isPassword,
  showPassword,
  setShowPassword,
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

      {isPassword && setShowPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

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

  const handleChange = (key: 'email' | 'password', value: string) => {
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

    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(v) => handleChange('email', v)}
            icon={<Mail size={16} />}
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={(v) => handleChange('password', v)}
            isPassword
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            icon={<LockKeyhole size={16} />}
          />

          <div className="flex justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Don&apos;t have an account?
            </Link>
          </div>

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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}