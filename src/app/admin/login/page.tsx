import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { AdminLoginForm } from "@/components/features/auth/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <AuthLayout>
            <AdminLoginForm />
        </AuthLayout>
    );
}
