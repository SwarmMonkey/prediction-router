'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MarketsResponse } from '@/lib/types';

interface AIChatProps {
  marketData: MarketsResponse | null;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function AIChat({ marketData }: AIChatProps) {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && marketData) {
      setIsThinking(true);
      setConversation((prev) => [...prev, { sender: 'user', text: newMessage }]);
      setNewMessage('');

      try {
        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: newMessage, marketData }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.reply) {
            setConversation((prev) => [...prev, { sender: 'ai', text: data.reply }]);
          } else {
            setConversation((prev) => [...prev, { sender: 'ai', text: 'Sorry, I couldn\'t generate a response.' }]);
          }
        } else {
          setConversation((prev) => [...prev, { sender: 'ai', text: 'Error communicating with the AI.' }]);
        }
      } catch (error) {
        console.error('Error sending message to AI:', error);
        setConversation((prev) => [...prev, { sender: 'ai', text: 'Something went wrong.' }]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-2">
      <h4 className="font-semibold mb-2 text-black">AI Market Assistant</h4>

      <div className="flex-1 overflow-y-auto border border-gray-300 rounded p-2 bg-gray-50 text-sm space-y-2">
        {conversation.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'text-green-800' : 'text-gray-800'}>
            <span className="font-semibold">{msg.sender === 'user' ? 'You:' : 'AI:'}</span> {msg.text}
          </div>
        ))}
        {isThinking && <div className="text-gray-600 italic animate-pulse">...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 rounded-md border border-gray-200 p-2 mr-2 text-sm focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask me about this market..."
          disabled={isThinking}
          
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          disabled={isThinking || !newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
