import type { User } from '@/interface/user';

export interface Comment {
  id: number;
  message: string;
  authorid: number;
  author: User;
  refid: number;
  refType: 'JOB';
}
