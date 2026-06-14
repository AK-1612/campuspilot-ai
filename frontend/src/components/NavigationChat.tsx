/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Cpu, Sparkles, Navigation, Volume2, AlertTriangle, Compass, Bot, CheckCircle, X } from 'lucide-react';
import { NavigationMode, RouteOption } from '../types';
import { queryAgent } from '../services/api';

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
  currentLocation: string;
  lastQrLocation?: string;
  onNavigateToDestination: (origin: string, destination: string) => void;
  onClose?: () => void;
}

export default function NavigationChat({
  currentProfileMode,
  currentLocation,
  lastQrLocation,
  onNavigateToDestination,
  onClose
}: NavigationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init-1',
      sender: 'agent',
      text: `CampusPilot AI Navigator ready.\n\nActive profile: ${currentProfileMode}\nCurrent location: ${currentLocation}\n\nWhere would you like to navigate? For example: "Take me to Room 204" or "Is there a step-free path to the Science Lab?"`,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

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
    setInputValue('');
    setIsAgentTyping(true);

    try {
      // Call the real backend agent
      const result = await queryAgent(
        currentLocation,
        trimmed,
        currentProfileMode,
        lastQrLocation
      );

      // Map real agent steps to display format
      const agentSteps: Message['agentSteps'] = result.agent_steps.map((step, i) => ({
        stepName: `${i + 1}. Tool: ${step.tool}`,
        details: `Input: ${step.input}\nOutput: ${step.output}`,
        status: 'success' as const
      }));

      // Add intent step at the front if available
      if (result.intent) {
        agentSteps.unshift({
          stepName: '0. Intent Classified',
          details: `Intent: [${result.intent.toUpperCase()}] | Profile: [${result.profile_applied?.toUpperCase() || currentProfileMode.toUpperCase()}]`,
          status: 'info' as const
        });
      }

      let responseText = result.response;
      if (result.intent === 'emergency') {
        // Emergency responses are pre-LLM — flag them distinctly
        agentSteps.length = 0;
        agentSteps.push({
          stepName: 'Emergency Override',
          details: 'Pre-LLM heuristic triggered. Agent bypassed. Response time < 1ms.',
          status: 'info' as const
        });
      }

      const agentMsg: Message = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: responseText,
        timestamp: new Date(),
        agentSteps,
        actionButton: result.route_data ? {
          label: 'Start Guidance',
          onClick: () => onNavigateToDestination(currentLocation, trimmed)
        } : undefined
      };

      setMessages(prev => [...prev, agentMsg]);

    } catch (err) {
      setMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        sender: 'agent',
        text: 'Unable to reach the navigation service. Please check your connection and try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-950 text-white h-[calc(100vh-76px)] overflow-hidden font-sans relative">
      {/* ─── HUD HEADER ─── */}
      <header className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800/80 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
          <div className="text-left">
            <h2 className="text-sm font-extrabold text-white tracking-wide leading-none">CampusPilot AI Navigator</h2>
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase mt-1 block">Agentic ReAct — Live</span>
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

              {/* Agent step trace — shows real tool calls from LangChain */}
              {msg.agentSteps && msg.agentSteps.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-zinc-800 pt-3">
                  <span className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase block mb-1">Agent Trace</span>
                  {msg.agentSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        step.status === 'success' ? 'bg-teal-400' :
                        step.status === 'info' ? 'bg-blue-400' : 'bg-zinc-500'
                      }`} />
                      <div>
                        <span className="font-bold text-zinc-300">{step.stepName}</span>
                        <span className="text-zinc-500 ml-1 break-all">{step.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button inside message */}
              {msg.actionButton && (
                <div className="mt-4 pt-2">
                  <button
                    onClick={msg.actionButton.onClick}
                    className="w-full bg-[#60f8cb] text-zinc-950 hover:bg-[#4edab0] font-bold h-11 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform duration-100 active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 rotate-45" />
                    {msg.actionButton.label}                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing placeholder animation */}
        {isAgentTyping && (
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
            handleSendText(inputValue);
          }}
          className="relative flex items-center w-full max-w-xl mx-auto"
        >
          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask CampusPilot Navigator..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="block w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3.5 pl-4 pr-12 text-sm font-semibold focus:outline-none focus:border-teal-500 shadow-inner"
            />
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute inset-y-0 right-2 pr-3 flex items-center text-teal-400 hover:text-teal-300 disabled:text-zinc-650 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
