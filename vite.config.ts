import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/*
// vite.config.js
export default {
  assetsInclude(file) {
    return /\.(hdr|glb|usdz|png)$/.test(file)
  }
}
*/

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.hdr']
})
