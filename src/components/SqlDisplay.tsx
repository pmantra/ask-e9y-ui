// src/components/SqlDisplay.tsx
import { useState } from 'react';

interface SqlDisplayProps {
  sql: string;
}

const SqlDisplay = ({ sql }: SqlDisplayProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format SQL for better display (simplistic approach)
  const formattedSql = sql
    .replace(/SELECT/g, 'SELECT\n  ')
    .replace(/FROM/g, '\nFROM\n  ')
    .replace(/WHERE/g, '\nWHERE\n  ')
    .replace(/AND/g, '\n  AND ')
    .replace(/OR/g, '\n  OR ')
    .replace(/ORDER BY/g, '\nORDER BY\n  ')
    .replace(/GROUP BY/g, '\nGROUP BY\n  ')
    .replace(/HAVING/g, '\nHAVING\n  ')
    .replace(/JOIN/g, '\nJOIN\n  ');
  
  return (
    <div className="relative">
      <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
        <code>{formattedSql}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default SqlDisplay;