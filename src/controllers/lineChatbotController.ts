import { RequestHandler } from "express"
import {
  Client,
  WebhookEvent,
  MessageEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk"
import { ErrorResponse } from "../types"
import { fetchLLMResult } from "../utils/fetchLLMResult"
import dotenv from "dotenv"
dotenv.config()

interface SendLineMessageResponse {
  status: "ok"
  data: (void | MessageAPIResponseBase)[]
}
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
}
const client = new Client(config)

const handleEvent = async (event: WebhookEvent) => {
  if (event.type === "message" && event.message.type === "text") {
    const messageEvent = event as MessageEvent
    const userMessage = (messageEvent.message as TextMessage).text
    const llmReply = await fetchLLMResult(userMessage)

    return client.replyMessage(messageEvent.replyToken, [
      {
        type: "text",
        text: llmReply,
      },
    ])
  }
  return Promise.resolve()
}
export const sendLineMeassage: RequestHandler<
  {},
  SendLineMessageResponse | ErrorResponse
> = async (req, res) => {
  try {
    const events = req.body.events as WebhookEvent[]
    const results = await Promise.all(events.map(handleEvent))

    res.status(200).json({ status: "ok", data: results })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({ status: "error", message: "Internal server error" })
  }
}
