// export const BASE_URL =
//   process.env.NODE_ENV === "development" ? "http://localhost:5000" : "" (if we dont use proxy this is what we gonna do)

// BASE_URL in constants.js should be an empty string i.e. ''
// You can't make your requests to localhost:5000 from the browser running on localhost:3000 as that would break the browsers SOP (Same Origin Policy) as we don't send a CORS (Cross Origin Resource Sharing) response from the server.
// You should instead be proxying your request to localhost:5000 using the React Development server.
// If you have installed some cors middleware in Express then please remove this and instead use the proxy as you will run into issues later.
// Additionally we don't need a CORS response as in production both backend and frontend are served from the same origin and we only want our server to respond to our client, not any body else.
export const BASE_URL = "" // because we already have the proxy (package.json) to be the same as the backend server, so we set BASE_URL to be empty
export const PRODUCTS_URL = "/api/products"
export const USERS_URL = "/api/users"
export const ORDERS_URL = "/api/orders"
export const PAYPAL_URL = "/api/config/paypal"

// PayPal JS SDK: https://developer.paypal.com/sdk/js/
// React PayPal JS: https://github.com/paypal/react-paypal-js#why-use-react-paypal-js
