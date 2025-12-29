import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { media, mediaMax } from '../../../theme/breakpoints';
import { tokens } from '../../../theme/tokens';

import { BADGE_SIZE, HEADER_HEIGHT, LOGO_SIZE } from './constants';

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: ${tokens.zIndex.sticky};
  width: 100%;
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.gray[200]};
  box-shadow: ${tokens.shadows.sm};
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${tokens.spacing[4]};
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT};
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
  text-decoration: none;
`;

export const LogoIcon = styled.div`
  width: ${LOGO_SIZE};
  height: ${LOGO_SIZE};
  background-color: ${tokens.colors.primary[600]};
  border-radius: ${tokens.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoText = styled.span`
  font-size: ${tokens.typography.fontSize.xl};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${tokens.colors.gray[900]};
  
  ${mediaMax.sm} {
    display: none;
  }
`;

export const SearchContainer = styled.div`
  display: none;
  flex: 1;
  max-width: 42rem;
  margin: 0 ${tokens.spacing[8]};
  
  ${media.md} {
    display: flex;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
  padding-left: ${tokens.spacing[10]};
  border: 1px solid ${tokens.colors.gray[300]};
  border-radius: ${tokens.borderRadius.lg};
  font-size: ${tokens.typography.fontSize.base};
  line-height: ${tokens.typography.lineHeight.normal};
  transition: all ${tokens.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
    box-shadow: 0 0 0 3px ${tokens.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${tokens.colors.gray[400]};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: ${tokens.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${tokens.colors.gray[400]};
  pointer-events: none;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
`;

export const IconButtonBase = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing[2]};
  background: none;
  border: none;
  border-radius: ${tokens.borderRadius.lg};
  color: ${tokens.colors.gray[700]};
  cursor: pointer;
  transition: background-color ${tokens.transitions.fast};
  
  &:hover {
    background-color: ${tokens.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const IconLinkBase = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing[2]};
  border-radius: ${tokens.borderRadius.lg};
  color: ${tokens.colors.gray[700]};
  text-decoration: none;
  transition: background-color ${tokens.transitions.fast};
  
  &:hover {
    background-color: ${tokens.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const Badge = styled.span<{ $color: 'primary' | 'danger' }>`
  position: absolute;
  top: -${tokens.spacing[1]};
  right: -${tokens.spacing[1]};
  min-width: ${BADGE_SIZE};
  height: ${BADGE_SIZE};
  padding: 0 ${tokens.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) =>
    $color === 'danger' ? tokens.colors.error[500] : tokens.colors.primary[600]};
  color: ${tokens.colors.white};
  font-size: ${tokens.typography.fontSize.xs};
  font-weight: ${tokens.typography.fontWeight.bold};
  border-radius: ${tokens.borderRadius.full};
`;

export const UserLink = styled(Link)`
  display: none;
  align-items: center;
  gap: ${tokens.spacing[2]};
  padding: ${tokens.spacing[2]};
  border-radius: ${tokens.borderRadius.lg};
  color: ${tokens.colors.gray[700]};
  text-decoration: none;
  transition: background-color ${tokens.transitions.fast};
  
  ${media.sm} {
    display: flex;
  }
  
  &:hover {
    background-color: ${tokens.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const UserName = styled.span`
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
`;

export const MobileSearchContainer = styled.div`
  padding-bottom: ${tokens.spacing[3]};
  
  ${media.md} {
    display: none;
  }
`;

export const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: ${tokens.spacing[6]};
  padding: ${tokens.spacing[3]} 0;
  border-top: 1px solid ${tokens.colors.gray[100]};
  
  ${media.md} {
    display: flex;
  }
`;

export const NavLink = styled(Link)`
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.primary[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const MobileMenu = styled.div`
  border-top: 1px solid ${tokens.colors.gray[200]};
  background-color: ${tokens.colors.white};
  
  ${media.md} {
    display: none;
  }
`;

export const MobileNav = styled.nav`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${tokens.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[3]};
`;

export const MobileNavLink = styled(Link)`
  padding: ${tokens.spacing[2]} 0;
  font-size: ${tokens.typography.fontSize.base};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.primary[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const MobileUserSection = styled.div`
  padding-top: ${tokens.spacing[4]};
  margin-top: ${tokens.spacing[2]};
  border-top: 1px solid ${tokens.colors.gray[200]};
`;