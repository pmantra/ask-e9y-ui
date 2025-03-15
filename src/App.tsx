// src/App.tsx - Adjust to work with your existing layout
import { useState, useEffect, useRef } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { getSavedQueries, getQueryHistory } from './services/storageService';
import { SavedQuery, QueryHistoryItem } from './types';

function App() {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const chatInterfaceRef = useRef<any>(null);

  
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
}

export default App;