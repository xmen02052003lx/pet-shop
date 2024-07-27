import React from "react"
import ReactDOM from "react-dom/client"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store.js" // this is the redux store to provide to our app
//import "bootstrap/dist/css/bootstrap.min.css" // we need to import bootstrap in order for react-bootstrap to work; This is the default, we gonna import the custom though
import "./assets/styles/bootstrap.custom.css"
import "./assets/styles/index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals" // why import this ???
import { HelmetProvider } from "react-helmet-async"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
import CartScreen from "./screens/CartScreen.jsx"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ShippingScreen from "./screens/ShippingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import PlaceOrderScreen from "./screens/PlaceOrderScreen"
import OrderScreen from "./screens/OrderScreen"
import ProfileScreen from "./screens/ProfileScreen"
import OrderListScreen from "./screens/admin/OrderListScreen"
import ProductListScreen from "./screens/admin/ProductListScreen"
import ProductEditScreen from "./screens/admin/ProductEditScreen"
import UserListScreen from "./screens/admin/UserListScreen"
import UserEditScreen from "./screens/admin/UserEditScreen"
import ChatBot from "./screens/Chatbot.jsx"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        // we also want pagination on search result as well
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/chatbot" element={<ChatBot />} />
      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      {/* Admin users */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route
          path="/admin/productlist/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    {/* we gonna add Helmet provider around all of those, it can help us to add the page's title, we use this functionality in Meta.jsx component */}
    <HelmetProvider>
      {/* Redux provider */}
      <Provider store={store}>
        {/* PayPal script provider */}
        <PayPalScriptProvider deferLoading={false}>
          {/* Router provider */}
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)

reportWebVitals()
