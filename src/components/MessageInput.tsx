// src/components/MessageInput.tsx
import { useState, FormEvent } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Textarea,
} from '@chakra-ui/react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const MessageInput = ({ onSendMessage, isDisabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isDisabled) return;
    
    onSendMessage(message);
    setMessage('');
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
    <Box borderTopWidth="1px" p={4}>
      <form onSubmit={handleSubmit}>
        <Flex>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your data..."
            size="md"
            resize="none"
            rows={1}
            mr={2}
            isDisabled={isDisabled}
          />
          <Button
            colorScheme="blue"
            type="submit"
            isDisabled={isDisabled || !message.trim()}
            isLoading={isDisabled}
          >
            Send
          </Button>
        </Flex>
      </form>
      <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
        Press Enter to send, Shift+Enter for a new line
      </Text>
    </Box>
  );
};

export default MessageInput;