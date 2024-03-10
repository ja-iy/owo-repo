import { z } from "zod"

const stringToBooleanSchema = z.enum(["true", "false"]).transform(v => {
    if (v === "true") return true
    else if (v === "false") return false
    else throw new Error("Invalid boolean ENV value")
})

const required_string_env = z.string().min(1)
const optional_string_env = z.string().optional()
const required_boolean_env = stringToBooleanSchema
const optional_boolean_env = stringToBooleanSchema.optional()
const required_number_env = z.number({coerce: true})
const optional_number_env = z.number({coerce: true}).optional()
const required_string_enum_env = <const T extends readonly [string, ...string[]]>(values: T) => z.enum(values)
const optional_string_enum_env = <const T extends readonly [string, ...string[]]>(values: T) => z.enum(values).optional()

export const ENV_SCHEMA_HELPERS  = {
    str: {
        enum:{
            required: required_string_enum_env,
            optional: optional_string_enum_env
        },
        required: required_string_env,
        optional: optional_string_env
    },
    bool: {
        required: required_boolean_env,
        optional: optional_boolean_env
    },
    num: {
        required: required_number_env,
        optional: optional_number_env
    },

}