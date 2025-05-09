import express from "express"
import cors from "cors"
import routes from "./routes"

const app = express()
require("dotenv").config()
app.use(cors())
app.use("/", routes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT}`)
})
