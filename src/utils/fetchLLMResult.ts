import { postRequest } from "./axios"

export async function fetchLLMResult(message: string): Promise<string> {
  try {
    const baseURL: string = process.env.LLM_API_URL || ""
    const modelName: string = process.env.LLM_MODEL_NAME || ""
    const apiKey: string = process.env.LLM_API_KEY || ""

    const response = await postRequest(
      baseURL,
      {
        model: modelName,
        messages: [{ role: "user", content: message }],
      },
      {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      }
    )
    // Validate the response from the LLM API
    if (
      !response.data ||
      !Array.isArray(response.data.choices) ||
      response.data.choices.length === 0
    ) {
      throw new Error("No choices returned from API")
    }
    // You may need to update this if the model returns differently structured responses
    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error(`Error calling ${process.env.LLM_MODEL_NAME} API:`, error)
    return "An error occurred. Please try again later."
  }
}
