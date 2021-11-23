import express from "express"

import router from "./routers/mens.js";
import "../src/db/conn.js";
//import MensRanking from "../src/models/mens";

const app = express();

   


const port = process.env.PORT || 3001;

app.use(express.json());
app.use(router);

app.listen(port, () =>{

    console.log(`connection is live at the ${port}`)
})

