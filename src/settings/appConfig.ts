const mode = process.env.VITE_APP_ENV_MODE
// make sure you add "VITE_APP_ENV_MODE=development" in .env.local while running app locally

const localConfig = {
  envName: process.env.VITE_APP_ENV_NAME,
  appName: process.env.VITE_APP_APP_NAME,
  appDomain: process.env.VITE_APP_APP_DOMAIN,
  apiConnectLicense: process.env.VITE_APP_API_IOCONNECT_BROWSER_LICENSE
}

const serverConfig = {
  envName: 'AIWWORKSPACE_ENVNAME',
  appName: 'AIWWORKSPACE_APPNAME',
  appDomain: 'AIWWORKSPACE_APPDOMAIN',
  b2cDomain: 'AIWWORKSPACE_API_IOCONNECT_BROWSER_LICENSE'
}

const appConfig = mode === 'development' ? localConfig : serverConfig
console.log(appConfig)

export default appConfig