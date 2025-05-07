import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger"

const app = express()
require("dotenv").config()

app.use(cors())
app.use(bodyParser.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT}`)
})
