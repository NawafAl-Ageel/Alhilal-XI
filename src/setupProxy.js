const { createProxyMiddleware } = require('http-proxy-middleware');

// CRA dev proxy to avoid CORS and inject required headers
module.exports = function(app) {
  const provider = (process.env.REACT_APP_FOOTBALL_PROVIDER || 'apisports').toLowerCase();
  const apiKey = process.env.REACT_APP_API_FOOTBALL_KEY || process.env.REACT_APP_FOOTBALL_API_KEY;

  const target = provider === 'rapidapi'
    ? 'https://api-football-v1.p.rapidapi.com'
    : 'https://v3.football.api-sports.io';

  app.use(
    '/api-football',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/api-football': provider === 'rapidapi' ? '/v3' : '',
      },
      onProxyReq: (proxyReq) => {
        if (!apiKey) return;
        if (provider === 'rapidapi') {
          proxyReq.setHeader('X-RapidAPI-Key', apiKey);
          proxyReq.setHeader('X-RapidAPI-Host', 'api-football-v1.p.rapidapi.com');
        } else {
          proxyReq.setHeader('x-apisports-key', apiKey);
          proxyReq.setHeader('x-rapidapi-key', apiKey);
          proxyReq.setHeader('x-rapidapi-host', 'v3.football.api-sports.io');
        }
      },
    })
  );
};


