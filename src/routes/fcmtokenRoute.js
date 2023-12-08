import { Router } from "express";
import { getText, postFCM } from "../controller/fcmCon.js";

const router = Router();
// wishlist Apis 
router.post("/updateFCM", postFCM);
router.get("/get", getText);




export default router;