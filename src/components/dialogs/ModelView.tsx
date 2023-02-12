import { Image, Box, Code, Heading, VStack } from '@chakra-ui/react'

export interface Props {
  resource_url: string
  prompt: string
}

const ModelView = (props: Props) => {
  return (
    <VStack width={300}>
      <Image
        src={props.resource_url}
        alt="model source"
        borderRadius="lg"
        objectFit={'cover'}
      />
      <Box>
        <Heading size="md" as="h5" mb={1}>
          Promt:
        </Heading>
        <Code>{props.prompt}</Code>
      </Box>
    </VStack>
  )
}

export default ModelView
