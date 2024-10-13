import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageSettings } from 'types';

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
    replacePageSettings: (state, { payload }: ActionReplace) => payload,
  },
});

export const { replacePageSettings, updatePageSettings } = pageSettingsSlice.actions;

export default pageSettingsSlice.reducer;
