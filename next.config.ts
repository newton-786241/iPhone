import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  
};

module.exports = {
  webpack: (config: { module: { rules: { test: RegExp; use: { loader: string; options: { publicPath: string; outputPath: string; name: string; }; }[]; }[]; }; }) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv|flv)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/videos/',
            outputPath: 'static/videos/',
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
