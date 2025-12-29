import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { tokens } from '../../../theme/tokens';

export const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
  font-size: ${tokens.typography.fontSize.sm};
`;

export const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${tokens.colors.gray[600]};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.gray[900]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const Separator = styled.span`
  display: flex;
  align-items: center;
  color: ${tokens.colors.gray[400]};
`;

export const BreadcrumbLink = styled(Link)`
  color: ${tokens.colors.gray[600]};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.gray[900]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const CurrentPage = styled.span`
  color: ${tokens.colors.gray[900]};
  font-weight: ${tokens.typography.fontWeight.medium};
`;