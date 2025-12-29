export interface FooterProps {
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

export interface FooterLinkItem {
  label: string;
  to: string;
}

export interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

export interface ContactInfo {
  icon: React.ReactNode;
  text: string;
  href?: string;
}