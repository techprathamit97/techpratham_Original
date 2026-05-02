import React from 'react';

interface SanityContentRendererProps {
  content: string;
}

const SanityContentRenderer: React.FC<SanityContentRendererProps> = ({ content }) => {
  // Convert plain text to HTML with basic formatting
  const formatContent = (text: string) => {
    return text
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  return (
    <div className="sanity-content prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
    </div>
  );
};

export default SanityContentRenderer;