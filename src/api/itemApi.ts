import axios from 'axios';
import {authConfig, withLogs} from '../core';
import { ItemProps } from '../types/ItemProps';
import {BackendItemProps} from "../types/BackendItemProps";
import {getLogger} from "../core/logger";

const log = getLogger('itemApi');

const itemUrl = `http://localhost:3000/item`;

const parseItem = (item: BackendItemProps): ItemProps=>({
  id: item.id ? item.id : undefined,
  name: item.name,
  price: item.price,
  dateOfProduction: new Date(item.date_of_production),
  isGlutenFree: item.is_gluten_free,
  photo:item.photo,
  photoPath: item.photoPath,
  location: item.location,
});

export const getItems: () => Promise<ItemProps[]> = async () => {
  return await withLogs(
      axios.get(itemUrl, authConfig()).then((res)=>{
        res.data=res.data.map(parseItem)
        return res;
      }),
      'getItems'
  );
}

export const createItem: (item: ItemProps) => Promise<ItemProps>= async (item:ItemProps) => {
  return await withLogs(
      axios.post(itemUrl, item,authConfig()).then((res)=>{
        res.data=parseItem(res.data);
        return res;
      }),
      'createItem'
  );
}

export const updateItem: (item: ItemProps) => Promise<ItemProps>=async (item:ItemProps) => {
  return await withLogs(
      axios.put(`${itemUrl}/${item.id}`, item,authConfig()).then((res)=>{
        res.data=parseItem(res.data);
        return res;
      }),
      'updateItem'
  );
}

interface MessageData {
  event: string;
  payload: {
    item: ItemProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket('ws://localhost:3000/ws')
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    const data = JSON.parse(messageEvent.data);
    data.payload.item = parseItem(data.payload.item);
    onMessage(data);
  };
  return () => {
    ws.close();
  }
}
