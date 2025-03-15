// src/types.ts
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'system';
    timestamp: Date;
    isLoading?: boolean;
    isError?: boolean;
    queryResults?: {
      sql?: string;
      results?: any[];
      executionTimeMs?: number;
      rowCount?: number;
    };
  }

export interface SavedQuery {
    id: string;
    name: string;
    query: string;
    createdAt: Date;
    lastRun?: Date;
}

export interface QueryHistoryItem {
    id: string;
    query: string;
    timestamp: Date;
    success: boolean;
    queryId?: string; // Reference to the original query ID from the API
}

export interface QueryTemplate {
    id: string;
    name: string;
    template: string; // The query with placeholders
    category?: string;
    createdAt: Date;
    lastUsed?: Date;
  }
  
  export interface TemplatePlaceholder {
    name: string;
    defaultValue?: string;
    type?: 'text' | 'number' | 'date';
  }