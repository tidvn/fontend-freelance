
import type { Job, Rewards } from '@/interface/job';

import { User } from './user';

interface SubscribeWithUser {
  id: number;
  email?: string;
  phoneNumber?: string;
  otherInfo?: string;
  userId: number;
  jobId: number;
  isChosen: boolean;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  job?: Job;
}

export type { SubscribeWithUser };
