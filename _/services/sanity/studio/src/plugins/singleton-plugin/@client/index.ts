import { definePlugin } from 'sanity'


type SingletonPluginInput = {
    documentTypes: Set<string>,
    disallowedActions: Set<string>
}
export const singletonPlugin = definePlugin<SingletonPluginInput>((input: SingletonPluginInput) => {

    const { documentTypes, disallowedActions } = input

    const types = documentTypes

    return {
        
        name: 'singletonPlugin',

        document: {

            // Hide from new document options
            newDocumentOptions: (input, context) => {

                if (context.creationContext.type !== 'global') return input

                return input.filter((templateItem) => !types.has(templateItem.templateId))
            },

            // Remove specified actions on singleton documents
            actions: (input, context) => {

                if (!types.has(context.schemaType)) return input

                return input.filter(({ action }) => action && !disallowedActions.has(action))
            }
                
        }
    }
    
})
