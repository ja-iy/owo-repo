import { buildGenerateImagesConfig } from "../src/config"

export const generateImagesConfig = buildGenerateImagesConfig(item => ({

    "@main/main-site": item({

        type: 'next',
        fileMatcher: [ 'jpg', 'jpeg', 'png', 'webp', ],
        optimize: [ '.jpeg' ] ,
        generateSourceFilesIfMissing: true,

        sourceBasePath: '/@assets/images/source',
        // sourceBasePath: '/public/images/source',

        optimizeBasePath: '/public/gen/images/optimized',
    })
}))