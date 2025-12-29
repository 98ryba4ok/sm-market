import styled from 'styled-components';

import { tokens } from '../../../../theme/tokens';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[4]};
`;

export const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ForgotPasswordButton = styled.button`
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.primary[600]};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color ${tokens.transitions.fast};

  &:hover {
    color: ${tokens.colors.primary[700]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const SwitchModeWrapper = styled.div`
  text-align: center;
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.gray[600]};
`;

export const SwitchModeButton = styled.button`
  color: ${tokens.colors.primary[600]};
  font-weight: ${tokens.typography.fontWeight.medium};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color ${tokens.transitions.fast};

  &:hover {
    color: ${tokens.colors.primary[700]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const PasswordToggleButton = styled.button`
  color: ${tokens.colors.gray[500]};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${tokens.transitions.fast};

  &:hover {
    color: ${tokens.colors.gray[700]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;