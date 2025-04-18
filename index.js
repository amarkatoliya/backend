import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"
import router from "./routes/user.routes.js"

import userRoutes from "./routes/user.routes.js"

dotenv.config()
const app = express();

app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port = process.env.PORT || 3000 ;
db();
app.get('/', (req, res) => {
  res.send('Hi,there you are in right direction')
});

app.get('/Home', (req, res) => {
  res.send('Hi,there you are in right direction')
});

app.get('/About us', (req, res) => {
  res.send('Hi,there you are in right direction')
});

//here we are calling database


app.use("/api/v1/users/",userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});