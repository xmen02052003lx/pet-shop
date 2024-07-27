import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap"
import { FaRobot, FaShoppingCart, FaUser } from "react-icons/fa"
import { LinkContainer } from "react-router-bootstrap"
import { useSelector, useDispatch } from "react-redux" // useDispatch is used to interact with our state's actions, and useSelector is used to access our state in the store.js
import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../slices/usersApiSlice"
import { logout } from "../slices/authSlice"
import SearchBox from "./SearchBox"
import logo from "../assets/logo.png"
import { resetCart } from "../slices/cartSlice"

const Header = () => {
  const { cartItems } = useSelector(state => state.cart) // this is the "cart: cartSliceReducer" property in the store.js file. Whatever we put in store.js we can access it here. So we can access anything in cartSliceReducer such as cartItems, itemsPrice, taxPrice,... (state.cartItems, state.itemsPrice,... in cartSlice.js)
  const { userInfo } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  //   Why put this in "[]" ??? - Destructure
  // we import the useLogoutMutation but we need a actual function to call
  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout()) // clear the local storage
      // NOTE: here we need to reset cart state for when a user logs out so the next user doesn't inherit the previous users cart and shipping
      dispatch(resetCart())
      navigate("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Pet Shop - CỬA HÀNG THÚ CƯNG</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {/* "a" is accumulator, "c" is current (current cart item that we're currently looping through)  c.qty because we want it to be 2 even though is is 2 of the same item */}
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/chatbot">
                <Nav.Link>
                  <FaRobot /> ChatBot - CSKH
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
export default Header
