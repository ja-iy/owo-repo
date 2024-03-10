type CspTagValue = 
    `'${string}'` |
    `${string}:` |
    `${string}://${string}` 

export type CspConfigInput = {
    'default-src'?: CspTagValue[] | undefined;
    'img-src'?: CspTagValue[] | undefined;
    'script-src'?: CspTagValue[] | undefined;
    'font-src'?: CspTagValue[] | undefined;
    'style-src'?: CspTagValue[] | undefined;
    'connect-src'?: CspTagValue[] | undefined;
    'frame-src'?: CspTagValue[] | undefined;
    'media-src'?: CspTagValue[] | undefined;
    'object-src'?: CspTagValue[] | undefined;
    'frame-ancestors'?: CspTagValue[] | undefined;
    'base-uri'?: CspTagValue[] | undefined;
    'manifest-src'?: CspTagValue[] | undefined;
    'worker-src'?: CspTagValue[] | undefined;
    'form-action'?: CspTagValue[] | undefined;
    'child-src'?: CspTagValue[] | undefined;
}

export type CspConfig = {
    [Key in keyof CspConfigInput]: ReturnType<typeof initSet>
}


export type CspTagSetOptions = {
    shared: CspConfigInput;
    dev: CspConfigInput;
    prod: CspConfigInput;
    scriptSrcHashes?: (CspTagValue[]) | undefined;
}


function initSet(arrs: (CspTagValue[] | undefined)[]): Set<string> | undefined {
    const elems = arrs.flat().filter(Boolean)
    return elems.length ? new Set(elems) : undefined
}


export class CspTagSet {

    shared: CspConfig | undefined;
    dev: CspConfig | undefined;
    prod: CspConfig | undefined;
    scriptSrcHashes?: Set<string> | undefined;

    // manually describes object properties to allow for diffrent future configurations
    constructor ({ shared, dev, prod, scriptSrcHashes }: CspTagSetOptions) {
        this.shared = shared ? {
            "default-src": initSet([shared["default-src"]]),
            "img-src": initSet([shared["img-src"]]),
            "script-src": initSet([shared["script-src"]]),
            "font-src": initSet([shared["font-src"]]),
            "style-src": initSet([shared["style-src"]]),
            "connect-src": initSet([shared["connect-src"]]),
            "frame-src": initSet([shared["frame-src"]]),
            "media-src": initSet([shared["media-src"]]),
            "object-src": initSet([shared["object-src"]]),
            "frame-ancestors": initSet([shared["frame-ancestors"]]),
            "base-uri": initSet([shared["base-uri"]]),
            "manifest-src": initSet([shared["manifest-src"]]),
            "worker-src": initSet([shared["worker-src"]]),
            "form-action": initSet([shared["form-action"]]),
            "child-src": initSet([shared["child-src"]]),
        } : undefined
        this.dev = {
            "default-src": initSet([shared["default-src"], dev["default-src"]]),
            "img-src": initSet([shared["img-src"], dev["img-src"]]),
            "script-src": initSet([shared["script-src"], dev["script-src"]]),
            "font-src": initSet([shared["font-src"], dev["font-src"]]),
            "style-src": initSet([shared["style-src"], dev["style-src"]]),
            "connect-src": initSet([shared["connect-src"], dev["connect-src"]]),
            "frame-src": initSet([shared["frame-src"], dev["frame-src"]]),
            "media-src": initSet([shared["media-src"], dev["media-src"]]),
            "object-src": initSet([shared["object-src"], dev["object-src"]]),
            "frame-ancestors": initSet([shared["frame-ancestors"], dev["frame-ancestors"]]),
            "base-uri": initSet([shared["base-uri"], dev["base-uri"]]),
            "manifest-src": initSet([shared["manifest-src"], dev["manifest-src"]]),
            "worker-src": initSet([shared["worker-src"], dev["worker-src"]]),
            "form-action": initSet([shared["form-action"], dev["form-action"]]),
            "child-src": initSet([shared["child-src"], dev["child-src"]]),
        }
        this.prod = {
            "default-src": initSet([shared["default-src"], prod["default-src"]]),
            "img-src": initSet([shared["img-src"], prod["img-src"]]),
            "script-src": initSet([shared["script-src"], prod["script-src"]]),
            "font-src": initSet([shared["font-src"], prod["font-src"]]),
            "style-src": initSet([shared["style-src"], prod["style-src"]]),
            "connect-src": initSet([shared["connect-src"], prod["connect-src"]]),
            "frame-src": initSet([shared["frame-src"], prod["frame-src"]]),
            "media-src": initSet([shared["media-src"], prod["media-src"]]),
            "object-src": initSet([shared["object-src"], prod["object-src"]]),
            "frame-ancestors": initSet([shared["frame-ancestors"], prod["frame-ancestors"]]),
            "base-uri": initSet([shared["base-uri"], prod["base-uri"]]),
            "manifest-src": initSet([shared["manifest-src"], prod["manifest-src"]]),
            "worker-src": initSet([shared["worker-src"], prod["worker-src"]]),
            "form-action": initSet([shared["form-action"], prod["form-action"]]),
            "child-src": initSet([shared["child-src"], prod["child-src"]]),
        }
        this.scriptSrcHashes = new Set(scriptSrcHashes)
    }
}

