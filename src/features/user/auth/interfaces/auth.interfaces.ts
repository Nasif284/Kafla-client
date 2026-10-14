export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface verifyEmail {
  email: string;
  code: string;
}

export interface SendOtp {
  email: string;
  purpose: string;
}

export interface VerifyOtp {
  email: string;
  code: string;
  purpose: string;
}

export interface ResetPassword {
  email: string;
  password: string;
}

export interface OTPVerificationCardProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
}
