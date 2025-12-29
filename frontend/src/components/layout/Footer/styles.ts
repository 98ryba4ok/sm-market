import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { media } from '../../../theme/breakpoints';
import { tokens } from '../../../theme/tokens';

export const FooterContainer = styled.footer`
  background-color: ${tokens.colors.gray[900]};
  color: ${tokens.colors.gray[300]};
`;

export const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${tokens.spacing[12]} ${tokens.spacing[4]};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing[8]};
  
  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Section = styled.div``;

export const SectionTitle = styled.h3`
  margin: 0 0 ${tokens.spacing[4]} 0;
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${tokens.colors.white};
`;

export const Description = styled.p`
  margin: 0 0 ${tokens.spacing[4]} 0;
  font-size: ${tokens.typography.fontSize.sm};
  line-height: ${tokens.typography.lineHeight.normal};
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${tokens.spacing[4]};
`;

export const SocialLink = styled.a`
  color: ${tokens.colors.gray[300]};
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.white};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const LinksList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[2]};
`;

export const LinksListItem = styled.li`
  font-size: ${tokens.typography.fontSize.sm};
`;

export const FooterLink = styled(Link)`
  color: ${tokens.colors.gray[300]};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.white};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const ContactList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[3]};
`;

export const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.spacing[3]};
  font-size: ${tokens.typography.fontSize.sm};
`;

export const ContactIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

export const ContactLink = styled.a`
  color: ${tokens.colors.gray[300]};
  text-decoration: none;
  transition: color ${tokens.transitions.fast};
  
  &:hover {
    color: ${tokens.colors.white};
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

export const BottomBar = styled.div`
  border-top: 1px solid ${tokens.colors.gray[800]};
`;

export const BottomContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${tokens.spacing[6]} ${tokens.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing[4]};
  
  ${media.md} {
    flex-direction: row;
    justify-content: space-between;
    gap: 0;
  }
`;

export const Copyright = styled.p`
  margin: 0;
  font-size: ${tokens.typography.fontSize.sm};
  text-align: center;
  
  ${media.md} {
    text-align: left;
  }
`;

export const LegalLinks = styled.div`
  display: flex;
  gap: ${tokens.spacing[6]};
  font-size: ${tokens.typography.fontSize.sm};
`;