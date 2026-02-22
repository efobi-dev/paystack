import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		transaction: "src/main/transaction.ts",
		split: "src/main/split.ts",
		transfer: "src/main/transfer.ts",
		recipient: "src/main/recipient.ts",
		verification: "src/main/verification.ts",
		miscellaneous: "src/main/miscellaneous.ts",
		virtual: "src/main/virtual.ts",
		webhook: "src/main/webhook.ts",
	},
	format: ["esm"],
	dts: true,
	splitting: false,
	sourcemap: false,
	clean: true,
	treeshake: true,
	target: "esnext",
	outDir: "dist",
});
