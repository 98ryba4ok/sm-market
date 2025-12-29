import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '../../../../hooks/useAuth';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';

import {
    PasswordToggleButton,
    StyledForm,
    SwitchModeButton,
    SwitchModeWrapper,
    TermsText,
} from './styles';
import type { RegisterFormProps } from './types';

// Validation schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Map form data to API format
      const registerData = {
        email: data.email,
        password: data.password,
        password_confirm: data.confirmPassword,
        first_name: data.firstName,
        last_name: data.lastName,
      };
      await registerUser(registerData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation (toast notification)
      console.error('Registration failed:', error);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      {/* First Name Field */}
      <Input
        label="First Name"
        type="text"
        placeholder="John"
        leftIcon={<User size={18} />}
        error={errors.firstName?.message}
        {...register('firstName')}
      />

      {/* Last Name Field */}
      <Input
        label="Last Name"
        type="text"
        placeholder="Doe"
        leftIcon={<User size={18} />}
        error={errors.lastName?.message}
        {...register('lastName')}
      />

      {/* Email Field */}
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        leftIcon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Password Field */}
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Create a password"
        leftIcon={<Lock size={18} />}
        rightIcon={
          <PasswordToggleButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </PasswordToggleButton>
        }
        error={errors.password?.message}
        helperText="Must be at least 6 characters"
        {...register('password')}
      />

      {/* Confirm Password Field */}
      <Input
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        leftIcon={<Lock size={18} />}
        rightIcon={
          <PasswordToggleButton
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </PasswordToggleButton>
        }
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Terms and Conditions */}
      <TermsText>
        By signing up, you agree to our{' '}
        <a href="/terms">Terms of Service</a> and{' '}
        <a href="/privacy">Privacy Policy</a>
      </TermsText>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Create Account
      </Button>

      {/* Switch to Login */}
      {onSwitchToLogin && (
        <SwitchModeWrapper>
          Already have an account?{' '}
          <SwitchModeButton type="button" onClick={onSwitchToLogin}>
            Sign in
          </SwitchModeButton>
        </SwitchModeWrapper>
      )}
    </StyledForm>
  );
};