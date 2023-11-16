import type { PoW } from './pow';

export interface Talent {
  id: number;
  publickey: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  skills: string;
  subskills: string;
  avatar: string;
  interests: string;
  bio: string;
  community: string;
  verified: boolean;
  experience: string;
  location: string;
  cryptoExperience: string;
  workPrefernce: string;
  currentEmployer: string;
  pow: string;
  tve?: number;
  github?: string;
  linkedin?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  notifications?: string;
  PoW?: PoW[];
}
