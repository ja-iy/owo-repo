import { buildGenerateImagesConfig } from "@repo/gen-image/config"

export default buildGenerateImagesConfig(item => ({

    "@demo/basic": item({

        type: 'next',
        fileMatcher: ['jpg', 'jpeg', 'png', 'webp',],
        optimize: ['.jpeg'],
        generateSourceFilesIfMissing: false,

        sourceBasePath: '/@assets/images/source',
        // sourceBasePath: '/public/images/source',

        optimizeBasePath: '/public/gen/images/optimized',
    })
}))