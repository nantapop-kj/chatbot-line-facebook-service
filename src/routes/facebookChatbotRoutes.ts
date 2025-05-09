import { Router } from "express"
import bodyParser from "body-parser"
import {
  verifyFacebookWebhook,
  sendFacebookMessage,
} from "../controllers/facebookChatbotController"

const router = Router()

router.get("/", verifyFacebookWebhook)
router.post("/", bodyParser.json(), sendFacebookMessage)

export default router
