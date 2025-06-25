import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable global SCSS variables and mixins
  sassOptions: {
    additionalData: '@use "styles/variables.scss" as *;'
  }
};

export default nextConfig;
