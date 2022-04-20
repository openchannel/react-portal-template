import * as React from 'react';
import ReactHelmet from 'react-helmet';

import { siteConfig } from '../../../assets/config';

const merge = (title: string, tagline = '') => (!tagline ? title : `${title} | ${tagline}`);

interface Helmet {
  title?: string;
}

export const Helmet: React.FC<Helmet> = React.memo(({ title }) => {
  const pageTitle = title
    ? merge(title, siteConfig.title)
    : merge(siteConfig.title, siteConfig.tagline);

  return <ReactHelmet {...siteConfig} title={pageTitle} />;
});
