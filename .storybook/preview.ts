import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        const defaultStory = 'webbuilder-builder--builder';

        if (a.id === defaultStory) return -1
        if (b.id === defaultStory) return 1

        return a.id.localeCompare(b.id, undefined, { numeric: true })
      },
    },
  },
};

export default preview;
