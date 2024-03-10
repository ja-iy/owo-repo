/** @type {import('@repo/ts-env/next')} */
const { createEnvTemplate, ENV_SCHEMA_HELPERS: h,  } = require('@repo/ts-env/next')


module.exports.ENV_TEMPLATE__sanity = createEnvTemplate({

    SANITY_CUSTOM_STUDIO_SECRETS_API_TOKEN:     [ 'server', h.str.required ],
    SANITY_PROJECT_ACCESS_TOKEN:                [ 'server', h.str.required ],

    NEXT_PUBLIC_SANITY_PROJECT_ID:              [ 'client', h.str.required ],
    NEXT_PUBLIC_SANITY_DATASET:                 [ 'client', h.str.required ],
    NEXT_PUBLIC_SANITY_API_VERSION:             [ 'client', h.str.required ],

})


