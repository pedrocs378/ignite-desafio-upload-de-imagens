import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          maxW="900px"
          maxH="600px"
          display="flex"
          justifyContent="center"
          p="0"
          bgColor="black"
        >
          <Image
            src={imgUrl}
            w="100%"
          />
        </ModalBody>
        <ModalFooter bgColor="pGray.800">
          <Link
            href={imgUrl}
            rel="noreferrer noopener"
            target="_blank"
            marginRight="auto"
          >
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
