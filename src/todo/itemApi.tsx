import axios from 'axios';
import {authConfig, getLogger, withLogs} from '../core';
import { ItemProps } from './ItemProps';

const log = getLogger('itemApi');

const itemUrl = `http://localhost:3000/item`;

export const getItems: () => Promise<ItemProps[]> = () => {
  return withLogs(axios.get(itemUrl, authConfig()), 'getItems');
}

export const createItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  return withLogs(axios.post(itemUrl, item, authConfig()), 'createItem');
}

export const updateItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  console.log("Acum salvez",item);
  return withLogs(axios.put(`${itemUrl}/${item.id}`, item, authConfig()), 'updateItem');
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
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
