import {
  Card,
  CardBody,
  CardFooter,
  Box,
  Icon,
  Image,
  Text,
  Divider,
  useDisclosure,
  Center,
  IconButton,
  Tooltip,
  HStack,
  Flex,
} from '@chakra-ui/react'

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { TaskSession } from '@/models/task/cards'
import DialogCard from '@/components/dialogs/DialogCard'
import { TaskDetail } from '@/models/task/detail'
import { useState } from 'react'
import { doGetTaskDetail } from '@/api/task'
import styles from '@/styles/Thumbnail.module.css'

interface Props extends TaskSession {
  onLike: () => void
}

function getLikeIcon(is_liked: boolean) {
  return (
    <Icon as={is_liked ? AiFillHeart : AiOutlineHeart} m={0} boxSize={6}></Icon>
  )
}

export default function ThumbnailCard(props: Props) {
  let { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      const fetchInitTaskDetail = async () => {
        setTaskDetail(await doGetTaskDetail(props.task_uuid))
      }
      fetchInitTaskDetail()
    },
  })

  const [taskDetail, setTaskDetail] = useState<TaskDetail>({
    ...props,
    chat_history: [],
    resource_url: '',
  })

  return (
    <Card
      maxW="sm"
      variant="outline"
      className={styles.container}
      onClick={onOpen}
    >
      <Box className={styles.background}>
        <Box>
          <Image
            src={props.image_url}
            alt="media source"
            borderRadius="lg"
            objectFit="cover"
            boxSize={200}
            borderBottomRadius="0"
          />
        </Box>
        <HStack
          justifyContent="space-between"
          p={2}
          alignItems="center"
          className={styles.footer}
          width="100%"
        >
          <Text color="gray.400">Clarive</Text>
          <Text color="gray.400">300 view</Text>
        </HStack>
        <DialogCard
          {...taskDetail}
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
        ></DialogCard>
      </Box>
      <Box
        className={styles.overlay}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex flexDirection="row-reverse">
          <IconButton
            aria-label="Like"
            icon={getLikeIcon(props.is_liked)}
            color={props.is_liked ? 'pink.400' : ''}
            onClick={props.onLike}
            size="sm"
          ></IconButton>
        </Flex>
        <Center>
          <Box mx={2} mb={2} p={2} className={styles['prompt-box']}>
            <Text className={styles['prompt-text']} noOfLines={3}>
              {props.prompt}
            </Text>
          </Box>
        </Center>
      </Box>
    </Card>
  )
}