// manually describes object properties to allow for diffrent future configurations

export function mergeCspTagSets(cspTagSets: CspTagSet[]) {

    const devCsp = {
        "default-src": new Set(),
        "img-src": new Set(),
        "script-src": new Set(),
        "font-src": new Set(),
        "style-src": new Set(),
        "connect-src": new Set(),
        "frame-src": new Set(),
        "media-src": new Set(),
        "object-src": new Set(),
        "frame-ancestors": new Set(),
        "base-uri": new Set(),
        "manifest-src": new Set(),
        "worker-src": new Set(),
        "form-action": new Set(),
        "child-src": new Set(),
    }

    const prodCsp = {
        "default-src": new Set(),
        "img-src": new Set(),
        "script-src": new Set(),
        "font-src": new Set(),
        "style-src": new Set(),
        "connect-src": new Set(),
        "frame-src": new Set(),
        "media-src": new Set(),
        "object-src": new Set(),
        "frame-ancestors": new Set(),
        "base-uri": new Set(),
        "manifest-src": new Set(),
        "worker-src": new Set(),
        "form-action": new Set(),
        "child-src": new Set(),
    }

    const cspScriptSrcHashes = new Set()

    // Merge all CspTagSets into a single object
    cspTagSets.forEach((cspTagSet) => {

        // Merge dev policies
        for (const directive in cspTagSet.dev) {
            // @ts-ignore
            const directiveSet = cspTagSet.dev[directive]
            // @ts-ignore
            if (directiveSet) { for (const source of directiveSet) { devCsp[directive].add(source) } }
        }

        // Merge prod policies
        for (const directive in cspTagSet.prod) {
            // @ts-ignore
            const directiveSet = cspTagSet.prod[directive]
            // @ts-ignore
            if (directiveSet) { for (const source of directiveSet) { prodCsp[directive].add(source) } }
        }

        // Merge scriptSrcHashes
        if (cspTagSet.scriptSrcHashes) {
            for (const hash of cspTagSet.scriptSrcHashes) { cspScriptSrcHashes.add(hash) }
        }

    })

    const devCspStrings = {
        "default-src": devCsp["default-src"].size ? [...devCsp["default-src"]].join(' ') : '',
        "img-src": devCsp["img-src"].size ? [...devCsp["img-src"]].join(' ') : '',
        "script-src": devCsp["script-src"].size ? [...devCsp["script-src"]].join(' ') : '',
        "font-src": devCsp["font-src"].size ? [...devCsp["font-src"]].join(' ') : '',
        "style-src": devCsp["style-src"].size ? [...devCsp["style-src"]].join(' ') : '',
        "connect-src": devCsp["connect-src"].size ? [...devCsp["connect-src"]].join(' ') : '',
        "frame-src": devCsp["frame-src"].size ? [...devCsp["frame-src"]].join(' ') : '',
        "media-src": devCsp["media-src"].size ? [...devCsp["media-src"]].join(' ') : '',
        "object-src": devCsp["object-src"].size ? [...devCsp["object-src"]].join(' ') : '',
        "frame-ancestors": devCsp["frame-ancestors"].size ? [...devCsp["frame-ancestors"]].join(' ') : '',
        "base-uri": devCsp["base-uri"].size ? [...devCsp["base-uri"]].join(' ') : "",
        "manifest-src": devCsp["manifest-src"].size ? [...devCsp["manifest-src"]].join(' ') : "",
        "worker-src": devCsp["worker-src"].size ? [...devCsp["worker-src"]].join(' ') : "",
        "form-action": devCsp["form-action"].size ? [...devCsp["form-action"]].join(' ') : "",
        "child-src": devCsp["child-src"].size ? [...devCsp["child-src"]].join(' ') : "",
    }

    const prodCspStrings = {
        "default-src": prodCsp["default-src"].size ? [...prodCsp["default-src"]].join(' ') : '',
        "img-src": prodCsp["img-src"].size ? [...prodCsp["img-src"]].join(' ') : '',
        "script-src": prodCsp["script-src"].size ? [...prodCsp["script-src"]].join(' ') : '',
        "font-src": prodCsp["font-src"].size ? [...prodCsp["font-src"]].join(' ') : '',
        "style-src": prodCsp["style-src"].size ? [...prodCsp["style-src"]].join(' ') : '',
        "connect-src": prodCsp["connect-src"].size ? [...prodCsp["connect-src"]].join(' ') : '',
        "frame-src": prodCsp["frame-src"].size ? [...prodCsp["frame-src"]].join(' ') : '',
        "media-src": prodCsp["media-src"].size ? [...prodCsp["media-src"]].join(' ') : '',
        "object-src": prodCsp["object-src"].size ? [...prodCsp["object-src"]].join(' ') : '',
        "frame-ancestors": prodCsp["frame-ancestors"].size ? [...prodCsp["frame-ancestors"]].join(' ') : '',
        "base-uri": prodCsp["base-uri"].size ? [...prodCsp["base-uri"]].join(' ') : "",
        "manifest-src": prodCsp["manifest-src"].size ? [...prodCsp["manifest-src"]].join(' ') : "",
        "worker-src": prodCsp["worker-src"].size ? [...prodCsp["worker-src"]].join(' ') : "",
        "form-action": prodCsp["form-action"].size ? [...prodCsp["form-action"]].join(' ') : "",
        "child-src": prodCsp["child-src"].size ? [...prodCsp["child-src"]].join(' ') : "",
    }

    const cspScriptSrcHashesString = [...cspScriptSrcHashes].join(' ')

    const devCspScriptSrcHashesString = !(
        devCsp["script-src"].has("'unsafe-eval'") ||
        devCsp["script-src"].has("'unsafe-inline'")
    ) ? cspScriptSrcHashesString : ''

    const prodCspScriptSrcHashesString = !(
        prodCsp["script-src"].has("'unsafe-eval'") ||
        prodCsp["script-src"].has("'unsafe-inline'")
    ) ? cspScriptSrcHashesString : ''

    const devCspString = [
        `default-src 'self' ${ devCspStrings["default-src"] } ;`,
        `img-src 'self' ${ devCspStrings["img-src"] } ;`,
        `script-src 'self' ${ devCspStrings["script-src"] } ${ devCspScriptSrcHashesString } ;`,
        `font-src 'self' ${ devCspStrings["font-src"] } ;`,
        `style-src 'self' ${ devCspStrings["style-src"] } ;`,
        `connect-src 'self' ${ devCspStrings["connect-src"] } ;`,
        `frame-src 'self' ${ devCspStrings["frame-src"] } ;`,
        `media-src 'self' ${ devCspStrings["media-src"] } ;`,
        `object-src 'self' ${ devCspStrings["object-src"] } ;`,
        `frame-ancestors 'self' ${ devCspStrings["frame-ancestors"] } ;`,
        `base-uri 'self' ${ devCspStrings["base-uri"] } ;`,
        `manifest-src 'self' ${ devCspStrings["manifest-src"] } ;`,
        `worker-src 'self' ${ devCspStrings["worker-src"] } ;`,
        `form-action 'self' ${ devCspStrings["form-action"] } ;`,
        `child-src 'self' ${ devCspStrings["child-src"] } ;`,
    ].join(' ')

    const prodCspString = [
        `default-src 'self' ${ prodCspStrings["default-src"] } ;`,
        `img-src 'self' ${ prodCspStrings["img-src"] } ;`,
        // `script-src 'self' ${prodCspStrings["script-src"]} ${prodCspScriptSrcHashesString} ;`,
        `font-src 'self' ${ prodCspStrings["font-src"] } ;`,
        `style-src 'self' ${ prodCspStrings["style-src"] } ;`,
        `connect-src 'self' ${ prodCspStrings["connect-src"] } ;`,
        `frame-src 'self' ${ prodCspStrings["frame-src"] } ;`,
        `media-src 'self' ${ prodCspStrings["media-src"] } ;`,
        `object-src 'self' ${ prodCspStrings["object-src"] } ;`,
        `frame-ancestors 'self' ${ prodCspStrings["frame-ancestors"] } ;`,
        `base-uri 'self' ${ prodCspStrings["base-uri"] } ;`,
        `manifest-src 'self' ${ prodCspStrings["manifest-src"] } ;`,
        `worker-src 'self' ${ prodCspStrings["worker-src"] } ;`,
        `form-action 'self' ${ prodCspStrings["form-action"] } ;`,
        `child-src 'self' ${ prodCspStrings["child-src"] } ;`,
    ].join(' ')

    // console.log(
    //     'DEV CSP: \n',devCspString, '\n\n',
    //     'PROD CSP: \n',prodCspString, '\n\n',
    // )

    // console.log("CSP TAG SET MERGER: SHOULD NOT APPEAR AFTER BUILDING APPLICATION")

    return {
        dev: (nounces?:string|undefined) => devCspString.replace(/\s{2,}/g, " ").trim(),
        prod: (nounces?:string|undefined) => (
            prodCspString.replace(/\s{2,}/g, " ").trim()
            + ' '
            + `script-src 'self' ${ nounces } ${ prodCspStrings["script-src"] } ${ prodCspScriptSrcHashesString } ;`.replace(/\s{2,}/g, " ").trim()
        ),
    }

}


// [
//     `default-src 'self'`,
//     `img-src 'self' blob: data: ${image_urls.join(' ')}   `,
//     `script-src 'self' https://www.google.com https://www.gstatic.com/recaptcha/ ${scriptSrcHashes['script-src']} `,
//     `font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com/ `,
//     `style-src 'unsafe-inline' 'self' `,
//     `connect-src 'self' ${process.env.VERCEL_URL} https://www.google.com  ${image_urls.join(' ')} ${connect_urls.join(' ')} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com  `,
//     `frame-src 'self' https://www.google.com `,
// ].join(' ')


