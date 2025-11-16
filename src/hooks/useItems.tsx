import { useCallback, useEffect, useReducer } from 'react';
import { ItemProps } from '../types/ItemProps';
import { getItems } from '../api/itemApi';
import {getLogger} from "../core/logger";

const log = getLogger('useItems');

export interface ItemsState {
  items?: ItemProps[],
  fetching: boolean,
  fetchingError?: Error,
}

export interface ItemsProps extends ItemsState {
  addItem: () => void,
}

interface ActionProps {
  type: string,
  payload?: unknown,
}

const initialState: ItemsState = {
  items: undefined,
  fetching: false,
  fetchingError: undefined,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch(type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true };
      case FETCH_ITEMS_SUCCEEDED: {
        const {items} = payload as { items: ItemProps[] };
        return {...state, items: items, fetching: false};
      }
      case FETCH_ITEMS_FAILED: {
        const {error} = payload as {error:Error};
        return {...state, fetchingError: error, fetching: false};
      }
      default:
        return state;
    }
  };

export const useItems: () => ItemsProps = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError } = state;
  const addItem = useCallback(() => {
    log('addItem - TODO');
  }, []);
  useEffect(getItemsEffect, [dispatch]);
  log(`returns - fetching = ${fetching}, items = ${JSON.stringify(items)}`);
  return {
    items,
    fetching,
    fetchingError,
    addItem,
  };

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
};
