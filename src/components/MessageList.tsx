// src/components/MessageList.tsx
import { VStack } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <VStack spacing={4} align="stretch">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <MessageItem 
          message={{
            id: 'loading',
            content: '',
            sender: 'system',
            timestamp: new Date(),
            isLoading: true
          }}
        />
      )}
    </VStack>
  );
};

export default MessageList;