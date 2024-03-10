import type { SanityClient } from 'next-sanity'

type Doc = {
    _id: string
    _rev?: string
    _type: string
    incomingReferences?: Doc[]
}


export function SANITY_MIGRATION__changeDocumentName(input: {
    sanity: SanityClient,
    originalName: string,
    newName: string,
    singleton?: boolean
}) {

    const sanity = input.sanity
    const OLD_TYPE = input.originalName
    const NEW_TYPE = input.newName

    const fetchDocuments = () =>
        sanity.fetch(
            `*[_type == $oldType][0...10] {..., "incomingReferences": *[references(^._id)]{...}}`,
            { oldType: OLD_TYPE }
        )

    const buildMutations = (docs: Doc[]) => {
        const mutations: any = []

        docs.forEach((doc) => {
            console.log('ID', doc._id)
            // Updating an document _type field isn't allowed, we have to create a new and delete the old
            const newDocId = input.singleton ? NEW_TYPE : `${ doc._id }-migrated`
            const newDocument = { ...doc, ...{ _id: newDocId, _type: NEW_TYPE } }
            delete newDocument.incomingReferences
            delete newDocument._rev

            mutations.push({ create: newDocument })
            if (!doc.incomingReferences) {
                return
            }
            // Patch each of the incoming references
            doc.incomingReferences.forEach((referencingDocument) => {
                console.log('ref', referencingDocument._id)
                // ⚠️ We're assuming the field is named the same as the type!
                // There might be another structure involved, perhaps an array, that needs patching
                const updatedReference = {
                    [NEW_TYPE]: {
                        _ref: newDocId,
                        _type: 'reference',
                    },
                }
                mutations.push({
                    id: referencingDocument._id,
                    patch: {
                        set: updatedReference,
                        unset: [OLD_TYPE],
                        ifRevisionID: referencingDocument._rev,
                    },
                })
            })

            // Apply the delete mutation after references have been changed
            mutations.push({ delete: doc._id })
        })
        return mutations.filter(Boolean)
    }

    const createTransaction = (mutations: any) => {
        return mutations.reduce((tx: any, mutation: any) => {
            if (mutation.patch) {
                return tx.patch(mutation.id, mutation.patch)
            }
            if (mutation.delete) {
                return tx.delete(mutation.delete)
            }
            if (mutation.create) {
                return tx.createIfNotExists(mutation.create)
            }
        }, sanity.transaction())
    }

    const migrateNextBatch: any = async () => {
        const documents = await fetchDocuments()
        if (documents.length === 0) {
            console.log('No more documents to migrate!')
            return null
        }
        const mutations = buildMutations(documents)
        const transaction = createTransaction(mutations)
        await transaction.commit()
        return migrateNextBatch()
    }

    migrateNextBatch().catch((err: any) => {
        console.error(JSON.stringify(err, null, 2))
        process.exit(1)
    })
}