"use client"

import { defineField } from 'sanity'
import { lsn } from '../../names'
import type { ReferenceFilterResolverContext, ArrayRule,  IntrinsicTypeName, DefineSchemaBase, NarrowPreview, MaybeAllowUnknownProps, DefineSchemaOptions, WidenValidation, WidenInitialValue, IntrinsicDefinitions, FieldDefinitionBase, StrictDefinition, StringDefinition, StringRule, ValidationBuilder } from 'sanity'


export function SSSH_uniqueReferenceArray<
    TRefName extends string,
    TName extends string,
    TSelect extends Record<string, string> | undefined,
    TPrepareValue extends Record<keyof TSelect, any> | undefined,
>(
    ref: { ref: TRefName  },
    schemaField: Omit<
        { name: TName } &
        DefineSchemaBase<'array', 'array'>   &
        NarrowPreview<'array', 'array', TSelect, TPrepareValue> &
        MaybeAllowUnknownProps<true> &
        FieldDefinitionBase
    , 'type'|'of'>,
    defineOptions?: DefineSchemaOptions<true, 'array'>
){
    return defineField({
        ...schemaField,

        type: lsn['array'],

        of: [{ 

            type: lsn['reference'], 
            to: { type: ref.ref }, 

            options:{

                filter: ({document}:ReferenceFilterResolverContext) => {

                    const existingRefs 
                        = (document?.[schemaField.name] as {_ref:string}[]|undefined)
                            ?.map((item)=>item._ref)
                            ?.filter(Boolean)

                    if (!existingRefs) return {
                        filter: ''
                    }

                    return {
                        filter: '!(_id in $existingRefs) && !(_id in path("drafts.**"))',
                        params: {
                            existingRefs
                        }
                    }
                }

            } 
        }],

        validation: ( (Rule:ArrayRule<unknown[]>) => schemaField.validation 
            ? [  Rule.unique(), schemaField.validation(Rule) ] 
            : [  Rule.unique() ] 
        ) as ValidationBuilder<ArrayRule<unknown[]>, unknown[]> & false,
    })
}