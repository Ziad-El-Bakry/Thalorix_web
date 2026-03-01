import { AuthLayout } from "@/components/features/auth/AuthLayout";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}