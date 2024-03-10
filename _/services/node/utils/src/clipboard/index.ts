import clipboardy from 'clipboardy'

export const clipboard = {

    writeSync: clipboardy.writeSync.bind(clipboardy),
    writeAsync: clipboardy.write.bind(clipboardy),

    readSync: clipboardy.readSync.bind(clipboardy),
    readAsync: clipboardy.read.bind(clipboardy),
    
}