import { defineField } from 'sanity'
import { lsn } from '../../../names'
import { LinkIcon } from '@sanity/icons'

export const CONTENT_OBJECT_urlSlug = defineField({

    name: lsn['urlSlug'],
    type: lsn['slug'],
    title: 'Link',
    description: 'A unique string for the page that will be used in the URL',

    icon: LinkIcon,

    options: {
        source: 'title',
        maxLength: 200,
    },

    validation: (Rule) => [
        Rule.required(),
        Rule.custom((slug) => { 
            if (!slug?.current) return true
            return slugRegex.test(slug.current) ? true : 'Only use lowercase letters, numbers, and hyphens' 
        }).error()
    ],
})

const slugRegex = /^[a-z0-9\-]*$/
