import { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Circle,
  Flex,
  Popover,
  Portal,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import useAiChat from '../hooks/useAiChat';
import type { ContentListUnion, Content, PartUnion } from '@google/genai';
import { toaster } from './ui/toaster';

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState<ContentListUnion>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { sendMessage, isPending } = useAiChat();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setHistory([]);
    setUserInput('');
  };

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      setHistory([]);
      setUserInput('');
    }
    setIsOpen(details.open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    try {
      const response = await sendMessage(userInput, history);
      setUserInput('');

      setHistory(response.history);

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toaster.error({
        title: 'Error encountered',
        description: 'Please try again with slightly different input',
      });
    }
  };

  return (
    <Box position='fixed' bottom='24px' right='24px' zIndex='tooltip'>
      <Popover.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        closeOnInteractOutside={false}
        size={'lg'}
      >
        <Popover.Trigger asChild>
          <Circle
            as='button'
            cursor={'pointer'}
            size='50px'
            bg='primary.subtle'
            color='fg'
            onClick={handleOpen}
            boxShadow='md'
            _hover={{ bg: 'bg.panel' }}
            _active={{ transform: 'scale(0.95)' }}
            transition='all 0.2s'
          >
            <Avatar.Root size='sm'>
              <Avatar.Fallback name='Assistant' />
            </Avatar.Root>
          </Circle>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              width='350px'
              height='500px'
              p={0}
              overflow='hidden'
              borderRadius='md'
              boxShadow='lg'
            >
              <Flex direction='column' h='100%'>
                {/* Chat header */}
                <Flex
                  p={3}
                  borderBottomWidth='1px'
                  alignItems='center'
                  bg='bg.subtle'
                  color='fg'
                >
                  <Avatar.Root size='xs' mr={2}>
                    <Avatar.Fallback name='Assistant' />
                  </Avatar.Root>
                  <Text fontWeight='medium'>File Assistant</Text>
                  <Button
                    size='sm'
                    ml='auto'
                    variant='ghost'
                    color='fg'
                    onClick={handleClose}
                  >
                    ✕
                  </Button>
                </Flex>

                {/* Messages container */}
                <VStack
                  flex={1}
                  p={3}
                  gap={3}
                  align='stretch'
                  overflowY='auto'
                  bg='bg.subtle'
                  onClick={scrollToBottom}
                >
                  {(history as Content[])
                    .filter((he) => ['user', 'model'].includes(he.role ?? ''))
                    .filter((he) => he.parts![0]?.text)
                    .map((historyEntry, i) => (
                      <Flex
                        key={i}
                        justify={
                          historyEntry.role === 'user'
                            ? 'flex-end'
                            : 'flex-start'
                        }
                      >
                        <Box
                          maxW='80%'
                          p={2}
                          borderRadius='md'
                          bg={
                            historyEntry.role === 'user' ? 'bg-inverted' : 'bg'
                          }
                          color={
                            historyEntry.role === 'user' ? 'fg-inverted' : 'fg'
                          }
                          boxShadow='sm'
                        >
                          <Text fontSize='sm'>
                            {historyEntry.parts![0]?.text ?? 'EMPTY'}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  <Box ref={messagesEndRef} />
                </VStack>

                {/* Message input */}
                <Box p={3} borderTopWidth='1px'>
                  <form onSubmit={handleSubmit}>
                    <Flex>
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder='Type a message...'
                        size='sm'
                        mr={2}
                        disabled={isPending}
                        maxH='150px'
                        autoresize
                        resize='none'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      />
                      <Button
                        type='submit'
                        size='sm'
                        bg='primary.subtle'
                        color='fg'
                        loading={isPending}
                      >
                        Send
                      </Button>
                    </Flex>
                  </form>
                </Box>
              </Flex>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </Box>
  );
};

export default Assistant;
