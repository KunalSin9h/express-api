import dotenv from "dotenv";
dotenv.config();

import app from "./server";

app.listen(5000, () => {
    console.log("Listening at http://localhost:5000");
})