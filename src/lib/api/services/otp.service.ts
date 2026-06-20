// lib/api/services/otp.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';

export type OtpType = 'email_verification' | 'phone_verification' | 'password_reset' | 'admin_verification';

export interface SendOtpDto {
  type: OtpType;
  email?: string;
  phone?: string;
  name?: string;
  userId?: string;
}

export interface VerifyOtpDto {
  code: string;
  type: OtpType;
  email?: string;
  phone?: string;
  userId?: string;
}

export const otpService = {
  /**
   * Send an OTP to the given email or phone.
   */
  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { data } = await api.post(ENDPOINTS.OTP.SEND, dto);
    return data;
  },

  /**
   * Verify a 6-digit OTP code.
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string; verified: boolean }> {
    const { data } = await api.post(ENDPOINTS.OTP.VERIFY, dto);
    return data;
  },

  /**
   * Expire the current OTP and send a new one.
   */
  async resendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { data } = await api.post(ENDPOINTS.OTP.RESEND, dto);
    return data;
  },
};
