import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import Avatar from 'boring-avatars';

import { userStore } from '@/store/user';

function Banner() {
  const { userInfo } = userStore();

  if (!userInfo?.currentCompanyId) return null;
  return (
    <Box
      mb={6}
      px={8}
      py={6}
      color="white"
      borderRadius="md"
      bgColor="brand.charcoal.700"
    >
      <Flex align="start" bg="transparent">
        {userInfo?.currentCompany?.logo ? (
          <Image
            boxSize="52px"
            mt={2}
            borderRadius="full"
            alt={userInfo?.currentCompany?.name}
            src={userInfo?.currentCompany?.logo}
          />
        ) : (
          <Avatar
            colors={['#92A1C6', '#F0AB3D', '#C271B4']}
            name={userInfo?.currentCompany?.name}
            size={32}
            variant="marble"
          />
        )}
        <Box display={{ base: 'none', md: 'block' }} ml={6}>
          <Text fontSize="2xl" fontWeight={700}>
            {userInfo?.currentCompany?.name}
          </Text>
          <Text fontSize="md" fontWeight={400}>
            {userInfo?.currentCompany?.bio || ''}
          </Text>
          <Link
            color="brand.slate.300"
            fontSize="sm"
            fontWeight={400}
            href={userInfo?.currentCompany?.url}
            isExternal
          >
            {userInfo?.currentCompany?.url}
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

export default Banner;
