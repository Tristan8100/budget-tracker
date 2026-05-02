import { Metadata } from 'next';
import { RegisterForm } from '@/components/register-form';

export const metadata: Metadata = {
  title: 'Register - BUDGET TRACKER',
  description: 'Create your account and TRACK your BUDGET.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
