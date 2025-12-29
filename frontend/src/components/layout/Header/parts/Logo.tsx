import React from 'react';

import { DEFAULT_SHOW_LOGO_TEXT } from '../constants';
import * as S from '../styles';
import type { LogoProps } from '../types';

/**
 * Логотип приложения
 */
export const Logo: React.FC<LogoProps> = ({ showText = DEFAULT_SHOW_LOGO_TEXT }) => {
  return (
    <S.LogoLink to="/">
      <S.LogoIcon>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
          SM
        </span>
      </S.LogoIcon>
      {showText && <S.LogoText>SM Market</S.LogoText>}
    </S.LogoLink>
  );
};