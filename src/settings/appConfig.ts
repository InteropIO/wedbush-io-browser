const mode = import.meta.env.VITE_APP_ENV_MODE
// make sure you add "VITE_APP_ENV_MODE=development" in .env.local while running app locally

const localConfig = {
  envName: import.meta.env.VITE_APP_ENV_NAME,
  appName: import.meta.env.VITE_APP_APP_NAME,
  appDomain: import.meta.env.VITE_APP_APP_DOMAIN,
  apiConnectLicense: import.meta.env.VITE_APP_API_IOCONNECT_BROWSER_LICENSE
}

const serverConfig = {
  envName: 'AIWWORKSPACE_ENVNAME',
  appName: 'AIWWORKSPACE_APPNAME',
  appDomain: 'AIWWORKSPACE_APPDOMAIN',
  apiConnectLicense: 'AIWWORKSPACE_API_IOCONNECT_BROWSER_LICENSE'
}

const appConfig = mode === 'development' ? localConfig : serverConfig
console.log(appConfig)

export default appConfig