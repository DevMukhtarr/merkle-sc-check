import { Router} from "express";
import { verifyToken } from "../middlewares/auth.js" ;
const router = Router();
import { 
    signUp,
    signIn,
    dashboard
} from "../controllers/authentication.js"

router.route("/signup").post(signUp)
router.route("/signin").post(signIn)
router.route("/dashboard").get(verifyToken, dashboard)

export default router