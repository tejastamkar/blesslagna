import { pool } from "../dbConfig.js";
import { validator } from "../helper/validate.js";


export async function postFCM(req, res) {
    try {
        let { id, token } = req.body;

        let validationRule = {
            id: "required",
            token: "required",
        }

        let { err, status } = await new Promise((resolve) => {
            validator(req.body, validationRule, {}, (err, status) => {
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
        ;


        const result = await pool.query(
            "UPDATE varVadhuDetails SET fcmtoken = ? WHERE id = ?", [token, id]
        )
        console.log(result[0]);
        return res.status(200).json({
            success: true,
            data: result[0].changedRows,
            message: 'Token updated successfully!',
        });

    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .send({ success: false, message: "Something went wrong", data: error });
    }

}

export async function getText(req, res) {
    try {
        const [usersDetials] = await pool.query(
            "SELECT * FROM varVadhuDetails"
        );

        return res.status(200).json({
            success: true,
            data: usersDetials,
            message: 'Product removed from cart successfully!',
        });

    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .send({ success: false, message: "Something went wrong", data: error });
    }

}
