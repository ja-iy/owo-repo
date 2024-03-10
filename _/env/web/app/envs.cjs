/** @type {import('@repo/ts-env/next')} */
const { createDynamicEnv, ENV_SCHEMA_HELPERS: h,  } = require('@repo/ts-env/next')


module.exports.ENV_DYNAMIC__nextApp = createDynamicEnv({

    NEXT_PUBLIC_MODE:                   [ 'client', h.str.enum.required(["production", "development", "local-dev", "local-prod"]) ],
    NEXT_PUBLIC_PRODUCTION_DOMAIN:      [ 'client', h.str.required ],
    
})
