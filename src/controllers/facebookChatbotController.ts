import { RequestHandler } from "express"
import { ErrorResponse } from "../types"
import { postRequest } from "../utils/axios"
import { fetchLLMResult } from "../utils/fetchLLMResult"

interface ReceivedMessage {
  mid: string
  text?: string
  attachments?: Attachment[]
  quick_reply?: {
    payload: string
  }
  is_echo?: boolean
  app_id?: number
  metadata?: string
}
interface Attachment {
  type: string
  payload: {
    url?: string
    coordinates?: {
      lat: number
      long: number
    }
  }
}
interface FacebookVerifyRequest {
  "hub.mode": string
  "hub.verify_token": string
  "hub.challenge": string
}
interface FacebookWebhookEntry {
  id: string
  time: number
  messaging: {
    sender: { id: string }
    recipient: { id: string }
    timestamp: number
    message?: {
      mid: string
      text?: string
      attachments?: any[]
      is_echo?: boolean
    }
    postback?: any
  }[]
}
interface FacebookWebhookBody {
  object: string
  entry: FacebookWebhookEntry[]
}
interface SendFacebookMessageResponse {
  status: "ok"
  message: string
}

const handleEvent = async (
  senderPsid: string,
  receivedMessage: ReceivedMessage
) => {
  const fbPageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN || ""
  const baseURL: string = `https://graph.facebook.com/v12.0/me/messages?access_token=${fbPageAccessToken}`

  if (!receivedMessage.text) {
    const fallback = {
      recipient: { id: senderPsid },
      message: {
        text: "Sorry, I can only understand text messages right now.",
      },
    }
    try {
      await postRequest(baseURL, fallback)
    } catch (error) {
      console.error("Error sending fallback message:", error)
    }
    return
  }

  try {
    const llmReply = await fetchLLMResult(receivedMessage.text)
    const replyMessage =
      llmReply.length > 2000 ? llmReply.slice(0, 2500) : llmReply

    const requestBody = {
      recipient: { id: senderPsid },
      message: { text: replyMessage },
    }

    await postRequest(baseURL, requestBody)
  } catch (error) {
    console.error("Error processing or sending message:", error)
    const fallback = {
      recipient: { id: senderPsid },
      message: {
        text: "Sorry, I can only understand text messages right now.",
      },
    }

    try {
      await postRequest(baseURL, fallback)
    } catch (fallbackError) {
      console.error("Error sending fallback message:", fallbackError)
    }
  }
}

export const verifyFacebookWebhook: RequestHandler<
  {},
  string | ErrorResponse,
  {},
  FacebookVerifyRequest
> = async (req, res) => {
  try {
    const fbVerifyToken: string = process.env.FB_VERIFY_TOKEN || ""
    const {
      "hub.mode": mode,
      "hub.verify_token": token,
      "hub.challenge": challenge,
    } = req.query

    if (!mode || !token || !challenge) {
      res.status(400).json({
        status: "error",
        message: "Missing required query parameters",
      })
    }

    if (mode === "subscribe" && token === fbVerifyToken) {
      res.status(200).send(challenge)
    }

    res.sendStatus(403)
  } catch (error) {
    console.error("Error verifying webhook:", error)
    res.status(500).json({ status: "error", message: "Internal server error" })
  }
}
export const sendFacebookMessage: RequestHandler<
  {},
  SendFacebookMessageResponse | ErrorResponse,
  FacebookWebhookBody
> = async (req, res) => {
  try {
    const body: FacebookWebhookBody = req.body

    if (body.object !== "page") {
      res.sendStatus(404)
    }

    res.status(200).json({ status: "ok", message: "Webhook received" })
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        const senderPsid = event.sender.id

        if (event.message && !event.message.is_echo) {
          await handleEvent(senderPsid, event.message)
        }
      }
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    res.status(500).json({ status: "error", message: "Internal server error" })
  }
}
