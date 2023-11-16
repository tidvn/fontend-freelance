import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { QuestionHandler } from "@/components/listings/job/questions/questionHandler";
import type { Eligibility } from "@/interface/job";
import { userStore } from "@/store/user";
import fetchClient from "@/lib/fetch-client";

interface Props {
  id: number;
  isOpen: boolean;
  onClose: () => void;
  eligibility: Eligibility[];
  setIsSubmitted: (arg0: boolean) => void;
  setSubscribeNumber: (arg0: number) => void;
  subscribeNumber: number;
  jobtitle: string;
  type?: string;
}
export const SubscribeModal = ({
  id,
  isOpen,
  onClose,
  eligibility,
  setIsSubmitted,
  setSubscribeNumber,
  subscribeNumber,
  jobtitle,
  type,
}: Props) => {
  const isPermissioned =
    type === "permissioned" && eligibility && eligibility?.length > 0;
  const { userInfo } = userStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const submitSubscribes = async (data: any) => {
    setIsLoading(true);
    try {
      const { email, phoneNumber, otherInfo, ...answers } = data;
      const eligibilityAnswers = eligibility.map((q) => ({
        question: q.question,
        answer: answers[`eligibility-${q.order}`],
      }));
      await fetchClient({
        method: "POST",
        endpoint: "/api/jobs/subscribe",
        body: JSON.stringify({
          userId: userInfo?.id,
          jobId: id,
          email: email || "",
          phoneNumber: phoneNumber || "",
          otherInfo: otherInfo || "",
          eligibilityAnswers: eligibilityAnswers.length
            ? eligibilityAnswers
            : null,
        }),
      });
      
      reset();
      setIsSubmitted(true);
      setSubscribeNumber(subscribeNumber + 1);

      onClose();
    } catch (e) {
      setError("Sorry! Please try again or contact support.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior={"inside"}
      size={"xl"}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader color="brand.slate.800">
          {isPermissioned ? "Submit Your Application" : "Job Subscribe"}
        </ModalHeader>
        <ModalCloseButton />
        <VStack
          align={"start"}
          gap={3}
          overflow={"scroll"}
          maxH={"50rem"}
          pb={6}
          px={6}
        >
          <Box>
            <Text mb={1} color={"brand.slate.500"} fontSize="sm">
              {isPermissioned
                ? "Don't start working just yet! Apply first, and then begin working only once you've been hired for the project by the company."
                : `Leave some of your information, maybe we will contact you soon`}
            </Text>
            <Text color={"brand.slate.500"} fontSize="sm">
              {!!isPermissioned &&
                "The company has received your application and may contact you in the near future"}
            </Text>
          </Box>
          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit((e) => {
              submitSubscribes(e);
            })}
          >
            <VStack gap={4} mb={5}>
              {!isPermissioned ? (
                <>
                  <FormControl isRequired>
                    <FormLabel
                      mb={0}
                      color={"brand.slate.800"}
                      fontWeight={600}
                      htmlFor={"email"}
                    >
                      Email
                    </FormLabel>
                    <Input
                      borderColor={"brand.slate.300"}
                      _placeholder={{ color: "brand.slate.300" }}
                      focusBorderColor="brand.purple"
                      id="email"
                      placeholder="Email"
                      {...register("email")}
                    />
                    <FormErrorMessage>
                      {errors.email ? <>{errors.email.message}</> : <></>}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      mb={0}
                      color={"brand.slate.800"}
                      fontWeight={600}
                      htmlFor={"phoneNumber"}
                    >
                      Phone number
                    </FormLabel>
                    <Input
                      borderColor={"brand.slate.300"}
                      _placeholder={{ color: "brand.slate.300" }}
                      focusBorderColor="brand.purple"
                      id="phoneNumber"
                      placeholder="Add a tweet's link"
                      {...register("phoneNumber")}
                    />
                    <FormErrorMessage>
                      {errors.phoneNumber ? (
                        <>{errors.phoneNumber.message}</>
                      ) : (
                        <></>
                      )}
                    </FormErrorMessage>
                  </FormControl>
                </>
              ) : (
                eligibility?.map((e) => {
                  return (
                    <FormControl key={e?.order} isRequired>
                      <QuestionHandler
                        register={register}
                        question={e?.question}
                        type={e?.type ?? "text"}
                        label={`eligibility-${e?.order}`}
                      />
                    </FormControl>
                  );
                })
              )}
              <FormControl>
                <FormLabel
                  mb={0}
                  color={"brand.slate.800"}
                  fontWeight={600}
                  htmlFor={"phoneNumber"}
                >
                  Anything Else?
                </FormLabel>
                <FormHelperText mt={0} mb={2} color="brand.slate.500">
                  You can leave a message or anything that makes an impression!
                </FormHelperText>
                <Input
                  borderColor={"brand.slate.300"}
                  _placeholder={{ color: "brand.slate.300" }}
                  focusBorderColor="brand.purple"
                  id="otherInfo"
                  maxLength={180}
                  placeholder="Add info or link"
                  {...register("otherInfo")}
                />
                <Text
                  color={
                    (watch("otherInfo")?.length || 0) > 160
                      ? "red"
                      : "brand.slate.400"
                  }
                  fontSize={"xs"}
                  textAlign="right"
                >
                  {180 - (watch("otherInfo")?.length || 0)} characters left
                </Text>
                <FormErrorMessage>
                  {errors.otherInfo ? <>{errors.otherInfo.message}</> : <></>}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            {!!error && (
              <Text align="center" mb={2} color="red">
                Sorry! Error occurred which submitting application. <br />
                Please try again or contact support.
              </Text>
            )}
            <Button
              w={"full"}
              isLoading={!!isLoading}
              loadingText="Submitting..."
              type="submit"
              variant="solid"
            >
              {!isPermissioned ? "Submit" : "Apply"}
            </Button>
          </form>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
