import type { ListingType, User } from '@prisma/client';

import type { Rewards } from '@/interface/job';

import type { Jobs } from './listings';

interface SubmissionWithUser {
  id: string;
  link?: string;
  tweet?: string;
  otherInfo?: string;
  eligibilityAnswers?: any;
  userId: string;
  listingType: ListingType;
  listingId: string;
  isWinner: boolean;
  winnerPosition?: keyof Rewards;
  isPaid: boolean;
  paymentDetails?: {
    txId?: string;
  };
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  like?: any;
  likes?: number;
  user: User;
  listing?: Jobs;
}

export type { SubmissionWithUser };
