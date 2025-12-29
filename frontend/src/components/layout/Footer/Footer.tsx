import React from 'react';

import { COMPANY_NAME, CUSTOMER_SERVICE, LEGAL_LINKS, QUICK_LINKS } from './constants';
import { CompanyInfo, ContactSection, LinksSection } from './parts';
import * as S from './styles';
import type { FooterProps } from './types';

/**
 * Футер приложения
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <S.FooterContainer className={className}>
      {/* Main Footer Content */}
      <S.MainContent>
        <S.Grid>
          <CompanyInfo />
          <LinksSection section={QUICK_LINKS} />
          <LinksSection section={CUSTOMER_SERVICE} />
          <ContactSection />
        </S.Grid>
      </S.MainContent>

      {/* Bottom Bar */}
      <S.BottomBar>
        <S.BottomContent>
          <S.Copyright>
            © {currentYear} {COMPANY_NAME}. All rights reserved.
          </S.Copyright>
          <S.LegalLinks>
            {LEGAL_LINKS.map((link) => (
              <S.FooterLink key={link.to} to={link.to}>
                {link.label}
              </S.FooterLink>
            ))}
          </S.LegalLinks>
        </S.BottomContent>
      </S.BottomBar>
    </S.FooterContainer>
  );
};