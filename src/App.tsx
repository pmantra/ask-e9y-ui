import { useState, useEffect, useRef, RefObject } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import PromptAnalysisDashboard from './components/PromptAnalysisDashboard';
import Layout from './components/layout/layout';
import { getSavedQueries, getQueryHistory } from './services/storageService';
import { SavedQuery, QueryHistoryItem } from './types';

// Define type for the chat interface
interface ChatInterfaceRef {
  runQuery: (query: string) => void;
}

// Interface for MainLayout props
interface MainLayoutProps {
  chatInterfaceRef: RefObject<ChatInterfaceRef | null>;
  sidebarVisible: boolean;
  savedQueries: SavedQuery[];
  queryHistory: QueryHistoryItem[];
  refreshSavedQueries: () => void;
  refreshQueryHistory: () => void;
  toggleSidebar: () => void;
  runQuery: (query: string) => void;
}

// Main layout with chat interface and sidebar
const MainLayout = ({ 
  chatInterfaceRef, 
  sidebarVisible, 
  savedQueries, 
  queryHistory, 
  refreshSavedQueries, 
  refreshQueryHistory, 
  toggleSidebar, 
  runQuery 
}: MainLayoutProps) => (
  <Flex h="100vh" overflow="hidden">
    {sidebarVisible && (
      <Box width="280px" flexShrink={0} height="100%" overflowY="auto" borderRight="1px solid" borderColor="gray.200">
        <Sidebar 
          savedQueries={savedQueries}
          recentQueries={queryHistory}
          refreshSavedQueries={refreshSavedQueries}
          refreshQueryHistory={refreshQueryHistory}
          onRunQuery={runQuery}
        />
      </Box>
    )}
    
    <Box flex="1" height="100%" overflowY="auto">
      <ChatInterface 
        ref={chatInterfaceRef}
        onToggleSidebar={toggleSidebar}
        onQueryRun={refreshQueryHistory} 
        onSaveQuery={refreshSavedQueries} 
      />
    </Box>
  </Flex>
);

function App() {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  // Load saved queries and history from localStorage on initial render
  useEffect(() => {
    setSavedQueries(getSavedQueries());
    setQueryHistory(getQueryHistory());
  }, []);
  
  // Re-fetch data when localStorage might have changed
  const refreshSavedQueries = () => {
    setSavedQueries(getSavedQueries());
  };

  const refreshQueryHistory = () => {
    setQueryHistory(getQueryHistory());
  };

  const runQuery = (query: string) => {
    // Navigate to home page if not already there
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Use the ref to call the ChatInterface method
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.runQuery(query);
    } else {
      console.log("Chat interface reference not available");
    }
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <MainLayout 
            chatInterfaceRef={chatInterfaceRef}
            sidebarVisible={sidebarVisible}
            savedQueries={savedQueries}
            queryHistory={queryHistory}
            refreshSavedQueries={refreshSavedQueries}
            refreshQueryHistory={refreshQueryHistory}
            toggleSidebar={toggleSidebar}
            runQuery={runQuery}
          />
        </Layout>
      } />
      <Route path="/analysis" element={<PromptAnalysisDashboard />} />
    </Routes>
  );
}

export default App;