import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Update this to match your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface QueryRequest {
  query: string;
  conversation_id?: string;
  max_results?: number;
  include_sql?: boolean;
  include_explanation?: boolean;  // Add this parameter
  include_cached_explanation?: boolean;  // Add this parameter
}

export interface ExplainRequest {
  query_id: string;
}

export interface QueryResponse {
  query_id: string;
  results: any[];
  query_details?: {
    generated_sql: string;
    execution_time_ms: number;
    row_count: number;
  };
  conversation_id: string;
  message?: string;
  explanation?: string;  // Add this field
  timestamp: string;
  has_results: boolean;
}

export interface ExplainResponse {
  query_id: string;
  explanation: string;
  timestamp: string;
  request_id: string;
}

export const sendQuery = async (data: QueryRequest): Promise<QueryResponse> => {
  try {
    const response = await api.post('/query', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail?.error || 'An error occurred');
    }
    throw error;
  }
};

export const getExplanation = async (data: ExplainRequest): Promise<ExplainResponse> => {
  try {
    const response = await api.post('/explain', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail?.error || 'An error occurred');
    }
    throw error;
  }
};

export default api;