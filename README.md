# VARIANT 3D CUSTOMIZER
Variant 3D customizer for on-demand knit products. The manipulation of program happens on a web-canvas level, to be processed on the backend as machine language.

## Deployed with Netlify
Currently served on the temp url : https://illustrious-platypus-e9e7e5.netlify.app/

Any pushes to the main branch will kickoff an automatic build & deploy of the live site on the above url.

## Libraries

- [three.js](https://threejs.org/)
- [Konva](https://konvajs.org/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [image-q](https://github.com/ibezkrovnyi/image-quantization)

## CLI/Build : Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

`npm run dev`     - begins local server at port 3000

`npm run build`   - builds locally

`npm run preview` - runs local build preview

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).
