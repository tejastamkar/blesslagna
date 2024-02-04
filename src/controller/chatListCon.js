import { pool } from "../dbConfig.js";
import { validator } from "../helper/validate.js";



export const getChatroomDataByUserId = async (req, res) => {
    try {
        let { userId } = req.query;
        let validationRule = {
            userId: "required",
        }

        let { err, status } = await new Promise((resolve) => {
            validator(req.query, validationRule, {}, (err, status) => {
                resolve({ err, status });
            });
        });

        if (!status) {
            return res.status(500).send({
                success: false,
                message: "validation error",
                data: err,
            });
        }


        let chatroomData = []
        let query = `SELECT * FROM chatroom WHERE senderId = ? `;
        const [chatroomD1] = await pool.query(query, [userId]);

        chatroomData.push(...chatroomD1);
        query = `SELECT * FROM chatroom WHERE receiverId  = ? `;
        const [chatroomD2] = await pool.query(query, [userId]);

        chatroomData.push(...chatroomD2);

        chatroomData.sort((a, b) => {
            return a.createdOn - b.createdOn
        })


        var allUserDataWithChat = await Promise.all(chatroomData.map(async (data) => {
            const latestChatQuery = `SELECT * FROM chats WHERE chatId = ? ORDER BY createdOn DESC LIMIT 1`;
            const [latestChatResult] = await pool.query(latestChatQuery, [data.chatId]);
            const latestChat = latestChatResult.length > 0 ? latestChatResult[0].msg : "";
            const latestChatTime = latestChatResult.length > 0 ? latestChatResult[0].createdOn : null;
            let query = `SELECT id, name, photo1, firebase_id FROM varVadhuDetails WHERE id = ?`;
            const [userData] = await pool.query(query, [userId == data.senderId ? data.receiverId : data.senderId]);
            return {
                latestChatTime: latestChatTime,
                latestChat: latestChat,
                ...data,
                ...userData[0]
            }
        }))

        // console.log(chatroomData);



        return res.status(200).send({
            "success": true,
            "data": allUserDataWithChat.reverse(),
            "message": "Chatroom data fetched successfully"
        });
    } catch (error) {
        console.error('Error fetching chatroom data:', error);
        throw error;
    }
};
