type FilterState = {
    searchQuery: string;
    orgs: string[];
    depts: string[];
    // new addons
    filteredOrgs: string[];
  filteredDepts: string[];
  };
  
  export const filterState: FilterState = {
    searchQuery: "",
    orgs: [],
    depts: [],
    filteredOrgs:[],
  filteredDepts: []
  };