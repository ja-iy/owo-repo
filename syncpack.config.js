// https://jamiemason.github.io/syncpack/config/syncpackrc/

/** @type {import("syncpack").RcFile} */
const config = {

    filter: ".",

    indent: "    ",

    sortFirst: [
        "name",
        "private",
        "description",
        "type",
        "version",
        "author",
        "license",
        "bin",
        "scripts",
        "exports",
        "dependencies",
        "peerDependencies",
        "devDependencies",
    ],

    sortAz: [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
        "keywords",
        "resolutions",
    ],

    versionGroups: [

        {
            label: "Ignore local packages",
            packages: ['**'],
            dependencies: ["$LOCAL"],
            dependencyTypes: [
                "dev",
                "local",
                "overrides",
                "peer",
                "pnpmOverrides",
                "prod",
                "resolutions",
            ],
            isIgnored: true,
        }

    ],
}

module.exports = config
