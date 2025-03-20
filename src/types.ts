export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'system';
    timestamp: Date;
    isLoading?: boolean;
    isError?: boolean;
    hasResults?: boolean;
    explanation?: string;
    original_user_query?: string;  // Added this field to track the original query
    timing_stats?: {
      cache_status?: string;
      cache_lookup?: number;
      sql_generation?: number;
      sql_execution?: number;
      total_time?: number;
      [key: string]: any; // For other timing stats
    };
    queryResults?: {
      sql?: string;
      results?: any[];
      executionTimeMs?: number;
      rowCount?: number;
      query_details?: {
        generated_sql?: string;
        execution_time_ms?: number;
        row_count?: number;
      };
    };
  }
  
  // Other existing type definitions...
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