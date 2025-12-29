import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import React from 'react';

import type { ContactInfo, FooterSection, SocialLink } from './types';

export const COMPANY_NAME = 'SM Market';
export const COMPANY_DESCRIPTION = 'Your trusted online marketplace for quality products at great prices.';

export const ICON_SIZE = 20;
export const CONTACT_ICON_SIZE = 18;

export const QUICK_LINKS: FooterSection = {
  title: 'Quick Links',
  links: [
    { label: 'Home', to: '/' },
    { label: 'All Products', to: '/products' },
    { label: 'Shopping Cart', to: '/cart' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'My Orders', to: '/orders' },
  ],
};

export const CUSTOMER_SERVICE: FooterSection = {
  title: 'Customer Service',
  links: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Shipping Information', to: '/shipping' },
    { label: 'Returns & Refunds', to: '/returns' },
    { label: 'FAQ', to: '/faq' },
  ],
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: React.createElement(Facebook, { size: ICON_SIZE }),
    ariaLabel: 'Facebook',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: React.createElement(Twitter, { size: ICON_SIZE }),
    ariaLabel: 'Twitter',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: React.createElement(Instagram, { size: ICON_SIZE }),
    ariaLabel: 'Instagram',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: React.createElement(Youtube, { size: ICON_SIZE }),
    ariaLabel: 'YouTube',
  },
];

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: React.createElement(MapPin, { size: CONTACT_ICON_SIZE }),
    text: '123 Market Street, City, Country 12345',
  },
  {
    icon: React.createElement(Phone, { size: CONTACT_ICON_SIZE }),
    text: '+1 (234) 567-890',
    href: 'tel:+1234567890',
  },
  {
    icon: React.createElement(Mail, { size: CONTACT_ICON_SIZE }),
    text: 'support@smmarket.com',
    href: 'mailto:support@smmarket.com',
  },
];

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookies' },
];