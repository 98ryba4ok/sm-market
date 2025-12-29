import React from 'react';

import * as S from '../styles';
import type { FooterSection } from '../types';

interface LinksSectionProps {
  section: FooterSection;
}

/**
 * Секция со ссылками
 */
export const LinksSection: React.FC<LinksSectionProps> = ({ section }) => {
  return (
    <S.Section>
      <S.SectionTitle>{section.title}</S.SectionTitle>
      <S.LinksList>
        {section.links.map((link) => (
          <S.LinksListItem key={link.to}>
            <S.FooterLink to={link.to}>{link.label}</S.FooterLink>
          </S.LinksListItem>
        ))}
      </S.LinksList>
    </S.Section>
  );
};