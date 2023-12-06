import { WebSocketServer } from "ws";
const sockserver = new WebSocketServer({ port: 8080 });

export const webSocket = () => {
    let webSockets = new Map()
    sockserver.on('connection', (ws, req) => {


        const queryObject = url.parse(req.url, true).query;         //get userid from URL ip:8080/chatId


        const [chatId, userId] = [queryObject.chatId, queryObject.userId];



        webSockets[userId] = ws //add new user to the connection list

        ws.on('open', () => console.log('Client has connected!'));
        ws.on('message', message => {
            console.log(`Received message => ${message}`);

        });

        ws.send('Hello! Message from the server...');
        ws.on('close', () => console.log('Client has disconnected!'))
        ws.onerror = function () {
            console.log('websocket error')
        }
    });
}
