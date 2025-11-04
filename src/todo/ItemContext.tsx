import React from "react";
import {ItemsState} from "./ItemProvider";

export const initialState: ItemsState = {
    fetching: false,
    saving: false,
};

export const ItemContext = React.createContext<ItemsState>(initialState);