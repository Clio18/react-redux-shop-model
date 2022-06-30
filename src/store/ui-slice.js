import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    /*5. Add new props - notification*/
    cartIsVisible: false,
    notification: null,
  },
  reducers: {
    toggler(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
    /*6. Add new reducer for notification */
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        message: action.payload.message,
        title: action.payload.title,
      };
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
