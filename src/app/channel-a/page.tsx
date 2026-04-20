"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, User, Brain, Briefcase, Heart } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import BottomButton from "@/components/BottomButton";

const tagCategories = [
  {
    title: "使用场景",
    icon: Briefcase,
    tags: [
      "代码开发",
      "内容创作",
      "学习助手",
      "生活管家",
      "商业决策",
      "情感陪伴",
    ],
  },
  {
    title: "性格倾向",
    icon: User,
    tags: [
      "理性严谨",
      "感性细腻",
      "幽默风趣",
      "直接坦率",
      "温和耐心",
      "犀利敏锐",
    ],
  },
  {
    title: "交互偏好",
    icon: Brain,
    tags: [
      "简洁回答",
      "详细展开",
      "举例说明",
      "结构化输出",
      "对话式互动",
      "步骤拆解",
    ],
  },
  {
    title: "关注领域",
    icon: Heart,
    tags: [
      "科技创新",
      "人文艺术",
      "商业财经",
      "健康生活",
      "社会关系",
      "效率工具",
    ],
  },
];

export default function ChannelA() {
  const router = useRouter();
  const { collectedTags, toggleTag, completeChannel } = useAppStore();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (collectedTags.length === 0) return;
    completeChannel("channel-a");
    setConfirmed(true);
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <PageTransition direction="right">
      <div className="h-full flex flex-col bg-qq-bg">
        <Navbar title="选择角色模板" />

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-qq-text mb-1">
              你的 OpenClaw 应该是什么样？
            </h2>
            <p className="text-sm text-qq-text-secondary">
              多选标签，我们会据此匹配最适合的人格预设
            </p>
          </motion.div>

          <div className="space-y-6">
            {tagCategories.map((category, catIdx) => {
              const CategoryIcon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon className="w-4 h-4 text-qq-primary" />
                    <h3 className="text-sm font-medium text-qq-text">
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => {
                      const isSelected = collectedTags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                            isSelected
                              ? "bg-qq-primary text-white border-qq-primary shadow-sm"
                              : "bg-white text-qq-text border-qq-border hover:border-qq-primary/40"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {isSelected && (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            {tag}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 p-4 bg-green-50 border border-green-200 rounded-2xl text-center"
              >
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">
                  标签已保存，正在返回配置大厅...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-white border-t border-qq-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-qq-text-secondary">
              已选 {collectedTags.length} 个标签
            </span>
            {collectedTags.length > 0 && (
              <button
                onClick={() =>
                  collectedTags.forEach((t) => toggleTag(t))
                }
                className="text-sm text-qq-primary hover:text-qq-primary-dark"
              >
                清空
              </button>
            )}
          </div>
          <BottomButton
            text="确认标签，保存配置"
            onClick={handleConfirm}
            disabled={collectedTags.length === 0 || confirmed}
          />
        </div>
      </div>
    </PageTransition>
  );
}
