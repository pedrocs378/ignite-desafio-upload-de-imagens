import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';

import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

import { api } from '../../services/api';

interface ImageData {
  description: string
  title: string
  url: string
}

interface FormData {
  description: string
  title: string
  image: FileList
}

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: (value: FileList) => {
          return value[0].size < 10 * 1000 * 1000 || 'O arquivo deve ser menor que 10MB'
        },
        acceptedFormats: (value: FileList) => {
          return !!value[0].type.match(/image\/(jpeg|png|gif)/) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
        }
      }
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres'
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres'
      }
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres'
      }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation((data: ImageData) => {
    return api.post('/api/images', data)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('images')
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: FormData): Promise<void> => {

    try {
      if (!imageUrl.trim()) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.'
        })

        return
      }

      await mutation.mutateAsync({
        title: data.title,
        description: data.description,
        url: imageUrl
      })

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.'
      })
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.'
      })
    } finally {
      reset(data)
      setImageUrl('')
      setLocalImageUrl('')
      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          {...register('image', formValidations.image)}
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          error={errors.image}
        />

        <TextInput
          {...register('title', formValidations.title)}
          placeholder="Título da imagem..."
          name="title"
          error={errors.title}
        />

        <TextInput
          {...register('description', formValidations.description)}
          placeholder="Descrição da imagem..."
          name="description"
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
