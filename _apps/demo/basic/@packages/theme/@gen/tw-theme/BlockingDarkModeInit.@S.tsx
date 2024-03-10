export function BlockingDarkModeInit() {
	return (
		<head>
			<script
				dangerouslySetInnerHTML={{
					__html: `
                try {
                                            
                    const overrideInitialUserPrefrence = 'dark'
                    const darkModeLocalStorageKey = 'dark-mode'
                    const darkModeClassName = 'dark'
            
                    const storedDarkMode = localStorage.getItem(darkModeLocalStorageKey)
                    const initialUserPrefrenceIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            
                    let darkMode
                    if (storedDarkMode === 'true')  { darkMode = true }
                    else if (storedDarkMode === 'false') { darkMode = false }
                    else {
                        darkMode = overrideInitialUserPrefrence 
                            ? overrideInitialUserPrefrence === 'dark' ? true : false
                            : initialUserPrefrenceIsDark
                    }
            
                    localStorage.setItem(darkModeLocalStorageKey, darkMode ? 'true' : 'false')
                                
                    if (darkMode)  document.documentElement.classList.add(darkModeClassName)
                    else document.documentElement.classList.remove(darkModeClassName)
                                    
                } catch (e) { console.log(e) }
            `,
				}}
			/>
		</head>
	)
}
