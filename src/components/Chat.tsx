import React, { useState } from 'react';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (res.ok) {
                const data = await res.json();
                setResponse(data.reply);
            } else {
                console.error('Failed to fetch response from backend');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-gray-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-300 bg-white shadow-sm">
                <h1 className="text-2xl font-semibold text-gray-800">ChatGPT Clone</h1>
            </div>
    
            {/* Chat window */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {response && (
                    <div className="flex items-start">
                        <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-md">
                            <strong>ChatGPT:</strong> {response}
                        </div>
                    </div>
                )}
                {message && (
                    <div className="flex justify-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md">
                            <strong>You:</strong> {message}
                        </div>
                    </div>
                )}
            </div>
    
            {/* Input section */}
            <div className="border-t border-gray-300 bg-white p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        placeholder="Send a message..."
                        className="flex-grow p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default Chat;