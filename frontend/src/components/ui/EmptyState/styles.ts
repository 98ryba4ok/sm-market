import styled from 'styled-components';

import { tokens } from '../../../theme/tokens';

import { MAX_DESCRIPTION_WIDTH } from './constants';

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing[12]} ${tokens.spacing[4]};
  text-align: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${tokens.spacing[4]};
  padding: ${tokens.spacing[3]};
  background-color: ${tokens.colors.gray[100]};
  border-radius: ${tokens.borderRadius.full};
  color: ${tokens.colors.gray[400]};
`;

export const Title = styled.h3`
  margin: 0 0 ${tokens.spacing[2]} 0;
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.semibold};
  line-height: ${tokens.typography.lineHeight.normal};
  color: ${tokens.colors.gray[900]};
`;

export const Description = styled.p`
  margin: 0 0 ${tokens.spacing[6]} 0;
  max-width: ${MAX_DESCRIPTION_WIDTH};
  font-size: ${tokens.typography.fontSize.sm};
  line-height: ${tokens.typography.lineHeight.normal};
  color: ${tokens.colors.gray[600]};
`;