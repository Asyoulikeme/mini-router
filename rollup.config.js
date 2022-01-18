/* prod 配置 */
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.ts",
  output: [
    {
      file: "./lib/bundle.js",
      format: "cjs",
      banner: injectDateForBuild
    },
    {
      file: "./esm/bundle.js",
      format: "es",
      banner: injectDateForBuild
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    terser({
      output: {
        comments: function (node, comment) {
          var text = comment.value
          var type = comment.type
          if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on|@Version/i.test(text)
          }
        }
      }
    }),
    typescript({
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true
    })
  ]
}

function injectDateForBuild() {
  return new Promise((resolve) => {
    const v = new Date()
    const buildDate = `${v.getFullYear()}-${
      v.getMonth() + 1
    }-${v.getDate()} ${v.getHours()}:${v.getMinutes()}:${v.getSeconds()}`
    resolve("/* @Version:" + "pkg-version" + " " + "Build Date:" + buildDate + " */")
  })
}
