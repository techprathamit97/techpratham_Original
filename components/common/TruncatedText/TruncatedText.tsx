import React, { useState } from 'react';

interface TruncatedTextProps {
  text: string;
  wordLimit?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  wordLimit = 10, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.trim() === '') {
    return <span className={className}>-</span>;
  }

  const words = text.trim().split(/\s+/);
  const shouldTruncate = words.length > wordLimit;

  if (!shouldTruncate) {
    return <span className={className} title={text}>{text}</span>;
  }

  const truncatedText = words.slice(0, wordLimit).join(' ');
  const displayText = isExpanded ? text : truncatedText;

  return (
    <div className={className}>
      <span title={text}>{displayText}</span>
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="ml-1 text-blue-400 hover:text-blue-300 text-xs underline focus:outline-none"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default TruncatedText;