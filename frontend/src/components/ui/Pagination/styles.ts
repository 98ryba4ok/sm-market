import styled from 'styled-components';

import { tokens } from '../../../theme/tokens';

export const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing[1]};
`;

export const PageNumbersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[1]};
`;

export const PageButton = styled.button<{ $isActive: boolean }>`
  min-width: 40px;
  padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  line-height: ${tokens.typography.lineHeight.sm};
  border-radius: ${tokens.borderRadius.lg};
  border: none;
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  background-color: ${({ $isActive }) =>
    $isActive ? tokens.colors.primary[600] : 'transparent'};
  color: ${({ $isActive }) =>
    $isActive ? tokens.colors.white : tokens.colors.gray[700]};
  
  &:hover:not(:disabled) {
    background-color: ${({ $isActive }) =>
      $isActive ? tokens.colors.primary[700] : tokens.colors.gray[100]};
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const DotsContainer = styled.span`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
  color: ${tokens.colors.gray[400]};
`;

export const SimplePaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${tokens.spacing[8]};
`;