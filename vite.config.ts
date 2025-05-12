import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode }) => {
  let base = "/"

  if (mode === "repo") {
    base = "/sample-visualization-of-flexmatch-rule/"
  }

  return {
    plugins: [react()],
    base: base,
  };
})
