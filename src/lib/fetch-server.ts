import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { BACKEND_URL } from "@/env";

const fetchServer = async ({ method = "GET", url, body = "" }: any) => {
  try {
    const session: any = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    const response = await axios({
      method: method,
      url: BACKEND_URL+ url.toString(),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer${accessToken}`,
      },
      data: body || undefined,
    });

    if (!response) {
      throw new Error("Empty response");
    }

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 401) {
        return redirect("/login");
      }

      if (error?.response?.status === 409) {
        return redirect("/request-email-verification");
      }
    }

    throw new Error("Failed to fetch data from the server", { cause: error });
  }
};

export default fetchServer;
