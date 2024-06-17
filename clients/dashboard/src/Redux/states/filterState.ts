type FilterState = {
    searchQuery: string;
    orgs: string[];
    depts: string[];
  };
  
  export const filterState: FilterState = {
    searchQuery: "",
    orgs: [],
    depts: []
  };