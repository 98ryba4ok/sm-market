import { createGlobalStyle } from 'styled-components';

import { colors, typography } from './tokens';

/**
 * Глобальные стили приложения
 */
export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${typography.fontFamily.sans};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.normal};
    color: ${colors.gray[900]};
    background-color: ${colors.white};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input,
  textarea,
  select {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.gray[400]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.gray[500]};
  }

  /* Focus visible styles */
  *:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: ${colors.primary[200]};
    color: ${colors.primary[900]};
  }
`;