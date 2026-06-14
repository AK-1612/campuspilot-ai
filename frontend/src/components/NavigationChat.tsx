/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Cpu, Sparkles, Navigation, Volume2, AlertTriangle, Compass, Bot, CheckCircle, X } from 'lucide-react';
import { NavigationMode, RouteOption } from '../types';
import { getRoute, sendChatMessage } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  agentSteps?: {
    stepName: string;
    details: string;
    status: 'pending' | 'success' | 'info';
  }[];
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface NavigationChatProps {
  currentProfileMode: NavigationMode;
  onNavigateToDestination: (origin: string, destination: string) => void;
  onClose?: () => void;
}

export default function NavigationChat({
  currentProfileMode,
  onNavigateToDestination,
  onClose
}: NavigationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init-1',
      sender: 'agent',
      text: `Hello! I am your CampusPilot AI Navigator. I am aware that you are currently using the **${currentProfileMode === 'wheelchair' ? '♿ Wheelchair' : currentProfileMode}** routing profile. 

Where would you like to navigate today? You can ask me in plain language, e.g. "Take me to Room 204" or "Is there a step-free path to the Science Lab?"`,
      timestamp: new Date()
    }
  ]);
  
  const [inputVal, setInputVal] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [routeOptions, setRouteOptions] = useState<RouteOption[] | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentTyping]);

  // Handle voice simulation
  const triggerVoiceSimulation = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      // Simulate speech detection filling the query
      setInputVal("Take me to Room 204, avoiding all stairs");
    }, 1500);

    setTimeout(() => {
      setIsVoiceListening(false);
      // Automatically send
      handleSendText("Take me to Room 204, avoiding all stairs");
    }, 2800);
  };

  const handleSendText = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setAgentTyping(true);

    // Call real backend endpoint
    try {
      const agentMsg: Message = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: 'Analyzing request...',
        timestamp: new Date(),
        agentSteps: []
      };
      
      setMessages(prev => [...prev, agentMsg]);

      const origin = 'Main Gate'; // Default context
      const result = await sendChatMessage(trimmed, origin, currentProfileMode);

      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        last.text = result.response;
        
        if (result.intermediate_steps && result.intermediate_steps.length > 0) {
          last.agentSteps = result.intermediate_steps;
        }

        if (result.route_data) {
          const nodes = result.route_data.nodes;
          const destination = nodes && nodes.length > 0 ? nodes[nodes.length - 1].name : 'Destination';

          last.text += `\n\n### 🗺️ Route Mapped\nI found a path. Click below to start your visual guide.`;

          last.actionButton = {
            label: '🚀 Start Guidance Now',
            onClick: () => {
              onNavigateToDestination(origin, destination);
            }
          };
        }
        return copy;
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        last.text = 'Sorry, I encountered an error communicating with the navigation server.';
        return copy;
      });
    }

    setAgentTyping(false);
  };

  return (
    <div className="flex flex-col bg-zinc-950 text-white h-[calc(100vh-76px)] overflow-hidden font-sans relative">
      {/* ─── HUD HEADER ─── */}
      <header className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800/80 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
          <div className="text-left">
            <h2 className="text-sm font-extrabold text-white tracking-wide leading-none">CampusPilot AI Navigator</h2>
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase mt-1 block">Agentic ReAct Mode</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* ─── CHAT BUBBLE STREAM ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 no-scrollbar pb-32 z-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Sender Label */}
            <span className="text-[10px] text-zinc-500 font-mono mb-1 select-none">
              {msg.sender === 'user' ? 'YOU' : 'CAMPUSPILOT_AGENT'}
            </span>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-md select-text ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-none'
                  : 'bg-zinc-900 text-zinc-105 border border-zinc-850 rounded-tl-none space-y-3'
              }`}
            >
              {/* Message text */}
              <div className="whitespace-pre-wrap text-left font-sans prose prose-invert prose-sm">
                {msg.text}
              </div>

              {/* Telemetry logs removed per user request */}

              {/* Action Button inside message */}
              {msg.actionButton && (
                <div className="mt-4 pt-2">
                  <button
                    onClick={msg.actionButton.onClick}
                    className="w-full bg-[#60f8cb] text-zinc-950 hover:bg-[#4edab0] font-bold h-11 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform duration-100 active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 rotate-45" />
                    {msg.actionButton.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing placeholder animation */}
        {agentTyping && (
          <div className="flex flex-col items-start mr-auto max-w-[80%]">
            <span className="text-[10px] text-zinc-500 font-mono mb-1">CAMPUSPILOT_AGENT</span>
            <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="h-2 w-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ─── BOTTOM CONTROL SHEETS (INPUT BAR) ─── */}
      <footer className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-850 px-4 pt-3 pb-6 shrink-0 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText(inputVal);
          }}
          className="relative flex items-center w-full max-w-xl mx-auto"
        >
          {/* Microphone button */}
          <button
            type="button"
            onClick={triggerVoiceSimulation}
            className={`mr-2 h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              isVoiceListening
                ? 'bg-red-900 border-red-500 text-white animate-pulse'
                : 'bg-zinc-950 border-zinc-800 text-teal-400 hover:bg-zinc-850'
            }`}
            title="Simulate Voice Command"
          >
            <Mic className={`w-5 h-5 ${isVoiceListening ? 'animate-bounce' : ''}`} />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={isVoiceListening ? "Dictating..." : "Ask CampusPilot agent..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isVoiceListening}
              className="block w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3.5 pl-4 pr-12 text-sm font-semibold focus:outline-none focus:border-teal-500 shadow-inner"
            />
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="absolute inset-y-0 right-2 pr-3 flex items-center text-teal-400 hover:text-teal-300 disabled:text-zinc-650 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </footer>

      {/* Voice Dictation Simulation Popover overlay */}
      {isVoiceListening && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
          <div className="relative flex items-center justify-center w-36 h-36">
            <div className="absolute inset-0 rounded-full bg-red-600 opacity-20 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-red-800 opacity-40 animate-pulse" />
            <div className="relative w-20 h-20 bg-red-650 rounded-full flex items-center justify-center shadow-lg border border-red-500/50">
              <Mic className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Voice Dictation</h3>
            <p className="text-xs text-zinc-400 font-semibold max-w-xs px-6">
              "Take me to Room 204, avoiding all stairs..."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
