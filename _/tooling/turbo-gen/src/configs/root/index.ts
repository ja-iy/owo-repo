import type { PlopTypes } from "@turbo/gen"

import { PLOP_GEN_PACKAGE__ts } from "@/configs/root/generators/packages/ts"

export function TURBO_GEN_root(plop: PlopTypes.NodePlopAPI): void {

    PLOP_GEN_PACKAGE__ts(plop)

}

