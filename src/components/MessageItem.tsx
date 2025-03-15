import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  HStack,
  Badge,
  Button,
  useClipboard,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Code,
  Collapse,
} from '@chakra-ui/react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.sender === 'user';
  const [showSql, setShowSql] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false); // Start collapsed
  const [sqlCompact, setSqlCompact] = useState(true); // Start with compact SQL
  const { hasCopied, onCopy } = useClipboard(message.queryResults?.sql || '');
  
  return (
    <Flex justify={isUser ? 'flex-end' : 'flex-start'}>
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
      
      <Box
        maxW={{ base: "90%", md: "90%", lg: "95%" }}
        bg={isUser ? 'blue.500' : message.isError ? 'red.50' : 'gray.100'}
        color={isUser ? 'white' : message.isError ? 'red.800' : 'gray.800'}
        borderRadius="lg"
        p={3}
        boxShadow="sm"
        borderWidth={message.isError ? '1px' : '0'}
        borderColor={message.isError ? 'red.300' : undefined}
      >
        {message.isLoading ? (
          <HStack spacing={1}>
            <Box h="2" w="2" borderRadius="full" bg="gray.400" animation="pulse 1s infinite"/>
            <Box h="2" w="2" borderRadius="full" bg="gray.400" animation="pulse 1s infinite 0.2s"/>
            <Box h="2" w="2" borderRadius="full" bg="gray.400" animation="pulse 1s infinite 0.4s"/>
          </HStack>
        ) : (
          <>
            {/* Only show toggle if there are query results */}
            {!isUser && message.queryResults?.sql && (
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium">Explanation</Text>
                <Button size="xs" onClick={() => setShowExplanation(!showExplanation)}>
                  {showExplanation ? 'Hide' : 'Show'}
                </Button>
              </Flex>
            )}
            
            {/* Collapsible explanation */}
            <Collapse in={showExplanation || !message.queryResults?.sql} animateOpacity>
              <Box mb={!showExplanation && message.queryResults?.sql ? 0 : 3}>
                <Text>{message.content}</Text>
                <Text 
                  fontSize="xs" 
                  color={isUser ? 'blue.100' : message.isError ? 'red.600' : 'gray.500'} 
                  mt={1}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Box>
            </Collapse>
            
            {/* SQL Display */}
            {!isUser && message.queryResults?.sql && (
              <Box mt={3} borderTopWidth="1px" borderTopColor="gray.200" pt={2}>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">Generated SQL</Text>
                  <HStack>
                    <Button size="xs" onClick={() => setSqlCompact(!sqlCompact)}>
                      {sqlCompact ? 'Expand' : 'Compact'}
                    </Button>
                    <Button size="xs" onClick={onCopy}>
                      {hasCopied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button size="xs" onClick={() => setShowSql(!showSql)}>
                      {showSql ? 'Hide' : 'Show'}
                    </Button>
                  </HStack>
                </Flex>
                
                <Collapse in={showSql} animateOpacity>
                  <Box
                    bg="gray.50"
                    color="gray.800"
                    p={2}
                    borderRadius="md"
                    fontSize="sm"
                    fontFamily="mono"
                    overflowX="auto"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Code bg="transparent" whiteSpace={sqlCompact ? 'nowrap' : 'pre'} color="gray.800">
                      {sqlCompact 
                        ? message.queryResults.sql.replace(/\s+/g, ' ') 
                        : message.queryResults.sql}
                    </Code>
                  </Box>
                </Collapse>
              </Box>
            )}
            
            {/* Results Display */}
            {!isUser && message.queryResults?.results && message.queryResults.results.length > 0 && (
            <Box mt={3} borderTopWidth="1px" borderTopColor="gray.200" pt={2}>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium">Query Results</Text>
                <HStack spacing={2}>
                    <Badge colorScheme="blue">
                    {message.queryResults.rowCount} rows
                    </Badge>
                    <Badge colorScheme="green">
                    {message.queryResults.executionTimeMs.toFixed(2)}ms
                    </Badge>
                    <Button size="xs" onClick={() => setShowResults(!showResults)}>
                    {showResults ? 'Hide' : 'Show'}
                    </Button>
                </HStack>
                </Flex>
                
                <Collapse in={showResults} animateOpacity>
                    <div className="results-table-container">
                        <ResultsTable results={message.queryResults.results} />
                    </div>
                </Collapse>
            </Box>
            )}
          </>
        )}
      </Box>
      
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
              {columns.map(column => (
                <Td key={`${rowIndex}-${column}`}>
                  {row[column] !== null && row[column] !== undefined 
                    ? String(row[column]) 
                    : '—'}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

export default MessageItem;