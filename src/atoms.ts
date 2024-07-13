import { atom } from "recoil";

export const TRELLO_TODO = "TRELLO_TODO";
export const TRELLO_ORDER = "TRELLO_ORDER";

const localStorageTodo = localStorage.getItem(TRELLO_TODO) || "{}";
const parsedLocalToDos = JSON.parse(localStorageTodo);

const localStorageOrder = localStorage.getItem(TRELLO_ORDER) || "[]";
const parsedLocalOrder = JSON.parse(localStorageOrder);

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: parsedLocalToDos,
});

export const boardModalState = atom({
  key: "boardModalState",
  default: false,
});

export const editModalState = atom({
  key: "editModalState",
  default: false,
});

export const boardOrderState = atom<string[]>({
  key: "boardOrder",
  default: parsedLocalOrder,
});

export const cardState = atom<object>({
  key: "cardState",
  default: {},
});
