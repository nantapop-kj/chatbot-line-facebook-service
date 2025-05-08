import axios, { AxiosResponse, AxiosError } from "axios"

export async function postRequest(
  url: string,
  data: any,
  headers: Record<string, string> = {},
  params: Record<string, any> = {}
): Promise<AxiosResponse<any>> {
  try {
    const response = await axios.post(url, data, { headers, params })
    return response
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      const errorDetails = {
        status: error.response.status,
        data: error.response.data,
        message: `Request failed with status ${error.response.status}`,
      }
      throw errorDetails
    } else if (error.request) {
      throw {
        message: "No response received from server",
        request: error.request,
      }
    } else {
      throw {
        message: `Unexpected error: ${error.message}`,
      }
    }
  }
}
