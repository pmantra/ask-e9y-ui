import { Flex, Heading, Text, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2, FiHome } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();
  const isAnalysisPage = location.pathname === '/analysis';
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <Flex 
        justify="space-between" 
        align="center"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        py={3}
        width="100%"
      >
        <div>
          <Heading as="h1" size="md">Ask E9Y</Heading>
          <Text fontSize="sm" color="gray.500">Query Assistant</Text>
        </div>
        
        {isAnalysisPage ? (
          <Button
            as={Link}
            to="/"
            leftIcon={<Icon as={FiHome} />}
            variant="ghost"
            colorScheme="blue"
            size="sm"
          >
            Back to Chat
          </Button>
        ) : (
          <Button
            as={Link}
            to="/analysis"
            leftIcon={<Icon as={FiBarChart2} />}
            variant="ghost"
            colorScheme="blue"
            size="sm"
          >
            Prompt Analysis
          </Button>
        )}
      </Flex>
    </header>
  );
};

export default Header;