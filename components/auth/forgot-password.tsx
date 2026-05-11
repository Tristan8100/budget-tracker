'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const supabase = createClient();

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
      },
    },
  };

  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-muted">
            <CheckCircle className="h-7 w-7 text-foreground" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            Check your email
          </h2>

          <p className="text-sm text-muted-foreground">
            We sent a password reset link to{' '}
            <span className="font-medium text-foreground">
              {email}
            </span>
            .
          </p>

          <p className="text-xs text-muted-foreground">
            If you don&apos;t see it, check your spam folder.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            className="inline-flex h-11 w-full items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Try another email
          </button>

          <Link
            href="/auth/login"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <motion.div
        custom={0}
        variants={inputVariants}
        className="space-y-2"
      >
        <label className="text-sm font-medium">
          Email
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex h-11 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </motion.div>

      {error && (
        <motion.p
          custom={1}
          variants={inputVariants}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      <motion.div
        custom={2}
        variants={inputVariants}
        className="space-y-3"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send reset link'}

          {!loading && (
            <ArrowRight className="h-4 w-4" />
          )}
        </motion.button>

        <Link
          href="/auth/login"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </motion.div>
    </motion.form>
  );
}