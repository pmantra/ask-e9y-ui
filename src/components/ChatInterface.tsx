import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import {
  Box, 
  Flex, 
  VStack, 
  IconButton, 
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text
} from '@chakra-ui/react';
import { HamburgerIcon, StarIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, SavedQuery, QueryHistoryItem } from '../types';
import { saveQuery, addQueryToHistory } from '../services/storageService';
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
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [queryName, setQueryName] = useState('');
  
  // =========== Refs and Hooks ===========
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
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
      addSystemMessage(response);
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
  
  const addSystemMessage = (response: any) => {
    const systemMessage: Message = {
      id: response.query_id,
      content: response.message || 'Here are the results of your query.',
      sender: 'system',
      timestamp: new Date(),
      hasResults: response.has_results,
      explanation: response.explanation,
      timing_stats: response.timing_stats,
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
  
  // =========== Save Query Handling ===========
  const handleSaveQueryClick = () => {
    if (currentQuery) {
      setQueryName(currentQuery.slice(0, 30) + (currentQuery.length > 30 ? '...' : ''));
      onOpen();
    }
  };
  
  const handleSaveQuery = () => {
    if (currentQuery && queryName) {
      const newSavedQuery: SavedQuery = {
        id: uuidv4(),
        name: queryName,
        query: currentQuery,
        createdAt: new Date()
      };
      
      saveQuery(newSavedQuery);
      onSaveQuery();
      onClose();
      setQueryName('');
    }
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
        
        <IconButton
          aria-label="Save Query"
          icon={<StarIcon />}
          onClick={handleSaveQueryClick}
          isDisabled={!currentQuery}
          variant="ghost"
          colorScheme="blue"
          size="md"
        />
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
        <MessageList messages={messages} isLoading={isLoading} />
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
      
      {/* Save Query Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Save Query
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl>
                <FormLabel>Query Name</FormLabel>
                <Input 
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  placeholder="Enter a name for this query"
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleSaveQuery} 
                ml={3}
                isDisabled={!queryName.trim()}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
});

export default ChatInterface;