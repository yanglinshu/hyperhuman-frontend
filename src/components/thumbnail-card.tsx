import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Icon,
  Image,
  VStack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  useDisclosure,
  Wrap,
  HStack,
} from '@chakra-ui/react'
import DialogCard from './dialog-card'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useState } from 'react'

const ThumbnailCard = () => {
  let { isOpen, onOpen, onClose } = useDisclosure()
  const [isLiked, setIsLiked] = useState(false)
  const getIcon = () => {
    return <Icon as={isLiked ? AiFillHeart : AiOutlineHeart} m={0}></Icon>
  }
  return (
    <Card maxW="sm" variant="outline">
      <Image
        src="data:image/jpeg;base64,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"
        alt="A laughing man"
        borderRadius="lg"
        objectFit="cover"
        boxSize={300}
        borderBottomRadius="0"
      />
      <CardBody px={0} onClick={onOpen}>
        <VStack mt={1} spacing="3">
          <Text color="" fontSize="md" maxWidth={250}>
            He has a great smile He has a face only a 6other could love. He has
            got dimples. One of his eyes is bigger than the other.
          </Text>
        </VStack>
      </CardBody>
      <Divider />
      <CardFooter justifyContent="space-around" p={4} alignItems="center">
        <DialogCard
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
        ></DialogCard>
        <Text color="gray.400">@Qingcheng</Text>
        <Text color="gray.400">300view</Text>
        <Button
          rightIcon={getIcon()}
          variant="ghost"
          iconSpacing={0}
          color={isLiked ? 'pink.400' : ''}
          onClick={() => {
            setIsLiked(!isLiked)
            console.log(isLiked)
          }}
        ></Button>
      </CardFooter>
    </Card>
  )
}

export default ThumbnailCard
