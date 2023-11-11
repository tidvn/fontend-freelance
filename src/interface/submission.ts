import type { ListingType, User } from '@prisma/client';

import type { Rewards } from '@/interface/job';

import type { Listings } from './listings';

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
  created_at: string;
  updated_at: string;
  like?: any;
  likes?: number;
  user: User;
  listing?: Listings;
}

export type { SubmissionWithUser };
