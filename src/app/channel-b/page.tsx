"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Check } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PageTransition from "@/components/PageTransition";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  quickReplies?: string[];
}

const conversationFlow: Message[] = [
  {
    id: "m1",
    type: "bot",
    content: "你好！我是龙虾配置助手 🦞\n我会帮你定制专属的 OpenClaw 人格配置。",
    quickReplies: ["开始配置", "准备好了"],
  },
  {
    id: "m2",
    type: "bot",
    content: "首先，你希望 OpenClaw 在哪些方面帮到你？",
    quickReplies: ["技术开发", "内容创作", "生活管理", "商业决策"],
  },
  {
    id: "m3",
    type: "bot",
    content: "了解！你更喜欢什么样的交流风格？",
    quickReplies: ["简洁直接", "详细展开", "幽默轻松", "专业严谨"],
  },
  {
    id: "m4",
    type: "bot",
    content: "你希望 OpenClaw 表现得更有创意，还是更务实？",
    quickReplies: ["创意发散型", "务实解决型", "两者平衡"],
  },
  {
    id: "m5",
    type: "bot",
    content: "最后一个问题～你希望 OpenClaw 的回应风格是？",
    quickReplies: ["像朋友聊天", "像导师指导", "像助手执行"],
  },
  {
    id: "m6",
    type: "bot",
    content: "太棒了！我已经充分了解了你的偏好 🎉\n返回配置大厅生成你的专属 OpenClaw 吧！",
  },
];

export default function ChannelB() {
  const router = useRouter();
  const { completeChannel, addTag } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [completed, setCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始发送第一条消息
  useEffect(() => {
    const timer = setTimeout(() => {
      sendBotMessage(0);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendBotMessage = (step: number) => {
    if (step >= conversationFlow.length) {
      setTimeout(() => {
        completeChannel("channel-b");
        setCompleted(true);
      }, 1500);
      return;
    }

    setIsTyping(true);
    const delay = Math.min(800 + conversationFlow[step].content.length * 15, 2000);

    setTimeout(() => {
      setMessages((prev) => [...prev, conversationFlow[step]]);
      setIsTyping(false);
    }, delay);
  };

  const handleQuickReply = (reply: string) => {
    // 添加用户消息
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content: reply },
    ]);

    // 记录标签
    addTag(reply);

    // 进入下一步
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setTimeout(() => {
      sendBotMessage(nextStep);
    }, 600);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    handleQuickReply(inputText.trim());
    setInputText("");
  };

  const handleBack = () => {
    if (completed) {
      router.push("/");
    } else {
      router.back();
    }
  };

  const lastBotMessage = messages.filter((m) => m.type === "bot").pop();

  return (
    <PageTransition direction="right">
      <div className="h-full flex flex-col bg-[#f5f6fa]">
        {/* 顶部导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 bg-qq-primary text-white shrink-0"
        >
          <button
            onClick={handleBack}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold">OpenClaw 配置助手</h1>
              <p className="text-xs text-white/70">
                {isTyping ? "正在思考..." : "在线"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "bot" && (
                  <div className="w-8 h-8 bg-qq-primary rounded-full flex items-center justify-center shrink-0 mr-2.5 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.type === "user"
                      ? "bg-qq-primary text-white rounded-br-md"
                      : "bg-white text-qq-text shadow-sm rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.type === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0 ml-2.5 mt-1">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 正在输入指示器 */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-8 h-8 bg-qq-primary rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-qq-primary/40 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-qq-primary/40 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-qq-primary/40 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 完成指示 */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center py-4"
              >
                <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700 font-medium">
                    配置已记录，正在返回...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* 快捷回复区域 */}
        <AnimatePresence>
          {lastBotMessage?.quickReplies && !completed && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-3 bg-white border-t border-gray-100"
            >
              <div className="flex flex-wrap gap-2">
                {lastBotMessage.quickReplies.map((reply) => (
                  <motion.button
                    key={reply}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickReply(reply)}
                    className="px-4 py-2 bg-qq-bg text-qq-text rounded-full text-sm font-medium border border-qq-border hover:bg-qq-primary hover:text-white hover:border-qq-primary transition-colors"
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 输入区域 */}
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isTyping ? "等待回复..." : "输入消息..."
              }
              disabled={isTyping || completed}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-qq-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-qq-primary/20 disabled:opacity-50"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping || completed}
              className="w-10 h-10 bg-qq-primary rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            或点击上方快捷选项进行配置
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
