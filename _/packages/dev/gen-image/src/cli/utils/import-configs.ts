import fs from 'fs-extra'
import { GEN_IMAGE__CONFIG_FILE_PATHS } from '@/vars'

import type { ProjectWithName } from '@repo/workspace-utils'
import { isGenImageConfigs } from '@/config/typeguards'

export async function importConfigs(pkg: ProjectWithName) {

    for (const configPath of GEN_IMAGE__CONFIG_FILE_PATHS) {

        const configFilePath = `${ pkg.dir }${ configPath }`.replace('/', '\\')


        if (fs.existsSync(configFilePath)) {
            const configsImport = (await import('file://' + configFilePath)).default
            if (isGenImageConfigs(configsImport)) return configsImport
            throw new Error(`Invalid config file: ${ configFilePath }`)
        }
    }

    throw new Error(`No config file found in ${ pkg.manifest.name }`)
}
