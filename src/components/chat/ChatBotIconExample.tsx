import React, { useState } from 'react';
import { ChatBotIcon } from './ChatBotIcon';

/**
 * Example implementation showing different usage patterns
 * for the Y7 Premium Chatbot Icon
 */
export const ChatBotIconExample: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div style={{ padding: '40px', background: '#0A0A0A', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '40px' }}>Y7 Chatbot Icon Examples</h1>
      
      {/* Standard Usage */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#00D4FF', marginBottom: '20px' }}>Standard Usage</h2>
        <ChatBotIcon 
          onClick={() => setIsActive(!isActive)}
          isActive={isActive}
        />
      </div>

      {/* Size Variants */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#00D4FF', marginBottom: '20px' }}>Size Variants</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <ChatBotIcon size={40} onClick={() => console.log('Small clicked')} />
          <ChatBotIcon size={60} onClick={() => console.log('Default clicked')} />
          <ChatBotIcon size={80} onClick={() => console.log('Large clicked')} />
        </div>
      </div>

      {/* Static Version */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#00D4FF', marginBottom: '20px' }}>Static Version (No Animation)</h2>
        <ChatBotIcon 
          className="static"
          onClick={() => console.log('Static clicked')}
        />
      </div>

      {/* Custom Positioned */}
      <div style={{ position: 'relative', height: '200px', border: '1px solid #333', borderRadius: '8px' }}>
        <h2 style={{ color: '#00D4FF', margin: '20px' }}>Custom Positioned</h2>
        <ChatBotIcon 
          size={48}
          onClick={() => console.log('Custom positioned clicked')}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px'
          }}
        />
      </div>

      {/* Usage Notes */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#1A1A1A', borderRadius: '8px' }}>
        <h3 style={{ color: '#00D4FF', marginBottom: '16px' }}>Implementation Notes</h3>
        <ul style={{ color: '#CCCCCC', lineHeight: '1.6' }}>
          <li>Animations respect <code>prefers-reduced-motion</code> settings</li>
          <li>Optimized for 60fps performance using GPU acceleration</li>
          <li>Includes hover, focus, and click feedback states</li>
          <li>Fully accessible with proper ARIA labels</li>
          <li>Dark mode optimized with high contrast support</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatBotIconExample;