# Ferruccio Theme Build System

The contents of this folder are used to generate CSS and Javascript for the Ferruccio Hugo theme.

## Development

### Prerequisites

- Node.js v22+ (using nvm)
- npm v10+

### Setup

```bash
# Use the correct Node.js version
nvm use v22

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Build System

The build system now uses Vite (instead of Webpack) to:

1. Compile JavaScript files from `js/`
2. Process CSS files from `css/`
3. Generate asset hashes for cache busting
4. Create a manifest file at `../data/vite_assets.json` for Hugo to consume

## Tools

### PostCSS
PostCSS is used for CSS processing. We're using `postcss-import` which allows us to import CSS files directly from the node_modules folder, and `postcss-nesting` for nested CSS support.

### Tachyons
This theme uses the [Tachyons CSS Library](http://tachyons.io/). It's about 15kb gzipped, highly modular, and each class is atomic so you never have to worry about overwriting your styles.

## Hugo Integration

The theme uses the manifest file to load the compiled assets in the Hugo templates. See `layouts/partials/site-scripts.html` for implementation details.

## Migration from Webpack

This build system has been migrated from Webpack to Vite. The key changes are:

1. Switched from Webpack to Vite for faster builds and modern defaults
2. Updated PostCSS configuration to use modern plugins
3. Simplified asset pipeline
4. Improved development experience with hot module replacement