import React from 'react';
import Layout from '../components/Layout';

const Chat: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Chat with Dietrium Assistant</h1>
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/kWXBDncP54qRPv-1MrE8G"
            width="100%"
            height="1000px"
            frameBorder="0"
            className="w-full"
            title="Dietrium Chat Assistant"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;