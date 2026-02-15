// Prerender configuration for better SEO
// This helps search engines index SPA pages by generating static HTML

module.exports = {
  // Routes to prerender
  routes: [
    '/',
    '/about',
    '/products',
    '/shop',
    '/blog',
    '/recipes',
    '/contact',
    '/hot-sauces',
    '/mayonnaise',
    '/international',
    '/bbq-sauces',
    '/bulk-orders',
    '/export',
    '/certifications',
    '/quality',
    '/faq',
    '/careers',
    '/press',
    '/partnerships',
    '/privacy',
    '/terms',
    '/refund',
    '/shipping'
  ],
  
  // Renderer options
  renderer: {
    // Wait for content to load
    renderAfterDocumentEvent: 'render-event',
    renderAfterTime: 5000,
    
    // Inject meta tags
    injectProperty: '__PRERENDER_INJECTED',
    inject: {
      prerendered: true
    }
  },
  
  // Server options
  server: {
    port: 8080
  },
  
  // Post-processing
  postProcess(renderedRoute) {
    // Add prerender meta tag
    renderedRoute.html = renderedRoute.html.replace(
      '</head>',
      '<meta name="prerender-status-code" content="200"></head>'
    );
    
    return renderedRoute;
  }
};
