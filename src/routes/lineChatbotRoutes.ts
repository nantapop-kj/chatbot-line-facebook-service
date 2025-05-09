import { Router } from "express"
import { middleware } from "@line/bot-sdk"
import { sendLineMeassage } from "../controllers/lineChatbotController"

const router = Router()

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
}

router.post("/", middleware(config), sendLineMeassage)

export default router
