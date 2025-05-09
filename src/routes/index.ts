import express from "express"
import lineChatbotRoutes from "./lineChatbotRoutes"
import facebookChatbotRoutes from "./facebookChatbotRoutes"

const router = express.Router()

router.use("/line-chat", lineChatbotRoutes)

router.use("/fb-chat", facebookChatbotRoutes)

export default router
