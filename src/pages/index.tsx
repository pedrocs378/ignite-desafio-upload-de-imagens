import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

import { api } from '../services/api';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = null }) => {
      const response = await api.get('/api/images', {
        params: {
          after: pageParam
        }
      })

      return response.data
    },
    {
      getNextPageParam: (lastPage) => lastPage.after || null
    }
  );

  const formattedData = useMemo(() => {
    const newData = data?.pages
      .map(page => {
        return page.data
      })
      .flat()

    return newData
  }, [data]);

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            mt="40px"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </Button>
        )}
      </Box>
    </>
  );
}
