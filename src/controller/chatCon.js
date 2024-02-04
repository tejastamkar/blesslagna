import moment from "moment";
import { sendMsg } from "../config/firebaseConfig.js";
import { pool } from "../dbConfig.js";
import { webSockets } from "./webSocket.js";

const auth_token = 'YLzefMtZLrJnhpttxNKBFbkmxupeeBpDQcZWpPDRLgUYwmVZQh'
export const chatting = async (senderId, receiverId, data, ws) => {

    try {

        if (data.auth === auth_token) {
            // const sender = webSockets[senderId];
            // const receiver = webSockets[receiverId];
            if (data.cmd === 'send') {
                let [chatRoomData] = await pool.execute("SELECT * FROM chatroom WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)", [senderId, receiverId, receiverId, senderId]);

                const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                let sendMsgData = {
                    cmd: "receive",
                    receiverId: receiverId,
                    senderId: senderId,
                    msg: data.msgtext,
                    addedBy: senderId,
                    time: dateTime
                }
                console.log(webSockets.has(receiverId));
                if (webSockets.has(receiverId)) {
                    console.log("receiver is online");
                    webSockets[receiverId].send(JSON.stringify(sendMsgData));
                    ws.send(JSON.stringify({ "cmd": "send" }));
                } else {
                    let [receiverData] = await pool.execute("SELECT fcmtoken , firebase_id , photo1 FROM varVadhuDetails WHERE id = ?", [receiverId]);
                    let [senderData] = await pool.execute("SELECT name FROM varVadhuDetails WHERE id = ?", [senderId]);
                    console.log(receiverData);
                    console.log(senderData);
                    if (!receiverData[0].fcmtoken) {
                        return
                    }
                    const sendPayload = {
                        token: receiverData[0].fcmtoken,
                        notification: {
                            title: `${senderData[0].name}`,
                            body: `${data.msgtext}`,
                        },
                        data: {
                            type: "chat",
                            body: JSON.stringify({ ...sendMsgData, userName: senderData[0].name, fcmtoken: receiverData[0].fcmtoken, firebaseId: receiverData[0].firebase_id, image: receiverData[0].photo1, isOnline: webSockets.has(senderId) }),
                        },
                    }
                    await sendMsg({ payload: sendPayload });
                }

                // Assuming `pool` is the database connection pool available in this context
                // and the `chats` table structure is appropriate for the following columns
                const chat = {
                    senderId: senderId,
                    receiverId: receiverId,
                    message: data.msgtext,
                    addedBy: senderId, // Assuming the sender is the one who adds the chat
                };

                const insertChatQuery = "INSERT INTO chats ( chatId, senderId, receiverId,msg, addedBy) VALUES (?, ?, ?, ? , ?)";
                await pool.query(insertChatQuery, [chatRoomData[0].chatId, chat.senderId, chat.receiverId, chat.message, chat.addedBy]);
            }
        }





    } catch (error) {

        console.error(error);
    }
}