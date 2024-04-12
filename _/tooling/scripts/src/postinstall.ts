import spawn from 'cross-spawn';

function main(){
    if (process.env.VERCEL){ return }

    const command = `pnpm sync-exports`
    const args: string[] = [] 

    console.log('generating exports')

    spawn(command, args, { 
        stdio: 'inherit',
    })
        .on('exit', function (exitCode: number | undefined, signal: string | number | undefined) {
            if (typeof exitCode === 'number') {
                process.exit(exitCode)
            } else {
                process.kill(process.pid, signal)
            }
        })
}


main()