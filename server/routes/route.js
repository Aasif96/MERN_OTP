import  express  from "express";
const router = express.Router();

import { register, login, getUser, updateUser, generateOTP, verifyOTP, resetPassword, createResetSession } from "../controllers/appController.js";
import { isAuthenticatedUser, Auth, localVariables } from "../middleware/auth.js";
import { registerMail } from "../controllers/mailer.js";

// post methods
router.route('/register').post(register)
router.route('/registerMail').post(registerMail)
router.route('/authenticate').post(isAuthenticatedUser,(req,res)=>res.end());
router.route('/login').post(isAuthenticatedUser,login) 

// Get methods
router.route('/user/:username').get(getUser);
router.route('/generateOTP').get(isAuthenticatedUser,localVariables,generateOTP);
router.route('/verifyOTP').get(isAuthenticatedUser,verifyOTP);
router.route('/createResetSession').get(createResetSession);


// Put method
router.route('/updateUser').put(Auth,updateUser);
router.route('/resetPassword').put(isAuthenticatedUser,resetPassword);


export default router;
