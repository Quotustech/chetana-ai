import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { filterState } from "../states/filterState";

const FilterSlice = createSlice({
  name: "FilterSlice",
  initialState: filterState,
  reducers: {
    getOrgs(
      state: Draft<typeof filterState>,
      action: PayloadAction<(typeof filterState)["orgs"]>
    ) {
      state.orgs = action.payload;
    },
    getDepts(
      state: Draft<typeof filterState>,
      action: PayloadAction<(typeof filterState)["depts"]>
    ) {
      state.depts = action.payload;
    },
    getSearch(
      state: Draft<typeof filterState>,
      action: PayloadAction<(typeof filterState)["searchQuery"]>
    ) {
      state.searchQuery = action.payload;
    },
  },
});

export const {getOrgs , getDepts , getSearch} = FilterSlice.actions;

export default FilterSlice.reducer;
