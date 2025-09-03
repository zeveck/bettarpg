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

  // Development server configuration
  devServer: {
    static: {
      directory: path.resolve(__dirname, '.')
    },
    port: 5555,
    open: false, // Don't auto-open browser in codespace
    hot: false, // Disable hot reload for this simple setup
    liveReload: true, // Enable live reload on file changes
    client: {
      logging: 'info' // Show more verbose output
    },
    compress: true, // Enable gzip compression
    historyApiFallback: false // We don't need SPA routing
  }
};