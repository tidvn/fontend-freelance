import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

import { useSession } from 'next-auth/react';

function TalentButton() {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { data: session, status } = useSession();
  const  userInfo  = session?.user;
  const checkTalent = async () => {
    if (!userInfo || !userInfo?.id) {
      setShowMessage(true);
    } else {
      setShowMessage(false);
      setIsLoading(true);
      try {
        if (!userInfo?.isTalentFilled) {
          router.push('/new/talent');
        } else {
          router.push('/');
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {!!showMessage && (
        <Alert mb={4} status="warning">
          <AlertIcon />
          Please log in to continue!
        </Alert>
      )}
      <Button
        w={'full'}
        h={12}
        color={'white'}
        fontSize={'0.9rem'}
        bg={'#6562FF'}
        _hover={{ bg: '#6562FF' }}
        isLoading={!!isLoading}
        leftIcon={<FaUser />}
        loadingText="Redirecting..."
        onClick={() => checkTalent()}
      >
        Make Your Talent Profile
      </Button>
    </>
  );
}

export default TalentButton;
