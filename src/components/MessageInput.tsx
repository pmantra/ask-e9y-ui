import { useState, FormEvent, useRef, useEffect } from 'react';
import {
  Flex,
  Textarea,
  IconButton,
  Text,
  Box,
  useToken
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const MessageInput = ({ onSendMessage, isDisabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [blue400] = useToken('colors', ['blue.400']); // Get blue color from theme
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
          borderColor="gray.300"
          overflow="hidden"
          bg="white"
          position="relative"
          align="center"
          transition="all 0.2s"
          _focusWithin={{
            borderColor: blue400,
            boxShadow: `0 0 0 1px ${blue400}`
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
            py={2}
            px={4}
            _focus={{
              boxShadow: 'none'
            }}
            minH="40px"
            maxH="150px"
            isDisabled={isDisabled}
          />
          <IconButton
            aria-label="Send message"
            icon={<ArrowUpIcon />}
            isRound
            colorScheme="blue"
            size="sm"
            type="submit"
            isDisabled={isDisabled || !message.trim()}
            mr={1}
          />
        </Flex>
      </form>
      <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
        Press Enter to send, Shift+Enter for a new line
      </Text>
    </Box>
  );
};

export default MessageInput;