const path = require('path');

module.exports = {
  // Entry point - core.js imports everything else
  entry: './src/core.js',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'script.js',
    clean: false // Don't clean - preserve other files in root
  },
  
  // Production mode for minification and optimization
  mode: 'production',
  
  // No need for source maps in production
  devtool: false,
  
  // Module resolution
  resolve: {
    extensions: ['.js']
  },
  
  // No special loaders needed - just vanilla JS
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // No babel needed - modern browsers support ES6+
      }
    ]
  },
  
  // No external dependencies to exclude
  externals: {},
  
  // Optimization settings
  optimization: {
    minimize: true // Minify for smaller output
  },

  // Docker/devcontainer file watching fix - use longer polling for better performance
  watchOptions: {
    poll: 3000, // Poll every 3 seconds (less aggressive)
    aggregateTimeout: 600,
    ignored: /node_modules/
  },

  // Development server configuration
  devServer: {
    static: {
      directory: path.resolve(__dirname, '.'),
      watch: false // Disable static file watching to improve performance
    },
    port: 5555,
    open: false, // Don't auto-open browser in codespace
    hot: false, // Disable HMR - it's interfering with static assets
    liveReload: true, // Keep live reload but disable HMR
    watchFiles: ['src/**/*.js'], // Only watch JS files, not HTML/assets
    client: {
      logging: 'warn' // Reduce logging noise
    },
    compress: false, // Disable compression for faster dev builds
    historyApiFallback: false // We don't need SPA routing
  }
};