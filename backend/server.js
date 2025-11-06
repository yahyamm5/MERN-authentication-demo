const express = require("express")
const connectDB = require("./db/connectDB")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser");

dotenv.config()

const PORT = 3000 || process.env.PORT

const authRoutes = require("./routes/auth.route")


const app = express()

// middleware

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies
app.use(cors())


app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})

// HAi9lCVOxTIqwhZC