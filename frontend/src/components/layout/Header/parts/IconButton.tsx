import React from 'react';

import { DEFAULT_BADGE_COLOR } from '../constants';
import * as S from '../styles';
import type { IconButtonProps } from '../types';

/**
 * Кнопка с иконкой и опциональным badge
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  count,
  badgeColor = DEFAULT_BADGE_COLOR,
  onClick,
  to,
  ariaLabel,
}) => {
  const content = (
    <>
      {icon}
      {count !== undefined && count > 0 && (
        <S.Badge $color={badgeColor}>{count}</S.Badge>
      )}
    </>
  );

  if (to) {
    return (
      <S.IconLinkBase to={to} aria-label={ariaLabel}>
        {content}
      </S.IconLinkBase>
    );
  }

  return (
    <S.IconButtonBase onClick={onClick} aria-label={ariaLabel}>
      {content}
    </S.IconButtonBase>
  );
};