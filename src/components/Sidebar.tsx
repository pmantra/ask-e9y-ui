import { useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  List, 
  ListItem, 
  Text, 
  Flex, 
  Icon, 
  Collapse, 
  IconButton, 
  useDisclosure,
  Divider,
  Badge,
  Button
} from '@chakra-ui/react';
import { FiStar, FiClock, FiPlay, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SavedQuery, QueryHistoryItem } from '../types';
import { updateSavedQueryLastRun, deleteSavedQuery } from '../services/storageService';

interface SidebarProps {
  savedQueries: SavedQuery[];
  recentQueries: QueryHistoryItem[];
  refreshSavedQueries: () => void;
  refreshQueryHistory: () => void;
  onRunQuery?: (query: string) => void;
}

// Business-focused example queries to demonstrate system capabilities
const exampleQueries = [
  // Verification queries
  "Count all failed verification attempts in the last week",
  
  // Eligibility analysis
  "List members with overeligibility and their eligible organizations",
  "Count all verifications by organization",
  
  // Organization insights
  "Compare member counts across all organizations",
  "What files were processed in the last week? ",
];

const Sidebar = ({ 
  savedQueries, 
  recentQueries, 
  refreshSavedQueries, 
  refreshQueryHistory, 
  onRunQuery 
}: SidebarProps) => {
  // Disclosures for collapsible sections
  const { isOpen: isExamplesOpen, onToggle: toggleExamples } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isSavedOpen, onToggle: toggleSaved } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isRecentOpen, onToggle: toggleRecent } = useDisclosure({ defaultIsOpen: true });
  
  // For "show more" functionality
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  
  // Number of items to show initially
  const initialCount = 3;
  
  // Handle running a saved query
  const handleRunSavedQuery = (query: SavedQuery) => {
    if (onRunQuery) {
      onRunQuery(query.query);
      // Update last run timestamp
      updateSavedQueryLastRun(query.id);
      refreshSavedQueries();
    }
  };
  
  // Handle running a recent query
  const handleRunRecentQuery = (historyItem: QueryHistoryItem) => {
    if (onRunQuery) {
      onRunQuery(historyItem.query);
    }
  };

  // Handle deleting a saved query
  const handleDeleteSavedQuery = (id: string) => {
    deleteSavedQuery(id);
    refreshSavedQueries();
  };
  
  return (
    <Box 
      width="100%"
      bg="white" 
      borderRight="1px" 
      borderColor="gray.200" 
      p={4} 
      height="100%" 
      overflow="auto"
      overflowX="hidden"
    >
      <VStack align="stretch" spacing={6} width="100%">
        <Heading size="md">Ask E9Y</Heading>
        
        {/* Example Queries Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={2} width="100%">
            <Heading size="sm">Example Queries</Heading>
            <IconButton
              size="xs"
              icon={isExamplesOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isExamplesOpen ? "Collapse" : "Expand"}
              onClick={toggleExamples}
              variant="ghost"
            />
          </Flex>
          <Collapse in={isExamplesOpen}>
            <List spacing={1} width="100%">
              {exampleQueries.map((query, index) => (
                <ListItem 
                  key={index}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                  onClick={() => onRunQuery && onRunQuery(query)}
                  maxWidth="100%"
                >
                  <Flex align="center" width="100%">
                    <Icon as={FiPlay} color="green.500" flexShrink={0} mr={2} />
                    <Text fontSize="sm" noOfLines={1}>{query}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
        
        <Divider />
        
        {/* Saved Queries Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={2} width="100%">
            <Heading size="sm">Saved Queries</Heading>
            <IconButton
              size="xs"
              icon={isSavedOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isSavedOpen ? "Collapse" : "Expand"}
              onClick={toggleSaved}
              variant="ghost"
            />
          </Flex>
          <Collapse in={isSavedOpen}>
            {savedQueries.length === 0 ? (
              <Text fontSize="sm" color="gray.500" py={2}>Save queries by clicking the bookmark icon on messages.</Text>
            ) : (
              <>
                <List spacing={1} width="100%">
                  {savedQueries
                    .slice(0, showAllSaved ? undefined : initialCount)
                    .map(query => (
                      <ListItem 
                        key={query.id}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: "gray.100" }}
                        cursor="pointer"
                        maxWidth="100%"
                      >
                        <Flex align="center" justify="space-between" width="100%">
                          <Flex align="center" flex="1" onClick={() => handleRunSavedQuery(query)} minWidth="0">
                            <Icon as={FiStar} color="yellow.500" flexShrink={0} mr={2} />
                            <Text fontSize="sm" noOfLines={1}>{query.name}</Text>
                          </Flex>
                          <IconButton
                            size="xs"
                            icon={<FiPlay />}
                            aria-label="Run Query"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleRunSavedQuery(query)}
                            flexShrink={0}
                          />
                        </Flex>
                      </ListItem>
                    ))}
                </List>
                {savedQueries.length > initialCount && (
                  <Button 
                    size="xs" 
                    variant="link" 
                    onClick={() => setShowAllSaved(!showAllSaved)}
                    mt={1}
                  >
                    {showAllSaved 
                      ? "Show less" 
                      : `Show ${savedQueries.length - initialCount} more`}
                  </Button>
                )}
              </>
            )}
          </Collapse>
        </Box>        
        
        {/* Recent Queries Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={2} width="100%">
            <Heading size="sm">Recent History</Heading>
            <IconButton
              size="xs"
              icon={isRecentOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isRecentOpen ? "Collapse" : "Expand"}
              onClick={toggleRecent}
              variant="ghost"
            />
          </Flex>
          <Collapse in={isRecentOpen}>
            {recentQueries.length === 0 ? (
              <Text fontSize="sm" color="gray.500" py={2}>Your query history will appear here.</Text>
            ) : (
              <List spacing={1} width="100%">
                {recentQueries
                  .slice(0, showAllRecent ? undefined : initialCount)
                  .map((historyItem, index) => (
                    <ListItem 
                      key={index}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: "gray.100" }}
                      cursor="pointer"
                      maxWidth="100%"
                    >
                      <Flex align="center" justify="space-between" width="100%">
                        <Flex align="center" flex="1" onClick={() => handleRunRecentQuery(historyItem)} minWidth="0">
                          <Icon as={FiClock} color="blue.500" flexShrink={0} mr={2} />
                          <Text fontSize="sm" noOfLines={1}>{historyItem.query}</Text>
                        </Flex>
                        <IconButton
                          size="xs"
                          icon={<FiPlay />}
                          aria-label="Run Query"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleRunRecentQuery(historyItem)}
                          flexShrink={0}
                        />
                      </Flex>
                    </ListItem>
                  ))}
                {recentQueries.length > initialCount && (
                  <Button 
                    size="xs" 
                    variant="link" 
                    onClick={() => setShowAllRecent(!showAllRecent)}
                    mt={1}
                  >
                    {showAllRecent 
                      ? "Show less" 
                      : `Show ${recentQueries.length - initialCount} more`}
                  </Button>
                )}
              </List>
            )}
          </Collapse>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;