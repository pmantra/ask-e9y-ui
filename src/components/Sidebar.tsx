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
const EXAMPLE_QUERIES = [
  {
    category: 'Verifications',
    queries: [
      "Count all failed verification attempts in the last week",
      "Count all verifications by organization"
    ]
  },
  {
    category: 'Organizations',
    queries: [
      "List members with overeligibility and their eligible organizations",
      "Compare member counts across all organizations",
      "What files were processed in the last week?"
    ]
  }
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
      bg="neutral.10" 
      borderRight="1px" 
      borderColor="neutral.25" 
      p={6} 
      height="100%" 
      overflow="auto"
      overflowX="hidden"
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'var(--chakra-colors-neutral-20)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--chakra-colors-neutral-30)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'var(--chakra-colors-neutral-40)',
        },
      }}
    >
      <VStack align="stretch" spacing={6} width="100%">
        <Heading 
          size="md" 
          color="neutral.60"
          fontFamily="sansSerif.semibold"
        >
          Ask E9Y
        </Heading>
        
        {/* Example Queries Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={3} width="100%">
            <Heading 
              size="sm" 
              color="neutral.60"
              fontFamily="sansSerif.semibold"
            >
              Example Queries
            </Heading>
            <IconButton
              size="xs"
              icon={isExamplesOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isExamplesOpen ? "Collapse" : "Expand"}
              onClick={toggleExamples}
              variant="ghost"
              color="neutral.50"
              _hover={{ bg: 'primary.10', color: 'primary.30' }}
            />
          </Flex>
          <Collapse in={isExamplesOpen}>
            <VStack spacing={4} align="stretch">
              {EXAMPLE_QUERIES.map((category) => (
                <Box key={category.category}>
                  <Text
                    fontSize="xs"
                    color="neutral.50"
                    textTransform="uppercase"
                    fontWeight="semibold"
                    fontFamily="sansSerif.semibold"
                    letterSpacing="0.05em"
                    mb={2}
                  >
                    {category.category}
                  </Text>
                  <List spacing={1}>
                    {category.queries.map((query, index) => (
                      <ListItem 
                        key={index}
                        position="relative"
                        role="button"
                        transition="all 0.2s"
                      >
                        <Flex
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => onRunQuery && onRunQuery(query)}
                          position="relative"
                          align="center"
                          width="100%"
                          role="group"
                          transition="all 0.2s"
                          _hover={{
                            bg: '#f1f7f6',
                            pl: 3,
                          }}
                        >
                          <Box
                            position="absolute"
                            left="-12px"
                            top="50%"
                            transform="translateY(-50%)"
                            width="2px"
                            height="0%"
                            bg="#00856f"
                            transition="height 0.2s"
                            _groupHover={{
                              height: '70%'
                            }}
                          />
                          <Box
                            position="relative"
                            width="24px"
                            height="24px"
                            mr={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon 
                              as={FiPlay}
                              color="#00856f"
                              position="absolute"
                              opacity={0}
                              transform="translateX(-5px)"
                              transition="all 0.2s"
                              _groupHover={{
                                opacity: 1,
                                transform: "translateX(0)",
                                color: '#005d4e'
                              }}
                            />
                          </Box>
                          <Box flex="1">
                            <Text 
                              fontSize="sm" 
                              noOfLines={1}
                              color="#172321"
                              fontFamily="sansSerif.normal"
                              transition="all 0.2s"
                              _groupHover={{
                                color: '#00856f'
                              }}
                            >
                              {query}
                            </Text>
                          </Box>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </VStack>
          </Collapse>
        </Box>
        
        <Divider borderColor="neutral.25" />
        
        {/* Saved Queries Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={3} width="100%">
            <Flex align="center" gap={2}>
              <Heading 
                size="sm"
                color="neutral.60"
                fontFamily="sansSerif.semibold"
              >
                Saved Queries
              </Heading>
              {savedQueries.length > 0 && (
                <Text
                  fontSize="xs"
                  color="neutral.50"
                  bg="neutral.20"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontFamily="sansSerif.normal"
                >
                  {savedQueries.length}
                </Text>
              )}
            </Flex>
            <IconButton
              size="xs"
              icon={isSavedOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isSavedOpen ? "Collapse" : "Expand"}
              onClick={toggleSaved}
              variant="ghost"
              color="neutral.50"
              _hover={{ bg: 'primary.10', color: 'primary.30' }}
            />
          </Flex>
          <Collapse in={isSavedOpen}>
            {savedQueries.length === 0 ? (
              <Text 
                fontSize="sm" 
                color="neutral.50" 
                py={2}
                fontFamily="sansSerif.normal"
              >
                Save queries by clicking the bookmark icon on messages.
              </Text>
            ) : (
              <>
                <List spacing={1} width="100%">
                  {savedQueries
                    .slice(0, showAllSaved ? undefined : initialCount)
                    .map(query => (
                      <ListItem 
                        key={query.id}
                        position="relative"
                        role="button"
                      >
                        <Flex
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          align="center"
                          justify="space-between"
                          width="100%"
                          role="group"
                          transition="all 0.2s"
                          _hover={{
                            bg: '#f1f7f6',
                            pl: 3,
                          }}
                        >
                          <Box
                            position="absolute"
                            left="-12px"
                            top="50%"
                            transform="translateY(-50%)"
                            width="2px"
                            height="0%"
                            bg="#00856f"
                            transition="height 0.2s"
                            _groupHover={{
                              height: '70%'
                            }}
                          />
                          <Flex align="center" flex="1" onClick={() => handleRunSavedQuery(query)} minWidth="0">
                            <Icon 
                              as={FiStar} 
                              color="#00856f"
                              flexShrink={0} 
                              mr={2}
                              transition="all 0.2s"
                              _groupHover={{
                                color: '#005d4e',
                                transform: 'scale(1.1)'
                              }}
                            />
                            <Text 
                              fontSize="sm" 
                              noOfLines={1}
                              color="#172321"
                              fontFamily="sansSerif.normal"
                              transition="all 0.2s"
                              _groupHover={{
                                color: '#00856f'
                              }}
                            >
                              {query.name}
                            </Text>
                          </Flex>
                          <IconButton
                            size="xs"
                            icon={<FiPlay />}
                            aria-label="Run Query"
                            variant="ghost"
                            color="#00856f"
                            onClick={() => handleRunSavedQuery(query)}
                            flexShrink={0}
                            opacity={0}
                            transform="translateX(-5px)"
                            transition="all 0.2s"
                            _groupHover={{
                              opacity: 1,
                              transform: "translateX(0)",
                              bg: '#f1f7f6'
                            }}
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
                    mt={2}
                    color="primary.30"
                    fontFamily="sansSerif.normal"
                    _hover={{ color: 'primary.40' }}
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
          <Flex justify="space-between" align="center" mb={3} width="100%">
            <Flex align="center" gap={2}>
              <Heading 
                size="sm"
                color="neutral.60"
                fontFamily="sansSerif.semibold"
              >
                Recent History
              </Heading>
              {recentQueries.length > 0 && (
                <Text
                  fontSize="xs"
                  color="neutral.50"
                  bg="neutral.20"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontFamily="sansSerif.normal"
                >
                  {recentQueries.length}
                </Text>
              )}
            </Flex>
            <IconButton
              size="xs"
              icon={isRecentOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isRecentOpen ? "Collapse" : "Expand"}
              onClick={toggleRecent}
              variant="ghost"
              color="neutral.50"
              _hover={{ bg: 'primary.10', color: 'primary.30' }}
            />
          </Flex>
          <Collapse in={isRecentOpen}>
            {recentQueries.length === 0 ? (
              <Text 
                fontSize="sm" 
                color="neutral.50" 
                py={2}
                fontFamily="sansSerif.normal"
              >
                Your query history will appear here.
              </Text>
            ) : (
              <List spacing={1} width="100%">
                {recentQueries
                  .slice(0, showAllRecent ? undefined : initialCount)
                  .map((historyItem, index) => (
                    <ListItem 
                      key={index}
                      position="relative"
                      role="button"
                    >
                      <Flex
                        p={2}
                        borderRadius="md"
                        cursor="pointer"
                        align="center"
                        justify="space-between"
                        width="100%"
                        role="group"
                        transition="all 0.2s"
                        _hover={{
                          bg: '#f6f6f6',
                          pl: 3,
                        }}
                      >
                        <Box
                          position="absolute"
                          left="-12px"
                          top="50%"
                          transform="translateY(-50%)"
                          width="2px"
                          height="0%"
                          bg="#64726f"
                          transition="height 0.2s"
                          _groupHover={{
                            height: '70%'
                          }}
                        />
                        <Flex align="center" flex="1" onClick={() => handleRunRecentQuery(historyItem)} minWidth="0">
                          <Icon 
                            as={FiClock} 
                            color="#64726f"
                            flexShrink={0} 
                            mr={2}
                            transition="all 0.2s"
                            _groupHover={{
                              color: '#475467'
                            }}
                          />
                          <Text 
                            fontSize="sm" 
                            noOfLines={1}
                            color="#172321"
                            fontFamily="sansSerif.normal"
                            transition="all 0.2s"
                            _groupHover={{
                              color: '#64726f'
                            }}
                          >
                            {historyItem.query}
                          </Text>
                        </Flex>
                        <IconButton
                          size="xs"
                          icon={<FiPlay />}
                          aria-label="Run Query"
                          variant="ghost"
                          color="#64726f"
                          onClick={() => handleRunRecentQuery(historyItem)}
                          flexShrink={0}
                          opacity={0}
                          transform="translateX(-5px)"
                          transition="all 0.2s"
                          _groupHover={{
                            opacity: 1,
                            transform: "translateX(0)",
                            bg: '#f6f6f6'
                          }}
                        />
                      </Flex>
                    </ListItem>
                  ))}
                {recentQueries.length > initialCount && (
                  <Button 
                    size="xs" 
                    variant="link" 
                    onClick={() => setShowAllRecent(!showAllRecent)}
                    mt={2}
                    color="primary.30"
                    fontFamily="sansSerif.normal"
                    _hover={{ color: 'primary.40' }}
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