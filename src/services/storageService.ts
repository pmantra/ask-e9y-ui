import { SavedQuery, QueryHistoryItem, QueryTemplate } from '../types';

// Keys for localStorage
const SAVED_QUERIES_KEY = 'ask_e9y_saved_queries';
const QUERY_HISTORY_KEY = 'ask_e9y_query_history';
const MAX_HISTORY_ITEMS = 50; // Maximum number of history items to store
const TEMPLATES_KEY = 'ask_e9y_templates';

// Saved Queries functions
export const getSavedQueries = (): SavedQuery[] => {
  try {
    const savedQueriesJson = localStorage.getItem(SAVED_QUERIES_KEY);
    if (!savedQueriesJson) return [];
    
    const queries = JSON.parse(savedQueriesJson);
    // Convert string dates back to Date objects
    return queries.map((q: any) => ({
      ...q,
      createdAt: new Date(q.createdAt),
      lastRun: q.lastRun ? new Date(q.lastRun) : undefined
    }));
  } catch (error) {
    console.error('Error retrieving saved queries:', error);
    return [];
  }
};

export const saveQuery = (query: SavedQuery): void => {
  try {
    const queries = getSavedQueries();
    // Check if query with same ID exists and remove it
    const filteredQueries = queries.filter(q => q.id !== query.id);
    // Add new query
    const updatedQueries = [...filteredQueries, query];
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updatedQueries));
  } catch (error) {
    console.error('Error saving query:', error);
  }
};

export const deleteSavedQuery = (id: string): void => {
  try {
    const queries = getSavedQueries();
    const updatedQueries = queries.filter(q => q.id !== id);
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updatedQueries));
  } catch (error) {
    console.error('Error deleting saved query:', error);
  }
};

export const updateSavedQueryLastRun = (id: string): void => {
  try {
    const queries = getSavedQueries();
    const updatedQueries = queries.map(q => 
      q.id === id ? { ...q, lastRun: new Date() } : q
    );
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updatedQueries));
  } catch (error) {
    console.error('Error updating saved query:', error);
  }
};

// Query History functions
export const getQueryHistory = (): QueryHistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(QUERY_HISTORY_KEY);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson);
    // Convert string dates back to Date objects
    return history.map((h: any) => ({
      ...h,
      timestamp: new Date(h.timestamp)
    }));
  } catch (error) {
    console.error('Error retrieving query history:', error);
    return [];
  }
};

export const addQueryToHistory = (historyItem: QueryHistoryItem): void => {
  try {
    const history = getQueryHistory();
    // Add new history item to the beginning (most recent first)
    const updatedHistory = [historyItem, ...history];
    // Keep only the latest MAX_HISTORY_ITEMS items
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error adding to query history:', error);
  }
};

export const clearQueryHistory = (): void => {
  try {
    localStorage.removeItem(QUERY_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing query history:', error);
  }
};

export const removeQueryFromHistory = (id: string): void => {
  try {
    const history = getQueryHistory();
    const updatedHistory = history.filter(h => h.id !== id);
    localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error removing from query history:', error);
  }
};


// Get all templates
export const getTemplates = (): QueryTemplate[] => {
  try {
    const templatesJson = localStorage.getItem(TEMPLATES_KEY);
    if (!templatesJson) return [];
    
    const templates = JSON.parse(templatesJson);
    return templates.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      lastUsed: t.lastUsed ? new Date(t.lastUsed) : undefined
    }));
  } catch (error) {
    console.error('Error retrieving templates:', error);
    return [];
  }
};

// Save a new template
export const saveTemplate = (template: QueryTemplate): void => {
  try {
    const templates = getTemplates();
    const filteredTemplates = templates.filter(t => t.id !== template.id);
    const updatedTemplates = [...filteredTemplates, template];
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error saving template:', error);
  }
};

// Delete a template
export const deleteTemplate = (id: string): void => {
  try {
    const templates = getTemplates();
    const updatedTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error deleting template:', error);
  }
};

// Update template's last used timestamp
export const updateTemplateUsage = (id: string): void => {
  try {
    const templates = getTemplates();
    const updatedTemplates = templates.map(t => 
      t.id === id ? { ...t, lastUsed: new Date() } : t
    );
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error updating template usage:', error);
  }
};