import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PageSettings } from 'types';

type ActionUpdate = PayloadAction<{ pageSettings: PageSettings }>;

type ActionReplace = PayloadAction<PageSettings>;

export const pageSettingsSlice = createSlice({
  name: 'pageSettings',
  initialState: {} as PageSettings,
  reducers: {
    updatePageSettings: (state, { payload: { pageSettings } }: ActionUpdate) => ({
      ...state,
      ...pageSettings,
    }),
    setPageSettings: (_state, { payload: { pageSettings } }: ActionUpdate) => pageSettings,
    replacePageSettings: (_state, { payload }: ActionReplace) => payload,
  },
});

export const { replacePageSettings, setPageSettings, updatePageSettings } = pageSettingsSlice.actions;

export default pageSettingsSlice.reducer;
