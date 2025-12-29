import React from 'react';

import { COMPANY_DESCRIPTION, COMPANY_NAME, SOCIAL_LINKS } from '../constants';
import * as S from '../styles';

/**
 * Информация о компании с социальными ссылками
 */
export const CompanyInfo: React.FC = () => {
  return (
    <S.Section>
      <S.SectionTitle>{COMPANY_NAME}</S.SectionTitle>
      <S.Description>{COMPANY_DESCRIPTION}</S.Description>
      <S.SocialLinks>
        {SOCIAL_LINKS.map((social) => (
          <S.SocialLink
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
          >
            {social.icon}
          </S.SocialLink>
        ))}
      </S.SocialLinks>
    </S.Section>
  );
};