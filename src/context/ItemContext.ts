import React from "react";
import {ItemsState} from "../provider/ItemProvider";

export const initialState: ItemsState = {
    items:[],
    filteredItems:[],
    visibleItems:[],
    fetching: false,
    saving: false,
    page:1,
    pageSize:5,
    totalPages:0,
    searchTerm:'',
    filterGlutenFree:'all',
};

export const ItemContext = React.createContext<ItemsState>(initialState);