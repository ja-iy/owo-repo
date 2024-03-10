"use client"

// copied from bellow as package cause conflicts in monorepo 
// https://github.com/sanity-io/sanity-studio-secrets

import { useSecrets } from './use-secrets'
import type { SettingsViewProps } from './settings'
import { SettingsView } from './settings'

export { useSecrets, SettingsView, type SettingsViewProps }