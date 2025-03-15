const ResultsTable = ({ results }: { results: any[] }) => {
    if (!results || results.length === 0) return null;
    
    const columns = Object.keys(results[0]);
    
    // For debugging
    console.log("First row data:", results[0]);
    
    // Check for effective_range column
    if (results[0] && columns.includes('effective_range')) {
      const sample = results[0]['effective_range'];
      console.log("Sample effective_range:", sample);
      console.log("Type:", typeof sample);
      console.log("Is object?", typeof sample === 'object' && sample !== null);
      console.log("Stringified:", JSON.stringify(sample));
      console.log("Constructor:", sample ? sample.constructor.name : 'null');
    }
    
    return (
      <Table size="sm" variant="simple">
        {/* Table header */}
        <Thead bg="gray.50">
          <Tr>
            {columns.map(column => (
              <Th key={column}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        
        {/* Table body */}
        <Tbody>
          {results.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map(column => {
                const value = row[column];
                
                // Special handling for effective_range
                let displayValue = '';
                
                if (column === 'effective_range') {
                  // Debug this specific value
                  console.log(`Row ${rowIndex} effective_range:`, value);
                  
                  // Try different approaches to check the structure
                  if (value === null || value === undefined) {
                    displayValue = '—';
                  } else if (typeof value === 'string') {
                    // If already stringified
                    displayValue = value;
                  } else if (typeof value === 'object') {
                    // If it's an object with lower/upper
                    if (value.hasOwnProperty('lower') || value.hasOwnProperty('upper')) {
                      const lower = value.lower || '(unbounded)';
                      const upper = value.upper || '(unbounded)';
                      displayValue = `[${lower}, ${upper})`;
                    } else {
                      // Fallback for other object types
                      displayValue = JSON.stringify(value);
                    }
                  } else {
                    // Fallback for other types
                    displayValue = String(value);
                  }
                } else {
                  // For non-effective_range columns
                  displayValue = value === null || value === undefined ? '—' : String(value);
                }
                
                return (
                  <Td key={`${rowIndex}-${column}`}>
                    {displayValue}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };