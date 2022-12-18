import dotenv from "dotenv";
dotenv.config();

interface Request {
    body: {
        username: string;
        password: string;
    }
}

interface Response {
    status(code: number): void;
    json({token}: {token: string}): void;
}


import config from "./config";

import app from "./server";

app.listen(config.port, () => {
    console.log(`Listening at http://localhost:${config.port}`);
})