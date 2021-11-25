const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://stage1-philips-market-api-test.openchannel.io',
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/': '' },
    }),
  );
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: 'https://stage1-philips-market-api-test.openchannel.io',
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/': '' },
    }),
  );
};
