import { Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();
  
  // Only show header on specific routes where needed
  // Currently hiding on both main chat page and analysis page
  if (location.pathname === '/' || location.pathname === '/analysis') {
    return null;
  }
  
  return (
    <header>
      <Flex 
        justify="space-between" 
        align="center"
        bg="neutral.10"
        borderBottom="1px"
        borderColor="neutral.25"
        px={6}
        py={4}
        width="100%"
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <Flex direction="column">
          <Heading 
            as="h1" 
            size="md" 
            color="neutral.60"
            fontFamily="sansSerif.semibold"
            mb={1}
          >
            Ask E9Y
          </Heading>
          <Text 
            fontSize="sm" 
            color="neutral.50"
            fontFamily="sansSerif.normal"
          >
            Query Assistant
          </Text>
        </Flex>
        
        <Button
          as={Link}
          to="/analysis"
          leftIcon={<Icon as={FiBarChart2} />}
          variant="ghost"
          size="sm"
          color="neutral.60"
          _hover={{
            bg: 'primary.10'
          }}
          fontFamily="sansSerif.normal"
        >
          Prompt Analysis
        </Button>
      </Flex>
    </header>
  );
};

export default Header;