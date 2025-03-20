import { Box, Divider } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSaveQuery?: () => void;  // Added prop to pass to MessageItem
}

const MessageList = ({ messages, isLoading, onSaveQuery }: MessageListProps) => {
  return (
    <Box width="100%" overflowY="auto" px={2}>
      {messages.map((message, index) => (
        <Box key={message.id}>
          <MessageItem 
            message={message} 
            onSaveQuery={onSaveQuery}  // Pass the callback to each MessageItem
          />
          {/* Add subtle divider between groups of messages, but not every message */}
          {index < messages.length - 1 && 
           messages[index].sender !== messages[index + 1].sender && (
            <Divider my={2} borderColor="gray.100" />
          )}
        </Box>
      ))}
      
      {/* Loading message at the end */}
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
    </Box>
  );
};

export default MessageList;