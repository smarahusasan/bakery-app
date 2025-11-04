import React from "react";
import {ItemsState} from "./ItemProvider";

export const initialState: ItemsState = {
    fetching: false,
    saving: false,
    page:1,
    pageSize:5,
    totalPages:1
};

export const ItemContext = React.createContext<ItemsState>(initialState);