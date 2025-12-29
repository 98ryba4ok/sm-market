import styled from 'styled-components';

import { StyledBox } from '../Box/styles';

import type { StyledFlexProps } from './types';

/**
 * Styled Flex component
 * Расширяет Box и добавляет flexbox свойства
 */
export const StyledFlex = styled(StyledBox)<StyledFlexProps>`
  display: flex;
  
  ${({ direction }) => direction && `flex-direction: ${direction};`}
  ${({ wrap }) => wrap && `flex-wrap: ${wrap};`}
  ${({ justify }) => justify && `justify-content: ${justify};`}
  ${({ align }) => align && `align-items: ${align};`}
  ${({ alignContent }) => alignContent && `align-content: ${alignContent};`}
  ${({ gap }) => gap && `gap: ${gap};`}
  
  ${({ flex }) => flex && `flex: ${flex};`}
  ${({ grow }) => grow !== undefined && `flex-grow: ${grow};`}
  ${({ shrink }) => shrink !== undefined && `flex-shrink: ${shrink};`}
  ${({ basis }) => basis && `flex-basis: ${basis};`}
  ${({ alignSelf }) => alignSelf && `align-self: ${alignSelf};`}
`;