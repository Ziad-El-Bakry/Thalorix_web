import { AuthLayout } from "@/components/features/auth/AuthLayout";
import VerifyEmailForm from "@/components/features/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
    return (
        <AuthLayout variant="verify">
            <VerifyEmailForm />
        </AuthLayout>
    );
}
