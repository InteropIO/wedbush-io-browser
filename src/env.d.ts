/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_IOCONNECT_BROWSER_LICENSE: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}