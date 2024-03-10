import { defineField } from 'sanity'
import { lsn } from '../../../names'
import { LinkIcon } from '@sanity/icons'

export const CONTENT_OBJECT_link = defineField({

    name: lsn['link'],
    type: lsn['object'],
    title: 'Link',

    icon: LinkIcon,

    fields: [
        {
            title: 'URL',
            name: 'href',
            type: lsn['string'],
            options: {
                allowRelative: true
            },
            validation: (Rule) => [
                Rule.uri({
                    // relativeOnly: true,
                    allowRelative: true,
                    scheme: ['https', 'http', 'mailto', 'tel']
                }),
                Rule.required()
            ]
        },
        {
            title: 'Open in new tab',
            name: 'blank',
            type: lsn['boolean'],
            initialValue: true,
            validation: (Rule) => Rule.required(),
        },
    ]
})

