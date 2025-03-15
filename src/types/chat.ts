export interface Message {
    id: string;
    type: 'user' | 'system';
    content: string;
    timestamp: Date;
    queryResults?: QueryResult;
  }
  
  export interface QueryResult {
    sql?: string;
    results?: any[];
    executionTimeMs?: number;
    rowCount?: number;
  }