import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '../../../../hooks/useAuth';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';

import {
    ForgotPasswordButton,
    ForgotPasswordWrapper,
    PasswordToggleButton,
    StyledForm,
    SwitchModeButton,
    SwitchModeWrapper,
} from './styles';
import type { LoginFormProps } from './types';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation (toast notification)
      console.error('Login failed:', error);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
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
        placeholder="Enter your password"
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
        {...register('password')}
      />

      {/* Forgot Password Link */}
      <ForgotPasswordWrapper>
        <ForgotPasswordButton type="button">
          Forgot password?
        </ForgotPasswordButton>
      </ForgotPasswordWrapper>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign In
      </Button>

      {/* Switch to Register */}
      {onSwitchToRegister && (
        <SwitchModeWrapper>
          Don't have an account?{' '}
          <SwitchModeButton type="button" onClick={onSwitchToRegister}>
            Sign up
          </SwitchModeButton>
        </SwitchModeWrapper>
      )}
    </StyledForm>
  );
};