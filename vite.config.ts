import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    } : undefined
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for speed
    minify: 'terser', // Use terser for better compression
    target: 'es2020',
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive code splitting
          if (id.includes('node_modules')) {
            // Core React
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Radix UI - split by component
            if (id.includes('@radix-ui')) {
              if (id.includes('dialog') || id.includes('dropdown') || id.includes('select')) {
                return 'ui-core';
              }
              return 'ui-extended';
            }
            // Heavy libraries
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Utilities
            if (id.includes('axios') || id.includes('zustand') || id.includes('zod')) {
              return 'utils';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            if (id.includes('react-helmet')) {
              return 'seo';
            }
            if (id.includes('react-hook-form')) {
              return 'forms';
            }
            if (id.includes('date-fns')) {
              return 'date';
            }
            // Other node_modules
            return 'vendor';
          }
          // Split pages by route
          if (id.includes('/pages/')) {
            if (id.includes('/admin/')) {
              return 'admin';
            }
            if (id.includes('/auth/')) {
              return 'auth';
            }
            if (id.includes('/categories/')) {
              return 'categories';
            }
            if (id.includes('/payment/')) {
              return 'payment';
            }
          }
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|eot/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          if (/mp4|webm|ogg|mp3|wav|flac|aac/i.test(ext)) {
            return `media/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      },
      // Tree-shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 800,
    reportCompressedSize: false, // Faster builds
    assetsInlineLimit: 8192, // Inline smaller assets
    // Terser options for maximum compression
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    }
  },
  plugins: [
    react(),
    // Only compress in production
    mode === 'production' && compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 10240, // Only compress files > 10KB
      deleteOriginalAssets: false,
    }),
    mode === 'production' && compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 10240,
      deleteOriginalAssets: false,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'axios', 
      'zustand',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query'
    ]
  },
  // Enable CSS optimization
  css: {
    devSourcemap: mode === 'development',
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  // Performance optimizations
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true
  },
  // Experimental features for better performance
  experimental: {
    renderBuiltUrl() {
      // Use CDN for production assets if needed
      return { relative: true };
    }
  }
}));
