import { getSession, signOut } from "next-auth/react";

interface fetchClientProps {
  method?: string;
  endpoint: string;
  body?: string;
  token?: string;
}

async function fetchClient({ method = "GET", endpoint, body = "", token }: fetchClientProps) {
  try {
    const session:any = await getSession();
    const accessToken = token || session?.JWT.accessToken;
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://frelan.test";
    const response = await fetch(backend_url + endpoint.toString(), {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer" + accessToken,
      },
      body: body || undefined,
    });

    if (!response.ok) {
      throw response;
    }

    return response;
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 401) {
        signOut();
      }

      if (error.status === 409) {
        window.location.href = "/request-email-verification";
      }

      throw error;
    }

    throw new Error("Failed to fetch data", { cause: error });
  }
}

export default fetchClient;
