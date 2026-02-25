import { SignupForm } from '@/components/auth/SignupForm';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - TaskFlow',
  description: 'Create a new TaskFlow account to manage your projects.',
};

export default function SignupPage() {
  return (
    <AuthSplitLayout 
      title="Real-time productivity for high-performance teams."
      subtitle="Streamline your workflow with instant updates, collaborative task boards, and advanced analytics."
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-slate-500 mt-2">Join high-performance teams managing tasks in real-time.</p>
      </div>
      
      <SignupForm />
    </AuthSplitLayout>
  );
}
