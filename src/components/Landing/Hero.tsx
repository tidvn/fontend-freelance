import { Box } from "@chakra-ui/react"
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return(
      <Box
      color={'brand.slate.500'}
      bg={'white'}
      borderTop="1px solid"
      borderTopColor="blackAlpha.200"
    ><pre>{JSON.stringify(session, null, 2)}</pre>
    </Box>) 
  }

  return(
    <Box
    color={'brand.slate.500'}
    bg={'white'}
    borderTop="1px solid"
    borderTopColor="blackAlpha.200"
  ><p>no Signin</p>
  </Box>) 
  
}