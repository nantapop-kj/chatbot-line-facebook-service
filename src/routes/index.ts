import express from "express"
import lineChatbotRoutes from "./lineChatbotRoutes"

const router = express.Router()

router.use("/chat", lineChatbotRoutes)

export default router
