import type { Skills } from '@/interface/skills';

export interface AboutYouType {
  bio: string;
  location: string;
  photo: string;
}

export interface WorkType {
  experience: string;
  currentEmployer: string;
  interests: string;
  skills: Skills;
  subSkills: string;
  workPrefernce: string;
  private: boolean;
}

export interface LinksType {
  discord: string;
  twitter: string;
  github: string;
  linkedin: string;
  website: string;
  telegram: string;
}

export interface UserStoreType {
  form: AboutYouType & WorkType & LinksType;
  updateState: (
    data: AboutYouType | WorkType | LinksType | { email: string }
  ) => void;
}
