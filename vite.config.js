import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	base: "/lucy-laura-scott/",
	build: { outDir: 'dist' },
	plugins: [react()],
});
