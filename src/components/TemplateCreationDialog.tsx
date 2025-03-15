import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Text,
  Box,
  Badge,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { QueryTemplate, TemplatePlaceholder } from '../types';
import { saveTemplate } from '../services/storageService';
import { extractPlaceholders } from '../utils/templateHelpers';

interface TemplateCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  templateToEdit?: QueryTemplate; // For future editing functionality
}

const TemplateCreationDialog = ({ 
  isOpen, 
  onClose, 
  onSave,
  templateToEdit 
}: TemplateCreationDialogProps) => {
  const [template, setTemplate] = useState<Partial<QueryTemplate>>(
    templateToEdit || {
      name: '',
      template: '',
      category: 'general'
    }
  );
  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>([]);
  
  // Update placeholders when template text changes
  const handleTemplateChange = (templateText: string) => {
    setTemplate(prev => ({ ...prev, template: templateText }));
    const extracted = extractPlaceholders(templateText);
    setPlaceholders(extracted);
  };
  
  // Save a new template
  const handleSave = () => {
    if (template.name && template.template) {
      const newTemplate: QueryTemplate = {
        id: templateToEdit?.id || uuidv4(),
        name: template.name,
        template: template.template,
        category: template.category || 'general',
        createdAt: templateToEdit?.createdAt || new Date()
      };
      
      saveTemplate(newTemplate);
      onSave();
      
      // Reset form
      setTemplate({
        name: '',
        template: '',
        category: 'general'
      });
      setPlaceholders([]);
      
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{templateToEdit ? 'Edit Template' : 'Create Template'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Template Name</FormLabel>
              <Input 
                value={template.name} 
                onChange={(e) => setTemplate({ ...template, name: e.target.value })} 
                placeholder="E.g., Find Members by Organization"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select 
                value={template.category} 
                onChange={(e) => setTemplate({ ...template, category: e.target.value })}
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
                value={template.template}
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
                <Text fontWeight="semibold" mb={2}>Detected Placeholders:</Text>
                <Flex wrap="wrap">
                  {placeholders.map((placeholder) => (
                    <Badge key={placeholder.name} m={1} colorScheme="blue">
                      {placeholder.name}
                      {placeholder.defaultValue && ` (default: ${placeholder.defaultValue})`}
                    </Badge>
                  ))}
                </Flex>
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
            isDisabled={!template.name || !template.template}
          >
            Save Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateCreationDialog;