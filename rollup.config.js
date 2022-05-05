import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy-watch";
import cleaner from "rollup-plugin-cleaner";

const production = !process.env.ROLLUP_WATCH;

export default {
	input: "src/index.js",
	output: {
		dir: "build",
		format: "iife",
		sourcemap: !production
	},
	plugins: [
		cleaner({
			targets: ["build"]
		}),
		resolve(),
		commonjs(),
		babel({
			exclude: "node_modules/**",
			presets: [["@babel/preset-env", { bugfixes: true }]]
		}),
		copy({
			watch: !production && "src/**",
			targets: [
				{
					src: "src/manifest.json",
					dest: "build",
					transform: (content) => {
						const manifest = JSON.parse(content.toString());
						manifest.version = process.env.npm_package_version;
						return JSON.stringify(manifest);
					}
				}
			],
			verbose: true
		})
	]
};
