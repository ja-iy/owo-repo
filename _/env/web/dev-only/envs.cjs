/** @type {import('@repo/ts-env/next')} */
const { createDynamicEnv, ENV_SCHEMA_HELPERS: h,  } = require('@repo/ts-env/next')


module.exports.ENV_DYNAMIC__devOnly = createDynamicEnv({

    NEXT_PUBLIC_DEV_MODE_NO_BUILD_METADATA:     [ 'client', h.bool.optional ],
    NEXT_PUBLIC_NGROK_ENABLED:                  [ 'client', h.bool.optional ],
    NEXT_PUBLIC_NGROK_URL:                      [ 'client', h.str.optional ]

})



