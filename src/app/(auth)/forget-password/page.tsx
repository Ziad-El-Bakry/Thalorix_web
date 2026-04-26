import { Suspense } from "react";
import { AuthLayout } from "@/components/features/auth/AuthLayout";
import ForgetPasswordForm from "@/components/features/auth/ForgetPasswordForm";

export default function ForgetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}