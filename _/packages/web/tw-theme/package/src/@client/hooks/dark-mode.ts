import { themeLocalStroage } from '../state'


// darkmode
export const useDarkModeValue = themeLocalStroage['dark-mode'].useValue.bind(themeLocalStroage['dark-mode'])
export const useSetDarkMode = themeLocalStroage['dark-mode'].useSetValue.bind(themeLocalStroage['dark-mode'])
export const useDarkMode = themeLocalStroage['dark-mode'].useState.bind(themeLocalStroage['dark-mode'])