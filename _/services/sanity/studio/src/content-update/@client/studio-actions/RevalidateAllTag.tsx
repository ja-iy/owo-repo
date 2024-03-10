"use client"

//packages
import { useMemo, useState, useEffect } from "react"
import { useCurrentUser, type DocumentActionComponent } from 'sanity'
import { useSecrets, SettingsView } from "../../../plugins/studio-secrets/@client"
import { useToast } from '@sanity/ui'

import { sanityStudioContentUpdateApi } from "../../api/sanity-content-update-api"
import { SANITY_STUDIO_CONTENT_UPDATE_CONFIG, type SanityStudioSecrets_ContentUpdate } from "../../config"

import { SunsetIcon } from "lucide-react"

const { namespace } = SANITY_STUDIO_CONTENT_UPDATE_CONFIG

const actionText = `Update Site`
const actionMessage = `This action should be done when you have finished editing and want to update the site. \n\n Proceed?`
const pendingMessage = `Please Wait: Updating Site...`
const specificErrors = {
    'default': {
        message: `Site Update Failed: Something went wrong. Please try again.`,
        actionText: `Try Again`
    },
    'missing-token': {
        message: `Site Update Failed: Missing Api Token. Please ask an admin to set the signing key.`,
        adminMessage: `Site Update Failed: Missing Api Token. Please set one using the "Set Secrets" action found above this one.`,
        actionText: `Try Again`
    },
    'invalid-token': { 
        message: `Site Update Failed: Invalid Api Token. Please ask an admin to set the signing key.`,
        adminMessage: `Site Update Failed: Invalid Api Token. Please set one using the "Set Secrets" action found above this one.`,
        actionText: `Try Again`
    },
} as const

type RevalidateActionProps = Parameters<DocumentActionComponent>[0]
export function SSA_RevalidateAllTag(props: RevalidateActionProps): ReturnType<DocumentActionComponent> {

    const {} = props

    const currentUser = useCurrentUser()
    const isAdmin = currentUser?.roles.map(role => role.name).includes("administrator")
    const { secrets } = useSecrets<SanityStudioSecrets_ContentUpdate>(namespace)

    const [status, setStatus] = useState<"pending"|"success"|"error"|null>(null)
    const [specificError, setSpecificError] = useState<keyof typeof specificErrors | null>(null)
    const [isDialogOpen, setDialogOpen] = useState(false)

    const { push:notify } = useToast()

    const confirmButtonText = useMemo( () => {
        switch(status) {
            case null: return actionText
            case "pending": return actionText
            case "success": return actionText
            case "error": {
                switch (specificError) {
                    case "missing-token": return specificErrors[specificError].actionText
                    case "invalid-token": return specificErrors[specificError].actionText
                    default: return specificErrors.default.actionText
                }
            }
            default: return actionText
        }
    }, [status, specificError])

    const message = useMemo( () => { 
        switch(status) {
            case null: return actionMessage
            case "pending": return pendingMessage
            case "success": return `Site updated successfully!`
            case "error": {
                switch (specificError) {
                    case "missing-token": return isAdmin ? specificErrors[specificError].adminMessage : specificErrors[specificError].message
                    case "invalid-token": return isAdmin ? specificErrors[specificError].adminMessage : specificErrors[specificError].message
                    default: return specificErrors.default.message
                }
            }
            default: return actionMessage
        }
    }, [status, specificError, isAdmin])


    return {
        label: status === "pending" ? 'Updating Site...' : actionText,
        icon: SunsetIcon,
        tone: "positive",
        disabled: status === "pending",
        
        onHandle: () => {
            setStatus(null)
            setSpecificError(null)
            setDialogOpen(true)
        },

        dialog: isDialogOpen && {

            type: "confirm",
            message: <p>{message}</p>,
            confirmButtonText: confirmButtonText,
            tone: "primary",


            onConfirm: async () => {
                try {
                    setDialogOpen(false)
                    setStatus("pending")
                    notify({ title: "PENDING: Updating Site", duration:3000, status: "warning", closable: true, })

                    if (!secrets) throw new Error("missing-token")
                    if (!currentUser) throw new Error("default")

                    let res = await sanityStudioContentUpdateApi["revalidate-tag"](
                        { tag: "all" }, 
                        { authToken: secrets.contentUpdateApiToken }
                    )

                    //sleep for 2 seconds
                    await new Promise(resolve => setTimeout(resolve, 2000))

                    res = await sanityStudioContentUpdateApi["revalidate-tag"](
                        { tag: "all" }, 
                        { authToken: secrets.contentUpdateApiToken }
                    )

                    if (!res.success){
                        switch (res.knownError) {
                            case "missing-auth-token": throw new Error("missing-token")
                            case "invalid-auth-token": throw new Error("invalid-token")
                        }

                        if (res.error){ throw new Error(res.error) }

                        throw new Error("default")
                    }

                    console.log(res)


                    notify({ title: "SUCCESS: Updated Site", duration:3000, status: "success", closable: true, })
                    setStatus("success")
                    props.onComplete()
                } 
                catch (error) {
                    if (
                        error instanceof Error ||
                        (typeof error === 'object' && error && 'message' in error)
                    ) {
                        switch (error.message){
                            case "missing-token": {
                                setSpecificError("missing-token")
                                setStatus("error")
                                setDialogOpen(true)
                                return
                            }
                            case "invalid-token": { 
                                setSpecificError("invalid-token")
                                setStatus("error")
                                setDialogOpen(true)
                                return
                            }
                        }
                    }

                    setSpecificError("default")
                    setStatus("error")
                    setDialogOpen(true)
                } 
                finally {
                    // Signal that the action is completed
                    // props.onComplete()
                }
            },

            onCancel: () => {
                // Signal that the action has been closed

                if (status === "pending") notify({ title: "CANCELLED: Updating Site", duration:3000, status: "error", closable: true, })

                setStatus(null)
                setSpecificError(null)
                setDialogOpen(false)
            },

        },
    }
}
