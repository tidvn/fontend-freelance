import { backend_url } from '@/env';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
interface fetchClientProps {
  method?: string;
  endpoint: string;
  body?: string;
  token?: string;
}

async function fetchClient({ method = 'GET', endpoint, body = '', token=""}: fetchClientProps) {
  try {
    const session: any = await getSession();
    const accessToken = token || session?.accessToken;

    const axiosConfig = {
      method: method,
      url: backend_url + endpoint.toString(),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer${accessToken}`, // Note the space after "Bearer"
      },
      data: body || undefined,
    };

    const response = await axios(axiosConfig);

    if (!response.status || response.status < 200 || response.status > 300) {
      throw response;
    }

    return response;
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error) && error.response) {
      const errorResponse = error.response;

      if (errorResponse.status === 401) {
        signOut();
      }

      if (errorResponse.status === 409) {
        window.location.href = '/request-email-verification';
      }

      throw errorResponse;
    }

    throw new Error('Failed to fetch data', { cause: error });
  }
}

export default fetchClient;
