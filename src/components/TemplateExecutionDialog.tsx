// src/components/TemplateExecutionDialog.tsx
import { useState, useEffect } from 'react';
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
  VStack,
  Text,
  Box,
} from '@chakra-ui/react';
import { QueryTemplate, TemplatePlaceholder } from '../types';
import { extractPlaceholders, fillTemplate } from '../utils/templateHelpers';
import { updateTemplateUsage } from '../services/storageService';

interface TemplateExecutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: QueryTemplate | null;
  onExecute: (query: string) => void;
}

const TemplateExecutionDialog = ({ 
  isOpen, 
  onClose, 
  template, 
  onExecute 
}: TemplateExecutionDialogProps) => {
  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [previewQuery, setPreviewQuery] = useState('');
  
  // Extract placeholders when template changes
  useEffect(() => {
    if (template) {
      const extracted = extractPlaceholders(template.template);
      setPlaceholders(extracted);
      
      // Initialize values with default values
      const initialValues: Record<string, string> = {};
      extracted.forEach(p => {
        initialValues[p.name] = p.defaultValue || '';
      });
      setValues(initialValues);
      
      // Update preview
      setPreviewQuery(fillTemplate(template.template, initialValues));
    }
  }, [template]);
  
  // Update preview when values change
  useEffect(() => {
    if (template) {
      setPreviewQuery(fillTemplate(template.template, values));
    }
  }, [values, template]);
  
  // Update a placeholder value
  const handleValueChange = (placeholder: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };
  
  // Execute the template with filled values
  const handleExecute = () => {
    if (template) {
      onExecute(previewQuery);
      updateTemplateUsage(template.id);
      onClose();
    }
  };
  
  // Reset form on close
  const handleClose = () => {
    setValues({});
    setPreviewQuery('');
    onClose();
  };
  
  if (!template) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{template.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {placeholders.length > 0 ? (
              <>
                {placeholders.map((placeholder) => (
                  <FormControl key={placeholder.name}>
                    <FormLabel>{placeholder.name}</FormLabel>
                    <Input
                      value={values[placeholder.name] || ''}
                      onChange={(e) => handleValueChange(placeholder.name, e.target.value)}
                      placeholder={`Enter ${placeholder.name}`}
                    />
                  </FormControl>
                ))}
                
                <Box p={3} borderWidth="1px" borderRadius="md" w="full" bg="gray.50">
                  <Text fontWeight="semibold" mb={2}>Preview:</Text>
                  <Text fontFamily="mono">{previewQuery}</Text>
                </Box>
              </>
            ) : (
              <Text>This template has no placeholders. It will run as is.</Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleExecute}
            isDisabled={placeholders.some(p => !values[p.name] && p.defaultValue === undefined)}
          >
            Execute Query
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateExecutionDialog;