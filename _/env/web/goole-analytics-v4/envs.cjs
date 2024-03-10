/** @type {import('@repo/ts-env/next')} */
const { createDynamicEnv, ENV_SCHEMA_HELPERS: h,  } = require('@repo/ts-env/next')


module.exports.ENV_DYNAMIC__googleAnalyticsV4 = createDynamicEnv({

    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:               [ 'client', h.str.required ],

})
