import { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  List, 
  ListItem, 
  Text, 
  Flex, 
  Button, 
  Icon, 
  Collapse, 
  IconButton, 
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Badge
} from '@chakra-ui/react';
import { FiStar, FiClock, FiPlay, FiChevronDown, FiChevronUp, FiPlus, FiEdit } from 'react-icons/fi';
import { SavedQuery, QueryHistoryItem, QueryTemplate } from '../types';
import { 
  deleteSavedQuery, 
  updateSavedQueryLastRun, 
  getTemplates, 
  updateTemplateUsage 
} from '../services/storageService';
import TemplateCreationDialog from './TemplateCreationDialog';
import TemplateExecutionDialog from './TemplateExecutionDialog';

interface SidebarProps {
  savedQueries: SavedQuery[];
  recentQueries: QueryHistoryItem[];
  refreshSavedQueries: () => void;
  refreshQueryHistory: () => void;
  onRunQuery?: (query: string) => void;
}

// Predefined query templates
const predefinedTemplates = [
  "Show all active members",
  "Find members with dependents",
  "List members from ACME Corporation",
  "Show verification statuses",
  "Count members by organization",
];

const Sidebar = ({ 
  savedQueries, 
  recentQueries, 
  refreshSavedQueries, 
  refreshQueryHistory, 
  onRunQuery 
}: SidebarProps) => {
  // State for custom templates
  const [customTemplates, setCustomTemplates] = useState<QueryTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<QueryTemplate | null>(null);
  
  // Disclosures for collapsible sections
  const { isOpen: isTemplatesOpen, onToggle: toggleTemplates } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isCustomTemplatesOpen, onToggle: toggleCustomTemplates } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isSavedOpen, onToggle: toggleSaved } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isRecentOpen, onToggle: toggleRecent } = useDisclosure({ defaultIsOpen: true });
  
  // Disclosures for dialogs
  const { 
    isOpen: isTemplateCreationOpen, 
    onOpen: onTemplateCreationOpen, 
    onClose: onTemplateCreationClose 
  } = useDisclosure();
  
  const { 
    isOpen: isTemplateExecutionOpen, 
    onOpen: onTemplateExecutionOpen, 
    onClose: onTemplateExecutionClose 
  } = useDisclosure();
  
  // For "show more" functionality
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllCustom, setShowAllCustom] = useState(false);
  
  // Number of items to show initially
  const initialCount = 3;
  
  // Load custom templates on mount
  useEffect(() => {
    setCustomTemplates(getTemplates());
  }, []);
  
  // Refresh custom templates
  const refreshCustomTemplates = () => {
    setCustomTemplates(getTemplates());
  };
  
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
  
  // Handle selecting a custom template
  const handleSelectTemplate = (template: QueryTemplate) => {
    setSelectedTemplate(template);
    onTemplateExecutionOpen();
  };
  
  // Handle executing a template
  const handleExecuteTemplate = (query: string) => {
    if (onRunQuery) {
      onRunQuery(query);
      refreshCustomTemplates();
    }
  };
  
  // Handle deleting a saved query
  const handleDeleteSavedQuery = (id: string) => {
    deleteSavedQuery(id);
    refreshSavedQueries();
  };
  
  return (
    <Box 
    width="100%"  // Changed from "280px" to "100%"
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
        
        {/* Predefined Query Templates Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={2} width="100%">
            <Heading size="sm">Query Templates</Heading>
            <IconButton
              size="xs"
              icon={isTemplatesOpen ? <FiChevronUp /> : <FiChevronDown />}
              aria-label={isTemplatesOpen ? "Collapse" : "Expand"}
              onClick={toggleTemplates}
              variant="ghost"
            />
          </Flex>
          <Collapse in={isTemplatesOpen}>
            <List spacing={1} width="100%">
              {predefinedTemplates.map((template, index) => (
                <ListItem 
                  key={index}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                  onClick={() => onRunQuery && onRunQuery(template)}
                  maxWidth="100%"
                >
                  <Flex align="center" width="100%">
                    <Icon as={FiPlay} color="green.500" flexShrink={0} mr={2} />
                    <Text fontSize="sm" noOfLines={1}>{template}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
        
        {/* Custom Templates Section */}
        <Box width="100%">
          <Flex justify="space-between" align="center" mb={2} width="100%">
            <Heading size="sm">Custom Templates</Heading>
            <Flex>
              <IconButton
                size="xs"
                icon={<FiPlus />}
                aria-label="Create new template"
                onClick={onTemplateCreationOpen}
                variant="ghost"
                mr={1}
              />
              <IconButton
                size="xs"
                icon={isCustomTemplatesOpen ? <FiChevronUp /> : <FiChevronDown />}
                aria-label={isCustomTemplatesOpen ? "Collapse" : "Expand"}
                onClick={toggleCustomTemplates}
                variant="ghost"
              />
            </Flex>
          </Flex>
          <Collapse in={isCustomTemplatesOpen}>
            {customTemplates.length === 0 ? (
              <Text fontSize="sm" color="gray.500" py={2}>No custom templates yet. Create one to get started.</Text>
            ) : (
              <>
                <List spacing={1} width="100%">
                  {customTemplates
                    .slice(0, showAllCustom ? undefined : initialCount)
                    .map(template => (
                      <ListItem 
                        key={template.id}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: "gray.100" }}
                        cursor="pointer"
                        maxWidth="100%"
                      >
                        <Flex align="center" justify="space-between" width="100%">
                          <Flex align="center" flex="1" onClick={() => handleSelectTemplate(template)} minWidth="0">
                            <Icon as={FiEdit} color="purple.500" flexShrink={0} mr={2} />
                            <Box minWidth="0">
                              <Text fontSize="sm" noOfLines={1}>{template.name}</Text>
                              {template.category && (
                                <Badge size="sm" colorScheme="purple" fontSize="xs">
                                  {template.category}
                                </Badge>
                              )}
                            </Box>
                          </Flex>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              size="xs"
                              icon={<FiChevronDown />}
                              variant="ghost"
                              flexShrink={0}
                            />
                            <MenuList fontSize="sm">
                              <MenuItem onClick={() => handleSelectTemplate(template)}>Use</MenuItem>
                              <MenuItem onClick={() => {/* Implement edit */}}>Edit</MenuItem>
                              <MenuItem onClick={() => {/* Implement delete */}}>Delete</MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </ListItem>
                    ))}
                </List>
                {customTemplates.length > initialCount && (
                  <Button 
                    size="xs" 
                    variant="link" 
                    onClick={() => setShowAllCustom(!showAllCustom)}
                    mt={1}
                  >
                    {showAllCustom 
                      ? "Show less" 
                      : `Show ${customTemplates.length - initialCount} more`}
                  </Button>
                )}
              </>
            )}
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
              <Text fontSize="sm" color="gray.500" py={2}>No saved queries yet.</Text>
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
            <Heading size="sm">Recent Queries</Heading>
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
              <Text fontSize="sm" color="gray.500" py={2}>No recent queries yet.</Text>
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
              </List>
            )}
          </Collapse>
        </Box>
      </VStack>
      
      {/* Template Creation Dialog */}
      <TemplateCreationDialog
        isOpen={isTemplateCreationOpen}
        onClose={onTemplateCreationClose}
        onSave={refreshCustomTemplates}
      />
      
      {/* Template Execution Dialog */}
      <TemplateExecutionDialog
        isOpen={isTemplateExecutionOpen}
        onClose={onTemplateExecutionClose}
        template={selectedTemplate}
        onExecute={handleExecuteTemplate}
      />
    </Box>
  );
};

export default Sidebar;