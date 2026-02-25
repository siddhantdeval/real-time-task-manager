import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - TaskFlow',
  description: 'Reset your TaskFlow account password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      title="Real-time productivity for high-performance teams."
      subtitle="Streamline your workflow with instant updates, collaborative task boards, and advanced analytics."
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Forgot your password?</h2>
        <p className="text-slate-500 mt-2">
          Enter your email and we'll send you a reset link if an account exists.
        </p>
      </div>

      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
