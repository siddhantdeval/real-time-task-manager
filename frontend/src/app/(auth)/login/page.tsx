import { LoginForm } from '@/components/auth/LoginForm';
import { AuthSplitLayout } from '@/components/layout/AuthSplitLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - TaskFlow',
  description: 'Sign in to your TaskFlow account to manage your projects.',
};

export default function LoginPage() {
  return (
    <AuthSplitLayout 
      title="Real-time productivity for high-performance teams."
      subtitle="Streamline your workflow with instant updates, collaborative task boards, and advanced analytics."
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sign in to TaskFlow</h2>
        <p className="text-slate-500 mt-2">Enter your details to manage your tasks in real-time.</p>
      </div>
      
      <LoginForm />
    </AuthSplitLayout>
  );
}
