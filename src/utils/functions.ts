/* eslint-disable no-nested-ternary */
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuidV4 } from 'uuid';

import type { Grant } from '@/interface/grant';
import type { Notifications } from '@/interface/user';

import type { Comment } from '../interface/comments';
import type {
  Listings,
  DraftType,
  GrantsType,
  SubmissionType,
  SubscribeType,
} from '../interface/listings';
// types
import type { CompanyType } from '../interface/company';
import type { Talent } from '../interface/talent';
import { CompanyStore } from '../store/company';
import { BACKEND_URL } from '@/env';


export const createUser = async (publickey: string) => {
  const id = uuidV4();
  try {
    const res = await axios.post(`${BACKEND_URL}/user/create`, {
      id,
      publickey,
    });
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export const UpdateUser = async (id: string, update: any) => {
  try {
    const res = await axios.patch(`${BACKEND_URL}/user/update`, {
      id,
      update,
    });
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const generateOtp = async (
  publicKey: string | undefined,
  email: string
): Promise<
  | any
  | {
      (headerName: string, parser: RegExp): RegExpExecArray | null;
      (headerName: string, matcher?: true | undefined): any;
    }
  | undefined
> => {
  try {
    const res = await axios.post(`${BACKEND_URL}/email/totp`, {
      publicKey,
      email,
    });
    return res?.headers?.get;
  } catch (e) {
    console.log(e);
    return null;
  }
};
// Companies
export const createCompany = async (company: CompanyType) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/company/create`, {
      ...company,
    });
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const findCompanies = async (publicKey: string) => {
  if (!publicKey) return null;
  try {
    const { data } = await axios.get(
      `${BACKEND_URL}/company/find?publickey=${publicKey}`
    );
    CompanyStore.setState({
      currentCompany: data.data[0],
    });
    return data.data ?? [];
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const DeleteCompany = async (id: string) => {
  try {
    const { data } = await axios.delete(`${BACKEND_URL}/company/delete/${id}`);
    return data;
  } catch (e) {
    console.log(e);

    return null;
  }
};

export const findCompanyListing = async (orgId: string) => {
  if (!orgId) {
    throw new Error('orgId undefined!');
  }
  const res = await axios.get(`${BACKEND_URL}/listings/find?orgId=${orgId}`);
  return res.data.data;
};

// Drafts
export const findCompanyDrafts = async (orgId: string) => {
  if (!orgId) {
    throw new Error('orgId undefined!');
  }
  const res = await axios.get(`${BACKEND_URL}/drafts/findall?orgId=${orgId}`);
  return res.data.data;
};
export const CreateDraft = async (draft: DraftType) => {
  try {
    const { data } = await axios.post(`${BACKEND_URL}/drafts/create`, {
      ...draft,
    });
    return data.data;
  } catch (e) {
    return null;
  }
};
export const findOneDraft = async (id: string) => {
  const { data, status } = await axios.get(
    `${BACKEND_URL}/drafts/find?id=${id}`
  );
  if (status === 200) {
    return data;
  }
  if (status === 204) {
    return toast.error('draft not found');
  }
  return null;
};
export const findTeam = async (id: string) => {
  if (!id) return null;
  try {
    const { data } = await axios.get(`${BACKEND_URL}/company/team?id=${id}`);

    return data.data ?? [];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Listings
export const createJob = async (
  jobs: Listings,
  company: CompanyType
) => {
  try {
    const { data } = await axios.post(`${BACKEND_URL}/listings/job/create`, {
      id: jobs.id,
      title: jobs.title,
      token: jobs.token,
      slug: jobs.slug,
      deadline: jobs.deadline,
      description: jobs.description,
      companyStatus: jobs.companyStatus,
      featured: jobs.featured,
      orgId: company.id,
      skills: jobs.skills,
      subSkills: jobs.subSkills,
      prizeList: jobs.prizeList,
      active: jobs.active,
      private: false,
      amount: jobs.amount,
      eligibility: jobs.eligibility,
      status: jobs.status,
    });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
type FindBoutiesReturn = {
  listing: Listings;
  company: CompanyType;
} | null;

export const findBouties = async (slug: string): Promise<FindBoutiesReturn> => {
  if (!slug) return null;
  const { data, status } = await axios.get(
    `${BACKEND_URL}/listings/job/find/${slug}`
  );
  if (status === 204) {
    return null;
  }

  return data.data;
};

export const createGrants = async (grants: GrantsType) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/listings/grants/create`, {
      ...grants,
    });
    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const createComment = async (comment: Comment) => {
  const { data, status } = await axios.post(`${BACKEND_URL}/comment/create`, {
    ...comment,
  });

  if (status !== 200) {
    return null;
  }
  return data;
};

export const findTalentPubkey = async (pubkey: string) => {
  const { data, status } = await axios.get(
    `${BACKEND_URL}/talent/find/publickey/${pubkey}`
  );

  if (status !== 200) {
    return null;
  }
  return data;
};

export const fetchComments = async (id: string) => {
  if (!id) return null;
  const { data } = await axios.get(`${BACKEND_URL}/comment/find/${id}`);

  return data.data ?? [];
};

export const createSubmission = async (sub: SubmissionType) => {
  try {
    const { data } = await axios.post(`${BACKEND_URL}/submission/create`, {
      ...sub,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchOgImage = async (url: string) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/submission/ogimage`, {
      url,
    });
    return res.data;
  } catch (error) {
    return null;
  }
};
export const addLike = async (id: string, likeId: string) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/submission/create/like`, {
      id,
      likeId,
    });
    return res.data;
  } catch (error) {
    return null;
  }
};

export const findSubmission = async (id: string) => {
  try {
    const { status, data } = await axios.get(
      `${BACKEND_URL}/submission/find/${id}`
    );

    if (status !== 200) {
      return null;
    }

    return data.data as SubmissionType;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const findGrants = async (slug: string): Promise<Grant | null> => {
  if (!slug) return null;
  try {
    const { data, status } = await axios.get(`/api/grants/${slug}`);
    if (status !== 200) {
      return null;
    }
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const createSubscription = async (sub: SubscribeType) => {
  try {
    const { data, status } = await axios.post(
      `${BACKEND_URL}/listings/sub/create`,
      {
        ...sub,
      }
    );
    if (status !== 201) {
      return null;
    }
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const removeSubscription = async (id: string) => {
  try {
    const { data, status } = await axios.delete(
      `${BACKEND_URL}/listings/sub/delete/${id}`
    );
    if (status !== 200) {
      return null;
    }
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createQuestions = async (questions: {
  id: string;
  jobsId: string;
  questions: string;
}) => {
  try {
    const { data, status } = await axios.post(
      `${BACKEND_URL}/listings/question/create`,
      {
        ...questions,
      }
    );
    console.log(data, status);

    if (status !== 201) {
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const AllGrants = async (): Promise<
  | {
      grants: GrantsType;
      companyInfo: CompanyType;
    }[]
  | null
> => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/listings/grants/find/all`);
    console.log(data);

    return data.data;
  } catch (error) {
    console.log(error, 'error');
    return null;
  }
};

export const updateNotification = async (
  id: string,
  notification: Notifications[]
) => {
  try {
    const { data, status } = await axios.post(`/api/user/updateNotification`, {
      id,
      notification,
    });
    if (status !== 200) {
      return null;
    }
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const TalentTVE = async (): Promise<Talent[] | null> => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/talent/find/tve`);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
