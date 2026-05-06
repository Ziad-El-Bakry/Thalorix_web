import { Suspense } from "react";
import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/features/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    );
}
