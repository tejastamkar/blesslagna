import { Router } from "express";
import { getChatroomDataByUserId } from "../controller/chatListCon.js";

const router = Router();
// getChatroomDataByUserId Apis 
router.get("/getChatroomDataByUserId", getChatroomDataByUserId);





export default router;