import fetchClient from "@/lib/fetch-client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  jobId: number | undefined;
  talentId: number | undefined;
  isDeadlinePassed?: boolean;
}

function PublishResults({
  isOpen,
  onClose,
  jobId,
  talentId,
  isDeadlinePassed,
}: Props) {
  const [isPublishingResults, setIsPublishingResults] = useState(false);

  const publishResults = async () => {
    if (!jobId || !talentId) return;
    setIsPublishingResults(true);

    try {
      await fetchClient({
        method: "POST",
        endpoint: `/api/jobs/update`,
        body: JSON.stringify({
          jobId: jobId,
          chosen: talentId,
          data: { status: "CLOSED", isWinnersAnnounced: true },
        }),
      });
      setIsPublishingResults(false);
      onClose();
    } catch (e) {
      setIsPublishingResults(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Results</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          The job will be marked as closed for the selected talent.
        </ModalBody>
        <ModalFooter>
          <>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
            <Button
              ml={4}
              // isDisabled={rewards?.length || true}
              isLoading={isPublishingResults}
              loadingText={"Publishing..."}
              onClick={() => publishResults()}
              variant="solid"
            >
              Agree
            </Button>
          </>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PublishResults;
