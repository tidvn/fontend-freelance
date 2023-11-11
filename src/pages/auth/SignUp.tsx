"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import { useAlert } from "@/context/AlertContext";
import axios from "axios";
import { useRouter } from "next/router";
import { BACKEND_URL } from "@/env";

export default function SignupCard() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { showAlert } = useAlert();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      firstname: "",
      lastname: "",

    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(BACKEND_URL + "/api/register", values, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (res.data.status != "user-created") throw new Error(res.data);
        showAlert({
          status: "success",
          variant: "left-accent",
          message: "SignUp Done",
        });
        router.push('/');
      } catch (error: any) {
        showAlert({
          status: "error",
          variant: "left-accent",
          message: error.response.data.message,
        });
      }
    },
  });
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <form onSubmit={formik.handleSubmit}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstname" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstname"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.firstname}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastname">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastname"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.lastname}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="password_confirmation" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password_confirmation"
                    onChange={formik.handleChange}
                    value={formik.values.password_confirmation}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user? <Link color={"blue.400"} onClick={()=>router.push('/')}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}
