import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
};

export const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
}: PropsWithChildren<Props>) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} variant="solid">
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
