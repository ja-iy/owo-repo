import { defineType, defineArrayMember } from 'sanity'
import { lsn } from '../../../names'
import { CONTENT_OBJECT_link } from '../link/schema.@C'

export const CONTENT_OBJECT_richText = defineType({
    name: lsn['richText'],
    title: 'Content',
    type: lsn['array'],
    of: [
        
        {
            title: 'Block',
            type: lsn['block'],
            marks:{
                annotations: [
                    {
                        ...CONTENT_OBJECT_link,
                    },
                ],
            },
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Sub-Heading', value: 'h3' },
            ],
           
        },
        
    ],
})

