import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { VerifyOtpForm } from "@/components/features/auth/VerifyOtpForm";

export default function VerifyOtpPage() {
    return (
        <AuthLayout>
            <VerifyOtpForm />
        </AuthLayout>
    );
}
