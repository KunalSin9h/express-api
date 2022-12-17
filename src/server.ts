import express, { NextFunction } from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import type { Request, Response } from "express";

interface Error {
    type: string;
}

const app = express();

/**
 * Global Middleware
 */
app.use(cors()); // cors -> cross origin research share | Block the client
app.use(morgan('dev')); // for logging each request
app.use(express.json()); // for allowing client to send json
app.use(express.urlencoded({extended: true})) // for using query sting & request params efficiently

/**
 * Global Custom Middleware
 */
// app.use((req, res, next) => {
//     if (Math.random() >= 0.5) {
//         res.status(401).json({
//             message: "not authorized",
//         })
//     } else {
//         next();
//     }
// });

/**
 * Home Api, like Api guide, probably does't require auth.
 */
app.get('/', (req: Request, res: Response) => {
    res.status(200);
    res.json({
        "create_product": "http://localhost:5000/product",
        "get_all_product": "http://localhost:5000/product",
        "get_product_by_id": "http://localhost:5000/product/{id}",
        "update_product_by_id": "http://localhost:5000/product/{id}",
        "delete_product_by_id": "http://localhost:5000/product/{id}",
    });
})

app.use('/', protect, router);
app.post('/user', createNewUser);
app.post('/signin', signIn);

/**
 * Error Handler Middleware
 * Should be at last
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.type === "auth") {
        res.status(401) .json({error: "Not Authorized"})
    } else if (err.type === "input"){
        res.status(400).json({error: "Invalid Input"});
    } else {
        res.status(500).json({error: "Internal Server Error"});
    }
});

export default app;