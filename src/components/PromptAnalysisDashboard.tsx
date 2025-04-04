import React, { useState, useEffect, ReactNode } from 'react';
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  Flex, 
  Text, 
  Badge, 
  Code,
  Select,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Divider,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { diffLines, Change } from 'diff';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';

// Define types for the prompt data
interface PromptData {
  query_id: string;
  original_query: string;
  prompt_system: string;
  prompt_user: string;
  execution_time_ms?: number;
  schema_size?: number;
  token_usage?: Record<string, number>;
}

// Define types for processed prompt data with analysis
interface ProcessedPromptData extends PromptData {
  analysis: {
    estimated_tokens: number;
    schema_table_count: number;
  };
}

// Define types for chart data
interface ChartDataPoint {
  queryId: string;
  schemaSize: number;
  tokenCount: number;
  responseTime: number;
  tableCount: number;
}

// Define types for comparison data
interface ComparisonData {
  prompt1: ProcessedPromptData;
  prompt2: ProcessedPromptData;
  diffs: {
    token: {
      value: number;
      percent: string;
    };
    table: {
      value: number;
      percent: string;
    };
    time: {
      value: string;
      percent: string;
    };
  };
  promptDiff: {
    text1: ReactNode;
    text2: ReactNode;
    diffs: Change[];
  };
}

// Define type for diff summary
interface DiffSummary {
  removed: number;
  added: number;
  unchanged: number;
}

// Helper function to estimate token count
const estimateTokens = (text: string | undefined): number => {
  return text ? Math.ceil(text.length / 4) : 0; // Rough estimate: ~4 chars per token
};

// Helper to count tables in schema
const countTables = (schemaText: string | undefined): number => {
  if (!schemaText) return 0;
  const matches = schemaText.match(/Table: eligibility\./g);
  return matches ? matches.length : 0;
};

// Enhanced helper function to highlight differences
const highlightDifferences = (text1: string | undefined, text2: string | undefined): {
  text1: ReactNode;
  text2: ReactNode;
  diffs: Change[];
} => {
  if (!text1 || !text2) return { text1, text2, diffs: [] };
  
  // Use line-by-line diff for large text like prompts
  const diffs = diffLines(text1, text2);
  
  // Create React elements with proper highlighting
  const parts1: React.ReactElement[] = [];
  const parts2: React.ReactElement[] = [];
  
  diffs.forEach((part, index) => {
    // Style for different parts
    const style = part.added 
      ? { backgroundColor: 'rgba(0, 255, 0, 0.2)', display: 'block' }  // green background for additions
      : part.removed 
        ? { backgroundColor: 'rgba(255, 0, 0, 0.2)', display: 'block' } // red background for deletions
        : {};                                              // no special style for unchanged parts
    
    // Add to appropriate array based on the type
    if (part.added) {
      parts2.push(<span key={index} style={style}>{part.value}</span>);
    } else if (part.removed) {
      parts1.push(<span key={index} style={style}>{part.value}</span>);
    } else {
      parts1.push(<span key={index} style={style}>{part.value}</span>);
      parts2.push(<span key={index} style={style}>{part.value}</span>);
    }
  });
  
  // Return both the formatted elements and the raw diffs for summary stats
  return { 
    text1: <>{parts1}</>, 
    text2: <>{parts2}</>,
    diffs
  };
};

const PromptAnalysisDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recentPrompts, setRecentPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for comparison feature
  const [comparePrompt1, setComparePrompt1] = useState<string>('');
  const [comparePrompt2, setComparePrompt2] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  
  // State for expanding prompt display
  const [expandedView, setExpandedView] = useState<boolean>(false);
  
  useEffect(() => {
    // Fetch recent prompts using the API service
    setLoading(true);
    setError(null);
    
    api.get('/analysis/prompts/recent?limit=20')
      .then(res => {
        setRecentPrompts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching prompts:', err);
        setError('Failed to fetch prompt data. Please check if the analytics API is available.');
        setLoading(false);
      });
  }, []);
  
  // Process prompts for analysis (add token estimation, etc.)
  const processedPrompts: ProcessedPromptData[] = recentPrompts.map(prompt => ({
    ...prompt,
    analysis: {
      estimated_tokens: estimateTokens(prompt.prompt_system) + estimateTokens(prompt.prompt_user),
      schema_table_count: countTables(prompt.prompt_system)
    }
  }));
  
  // Extract data for charts
  const chartData: ChartDataPoint[] = processedPrompts.map(p => ({
    queryId: p.query_id?.slice(0, 8) || 'unknown',
    schemaSize: p.schema_size || 0,
    tokenCount: p.analysis.estimated_tokens || 0,
    responseTime: p.execution_time_ms || 0,
    tableCount: p.analysis.schema_table_count || 0
  })).reverse(); // Reverse to show chronological order
  
  // Handle comparison generation
  const generateComparison = (): void => {
    if (!comparePrompt1 || !comparePrompt2) return;
    
    const prompt1 = processedPrompts.find(p => p.query_id === comparePrompt1);
    const prompt2 = processedPrompts.find(p => p.query_id === comparePrompt2);
    
    if (!prompt1 || !prompt2) return;
    
    // Calculate differences
    const tokenDiff = prompt2.analysis.estimated_tokens - prompt1.analysis.estimated_tokens;
    const tokenPercentDiff = prompt1.analysis.estimated_tokens ? 
      (tokenDiff / prompt1.analysis.estimated_tokens) * 100 : 0;
    
    const tableDiff = prompt2.analysis.schema_table_count - prompt1.analysis.schema_table_count;
    const tablePercentDiff = prompt1.analysis.schema_table_count ? 
      (tableDiff / prompt1.analysis.schema_table_count) * 100 : 0;
    
    const timeDiff = (prompt2.execution_time_ms || 0) - (prompt1.execution_time_ms || 0);
    const timePercentDiff = prompt1.execution_time_ms ? 
      (timeDiff / prompt1.execution_time_ms) * 100 : 0;
    
    // Get highlighted diffs with text and raw diff data
    const promptDiff = highlightDifferences(prompt1.prompt_system, prompt2.prompt_system);
    
    setComparison({
      prompt1,
      prompt2,
      diffs: {
        token: {
          value: tokenDiff,
          percent: tokenPercentDiff.toFixed(1)
        },
        table: {
          value: tableDiff,
          percent: tablePercentDiff.toFixed(1)
        },
        time: {
          value: timeDiff.toFixed(2),
          percent: timePercentDiff.toFixed(1)
        }
      },
      promptDiff
    });
    
    // Reset expanded view when generating new comparison
    setExpandedView(false);
  };
  
  // Calculate diff summary stats if comparison exists
  const getDiffSummary = (): DiffSummary | null => {
    if (!comparison || !comparison.promptDiff.diffs) return null;
    
    const diffs = comparison.promptDiff.diffs;
    
    const removed = diffs.filter(part => part.removed).length;
    const added = diffs.filter(part => part.added).length;
    const unchanged = diffs.filter(part => !part.added && !part.removed).length;
    
    return { removed, added, unchanged };
  };
  
  const diffSummary = comparison ? getDiffSummary() : null;
  
  // Toggle expanded view function
  const toggleExpandedView = (): void => {
    setExpandedView(!expandedView);
  };
  
  // Function to handle navigation back to chat
  const handleBackToChat = () => {
    navigate('/');
  };
  
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Header with back button */}
      <Flex 
        justify="space-between" 
        align="center" 
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        bg="white"
        width="100%"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="center">
          <Tooltip label="Back to Chat" placement="right">
            <IconButton
              aria-label="Back to chat"
              icon={<ChevronLeftIcon boxSize={6} />}
              variant="ghost"
              mr={3}
              onClick={handleBackToChat}
              size="md"
              _hover={{ bg: 'blue.50' }}
              borderRadius="full"
            />
          </Tooltip>
          <Heading size="lg" mb={0}>Prompt Analysis Dashboard</Heading>
        </Flex>
      </Flex>
      
      {/* Scrollable content area */}
      <Box 
        overflowY="auto" 
        flex="1" 
        p={4}
        position="relative"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {loading && (
          <Flex justify="center" align="center" height="200px">
            <Text>Loading prompt data...</Text>
          </Flex>
        )}
        
        {error && (
          <Flex 
            direction="column" 
            justify="center" 
            align="center" 
            p={6} 
            bg="red.50" 
            borderRadius="md" 
            border="1px solid" 
            borderColor="red.200"
            mb={4}
          >
            <Text color="red.500" fontWeight="medium">{error}</Text>
            <Text mt={2} fontSize="sm">
              Make sure the analytics endpoint is properly configured in your backend.
            </Text>
          </Flex>
        )}
        
        {!loading && !error && (
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Prompt Details</Tab>
              <Tab>Comparison</Tab>
            </TabList>
            
            <TabPanels>
              {/* Overview panel */}
              <TabPanel>
                <Flex direction="column" gap={6}>
                  <Box>
                    <Heading size="md" mb={3}>Metrics Over Time</Heading>
                    <Box height="300px">
                      <LineChart width={800} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="queryId" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <RechartsTooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="schemaSize" stroke="#8884d8" name="Schema Size" />
                        <Line yAxisId="left" type="monotone" dataKey="tableCount" stroke="#82ca9d" name="Table Count" />
                        <Line yAxisId="right" type="monotone" dataKey="tokenCount" stroke="#ffc658" name="Token Count" />
                      </LineChart>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={3}>Response Time vs Schema Size</Heading>
                    <Box height="300px">
                      <LineChart width={800} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="queryId" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="responseTime" stroke="#ff7300" name="Response Time (ms)" />
                        <Line type="monotone" dataKey="schemaSize" stroke="#387908" name="Schema Size" />
                      </LineChart>
                    </Box>
                  </Box>
                </Flex>
              </TabPanel>
              
              {/* Prompt details panel */}
              <TabPanel>
                {processedPrompts.length === 0 ? (
                  <Text>No prompts found. Run some queries first to see their details here.</Text>
                ) : (
                  processedPrompts.map(prompt => (
                    <Box key={prompt.query_id} mb={8} p={4} borderWidth="1px" borderRadius="md">
                      <Flex justify="space-between" align="flex-start">
                        <Box>
                          <Heading size="sm">{prompt.original_query}</Heading>
                          <Text color="gray.500" fontSize="sm">ID: {prompt.query_id}</Text>
                        </Box>
                        <Flex gap={2}>
                          <Badge colorScheme="blue">Tables: {prompt.analysis.schema_table_count}</Badge>
                          <Badge colorScheme="green">Tokens: {prompt.analysis.estimated_tokens}</Badge>
                          <Badge colorScheme="purple">Time: {prompt.execution_time_ms?.toFixed(2) || 0}ms</Badge>
                        </Flex>
                      </Flex>
                      
                      <Box mt={3}>
                        <Heading size="xs" mb={2}>System Prompt</Heading>
                        <Code p={2} borderRadius="md" fontSize="xs" whiteSpace="pre-wrap" maxHeight="200px" overflow="auto">
                          {prompt.prompt_system}
                        </Code>
                      </Box>
                    </Box>
                  ))
                )}
              </TabPanel>
              
              {/* Comparison panel */}
              <TabPanel>
                <Box mb={6}>
                  <Heading size="md" mb={4}>Compare Prompts</Heading>
                  <Flex gap={4} mb={4}>
                    <Box flex="1">
                      <Text mb={2}>First Prompt:</Text>
                      <Select 
                        placeholder="Select prompt..." 
                        value={comparePrompt1}
                        onChange={(e) => setComparePrompt1(e.target.value)}
                      >
                        {processedPrompts.map(p => (
                          <option key={p.query_id} value={p.query_id}>
                            {p.original_query?.substring(0, 30)}... ({p.query_id?.substring(0, 8)})
                          </option>
                        ))}
                      </Select>
                    </Box>
                    
                    <Box flex="1">
                      <Text mb={2}>Second Prompt:</Text>
                      <Select 
                        placeholder="Select prompt..." 
                        value={comparePrompt2}
                        onChange={(e) => setComparePrompt2(e.target.value)}
                      >
                        {processedPrompts.map(p => (
                          <option key={p.query_id} value={p.query_id}>
                            {p.original_query?.substring(0, 30)}... ({p.query_id?.substring(0, 8)})
                          </option>
                        ))}
                      </Select>
                    </Box>
                  </Flex>
                  
                  <Button 
                    colorScheme="blue" 
                    onClick={generateComparison}
                    isDisabled={!comparePrompt1 || !comparePrompt2}
                  >
                    Compare Prompts
                  </Button>
                </Box>
                
                {comparison && (
                  <Box>
                    <Heading size="md" mb={4}>Comparison Results</Heading>
                    
                    {/* Metrics comparison */}
                    <SimpleGrid columns={3} spacing={10} mb={6}>
                      <Stat>
                        <StatLabel>Token Usage</StatLabel>
                        <StatNumber>{comparison.prompt2.analysis.estimated_tokens}</StatNumber>
                        <StatHelpText>
                          {comparison.diffs.token.value !== 0 && (
                            <>
                              <StatArrow type={comparison.diffs.token.value < 0 ? 'decrease' : 'increase'} />
                              {Math.abs(comparison.diffs.token.value)} ({comparison.diffs.token.percent}%)
                            </>
                          )}
                        </StatHelpText>
                      </Stat>
                      
                      <Stat>
                        <StatLabel>Schema Tables</StatLabel>
                        <StatNumber>{comparison.prompt2.analysis.schema_table_count}</StatNumber>
                        <StatHelpText>
                          {comparison.diffs.table.value !== 0 && (
                            <>
                              <StatArrow type={comparison.diffs.table.value < 0 ? 'decrease' : 'increase'} />
                              {Math.abs(comparison.diffs.table.value)} ({comparison.diffs.table.percent}%)
                            </>
                          )}
                        </StatHelpText>
                      </Stat>
                      
                      <Stat>
                        <StatLabel>Response Time</StatLabel>
                        <StatNumber>{comparison.prompt2.execution_time_ms?.toFixed(2) || 0} ms</StatNumber>
                        <StatHelpText>
                          {parseFloat(comparison.diffs.time.value) !== 0 && (
                            <>
                              <StatArrow type={parseFloat(comparison.diffs.time.value) < 0 ? 'decrease' : 'increase'} />
                              {Math.abs(parseFloat(comparison.diffs.time.value))} ms ({comparison.diffs.time.percent}%)
                            </>
                          )}
                        </StatHelpText>
                      </Stat>
                    </SimpleGrid>
                    
                    {/* Queries */}
                    <SimpleGrid columns={2} spacing={4} mb={6}>
                      <Box>
                        <Heading size="sm" mb={2}>First Query</Heading>
                        <Text fontWeight="medium">{comparison.prompt1.original_query}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm" mb={2}>Second Query</Heading>
                        <Text fontWeight="medium">{comparison.prompt2.original_query}</Text>
                      </Box>
                    </SimpleGrid>
                    
                    {/* Diff summary */}
                    {diffSummary && (
                      <Flex mt={2} mb={4} justify="center">
                        <Badge colorScheme="red" mx={2}>
                          {diffSummary.removed} sections removed
                        </Badge>
                        <Badge colorScheme="green" mx={2}>
                          {diffSummary.added} sections added
                        </Badge>
                        <Badge colorScheme="blue" mx={2}>
                          {diffSummary.unchanged} sections unchanged
                        </Badge>
                      </Flex>
                    )}
                    
                    <Divider my={6} />
                    
                    {/* Show/Hide button */}
                    <Flex justify="center" mb={4}>
                      <Button
                        onClick={toggleExpandedView}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                      >
                        {expandedView ? "Show Less" : "Show Full Prompts"}
                      </Button>
                    </Flex>
                    
                    {/* Prompt comparison with diff highlighting */}
                    <Heading size="sm" mb={4}>System Prompts</Heading>
                    <SimpleGrid columns={2} spacing={4} mb={expandedView ? 16 : 6}>
                      <Box>
                        <Badge colorScheme="blue" mb={2}>First Prompt</Badge>
                        <Box 
                          p={2} 
                          borderRadius="md" 
                          fontSize="xs" 
                          fontFamily="monospace"
                          whiteSpace="pre-wrap" 
                          height={expandedView ? "auto" : "400px"}
                          maxHeight={expandedView ? "none" : "400px"}
                          overflow="auto"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          mb={2}
                        >
                          {comparison.promptDiff.text1}
                        </Box>
                      </Box>
                      <Box>
                        <Badge colorScheme="green" mb={2}>Second Prompt</Badge>
                        <Box 
                          p={2} 
                          borderRadius="md" 
                          fontSize="xs" 
                          fontFamily="monospace"
                          whiteSpace="pre-wrap" 
                          height={expandedView ? "auto" : "400px"}
                          maxHeight={expandedView ? "none" : "400px"}
                          overflow="auto"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          mb={2}
                        >
                          {comparison.promptDiff.text2}
                        </Box>
                      </Box>
                    </SimpleGrid>
                    
                    {/* Additional Show/Hide button at bottom for convenience */}
                    {expandedView && (
                      <Flex justify="center" mb={16} pb={8}>
                        <Button
                          onClick={toggleExpandedView}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                        >
                          Show Less
                        </Button>
                      </Flex>
                    )}
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </Box>
  );
};

export default PromptAnalysisDashboard;