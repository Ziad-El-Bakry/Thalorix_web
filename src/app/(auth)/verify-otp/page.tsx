import { Suspense } from "react";
import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { VerifyOtpForm } from "@/components/features/auth/VerifyOtpForm";

export default function VerifyOtpPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyOtpForm />
            </Suspense>
        </AuthLayout>
    );
}
