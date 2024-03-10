/** @type {import('@repo/ts-env/next')} */
const { createDynamicEnv, ENV_SCHEMA_HELPERS: h,  } = require('@repo/ts-env/next')


module.exports.ENV_DYNAMIC__vercel = createDynamicEnv({

    VERCEL_REIGON:                  [ 'shared', h.str.optional ],
    VERCEL_ENV:                     [ 'shared', h.str.enum.optional(["production", "preview", "development"]) ],
    VERCEL_URL:                     [ 'shared', h.str.optional ],

})

