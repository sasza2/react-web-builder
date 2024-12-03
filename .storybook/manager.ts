import { addons } from '@storybook/manager-api';

addons.register('custom-panel', (api) => {
  api.toggleToolbar(false);
  api.togglePanel(false);
});
