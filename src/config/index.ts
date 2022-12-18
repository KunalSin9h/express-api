import merge from "lodash.merge";

// These two thing i will change in terminal
process.env.NODE_ENV = process.env.NODE_ENV || "DEV";
const stage = process.env.STAGE || "LOCAL";

let envConfig;

if (stage === "PROD") {
    envConfig = require('./prod').default;
} else if (stage === "TEST") {
    envConfig = require('./testing').default;
} else{
    envConfig = require('./local').default;
}


export default merge({
    stage,
    env: process.env.NODE_ENV,
    port: 3000,
    secrets: {
        jwt: process.env.JWT_SECRET,
        dbUrl: process.env.DATABASE_URL
    }
}, envConfig);
