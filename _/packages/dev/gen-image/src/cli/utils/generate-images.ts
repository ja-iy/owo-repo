import { generate_optimized_image_files } from "@/cli/utils/optimize/generate-optimized-image-files"
import { generate_image_file } from "@/cli/utils/ts-file/generate_ts_image_file"

import { findWorkspaceDir  } from "@repo/workspace-utils"
import { findNamedWorkspacePackages } from "@repo/workspace-utils"

import type { GenerateImages } from "@/config"
import type {ProjectWithName} from "@repo/workspace-utils";

import { generate_source_files } from "@/cli/utils/source/generate-source-files"

export async function generateImages(input:{
    sourcePackage: ProjectWithName,
    configs: GenerateImages['configs'],
    rootDirectory?: string,
    packages?: ProjectWithName[],
}) {
    try {

        const rootDirectory = input.rootDirectory ?? await findWorkspaceDir(process.cwd())
        const packages = input.packages ?? await findNamedWorkspacePackages({ rootDirectory })

        const sourcePackage = input.sourcePackage

        for (const outputPackageName in input.configs) {

            console.log(`... STARTED GENERATING IMAGES for ${outputPackageName}\n`)

            const config = input.configs[outputPackageName]!
            const outputPackage = packages.find(pkg => pkg.manifest.name === outputPackageName)
            if (!outputPackage) throw new Error(`Output package not found: ${ outputPackageName }`)
            await generate_optimized_image_files({sourcePackage, outputPackage, config}) //IMPRVOMENT: files with the exact same path but diffrent extensions will get overwritten to the last processed image
            await generate_source_files({sourcePackage, outputPackage, config})
            await generate_image_file({sourcePackage, outputPackage, config})
        }

        console.log(`\n ✅ FINISHED GENERATING IMAGES \n\n`)
    } catch (error) {
        console.error('\n ❌ ERROR GENERATING IMAGES:', error)
    }
}

