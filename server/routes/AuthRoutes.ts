import  express  from "express";
import { loginUser, registerUser, userLogout, verifyUser } from "../Controllers/AuthControllers.js";
import protect from "../middlewares/auth.js";

// “GET is used when we only want to retrieve data without modifying anything, like verifying a logged-in user.
// POST is used when we send data to the server, such as login where credentials are sent and a session is created.”


// store the express router in variable
const AuthRouter=express.Router();

// router for user register and make the post request beacuse user sends the data in this case
AuthRouter.post('/register',registerUser)

// router for user login and make post request, because user sends the data in this case
AuthRouter.post('/login',loginUser)

// use the middleware for the verifyuser and use get request, because we just checking the logged in status not data sent manually
AuthRouter.get('/verify',protect,verifyUser)

// we use the post request forthe logout because state is changed in server during logout
AuthRouter.post('/logout',protect,userLogout)

export default AuthRouter

