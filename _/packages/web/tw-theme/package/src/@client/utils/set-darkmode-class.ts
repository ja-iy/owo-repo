

export function setDarkmodeClass(darkMode: boolean, darkModeClassName?:string) {

    if (darkMode) globalThis?.window?.document.documentElement.classList.add(darkModeClassName ?? 'dark')
    else globalThis?.window?.document.documentElement.classList.remove(darkModeClassName ?? 'dark')
}