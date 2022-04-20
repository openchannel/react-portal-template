import { HelmetProps } from 'react-helmet';

type MetaTag = {
  name: string;
  content: string;
};

interface SiteConfig extends HelmetProps {
  title: string;
  tagline?: string;
  meta?: MetaTag[];
}

export const siteConfig: SiteConfig = {
  title: 'App Marketplace',
  // Allow to combine title and tagline that will be set in title. ({site.title} | {site.tagline}
  tagline: 'All the apps and integrations that you need',
  meta: [
    { name: 'author', content: 'OpenChannel' },
    { name: 'description', content: 'OpenChannel' },
    { name: 'generator', content: 'OpenChannel' },
  ],
  link: [
    // 'id' attr is required for the @openchannel/react-common-components
    { id: 'custom-favicon', rel: 'icon', type: 'image/x-icon', href: 'favicon.png' },
  ],
};
