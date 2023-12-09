import { WebSocketServer } from "ws";
const sockserver = new WebSocketServer({ port: 6060 });
import Url from 'url';
import { pool } from "../dbConfig.js";
import { chatting } from "./chatCon.js";
export let webSockets = new Map()
export const webSocketFun = async () => {
    await pool.connect();
    sockserver.on('connection', async (ws, req) => {
        await pool.connect();
        const queryObject = Url.parse(req.url, true).query;         //get userid from URL ip:8080/chatId

        const [receiverId, senderId] = [queryObject.receiverId, queryObject.senderId];
        
        webSockets[senderId] = ws //add new user to the connection list
        console.log(`Client ${senderId} connected!`);
        // Check if senderId and receiverId have a chat data in the chat table
        ws.send(JSON.stringify({ 'cmd': "connected" }));
        let [chatRoomData] = await pool.query("SELECT * FROM chatroom WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)", [senderId, receiverId, receiverId, senderId]);
        if (chatRoomData.length > 0) {
            // Chat data exists, retrieve all messages from message table with matching chat id
            let [messagesData] = await pool.query("SELECT * FROM chats WHERE chatId = ?", [chatRoomData[0].chatId]);
            // Further processing with messagesData if necessary
            
            ws.send(JSON.stringify({ 'cmd': "chat", 'data': messagesData }));
        } else {
            // No chat data, create a new chat data entry
            await pool.query("INSERT INTO chatroom (senderId, receiverId) VALUES (?, ?)", [senderId, receiverId]);
            ws.send(JSON.stringify({ 'cmd': "chat", 'data': [] }));
            // Use the inserted chat data id if needed for further operations
            // newChatData.insertId will contain the id of the newly created chat data
        }

        ws.on('open', () => console.log('Client has connected!'));
        ws.on('message', message => {
            console.log(`Received message => ${message}`);

            var data = JSON.parse(message);
            chatting(data.senderid, data.userid, data , ws);
        });

        ws.on('close', () => {
            delete webSockets[senderId];
            console.log('Client has disconnected!')
        })
        ws.onerror = function () {
            console.log('websocket error')
        }
    });
}


