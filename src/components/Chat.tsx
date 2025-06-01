import { useAtom } from 'jotai';
import React, { useState } from 'react';

import { atom } from 'jotai';
import { locationsAtom } from '../atom';

type Message = {
    role: 'user' | 'assistant' | 'loading';
    content: string;
};

const responseData = {
    generalExplanation: "There are 5 high-risk Ukrainian targets for May 24th, 2025. I've identified these based on recent satellite heat signatures, intercepted communications, and movement analysis from ISR drone sweeps. These zones have shown a spike in tactical activity, including artillery staging, radar disruptions, and logistics convoys indicating imminent escalation.",

    locations: [
        {
            name: "Kiev",
            explanation:
                "Kiev has shown increased electronic warfare signals in the northeastern sector. SIGINT intercepted encrypted traffic suggesting forward command node mobilization. Satellite imagery confirms hardened shelters being retrofitted near Obolon District.",
        },
        {
            name: "Kharkiv",
            explanation:
                "Multiple artillery units repositioned south of Kharkiv. Civilian movement decreased sharply overnight in Industrialnyi District. Drone recon detected scorched terrain and temporary camo netting consistent with Smerch MLRS batteries.",
        },
        {
            name: "Dnipro",
            explanation:
                "Logistics patterns indicate stockpiling of anti-air munitions near Dnipro’s western corridor. Convoy telemetry from thermal imaging satellites shows 12+ heavy transports arriving over 48 hours. Possible preparation for layered defense or launchpad construction.",
        },
        {
            name: "Zaporizhzhia",
            explanation:
                "AI anomaly detection flagged heat anomalies on Zaporizhzhia’s southeastern perimeter. Independent corroboration from geofenced mobile pings suggests troop density exceeds baseline by 3.6x. Pattern matches staging prior to previous incursions.",
        },
        {
            name: "Mykolaiv",
            explanation:
                "Increased drone jamming attempts logged from Mykolaiv’s southern flank. Frequency hopping observed across civilian and encrypted channels. Suggests testing EW suppression capabilities, likely prelude to broader signal blackouts.",
        }
    ]
}

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [locations, setLocations] = useAtom(locationsAtom);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    

    const [generalExplanation, setGeneralExplanation] = useState("");

    const handleSendMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        setIsLoading(true);
        const userMessage: Message = { role: 'user', content: trimmedMessage };
        const loadingMessage: Message = { role: 'loading', content: 'Analyzing battlefield telemetry…' };

        setMessages((prev) => [...prev, userMessage, loadingMessage]);
        setMessage('');

        setTimeout(() => {
            const mockResponse = {
                reply: responseData.generalExplanation
            };

            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: mockResponse.reply },
            ]);

            triggerMapUpdate(mockResponse.reply);

            setLocations(responseData.locations);
            setIsLoading(false);
        }, 2000);
        // try {
        //   const res = await fetch('http://localhost:5000/api/chat', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ message: trimmedMessage }),
        //   });

        //   if (res.ok) {
        //     const data = await res.json();

        //     setMessages((prev) => [
        //       ...prev.slice(0, -1),
        //       { role: 'assistant', content: data.reply },
        //     ]);

        //     triggerMapUpdate(data.reply);
        //   } else {
        //     console.error('Failed to fetch response from backend');
        //     setMessages((prev) => [
        //       ...prev.slice(0, -1),
        //       { role: 'assistant', content: 'Unable to retrieve battlefield data.' },
        //     ]);
        //   }
        // } catch (error) {
        //   console.error('Error:', error);
        //   setMessages((prev) => [
        //     ...prev.slice(0, -1),
        //     { role: 'assistant', content: 'System error. Check comms uplink.' },
        //   ]);
        // } finally {
        //   setIsLoading(false);
        // }
    };

    const triggerMapUpdate = (intel: string) => {
        console.log('Triggering map update based on response:', intel);
    };

    return (
        <div className="flex flex-col h-screen bg-[#0b0c10] text-white font-sans">
            {/* Header */}
            <div className="p-5 border-b border-[#1f2937] bg-[#111214] shadow-sm">
                <h1 className="text-xl font-semibold tracking-wide text-green-400">Battlefield AI</h1>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#0b0c10]">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`px-4 py-3 max-w-xl rounded-xl text-sm shadow ${msg.role === 'user'
                                    ? 'bg-green-400/10 border border-green-500/20 text-green-100'
                                    : msg.role === 'assistant'
                                        ? 'bg-[#161819] text-gray-100 border border-gray-700'
                                        : 'bg-[#1a1c1e] text-green-300 italic animate-pulse'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="border-t border-[#1f2937] bg-[#111214] p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        placeholder="e.g. Where have artillery strikes been concentrated?"
                        disabled={isLoading}
                        className="flex-grow p-3 bg-[#1f2023] text-green-200 placeholder-green-500 border border-green-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg text-sm font-medium text-white disabled:opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
