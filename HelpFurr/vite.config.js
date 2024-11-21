// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// // server: {
// //   port: 5173,
// //   proxy: {
// //     '/auth': {
// //       target: 'http://localhost:8080',
// //       changeOrigin: true
// //     }
// //   }
// // }

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // hmr: {
    //   overlay: false, // Disable the HMR overlay
    // },
    port: 5173,
     proxy: {
       '/auth': {
         target: 'http://localhost:8080',
         changeOrigin: true
       }
     }
  },
}) 



