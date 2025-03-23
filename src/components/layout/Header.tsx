// src/components/layout/Header.tsx
import { Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <Flex className="container mx-auto" justify="space-between" align="center">
        <div>
          <Heading className="text-xl font-bold">Ask E9Y</Heading>
          <Text className="text-sm text-gray-500">Query Assistant</Text>
        </div>
        
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
      </Flex>
    </header>
  );
};

export default Header;