import React from 'react';

import { CONTACT_INFO } from '../constants';
import * as S from '../styles';

/**
 * Секция с контактной информацией
 */
export const ContactSection: React.FC = () => {
  return (
    <S.Section>
      <S.SectionTitle>Contact Us</S.SectionTitle>
      <S.ContactList>
        {CONTACT_INFO.map((contact, index) => (
          <S.ContactItem key={index}>
            <S.ContactIcon>{contact.icon}</S.ContactIcon>
            {contact.href ? (
              <S.ContactLink href={contact.href}>{contact.text}</S.ContactLink>
            ) : (
              <span>{contact.text}</span>
            )}
          </S.ContactItem>
        ))}
      </S.ContactList>
    </S.Section>
  );
};