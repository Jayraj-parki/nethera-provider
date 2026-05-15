
import { configureStore } from "@reduxjs/toolkit";
import operatorAuthReducer,{ persistOperatorAuth, restoreOperatorAuth } from "./operatorAuthSlice";
import busReducer from "./busSlice";
import adminAuthReducer from "./adminAuthSlice";
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      operatorAuth: operatorAuthReducer,
      bus: busReducer,
      adminAuth: adminAuthReducer,
    },
    middleware: (getDefault) => getDefault({ serializableCheck: false })
  });

  // Client-side persistence
  if (typeof window !== "undefined") {
    restoreOperatorAuth(store);
    persistOperatorAuth(store);
  }

  return store;
};

export const store = makeStore();
