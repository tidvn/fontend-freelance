import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoginModal } from "../modals/LoginModal";
import { signOut } from "next-auth/react";
import { userStore } from "@/store/user";

interface UserInfoProps {
  isMobile?: boolean;
}

export default function UserInfo({ isMobile }: UserInfoProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initialStep, setInitialStep] = useState<number>(1);
  const [isLessthan768] = useMediaQuery("(max-width: 768px)");
  const { userInfo }: any = userStore();
  const displayValue = isMobile
    ? { base: "block", md: "none" }
    : { base: "none", md: "block" };

    return (
      <>
        {userInfo ? (
          <>
            {userInfo &&
              !userInfo?.isTalentFilled &&
              userInfo?.isVerified  && (
                <Button
                  display={displayValue}
                  fontSize="xs"
                  onClick={() => {
                    router.push("/new");
                  }}
                  size="sm"
                  variant={{ base: "solid", md: "ghost" }}
                >
                  Complete your Profile
                </Button>
              )}
            <Menu>
              <MenuButton
                display={isMobile ? "none" : "flex"}
                minW={0}
                cursor={"pointer"}
                rounded={"full"}
              >
                <Flex align="center">
                  {userInfo?.photo ? (
                    <Image
                      boxSize="32px"
                      borderRadius="full"
                      alt={`${userInfo?.lastname} ${userInfo?.lastname}`}
                      src={userInfo?.photo}
                    />
                  ) : (
                    <Avatar
                      name={`${userInfo?.lastname} ${userInfo?.lastname}`}
                      colors={["#92A1C6", "#F0AB3D", "#C271B4"]}
                      size={32}
                      variant="marble"
                    />
                  )}
                  <Box display={displayValue} ml={2}>
                    {!userInfo?.lastname ? (
                      <Text color="brand.slate.800" fontSize="sm">
                        New User
                      </Text>
                    ) : (
                      <Text color="brand.slate.800" fontSize="sm">
                        {userInfo?.lastname}
                      </Text>
                    )}
                   
                  </Box>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  color="brand.slate.500"
                  fontSize="sm"
                  fontWeight={600}
                  onClick={() => {
                    router.push(`/t/${userInfo.username}`);
                  }}
                >
                  Profile
                </MenuItem>
  
                <MenuItem
                  color="brand.slate.500"
                  fontSize="sm"
                  fontWeight={600}
                  onClick={() => {
                    router.push(`/t/${userInfo.username}/edit`);
                  }}
                >
                  Edit Profile
                </MenuItem>
  
                <MenuItem
                  color="brand.slate.500"
                  fontSize="sm"
                  fontWeight={600}
                  onClick={() => {
                    router.push("/dashboard/jobs");
                  }}
                >
                  Company Dashboard
                </MenuItem>
  
                {userInfo?.role === "GOD" && (
                  <>
                    <MenuDivider />
                    <MenuGroup
                      ml={3}
                      color="brand.slate.700"
                      fontSize="xs"
                      fontWeight={700}
                      title="God Mode"
                    >
                      <MenuItem
                        color="brand.slate.500"
                        fontSize="sm"
                        fontWeight={600}
                        onClick={() => {
                          router.push("/new/company");
                        }}
                      >
                        Create New Company
                      </MenuItem>
                    </MenuGroup>
                  </>
                )}
  
                <MenuDivider />
                <MenuItem
                  color="red.500"
                  fontSize="sm"
                  fontWeight={600}
                  onClick={() => signOut()}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <>
            <HStack flexDir={{ base: "column", md: "row" }} gap={2}>
              <HStack gap={0} w={{ base: "100%", md: "auto" }}>
                <Button
                  display={displayValue}
                  w={{ base: "100%", md: "auto" }}
                  fontSize="xs"
                  onClick={onOpen}
                  size="sm"
                  variant={{ base: "solid", md: "ghost" }}
                >
                  Login
                </Button>
                <LoginModal isOpen={isOpen} onClose={onClose} />
              </HStack>
  
              <Button
                display={displayValue}
                w={{ base: "100%" }}
                px={4}
                fontSize="xs"
                onClick={() => router.push("/auth/SignUp")}
                size="sm"
                variant="solid"
              >
                Sign Up
              </Button>
            </HStack>
          </>
        )}
      </>
    );
}
