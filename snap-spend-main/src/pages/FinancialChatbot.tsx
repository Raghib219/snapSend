
import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, ArrowLeft, Send, Bot, User } from "lucide-react";

interface ChatMessage {
  question: string;
  answer: string;
}

export default function FinancialChatbot() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    const userQuestion = question;
    setQuestion("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/ask-question`, {
        question: userQuestion,
      });

      const newAnswer = response.data.answer;
      setChatHistory((prev) => [...prev, { question: userQuestion, answer: newAnswer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev, 
        { 
          question: userQuestion, 
          answer: "I'm sorry, something went wrong. Please make sure you've uploaded your transaction data first." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 min-h-[80vh]">
          {/* Header */}
          <CardHeader className="border-b border-gray-200 bg-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    AI Financial Advisor
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Get personalized insights about your spending patterns
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Analyzer</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col" style={{ height: "calc(80vh - 120px)" }}>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start a conversation!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ask me anything about your finances and spending patterns
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                    <h4 className="font-medium text-blue-900 mb-2">Try asking:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• "How can I reduce my spending?"</li>
                      <li>• "What's my biggest expense category?"</li>
                      <li>• "Should I invest my savings?"</li>
                      <li>• "How can I improve my financial health?"</li>
                    </ul>
                  </div>
                </div>
              ) : (
                chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                          <p className="text-sm leading-relaxed">{chat.question}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {chat.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-200 p-6 bg-white rounded-b-lg">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <Input
                  type="text"
                  className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  placeholder="Ask me about your finances..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 rounded-lg"
                  disabled={loading || !question.trim()}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
