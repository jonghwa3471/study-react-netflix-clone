import { atom } from "recoil";

export const TRELLO_TODO = "TRELLO_TODO";

const localStorageTodo = localStorage.getItem(TRELLO_TODO) || "{}";
const parsedLocalToDos = JSON.parse(localStorageTodo);

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

export const boardMoalState = atom({
  key: "boardModalState",
  default: false,
});
