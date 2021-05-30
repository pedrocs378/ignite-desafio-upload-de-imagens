import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';

import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure()

  const [selectedImageUrl, setSelectedImageUrl] = useState('')

  function handleViewImage(url: string) {
    setSelectedImageUrl(url)
    onOpen()
  }

  function handleCloseViewImage() {
    onClose()
    setSelectedImageUrl('')
  }

  return (
    <>
      <ModalViewImage
        isOpen={isOpen}
        onClose={handleCloseViewImage}
        imgUrl={selectedImageUrl}
      />

      <SimpleGrid
        columns={3}
        spacing="40px"
      >
        {cards.map(card => {
          return (
            <Card key={card.id} data={card} viewImage={handleViewImage} />
          )
        })}
      </SimpleGrid>
    </>
  );
}
