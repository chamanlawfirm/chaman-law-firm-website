/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = 'eeuefmhu'
const dataset = 'production'
const appId = 'c445zlb4ey1j28muixjxe621'

export default defineCliConfig({
  api: {projectId, dataset},
  deployment: {appId},
})
