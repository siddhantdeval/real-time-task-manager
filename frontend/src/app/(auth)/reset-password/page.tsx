import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - TaskFlow',
  description: 'Set a new password for your TaskFlow account.',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  // Server Component reads token from URL: /reset-password?token=<rawToken>
  const { token } = await searchParams;

  return (
    <AuthSplitLayout
      title="Real-time productivity for high-performance teams."
      subtitle="Streamline your workflow with instant updates, collaborative task boards, and advanced analytics."
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reset your password</h2>
        <p className="text-slate-500 mt-2">Enter a new password for your account.</p>
      </div>

      <ResetPasswordForm token={token ?? ''} />
    </AuthSplitLayout>
  );
}
