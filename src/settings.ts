interface AppSettings {
  PRODUCTION: boolean;
  API_URL: string;
  API_URL_DEVELOPMENT: string;
  MARKETPLACE_NAME: string;
  ENABLE_CMS: boolean;
}

const settings: AppSettings = {
  PRODUCTION: process.env.NODE_ENV === 'production',
  API_URL: process.env.REACT_APP_API_URL ?? '',
  API_URL_DEVELOPMENT: process.env.REACT_APP_API_URL_DEVELOPMENT ?? '',
  MARKETPLACE_NAME: process.env.REACT_APP_MARKETPLACE_NAME ?? 'OpenChannel',
  ENABLE_CMS: process.env.REACT_APP_PRODUCTION === 'true' || false,
};

export default settings;
