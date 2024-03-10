import fs from 'fs-extra'
import path from 'path'
import { FileActions } from '@repo/node-utils/file-actions'


const content = `
##| app

    NEXT_PUBLIC_MODE="local-dev"
    NEXT_PUBLIC_PRODUCTION_DOMAIN="your-app.vercel.app"

##|
`

export async function generate_env_file(input: {
    path: string,
    content: string
}) {

    await fs.ensureDir(path.dirname(input.path))

    const actions = new FileActions({
        createFile: true,
        createParent: false,
        overwriteIfExists: false,
    })

    actions.push({
        type: 'add',
        path: input.path + '/.env',
        content: input.content,
        noLog: true
    })

    await actions.execute({})

    return { success: true }

}


async function main() {

    try {

        const data = await generate_env_file({
            path: '_apps/demo/basic',
            content: content
        })

        console.log(`\n ✅ FINISHED GENERATING ENV FILE`)
    } catch (error) {
        // console.error('\n ❌ ERROR GENERATING ENV FILE:', error)
    }
}

main()