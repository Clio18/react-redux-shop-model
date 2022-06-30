import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import React, { Fragment, useEffect } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  /*8. Having the reducer for notification we can dispatch this function when loading the data, 
  getting error or success messages */
  const dispatch = useDispatch();

  /*14. Now we can use notification   */
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    /*1. We cannot use async in useEffect signature so we need separate function for this */
    const sendCartData = async () => {
      /*10. Now we can dispatch the actions when pending */
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending the data...",
          message: "Sending cart data!",
        })
      );

      /*2. Make it await and return response */
      const response = await fetch(
        "https://react-shop-model-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      /*3. Check if response is not ok */
      if (!response.ok) {
        throw new Error("Send cart data failed!");
      }

      const responseData = response.json();
      /*4. Here and on the beggining of sending the data we need to show notification. 
      For this purposes we should add this info to the ui-slice and add it to state */

      /*12. Now we can dispatch the actions when we success */
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Send cart data successfully!",
        })
      );
    };

    /*15. From the very begining we see the notification as pending, to avoid this we
     create new variable which is initial true but when we sending the data
     it becomes false (only once)*/
    if (isInitial) {
      isInitial = false;
      return;
    }

    /*13. Durig the app flow many other exception may occure, that's why we throw 
    new error when response is not ok and catch it here because our function is async
    and may return promise */
    sendCartData().catch((error) => {
      /*11. Now we can dispatch the actions when error */
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Send cart data failed!",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
