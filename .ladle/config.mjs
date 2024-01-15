export default {
  appendToHead: "<style>.ladle-main { padding: 0 } .ladle-root { height: 100% }</style>",
  addons: {
    ladle: {
      enabled: false,
    },
    mode: {
      enabled: false,
      defaultState: "full",
    },
    rtl: {
      enabled: false,
    },
    source: {
      enabled: false,
      defaultState: false,
    },
    theme: {
      enabled: false,
    },
    width: {
      enabled: false
    }
  },
  defaultStory: "webbuilder--web-builder-story",
  viteConfig: process.cwd() + "/vite.ladle.config.ts",
}
