import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  Collapse,
  Badge,
  Tooltip,
  Code as ChakraCode,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Spinner,
  useClipboard,
  Button,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CopyIcon, 
  CheckIcon,
  InfoIcon, 
  CloseIcon
} from '@chakra-ui/icons';
import { FiBookmark } from 'react-icons/fi';
import { Message } from '../types';
import { getExplanation } from '../services/api';
import { saveQuery } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';

interface MessageItemProps {
  message: Message;
  onSaveQuery?: () => void; // Callback to refresh saved queries in parent
}

const MessageItem = ({ message, onSaveQuery }: MessageItemProps) => {
  // Handle case where message is undefined or null
  if (!message) {
    return null;
  }
  
  // Set default values to prevent undefined errors
  const isUser = message.sender === 'user';
  const hasStructuredContent = message?.queryResults?.sql || message?.queryResults?.results;
  const hasResults = message?.hasResults === true || (message?.queryResults?.results && message.queryResults.results.length > 0);
  
  // Check if explanation is already included with the message
  const initialExplanation = message.explanation || null;
  
  // State for collapsible sections
  const [showSql, setShowSql] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(initialExplanation);
  const [isExplanationFetching, setIsExplanationFetching] = useState(false);
  const [explanationFetchError, setExplanationFetchError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationReady, setExplanationReady] = useState(!!initialExplanation);
  const { hasCopied, onCopy } = useClipboard(message.queryResults?.sql || '');
  
  // State for save query functionality
  const [queryName, setQueryName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Reference to track if the component is mounted
  const isMounted = useRef(true);
  
  // Clear the mounted flag on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Automatically fetch explanation in the background when message has results
  useEffect(() => {
    // Only fetch if we have results, no error, and haven't fetched explanation yet.
    if (hasResults && message.id && !explanation && !isExplanationFetching && !explanationFetchError) {
      fetchExplanation();
    }
  }, [hasResults, message.id, explanation, isExplanationFetching, explanationFetchError]);
  
  // Get the original user query that triggered this response
  const getOriginalUserQuery = () => {
    // If this is a system message with an original query, use that
    if (message.original_user_query) {
      return message.original_user_query;
    }
    // Otherwise fall back to the message content
    return message.content;
  };

  // Initialize query name with the original user query when opening save dialog
  useEffect(() => {
    if (isOpen) {
      const originalQuery = getOriginalUserQuery();
      const truncatedQuery = originalQuery && originalQuery.length > 40 
        ? originalQuery.substring(0, 40) + '...'
        : originalQuery;
      setQueryName(truncatedQuery || '');
    }
  }, [isOpen]);

  // Function to fetch explanation
  const fetchExplanation = async () => {
    if (!message.id || isExplanationFetching || explanation) return; // Already have it, skip
    
    setIsExplanationFetching(true);
    
    try {
      const response = await getExplanation({ query_id: message.id });
      if (response && response.explanation) {
        setExplanation(response.explanation);
        setExplanationReady(true);
      } else {
        // Only set an error if we truly have no explanation
        if (!explanation) {
          setExplanationFetchError('No explanation available');
        }
      }
    } catch (error) {
      if (!explanation) {
        setExplanationFetchError('Failed to fetch explanation');
      }
    } finally {
      setIsExplanationFetching(false);
    }
  };

  // Handle showing/hiding explanation
  const toggleExplanation = () => {
    if (explanation) {
      setShowExplanation(!showExplanation);
    }
  };

  // Handle saving a query
  const handleSaveQuery = () => {
    if (!queryName.trim()) return;
    
    // Get the original user query that produced these results
    const queryToSave = getOriginalUserQuery();
    
    // Create and save query object
    const savedQuery = {
      id: uuidv4(),
      name: queryName.trim(),
      query: queryToSave,
      createdAt: new Date()
    };
    
    saveQuery(savedQuery);
    
    // Call the callback to refresh saved queries in parent
    if (onSaveQuery) {
      onSaveQuery();
    }
    
    // Close the modal and reset
    onClose();
    setQueryName('');
  };

  // Determine if this message should use the bubble style or full-width style
  const useBubbleStyle = isUser || (!hasStructuredContent && !message.isLoading);

  // Dynamic styles based on message type and content
  const getContainerStyle = () => {
    if (useBubbleStyle) {
      // Bubble style for user messages and simple system text responses
      return {
        maxW: { base: isUser ? '80%' : '85%', md: isUser ? '70%' : '75%' },
        ml: isUser ? 'auto' : '3',
        mr: isUser ? '3' : 'auto',
        bg: isUser ? 'blue.500' : message.isError ? 'red.50' : 'gray.100',
        color: isUser ? 'white' : message.isError ? 'red.800' : 'gray.800',
        borderRadius: 'lg',
        p: 3,
        boxShadow: 'sm',
        borderWidth: message.isError ? '1px' : '0',
        borderColor: message.isError ? 'red.300' : undefined,
      };
    } else {
      // Full-width style for system messages with structured content
      return {
        width: '100%',
        bg: 'transparent',
        borderLeftWidth: '3px',
        borderLeftColor: message.isError ? 'red.400' : 'blue.400',
        pl: 3,
        py: 2,
        mt: 2,
      };
    }
  };

  // Render the explain button/icon based on the current state
  const renderExplainButton = () => {
    if (isExplanationFetching) {
      // Don't show anything while fetching
      return null;
    } else if (explanationFetchError) {
      // Don't show anything if there was an error
      return null;
    } else if (explanationReady) {
      // Show explanation button when ready
      return (
        <Tooltip label={showExplanation ? "Hide explanation" : "View explanation"}>
          <IconButton
            aria-label={showExplanation ? "Hide explanation" : "View explanation"}
            icon={<InfoIcon />}
            size="sm"
            onClick={toggleExplanation}
            colorScheme="green"
            variant={showExplanation ? "solid" : "ghost"}
          />
        </Tooltip>
      );
    }
    
    // Don't show anything by default
    return null;
  };

  if (message.isLoading) {
    // Special loading message style
    return (
      <Flex justify="flex-start" width="100%" my={4}>
        <Avatar
          size="sm"
          name="E 9 Y"
          bg="blue.500"
          color="white"
          mr={2}
          fontSize="xs"
        />
        <Box 
          p={4} 
          borderRadius="md" 
          bg="gray.50"
          maxW="300px"
        >
          <HStack spacing={2}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" color="gray.600">Processing your query...</Text>
          </HStack>
        </Box>
      </Flex>
    );
  }

  // Main message rendering
  return (
    <Flex 
      direction="column" 
      width="100%" 
      my={4}
    >
      {/* Message Header with Avatar and Timestamp */}
      <Flex justify={isUser ? 'flex-end' : 'flex-start'} mb={1} align="center">
        {!isUser && (
          <Avatar
            size="sm"
            name="E 9 Y"
            bg="blue.500"
            color="white"
            mr={2}
            fontSize="xs"
          />
        )}
        <Text 
          fontSize="xs" 
          color="gray.500" 
          mr={isUser ? 2 : 0}
          ml={isUser ? 0 : 2}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {isUser && (
          <Avatar
            size="sm"
            name="User"
            bg="gray.300"
            ml={2}
            fontSize="xs"
          />
        )}
      </Flex>
      
      {/* Message Content */}
      <Box
        {...getContainerStyle()}
      >
        {/* Main message content/text - Only show for empty results or simple messages */}
        {(!hasResults || !hasStructuredContent) && (
          <Box mb={hasStructuredContent ? 3 : 0}>
            <Text color={!hasResults || !hasStructuredContent ? "inherit" : "gray.600"}>
              {message.content}
            </Text>
          </Box>
        )}
        
        {/* Structured Content (SQL, Results, etc.) */}
        {hasStructuredContent && (
          <Box>
            {/* Results Section */}
            {message.queryResults?.results && message.queryResults.results.length > 0 && (
              <Box>
                <Flex 
                  justifyContent="space-between" 
                  alignItems="center" 
                  bg="blue.50" 
                  p={2} 
                  borderRadius="md"
                  borderBottomRadius={(showResults || showSql) ? 0 : 'md'}
                  borderBottom={(showResults || showSql) ? '1px solid' : 'none'}
                  borderColor="blue.100"
                >
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">Query Results</Text>
                    <Badge colorScheme="blue">
                      {message.queryResults?.rowCount || (message.queryResults?.results?.length || 0)} rows
                    </Badge>
                    {/* Show execution time if available */}
                    {(message.queryResults?.executionTimeMs || message.queryResults?.query_details?.execution_time_ms) && (
                      <Badge colorScheme="green">
                        {(message.queryResults?.executionTimeMs || 
                          message.queryResults?.query_details?.execution_time_ms || 0).toFixed(2)}ms
                      </Badge>
                    )}
                    {/* Show cache status if available */}
                    {message.timing_stats?.cache_status && message.timing_stats.cache_status !== "miss" && (
                      <Badge colorScheme="purple">
                        Cached
                      </Badge>
                    )}
                  </HStack>
                  <HStack>
                    {/* Save Query Button - Only show for system messages with results */}
                    {!isUser && hasResults && (
                      <Tooltip label="Save Query">
                        <IconButton
                          aria-label="Save Query"
                          icon={<FiBookmark />}
                          size="sm"
                          onClick={onOpen}
                          variant="ghost"
                          colorScheme="blue"
                        />
                      </Tooltip>
                    )}
                    
                    {/* SQL Button - Only show if SQL exists */}
                    {message.queryResults?.sql && (
                      <Button 
                        size="xs" 
                        leftIcon={<CopyIcon />} 
                        onClick={() => setShowSql(!showSql)}
                        colorScheme="gray"
                        variant={showSql ? "solid" : "ghost"}
                      >
                        {showSql ? "Hide SQL" : "SQL"}
                      </Button>
                    )}
                    
                    {/* Explanation button/icon */}
                    {renderExplainButton()}
                    
                    <Tooltip label={showResults ? 'Hide Results' : 'Show Results'}>
                      <IconButton
                        aria-label={showResults ? 'Hide Results' : 'Show Results'}
                        icon={showResults ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        size="xs"
                        onClick={() => setShowResults(!showResults)}
                        variant="ghost"
                      />
                    </Tooltip>
                  </HStack>
                </Flex>
                
                {/* SQL Section - Only show when SQL button is clicked */}
                <Collapse in={showSql} animateOpacity>
                  <Box
                    bg="gray.50"
                    p={3}
                    borderBottomWidth={showResults ? "1px" : "0"}
                    borderBottomColor="gray.200"
                    fontSize="sm"
                    fontFamily="mono"
                    overflowX="auto"
                    position="relative"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontSize="sm" fontWeight="medium">Generated SQL</Text>
                      <IconButton
                        aria-label="Copy SQL"
                        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                        size="xs"
                        onClick={onCopy}
                        variant="ghost"
                      />
                    </Flex>
                    <ChakraCode bg="transparent" whiteSpace="pre" color="gray.800">
                      {message.queryResults.sql}
                    </ChakraCode>
                  </Box>
                </Collapse>
                
                {/* Results Table */}
                <Collapse in={showResults} animateOpacity>
                  <Box
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderBottomRadius="md"
                    overflow="hidden"
                  >
                    <Box overflowX="auto">
                      <ResultsTable results={message.queryResults.results} />
                    </Box>
                  </Box>
                </Collapse>
                
                {/* Explanation Section - Only shown when explanation is ready and user has toggled it */}
                {explanation && (
                  <Collapse in={showExplanation} animateOpacity>
                    <Box mt={2}>
                      <Flex 
                        justifyContent="space-between" 
                        alignItems="center" 
                        bg="green.50" 
                        p={2} 
                        borderRadius="md"
                        borderBottomRadius="0"
                        borderBottom="1px solid"
                        borderColor="green.100"
                      >
                        <HStack>
                          <InfoIcon color="green.500" />
                          <Text fontSize="sm" fontWeight="medium">Explanation</Text>
                        </HStack>
                        <Tooltip label="Hide Explanation">
                          <IconButton
                            aria-label="Hide Explanation"
                            icon={<ChevronUpIcon />}
                            size="xs"
                            onClick={() => setShowExplanation(false)}
                            variant="ghost"
                          />
                        </Tooltip>
                      </Flex>
                      
                      <Box
                        bg="green.50"
                        p={3}
                        borderBottomRadius="md"
                        fontSize="sm"
                        className="markdown-content"
                        overflowX="auto"
                      >
                        <ReactMarkdown
                          components={{
                            h1: (props) => <Heading as="h1" size="lg" my={2} color="blue.900" {...props} />,
                            h2: (props) => <Heading as="h2" size="md" my={2} color="blue.800" {...props} />,
                            h3: (props) => <Heading as="h3" size="sm" my={2} color="blue.700" {...props} />,
                            h4: (props) => <Heading as="h4" size="sm" fontWeight="semibold" my={2} {...props} />,
                            p: (props) => <Text mb={4} {...props} />,
                            ul: (props) => <Box as="ul" pl={4} mb={4} {...props} />,
                            ol: (props) => <Box as="ol" pl={4} mb={4} {...props} />,
                            li: (props) => <Box as="li" mb={1} {...props} />,
                            code: (props) => {
                              const { children, className, ...rest } = props;
                              return (
                                <ChakraCode
                                  p={1}
                                  borderRadius="md"
                                  bg="gray.100"
                                  {...rest}
                                >
                                  {children}
                                </ChakraCode>
                              );
                            }
                          }}
                        >
                          {explanation}
                        </ReactMarkdown>
                      </Box>
                    </Box>
                  </Collapse>
                )}
              </Box>
            )}
          </Box>
        )}
        
        {/* Error Message for error states */}
        {message.isError && (
          <HStack mt={2} color="red.500" fontSize="sm">
            <CloseIcon boxSize={3} />
            <Text>Error processing query. Please try again or modify your request.</Text>
          </HStack>
        )}
      </Box>
      
      {/* Save Query Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Query</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Query Name</FormLabel>
              <Input 
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="Enter a name for this query"
                autoFocus
              />
            </FormControl>
            <Text fontSize="sm" color="gray.600" mt={2}>
              Saving: "{getOriginalUserQuery()?.substring(0, 60)}{getOriginalUserQuery() && getOriginalUserQuery().length > 60 ? '...' : ''}"
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSaveQuery}
              isDisabled={!queryName.trim()}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

// Results Table Component
const ResultsTable = ({ results }: { results: any[] }) => {
  if (!results || results.length === 0) return null;
  
  const columns = Object.keys(results[0]);
  
  return (
    <Table size="sm" variant="simple">
      <Thead bg="gray.50">
        <Tr>
          {columns.map(column => (
            <Th key={column} whiteSpace="nowrap">{column}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {results.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {columns.map(column => {
              const value = row[column];
              
              // Format special data types
              let displayValue = '';
              
              if (column === 'effective_range') {
                if (value === null || value === undefined) {
                  displayValue = '—';
                } else if (typeof value === 'string') {
                  displayValue = value;
                } else if (typeof value === 'object') {
                  if (value.hasOwnProperty('lower') || value.hasOwnProperty('upper')) {
                    const lower = value.lower || '(unbounded)';
                    const upper = value.upper || '(unbounded)';
                    displayValue = `[${lower}, ${upper})`;
                  } else {
                    displayValue = JSON.stringify(value);
                  }
                } else {
                  displayValue = String(value);
                }
              } else {
                displayValue = value === null || value === undefined ? '—' : String(value);
              }
              
              return (
                <Td key={`${rowIndex}-${column}`}>
                  {displayValue}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default MessageItem;