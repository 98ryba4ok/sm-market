import styled from 'styled-components';

import { tokens } from '../../../theme/tokens';

import { MAX_CONTENT_HEIGHT, MODAL_SIZES } from './constants';
import type { ModalSize } from './types';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${tokens.zIndex.modalBackdrop};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing[4]};
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div<{ $size: ModalSize }>`
  position: relative;
  width: 100%;
  max-width: ${({ $size }) => MODAL_SIZES[$size]};
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.borderRadius.lg};
  box-shadow: ${tokens.shadows.xl};
  transform: scale(1);
  transition: transform ${tokens.transitions.base};
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${tokens.spacing[6]};
  border-bottom: 1px solid ${tokens.colors.gray[200]};
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${tokens.typography.fontSize.xl};
  font-weight: ${tokens.typography.fontWeight.semibold};
  line-height: ${tokens.typography.lineHeight.normal};
  color: ${tokens.colors.gray[900]};
`;

export const Description = styled.p`
  margin: ${tokens.spacing[1]} 0 0 0;
  font-size: ${tokens.typography.fontSize.sm};
  line-height: ${tokens.typography.lineHeight.normal};
  color: ${tokens.colors.gray[600]};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${tokens.spacing[4]};
  padding: ${tokens.spacing[1]};
  background: none;
  border: none;
  border-radius: ${tokens.borderRadius.lg};
  color: ${tokens.colors.gray[400]};
  cursor: pointer;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.gray[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const Content = styled.div`
  padding: ${tokens.spacing[6]};
  max-height: ${MAX_CONTENT_HEIGHT};
  overflow-y: auto;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.spacing[3]};
  padding: ${tokens.spacing[6]};
  border-top: 1px solid ${tokens.colors.gray[200]};
`;