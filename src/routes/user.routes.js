import { Router} from "express";
import { userRegister,userLogin, userLogout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router= Router()

// calling the multer middleware in userroutes
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
 userRegister)


 router.route("/login").post(userLogin)

 router.route("/logout").post(verifyJwt,userLogout)


 export default router