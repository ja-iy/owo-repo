/** @type {import('@repo/ts-env/next')} */
const { createDynamicEnv, ENV_SCHEMA_HELPERS: h,  } = require('@repo/ts-env/next')


module.exports.ENV_DYNAMIC__grecaptchaV3 = createDynamicEnv({

    RECAPTCHA_SECRET_KEY:               [ 'server', h.str.required ],

})
