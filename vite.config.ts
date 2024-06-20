import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { Buffer } from "buffer";
// import nodePolyfills from "rollup-plugin-polyfill-node";
// import inject from "@rollup/plugin-inject";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    // rollupOptions: {
    //   // plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
    // },
  },
});
