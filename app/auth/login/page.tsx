import { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login - BUDGET TRACKER',
  description: 'Login to access the BUDGET TRACKER.',
};

export default function LoginPage() {
  return <LoginForm />;
}
