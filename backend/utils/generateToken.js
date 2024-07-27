import jwt from "jsonwebtoken"

// FYI: traditionally, we store JWT on the client side (localStorage), but it opens up to cross site scripting attack, so we'll store it in httpOnly Cookie on the server
// When we log in, a cookie containing a token (jwt) arrives as a response from the server. And that token is unique to us.
// Then, every time we send a request to the server, we automatically send a cookie (token) where the server checks if it is really us.
// The cookie is http only so is set/read on the server only and not available to the client.
// Once a cookie is set it goes along with every request made and is available to the server to read.
const generateToken = (res, userId) => {
  // sign() params: payload (a payload includes what we want our token to include), secret, when to expire?
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  })

  // Set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  })
}

export default generateToken
