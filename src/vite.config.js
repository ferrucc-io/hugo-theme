import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import fs from 'fs';

function hugoAssetsPlugin(options = {}) {
  const manifestFile = options.manifestFile || resolve(__dirname, '../data/vite_assets.json');
  return {
    name: 'hugo-assets',
    apply: 'build',
    writeBundle(outputOptions, bundle) {
      const assets = {};
      
      // Group by entry chunks
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if (chunk.isEntry || chunk.isDynamicEntry) {
          const entryName = chunk.name || 'main';
          assets[entryName] = assets[entryName] || {};
          assets[entryName].js = fileName;
        } else if (fileName.endsWith('.css')) {
          // Find the entry that generated this CSS
          const entryName = 'main';
          assets[entryName] = assets[entryName] || {};
          assets[entryName].css = fileName;
        }
      });
      
      // Write manifest file
      fs.mkdirSync(resolve(manifestFile, '..'), { recursive: true });
      fs.writeFileSync(
        manifestFile,
        JSON.stringify(assets, null, 2)
      );
    }
  };
}

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    hugoAssetsPlugin({
      manifestFile: resolve(__dirname, '../data/vite_assets.json')
    })
  ],
  build: {
    outDir: resolve(__dirname, '../static/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'js/main.js')
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(css)$/i.test(extType)) {
            return 'css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  }
});