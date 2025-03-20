import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import {
  Box, 
  Flex,   
  IconButton, 
  Text
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, QueryHistoryItem } from '../types';
import { addQueryToHistory } from '../services/storageService';
import { sendQuery } from '../services/api';

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  onQueryRun: (query: string) => void;
  onSaveQuery: () => void;
}

const ChatInterface = forwardRef(({ onToggleSidebar, onQueryRun, onSaveQuery }: ChatInterfaceProps, ref) => {  
  // =========== State Management ===========
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to Ask E9Y! Ask me questions about your data.',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setCurrentQuery] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  
  // =========== Refs and Hooks ===========
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // =========== Expose Methods via Ref ===========
  useImperativeHandle(ref, () => ({
    runQuery: (query: string) => {
      handleSendMessage(query);
    }
  }));
  
  // =========== Effects ===========
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // =========== Query Processing ===========
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setCurrentQuery(content);
    addUserMessage(content);
    setIsLoading(true);
    
    try {
      onQueryRun(content);
      const response = await processQuery(content);
      addSystemMessage(response, content); // Pass content directly to avoid state timing issues
      addToQueryHistory(content, response.query_id, true);
    } catch (error) {
      console.error("API Error:", error);
      addErrorMessage(error);
      addToQueryHistory(content, undefined, false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // =========== Helper Functions ===========
  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
  };
  
  const processQuery = async (content: string) => {
    const response = await sendQuery({
      query: content,
      conversation_id: conversationId,
      include_sql: true,
      max_results: 100,
      include_explanation: true,       
      include_cached_explanation: true
    });
    
    if (!conversationId && response.conversation_id) {
      setConversationId(response.conversation_id);
    }
    
    return response;
  };
  
  const addSystemMessage = (response: any, originalQuery: string) => {
    const systemMessage: Message = {
      id: response.query_id,
      content: response.message || 'Here are the results of your query.',
      sender: 'system',
      timestamp: new Date(),
      hasResults: response.has_results,
      explanation: response.explanation,
      timing_stats: response.timing_stats,
      original_user_query: originalQuery, // Use the passed query directly
      queryResults: {
        sql: response.query_details?.generated_sql,
        results: response.results,
        executionTimeMs: response.query_details?.execution_time_ms,
        rowCount: response.query_details?.row_count,
        query_details: response.query_details
      }
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };
  
  const addErrorMessage = (error: any) => {
    const errorMessage: Message = {
      id: uuidv4(),
      content: `Error processing your query: ${error instanceof Error ? error.message : 'Unknown error'}`,
      sender: 'system',
      timestamp: new Date(),
      isError: true
    };
    
    setMessages(prev => [...prev, errorMessage]);
  };
  
  const addToQueryHistory = (query: string, queryId?: string, success: boolean = true) => {
    const historyItem: QueryHistoryItem = {
      id: uuidv4(),
      query,
      timestamp: new Date(),
      success,
      queryId
    };
    
    addQueryToHistory(historyItem);
  };
  
  // =========== Render UI ===========
  return (
    <Flex 
      direction="column"
      height="100vh"
      width="100%"
      overflow="hidden"
      backgroundColor="white"
      position="relative"
    >
      {/* Header Bar with subtle design */}
      <Flex 
        p={3} 
        borderBottomWidth="1px" 
        borderColor="gray.200" 
        justify="space-between" 
        align="center"
        bg="white"
        boxShadow="sm"
      >
        <IconButton
          aria-label="Toggle Sidebar"
          icon={<HamburgerIcon />}
          onClick={onToggleSidebar}
          variant="ghost"
          size="md"
        />
        
        <Text fontSize="lg" fontWeight="medium" color="gray.700">
          Ask E9Y
        </Text>
        
        {/* Removed save button from header */}
        <Box width="40px" /> {/* Spacer to maintain header layout */}
      </Flex>
      
      {/* Main Chat Area */}
      <Box 
        ref={messagesContainerRef}
        flex="1" 
        overflowY="auto" 
        py={4}
        bg="gray.50"  // Subtle background color to distinguish from sidebar
        position="relative"
      >
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          onSaveQuery={onSaveQuery} 
        />
        <Box ref={messagesEndRef} />
      </Box>
      
      {/* Input Area with modern styling */}
      <Box
        borderTopWidth="1px"
        borderColor="gray.200"
        p={4}
        bg="white"
        width="100%"
      >
        <MessageInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
      </Box>
    </Flex>
  );
});

export default ChatInterface;