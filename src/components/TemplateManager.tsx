import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { QueryTemplate } from '../types';
import { saveTemplate, getTemplates, deleteTemplate } from '../services/storageService';
import { extractPlaceholders } from '../utils/templateHelpers';

const TemplateManager = () => {
  const [templates, setTemplates] = useState<QueryTemplate[]>(getTemplates());
  const [newTemplate, setNewTemplate] = useState<Partial<QueryTemplate>>({
    name: '',
    template: '',
    category: 'general'
  });
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Update placeholders when template text changes
  const handleTemplateChange = (template: string) => {
    setNewTemplate(prev => ({ ...prev, template }));
    const extracted = extractPlaceholders(template);
    setPlaceholders(extracted.map(p => p.name));
  };
  
  // Save a new template
  const handleSave = () => {
    if (newTemplate.name && newTemplate.template) {
      const template: QueryTemplate = {
        id: uuidv4(),
        name: newTemplate.name,
        template: newTemplate.template,
        category: newTemplate.category || 'general',
        createdAt: new Date()
      };
      
      saveTemplate(template);
      setTemplates(getTemplates());
      setNewTemplate({ name: '', template: '', category: 'general' });
      onClose();
    }
  };
  
  // Delete a template
  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
  };
  
  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Query Templates</Heading>
        <Button colorScheme="blue" onClick={onOpen}>Create New Template</Button>
      </Flex>
      
      {/* List of existing templates */}
      <VStack spacing={3} align="stretch">
        {templates.map((template) => (
          <Box 
            key={template.id} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md"
            _hover={{ bg: 'gray.50' }}
          >
            <Flex justify="space-between">
              <Box>
                <Heading size="sm">{template.name}</Heading>
                <Text color="gray.600" fontSize="sm">
                  {template.category} • Created {template.createdAt.toLocaleDateString()}
                </Text>
                <Text mt={2} fontSize="sm" fontFamily="mono">
                  {template.template}
                </Text>
              </Box>
              <HStack>
                <Button size="sm" onClick={() => handleDelete(template.id)}>Delete</Button>
                <Button size="sm" colorScheme="blue">Use</Button>
              </HStack>
            </Flex>
          </Box>
        ))}
      </VStack>
      
      {/* New template modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Template Name</FormLabel>
                <Input 
                  value={newTemplate.name} 
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} 
                  placeholder="E.g., Find Members by Organization"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={newTemplate.category} 
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="member">Member Queries</option>
                  <option value="organization">Organization Queries</option>
                  <option value="verification">Verification Queries</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Template Query</FormLabel>
                <Textarea
                  value={newTemplate.template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  placeholder="E.g., Show me all members from {organization}"
                  rows={4}
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Use {'{placeholder}'} for variables that will be filled in when using the template.
                </Text>
              </FormControl>
              
              {placeholders.length > 0 && (
                <Box borderWidth="1px" p={3} borderRadius="md" w="full">
                  <Heading size="xs" mb={2}>Detected Placeholders:</Heading>
                  {placeholders.map((placeholder) => (
                    <Badge key={placeholder} m={1} colorScheme="blue">
                      {placeholder}
                    </Badge>
                  ))}
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSave}
              isDisabled={!newTemplate.name || !newTemplate.template}
            >
              Save Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TemplateManager;