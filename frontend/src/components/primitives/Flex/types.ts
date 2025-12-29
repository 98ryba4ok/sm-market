import type { CSSProperties } from 'react';

import type { BoxProps } from '../Box/types';

export interface FlexProps extends BoxProps {
  // Flex container properties
  direction?: CSSProperties['flexDirection'];
  wrap?: CSSProperties['flexWrap'];
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  alignContent?: CSSProperties['alignContent'];
  gap?: CSSProperties['gap'];
  
  // Flex item properties
  flex?: CSSProperties['flex'];
  grow?: CSSProperties['flexGrow'];
  shrink?: CSSProperties['flexShrink'];
  basis?: CSSProperties['flexBasis'];
  alignSelf?: CSSProperties['alignSelf'];
}

export type StyledFlexProps = FlexProps;