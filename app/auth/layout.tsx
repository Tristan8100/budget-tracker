import { ReactNode } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication - BUDGET TRACKER',
  description: 'Login or register to access BUDGET TRACKER.',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-card flex overflow-hidden">

      {/* Image side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/layoutOverlay.png"
          alt="Background"
          fill
          className="object-cover blur-[1px]"
        />
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-red-900" />
              <h1 className="text-xs font-mono text-gray-400">BUDGET TRACKER</h1>
            </div>

            <Link href="/" className="text-3xl font-bold text-primary">
              BUDGET <span className="text-primary">TRACKER</span>
            </Link>
          </div>

          {children}
        </div>
      </div>

    </div>
  );
}