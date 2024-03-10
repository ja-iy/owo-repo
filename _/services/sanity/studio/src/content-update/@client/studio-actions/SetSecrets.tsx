"use client"

import { useMemo, useState, useEffect } from "react"
import { useCurrentUser, type DocumentActionComponent } from 'sanity'
import { useSecrets, SettingsView } from "../../../plugins/studio-secrets/@client"

import { KeyIcon } from "lucide-react"

import { SANITY_STUDIO_CONTENT_UPDATE_CONFIG, type SanityStudioSecrets_ContentUpdate } from "../../config"


const { namespace } = SANITY_STUDIO_CONTENT_UPDATE_CONFIG

type RevalidateActionProps = Parameters<DocumentActionComponent>[0]
export function SSA_SetContentUpdateSecrets(props: RevalidateActionProps): ReturnType<DocumentActionComponent> {

    const currentUser = useCurrentUser()
    const isAdmin = currentUser?.roles.map(role => role.name).includes("administrator")
    const { secrets } = useSecrets<SanityStudioSecrets_ContentUpdate>(namespace)

    const [status, setStatus] = useState("pending")
    const [isDialogOpen, setDialogOpen] = useState(false)

    const [showSettings, setShowSettings] = useState(false)

    const label = useMemo(() => {
        switch (status) {
            case "success": return "Updated"
            case "error": return "Something went wrong"
            default: return "Set Secrets"
        }
    }, [status])

    // useEffect(() => {
    //     if (!secrets) { setShowSettings(true) }
    // }, [secrets])

    // if (!showSettings) { return null } // only show if secrets are not set

    if (!isAdmin) { return null } // only show for admin users

    return {
        label,
        icon: KeyIcon,
        tone: status === "error" ? "critical" : "default",
        disabled: !isAdmin,
        
        onHandle: () => {
            setDialogOpen(true)
        },

        dialog: isDialogOpen && {

            // type: 'modal' as 'dialog', //TYPE ERROR IN SANITY TYPES so cast to dialog
            type: 'popover',


            content: isDialogOpen && <SettingsView

                title={"Set Config Keys"}
                namespace={namespace}

                keys={[
                    {
                        key: "contentUpdateApiToken",
                        title: "Content Update Token: ",
                    },
                ] satisfies { key: keyof SanityStudioSecrets_ContentUpdate; title: string }[]}

                onClose={() => {
                    setShowSettings(false);
                    setDialogOpen(false);
                }}

            />,

            onClose: () => {
                setShowSettings(false);
                setDialogOpen(false);
            }

        },
    }
}


