import styled, { css } from 'styled-components';

import { spacing } from '../../../theme/tokens';

import type { StyledBoxProps } from './types';

/**
 * Генерирует CSS для spacing свойств
 */
const getSpacingStyles = (props: StyledBoxProps) => css`
  ${props.p && `padding: ${spacing[props.p]};`}
  ${props.px && `padding-left: ${spacing[props.px]}; padding-right: ${spacing[props.px]};`}
  ${props.py && `padding-top: ${spacing[props.py]}; padding-bottom: ${spacing[props.py]};`}
  ${props.pt && `padding-top: ${spacing[props.pt]};`}
  ${props.pr && `padding-right: ${spacing[props.pr]};`}
  ${props.pb && `padding-bottom: ${spacing[props.pb]};`}
  ${props.pl && `padding-left: ${spacing[props.pl]};`}
  
  ${props.m && `margin: ${spacing[props.m]};`}
  ${props.mx && `margin-left: ${spacing[props.mx]}; margin-right: ${spacing[props.mx]};`}
  ${props.my && `margin-top: ${spacing[props.my]}; margin-bottom: ${spacing[props.my]};`}
  ${props.mt && `margin-top: ${spacing[props.mt]};`}
  ${props.mr && `margin-right: ${spacing[props.mr]};`}
  ${props.mb && `margin-bottom: ${spacing[props.mb]};`}
  ${props.ml && `margin-left: ${spacing[props.ml]};`}
`;

/**
 * Styled Box component
 */
export const StyledBox = styled.div<StyledBoxProps>`
  ${getSpacingStyles}
  
  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${height};`}
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`}
  ${({ minHeight }) => minHeight && `min-height: ${minHeight};`}
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth};`}
  ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight};`}
  
  ${({ display }) => display && `display: ${display};`}
  ${({ overflow }) => overflow && `overflow: ${overflow};`}
  
  ${({ bg }) => bg && `background-color: ${bg};`}
  ${({ color }) => color && `color: ${color};`}
  
  ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius};`}
  ${({ border }) => border && `border: ${border};`}
  
  ${({ position }) => position && `position: ${position};`}
  ${({ top }) => top !== undefined && `top: ${top};`}
  ${({ right }) => right !== undefined && `right: ${right};`}
  ${({ bottom }) => bottom !== undefined && `bottom: ${bottom};`}
  ${({ left }) => left !== undefined && `left: ${left};`}
  ${({ zIndex }) => zIndex !== undefined && `z-index: ${zIndex};`}
`;