import { useState, FormEvent, useRef, useEffect } from 'react';
import {
  Flex,
  Textarea,
  Text,
  Box,
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const MessageInput = ({ onSendMessage, isDisabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150); // Max height of 150px
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isDisabled) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Reset height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  // Handle Shift+Enter for newlines, Enter for submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isDisabled) {
        handleSubmit(e);
      }
    }
  };
  
  return (
    <Box width="100%">
      <form onSubmit={handleSubmit}>
        <Flex 
          borderWidth="1px" 
          borderRadius="full"
          borderColor="neutral.30"
          overflow="hidden"
          bg="neutral.10"
          position="relative"
          align="center"
          transition="all 0.2s"
          _focusWithin={{
            borderColor: 'primary.30',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary-30)'
          }}
          _hover={{
            borderColor: 'neutral.40'
          }}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your data..."
            border="none"
            resize="none"
            rows={1}
            py={3}
            px={4}
            _focus={{
              boxShadow: 'none'
            }}
            _placeholder={{
              color: 'neutral.50'
            }}
            color="neutral.60"
            fontFamily="sansSerif.normal"
            fontSize="md"
            minH="44px"
            maxH="150px"
            isDisabled={isDisabled}
          />
          <Box
            as="button"
            type="submit"
            aria-label="Send message"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="36px"
            height="36px"
            borderRadius="full"
            bg="#00856f"
            color="white"
            mr={2}
            my={1}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              bg: '#005d4e',
              transform: 'translateY(-1px)'
            }}
            _active={{
              bg: '#00413e',
              transform: 'translateY(0)'
            }}
            _disabled={{
              bg: '#99CEC5',
              cursor: 'not-allowed',
              _hover: { bg: '#99CEC5' }
            }}
            disabled={isDisabled || !message.trim()}
          >
            <ArrowUpIcon />
          </Box>
        </Flex>
      </form>
      <Text 
        fontSize="xs" 
        color="neutral.50" 
        mt={2} 
        textAlign="center"
        fontFamily="sansSerif.normal"
      >
        Press Enter to send, Shift+Enter for a new line
      </Text>
    </Box>
  );
};

export default MessageInput;