import { useAtom } from 'jotai';
import React, { useState } from 'react';

import { atom } from 'jotai';
import { locationsAtom, visiblePointsAtom } from '../atom';

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
                "Logistics patterns indicate stockpiling of anti-air munitions near Dnipro's western corridor. Convoy telemetry from thermal imaging satellites shows 12+ heavy transports arriving over 48 hours. Possible preparation for layered defense or launchpad construction.",
        },
        {
            name: "Zaporizhzhia",
            explanation:
                "AI anomaly detection flagged heat anomalies on Zaporizhzhia's southeastern perimeter. Independent corroboration from geofenced mobile pings suggests troop density exceeds baseline by 3.6x. Pattern matches staging prior to previous incursions.",
        },
        {
            name: "Mykolaiv",
            explanation:
                "Increased drone jamming attempts logged from Mykolaiv's southern flank. Frequency hopping observed across civilian and encrypted channels. Suggests testing EW suppression capabilities, likely prelude to broader signal blackouts.",
        }
    ]
}

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [locations, setLocations] = useAtom(locationsAtom);
    const [visiblePoints, setVisiblePoints] = useAtom(visiblePointsAtom);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSendMessage();
        }
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
        setVisiblePoints([]);

        try {
            const res = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmedMessage }),
            });

            if (res.ok) {
                const data = await res.json();
                const parsedResponse = JSON.parse(data.response);
                const fullReply = parsedResponse.general_explanation;

                // Prepare cleaned locations for later use
                const cleanedLocations = parsedResponse.locations.map((loc: any) => ({
                    ...loc,
                    name: loc.name.replace(/[^a-zA-Z]/g, ''),
                }));

                // Replace loading message with empty assistant message for animation
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'assistant', content: '' };
                    return updated;
                });

                let index = 0;
                const interval = setInterval(() => {
                    index++;
                    setMessages((prev) => {
                        const updated = [...prev];
                        const assistantMsg = updated[updated.length - 1];
                        if (assistantMsg && assistantMsg.role === 'assistant') {
                            assistantMsg.content = fullReply.slice(0, index);
                        }
                        return updated;
                    });

                    if (index >= fullReply.length) {
                        clearInterval(interval);
                        setIsLoading(false);
                        setLocations(cleanedLocations); // ✅ Only set after animation
                        triggerMapUpdate(fullReply);     // (optional, if needed after locations update)
                    }
                }, 10);
            } else {
                console.error('Failed to fetch response from backend');
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { role: 'assistant', content: 'Unable to retrieve battlefield data.' },
                ]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: 'System error. Check comms uplink.' },
            ]);
        }
    };





    const triggerMapUpdate = (intel: string) => {
        console.log('Triggering map update based on response:', intel);
    };

    return (
        <div className="flex flex-col h-screen bg-[#030711] text-white font-mono">
            {/* Header */}
            <div className="p-5 border-b border-[#1a2b45] bg-[#050b1a] shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold tracking-wider text-cyan-400">
                            DEFENSE COMMAND CENTER <span className="text-xs text-cyan-500">v2.0</span>
                        </h1>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400">SYSTEM ONLINE</span>
                        </div>
                    </div>
                    <div className="text-xs text-cyan-600">
                        {new Date().toLocaleTimeString()} UTC
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#030711] relative">
                <div className="absolute inset-0 bg-[url('/grid.png')] opacity-5 pointer-events-none"></div>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`px-4 py-3 max-w-xl rounded-md text-sm shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                ? 'bg-cyan-400/10 border border-cyan-500/20 text-cyan-100'
                                : msg.role === 'assistant'
                                    ? 'bg-[#0a1628] text-cyan-100 border border-cyan-900'
                                    : 'bg-[#1a1c1e] text-cyan-300 italic animate-pulse'
                                }`}
                        >
                            {msg.role !== 'loading' && (
                                <div className="text-xs text-cyan-500 mb-1">
                                    {msg.role === 'user' ? 'COMMAND INPUT' : 'SYSTEM RESPONSE'}
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="border-t border-[#1a2b45] bg-[#050b1a] p-4">
                <div className="flex items-center gap-2">
                    <div className="flex-grow relative max-w-[95%]">
                        <div className="w-full p-3 bg-[#0a1628] text-cyan-200 border border-cyan-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 font-mono">
                            <input
                                type="text"
                                value={message}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter tactical query..."
                                disabled={isLoading}
                                className="w-[90%] bg-transparent text-cyan-200 placeholder-cyan-700 focus:outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cyan-600">
                                {isLoading ? 'PROCESSING...' : 'READY'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="px-6 py-3 bg-cyan-800 hover:bg-cyan-700 transition rounded-md text-sm font-bold text-white disabled:opacity-50 flex items-center space-x-2 border border-cyan-600"
                    >
                        <span>EXECUTE</span>
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
