import type { SponsorType } from '@/interface/sponsor';
import type { UserSponsor } from '@/interface/userSponsor';

import type { PoW } from './pow';
import type { SubmissionWithUser } from './submission';

interface Notifications {
  label: string;
  timestamp: number;
}

interface User {
  id?: string;
  publicKey?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  talent?: boolean;
  sponsor?: boolean;
  isTalentFilled?: boolean;
  bio?: string;
  location?: string;
  photo?: string;
  experience?: string;
  cryptoExperience?: string;
  currentEmployer?: string;
  community?: string;
  interests?: string;
  skills?: string;
  subSkills?: string;
  workPrefernce?: string;
  discord?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  telegram?: string;
  pow?: string;
  notifications?: Notifications[] | null;
  totalEarnedInUSD?: number;
  currentSponsorId?: string;
  currentSponsor?: SponsorType;
  UserSponsors?: UserSponsor[];
  PoW?: PoW[];
  private?: boolean;
  Submission?: SubmissionWithUser[];
}
export type { Notifications, User };
