declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALOGLIA_KEY: string;
      NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: string;
      BUNDLR_PRIVATE_KEY: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

export {}
