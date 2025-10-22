import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
	base: command === "build" ? "/lucy-laura-scott/" : "/",
	build: { outDir: "dist" },
	plugins: [react()],
}));
