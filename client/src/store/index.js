import { configureStore } from "@reduxjs/toolkit"
import uiReducer   from "./uiSlice"
import chatReducer from "./chatSlice"

export const store = configureStore({
  reducer: { ui: uiReducer, chat: chatReducer },
})