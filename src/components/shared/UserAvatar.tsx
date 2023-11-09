import { Image } from '@chakra-ui/react';
import Avatar from 'boring-avatars';

import type { User } from '@/interface/user';

function UserAvatar({ user }: { user: User }) {
  if (user?.photo) {
    return (
      <Image
        boxSize="32px"
        borderRadius="full"
        alt={`${user?.firstname} ${user?.lastname}`}
        src={user?.photo}
      />
    );
  }
  return (
    <Avatar
      name={`${user?.firstname} ${user?.lastname}`}
      colors={['#92A1C6', '#F0AB3D', '#C271B4']}
      size="32px"
      variant="marble"
    />
  );
}

export default UserAvatar;
