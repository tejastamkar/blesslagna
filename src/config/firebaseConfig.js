import admin from "firebase-admin";
import serviceAccount from "../helper/serviceAccountKey.json" assert { type: "json" };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export async function sendMsg({ payload }) {
    await admin
        .messaging()
        .send(payload)
        .then((response) => {
            // Response is a message ID string.
            // console.log("notification send");
            // console.log("Successfully sent message:", response);
            return true;
        })
        .catch((error) => {
            console.error("error:", error.code);

        });
    return false;

}