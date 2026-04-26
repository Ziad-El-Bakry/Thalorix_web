// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { authService } from "../api/services/auth.service";

// export const useAuth = () => {
//     const router = useRouter();
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//     const [user, setUser] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         checkAuthStatus();
//     }, []);

//     const checkAuthStatus = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 setIsAuthenticated(false);
//                 setLoading(false);
//                 return;
//             }

//             const response = await authService.me();
//             if (response.success) {
//                 setIsAuthenticated(true);
//                 setUser(response.data);
//             } else {
//                 setIsAuthenticated(false);
//                 localStorage.removeItem("token");
//             }
//         } catch (error) {
//             setIsAuthenticated(false);
//             localStorage.removeItem("token");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email: string, password: string) => {
//         try {
//             const response = await authService.login(email, password);
//             if (response.success) {
//                 localStorage.setItem("token", response.data.token);
//                 setIsAuthenticated(true);
//                 setUser(response.data.user);
//                 return { success: true };
//             } else {
//                 return { success: false, error: response.message };
//             }
//         } catch (error: any) {
//             return { success: false, error: error.message };
//         }
//     };

//     const logout = async () => {
//         try {
//             await authService.logout();
//             localStorage.removeItem("token");
//             setIsAuthenticated(false);
//             setUser(null);
//             router.push("/login");
//         } catch (error) {
//             console.error("Logout error:", error);
//         }
//     };

//     const register = async (userData: any) => {
//         try {
//             const response = await authService.register(userData);
//             if (response.success) {
//                 localStorage.setItem("token", response.data.token);
//                 setIsAuthenticated(true);
//                 setUser(response.data.user);
//                 return { success: true };
//             } else {
//                 return { success: false, error: response.message };
//             }
//         } catch (error: any) {
//             return { success: false, error: error.message };
//         }
//     };

//     return {
//         isAuthenticated,
//         user,
//         loading,
//         login,
//         logout,
//         register,
//         checkAuthStatus,
//     };
// };