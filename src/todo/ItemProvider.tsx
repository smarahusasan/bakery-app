import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import {getLogger} from '../core';
import {ItemProps} from './ItemProps';
import {createItem, getItems, newWebSocket, updateItem} from './itemApi';
import {AuthContext} from "../auth";
import {NetworkContext} from "../network/NetworkContext";
import {initialState, ItemContext} from "./ItemContext";

const log = getLogger('ItemProvider');

type SaveItemFn = (item: ItemProps) => Promise<void>;

export interface ItemsState {
  items?: ItemProps[],
  visibleItems?: ItemProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveItemFn,
  page:number,
  pageSize:number,
  totalPages:number,
  setPage?:(page:number) => void,
}

interface ActionProps {
  type: string,
  payload?: unknown,
}

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';
const REMOVE_TEMP_ITEM = 'REMOVE_TEMP_ITEM';
const SET_PAGE='SET_PAGE';
const UPDATE_VISIBLE_ITEMS='UPDATE_VISIBLE_ITEMS';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch(type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED: {
        const {items} = payload as { items: ItemProps[] };
        return {...state, items: items, fetching: false};
      }
      case FETCH_ITEMS_FAILED: {
        const {error} = payload as {error: Error};
        return {...state, fetchingError: error, fetching: false};
      }
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_ITEM_SUCCEEDED:{
        const items = [...(state.items || [])];
        const {item} = payload as {item:ItemProps};
        const index = items.findIndex(it => it.id === item.id);
        if (index === -1) {
          items.splice(0, 0, item);
        } else {
          items[index] = item;
        }
        return { ...state,  items, saving: false };
        }
      case SAVE_ITEM_FAILED: {
        const {error} = payload as { error: Error };
        return {...state, savingError: error, saving: false};
      }
      case REMOVE_TEMP_ITEM: {
        const { id } = payload as { id: string };
        const items = (state.items || []).filter(it => it.id !== id);
        return { ...state, items };
      }
      case SET_PAGE:{
        const {page}=payload as { page:number };
        const start = (page-1)*state.pageSize;
        const items = (state.items || []);
        const end=((start+state.pageSize) > items.length) ? items.length : (start+state.pageSize);
        const visibleItems = items.slice(start,end);
        return {...state, page,visibleItems};
      }
      case UPDATE_VISIBLE_ITEMS: {
        const start = (state.page - 1) * state.pageSize;
        const items = (state.items || []);
        const end=((start+state.pageSize) > items.length) ? items.length : (start+state.pageSize);
        const visibleItems = items.slice(start, end);
        const totalPages = Math.ceil((items?.length || 0) / state.pageSize);
        return { ...state, visibleItems, totalPages };
      }
      default:
        return state;
    }
  };

interface ItemProviderProps {
  children: React.ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { fetching, fetchingError, saving, savingError,page,pageSize,totalPages } = state;

  const { token } = useContext(AuthContext);
  const {online}=useContext(NetworkContext);

  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, []);
  useEffect(() => {
    if(online){
      syncLocalItems();
    }
  }, [online]);
  useEffect(() => {
    dispatch({ type: UPDATE_VISIBLE_ITEMS });
  }, [state.items, state.pageSize, state.page]);

  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [online]);

  const setPage=useCallback((page:number)=>{
    dispatch({type:SET_PAGE,payload:{page}});
  },[]);

  const value = { visibleItems:state.visibleItems,fetching, fetchingError, saving, savingError, saveItem ,page,pageSize,totalPages,setPage };
  log('returns');
  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      try {
        log('fetchItems started');
        dispatch({ type: FETCH_ITEMS_STARTED });
        const items = await getItems();
        log('fetchItems succeeded');
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
        }
      } catch (error) {
        log('fetchItems failed');
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
        }
      }
    }
  }

  async function saveItemCallback(item: ItemProps) {
    try {
      log('saveItem started');
      console.log("SALVAM ITEM: ", item);
      dispatch({ type: SAVE_ITEM_STARTED });

      const savedItem = await (item.id ? updateItem(item) : createItem(item));
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
      log('saveItem succeeded');
    } catch (error) {
      log('saveItem failed',error);

      if(!online){
        const fallbackItem = { ...item, id: item.id ?? 'temp'+Date.now().toString()};
        saveItemLocally(fallbackItem);
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: fallbackItem } });
        log('Item saved locally');
      }else{
        dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
        throw error;
      }
    }
  }

  function saveItemLocally(item: ItemProps) {
    const local = JSON.parse(localStorage.getItem("offlineItems") || "[]");
    local.push(item);
    localStorage.setItem("offlineItems", JSON.stringify(local));
  }

  async function syncLocalItems() {
    const local = JSON.parse(localStorage.getItem("offlineItems") || "[]");
    if (local.length === 0) return;

    log(`syncLocalItems: ${local.length} items`);
    const synced: string[] = [];

    for (const item of local) {
      try {
        const savedItem = await (item.id && !item.id.toString().startsWith('temp')
            ? updateItem(item)
            : createItem(item));

        dispatch({type:REMOVE_TEMP_ITEM, payload:{id:item.id}});
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
        log(`Synced item: ${item.name}`);
      } catch (e) {
        log(`Failed to sync item: ${item.name}.`,e);
        dispatch({type:REMOVE_TEMP_ITEM, payload:{id:item.id}});
      }finally {
        synced.push(item.id)
      }
    }
    const remaining = local.filter((i: ItemProps) => !synced.find((sid) => sid === i.id));
    localStorage.setItem("offlineItems", JSON.stringify(remaining));

    if (synced.length > 0) {
      console.log(`✅ ${synced.length} items synced successfully`);
    }
  }

  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    const closeWebSocket = newWebSocket(message => {
      if (canceled) {
        return;
      }
      const { event, payload: { item }} = message;
      log(`ws message, item ${event}`);
      if (event === 'created' || event === 'updated') {
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
      }
    });
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket();
    }
  }
};
