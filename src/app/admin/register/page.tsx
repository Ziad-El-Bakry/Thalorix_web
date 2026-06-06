import { AuthLayout } from "@/components/features/auth/AuthLayout";
import { AdminRegisterForm } from "@/components/features/auth/AdminRegisterForm";

export default function AdminRegisterPage() {
    return (
        <AuthLayout>
            <AdminRegisterForm />
        </AuthLayout>
    );
}
