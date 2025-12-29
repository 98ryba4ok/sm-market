import type { CSSProperties, ReactNode } from 'react';

import type { spacing } from '../../../theme/tokens';

export type SpacingValue = keyof typeof spacing;

export interface BoxProps {
  children?: ReactNode;
  className?: string;
  
  // Spacing
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  pt?: SpacingValue;
  pr?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  mt?: SpacingValue;
  mr?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  
  // Layout
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  minWidth?: CSSProperties['minWidth'];
  minHeight?: CSSProperties['minHeight'];
  maxWidth?: CSSProperties['maxWidth'];
  maxHeight?: CSSProperties['maxHeight'];
  
  // Display
  display?: CSSProperties['display'];
  overflow?: CSSProperties['overflow'];
  
  // Colors
  bg?: string;
  color?: string;
  
  // Border
  borderRadius?: string;
  border?: string;
  
  // Position
  position?: CSSProperties['position'];
  top?: CSSProperties['top'];
  right?: CSSProperties['right'];
  bottom?: CSSProperties['bottom'];
  left?: CSSProperties['left'];
  zIndex?: CSSProperties['zIndex'];
}

export type StyledBoxProps = BoxProps;