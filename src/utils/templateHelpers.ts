import { TemplatePlaceholder } from '../types';

/**
 * Extract placeholders from a template string
 */
export const extractPlaceholders = (template: string): TemplatePlaceholder[] => {
  const regex = /{([^{}:]+)(?::([^{}]*))?}/g;
  const placeholders: TemplatePlaceholder[] = [];
  
  let match;
  while ((match = regex.exec(template)) !== null) {
    placeholders.push({
      name: match[1],
      defaultValue: match[2] || undefined,
      type: 'text' // Default type
    });
  }
  
  return placeholders;
};

/**
 * Fill a template with provided values
 */
export const fillTemplate = (template: string, values: Record<string, string>): string => {
  let filledTemplate = template;
  
  // Replace each placeholder with its value
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}(?::[^{}]*)?}`, 'g');
    filledTemplate = filledTemplate.replace(regex, value);
  });
  
  filledTemplate = filledTemplate.replace(
    /{([^{}:]+)(?::([^{}]*))?}/g,
    (_match: string, _placeholder: string, defaultValue?: string): string => {
      return defaultValue ?? '';
    }
  );
  
  
  return filledTemplate;
};