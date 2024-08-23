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
      // addition
      state.filteredOrgs = action.payload.filter(org => 
        org.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    getDepts(
      state: Draft<typeof filterState>,
      action: PayloadAction<(typeof filterState)["depts"]>
    ) {
      state.depts = action.payload;
      state.filteredDepts = action.payload.filter(dept => 
        dept.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    // getSearch(
    //   state: Draft<typeof filterState>,
    //   action: PayloadAction<(typeof filterState)["searchQuery"]>
    // ) {
    //   state.searchQuery = action.payload;
    // },
    getSearch(
      state: Draft<typeof filterState>,
      action: PayloadAction<(typeof filterState)["searchQuery"]>
    ) {
      const query = action.payload.toLowerCase();
      state.searchQuery = query;
      state.filteredOrgs = state.orgs.filter(org => 
        org.toLowerCase().includes(query)
      );
      state.filteredDepts = state.depts.filter(dept => 
        dept.toLowerCase().includes(query)
      );
    },
  },
});

export const {getOrgs , getDepts , getSearch} = FilterSlice.actions;

export default FilterSlice.reducer;
