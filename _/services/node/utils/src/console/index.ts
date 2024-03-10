import picocolors from 'picocolors'
import cliSpinners from 'cli-spinners'
import cliProgress from 'cli-progress'
import ora from 'ora'
import type { Ora } from 'ora'


export const cc = picocolors
export type ConsoleColorOptions = Exclude<keyof typeof cc, 'createColors' | 'isColorSupported'>

export const spinners = cliSpinners

export const createSpinner = ora
export type Spinner = Ora

export const progress = cliProgress

