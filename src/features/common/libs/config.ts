export type ConfigObject = {
  clientId: string;
  redirectUri: string;
  scope: string;
  issuer: string;
};

export type NormalizedConfigObject = {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  authority: string;
  silent_redirect_uri: string;
  automaticSilentRenew: boolean;
  loadUserInfo: boolean;
  monitorSession: boolean;
  post_logout_redirect_uri: string;
};

export const normalizeOIdConfig = (config: ConfigObject): NormalizedConfigObject => {
  return {
    client_id: config.clientId,
    redirect_uri: config.redirectUri || `${window.location.origin}/login`,
    response_type: 'id_token token',
    scope: config.scope,
    authority: config.issuer,
    silent_redirect_uri: config.redirectUri || `${window.location.origin}/login`,
    automaticSilentRenew: true,
    loadUserInfo: true,
    monitorSession: false, // set to true by default. this causes a signout after few seconds in chrome browser
    post_logout_redirect_uri: window.location.origin,
  };
};
