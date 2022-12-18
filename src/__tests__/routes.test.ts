import { createNewUser,  signIn } from "../handlers/user";
import request from "supertest";
import app from "../server";

describe("GET /", () => {
    test("Response from GET / ", async () => {
        const res = await request(app).get('/');
        console.log(res.body);
        expect(res.body.create_product).toBe("http://localhost:5000/product");
    } );
});