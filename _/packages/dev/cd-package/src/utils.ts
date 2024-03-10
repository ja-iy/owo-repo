import { execSync } from 'child_process'


export function openNewTerminal(input:{
    type: 'powershell.exe' | 'cmd.exe'
    name: string,
    cwd: string
}){
    execSync(`start ${input.type} -NoExit -Command "cd ${input.cwd}"`, { stdio: 'inherit' })
}
