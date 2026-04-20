"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Eye,
  Code2,
  FileText,
  X,
  Copy,
  Check,
  Zap,
  Settings,
  Shield,
  Heart,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PageTransition from "@/components/PageTransition";

export default function Result() {
  const router = useRouter();
  const {
    collectedTags,
    completedChannels,
    openClawConfig,
    soulMarkdown,
    matchedPreset,
    generateOpenClaw,
    resetProgress,
  } = useAppStore();
  const [showOverview, setShowOverview] = useState(false);
  const [showRawConfig, setShowRawConfig] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedSoul, setCopiedSoul] = useState(false);

  // 确保配置已生成
  const config = openClawConfig;
  const preset = matchedPreset;
  const soul = soulMarkdown;

  // 如果 store 中没有配置，先生成一个
  useMemo(() => {
    if (!config) {
      generateOpenClaw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tagCloud = useMemo(() => {
    const allTags =
      collectedTags.length > 0
        ? collectedTags
        : preset?.tags || ["个性化", "智能助手", "AI 协作者"];
    return allTags.map((tag, i) => ({
      text: tag,
      size: 0.8 + Math.random() * 0.7,
      delay: i * 0.05,
    }));
  }, [collectedTags, preset]);

  const handleRestart = () => {
    resetProgress();
    router.push("/");
  };

  const handleCopyJson = () => {
    if (config) {
      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleCopySoul = () => {
    if (soul) {
      navigator.clipboard.writeText(soul);
      setCopiedSoul(true);
      setTimeout(() => setCopiedSoul(false), 2000);
    }
  };

  const channelLabels: Record<string, string> = {
    "channel-a": "角色模板",
    "channel-b": "对话定制",
    "channel-c": "文件导入",
    "channel-d": "数据授权",
  };

  return (
    <PageTransition direction="up">
      <div className="h-full flex flex-col bg-qq-bg overflow-hidden">
        {/* 顶部渐变背景 */}
        <div className="relative bg-gradient-to-br from-qq-primary to-qq-primary-light text-white shrink-0">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">我的 OpenClaw</h1>
            <div className="w-9" />
          </div>

          {/* 人格类型大标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 pb-8 text-center"
          >
            <div className="inline-block mb-3">
              <div className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                已生成专属配置
              </div>
            </div>
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="text-4xl font-black tracking-tight mb-2"
            >
              {preset?.personalityLabel || "个性化 OpenClaw"}
            </motion.h2>
            <h3 className="text-xl font-bold mb-1">
              {preset?.personalitySubtitle || "你的专属 AI 协作者"}
            </h3>
            <p className="text-white/70 text-sm">
              {preset?.description || "基于你的选择生成的个性化配置"}
            </p>
          </motion.div>

          {/* 装饰波浪 */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path
                d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
                fill="#f5f6fa"
              />
            </svg>
          </div>
        </div>

        {/* 滚动内容区 */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 -mt-2">
          {/* 完成进度 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-qq-text">
                配置通道完成度
              </h3>
              <span className="text-sm font-bold text-qq-primary">
                {completedChannels.length}/4
              </span>
            </div>
            <div className="flex gap-2">
              {["channel-a", "channel-b", "channel-c", "channel-d"].map(
                (ch) => {
                  const isDone = completedChannels.includes(ch);
                  return (
                    <div key={ch} className="flex-1 text-center">
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor: isDone ? "#0099ff" : "#e5e7eb",
                          scale: isDone ? 1 : 0.95,
                        }}
                        className="h-2 rounded-full mb-1.5"
                      />
                      <span
                        className={`text-[10px] ${
                          isDone
                            ? "text-qq-primary font-medium"
                            : "text-qq-text-secondary"
                        }`}
                      >
                        {channelLabels[ch]}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </motion.div>

          {/* 动态标签云 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm mb-4"
          >
            <h3 className="text-sm font-semibold text-qq-text mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-qq-primary" />
              个性化标签
            </h3>
            <div className="flex flex-wrap gap-2 justify-center min-h-[80px]">
              {tagCloud.map((tag, i) => (
                <motion.span
                  key={tag.text + i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.6 + tag.delay,
                    type: "spring",
                    stiffness: 300,
                  }}
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1.5 bg-qq-primary/10 text-qq-primary rounded-xl font-medium"
                  style={{ fontSize: `${tag.size}rem` }}
                >
                  {tag.text}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* 能力挂载推荐 */}
          {config && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <h3 className="text-sm font-semibold text-qq-text mb-3 px-1">
                已挂载能力
              </h3>
              <div className="space-y-3">
                {config.capabilities.plugins.map((plugin, idx) => {
                  const icons = [Zap, Settings, Shield, Heart];
                  const colors = [
                    "bg-blue-50 text-blue-600",
                    "bg-green-50 text-green-600",
                    "bg-purple-50 text-purple-600",
                    "bg-orange-50 text-orange-600",
                  ];
                  const Icon = icons[idx % icons.length];
                  return (
                    <motion.div
                      key={plugin}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                      className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[idx % colors.length]}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-qq-text">
                          {plugin}
                        </h4>
                        <p className="text-xs text-qq-text-secondary">
                          {config.capabilities.modes[idx % config.capabilities.modes.length]}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 底部操作按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-3"
          >
            <button
              onClick={() => setShowOverview(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-qq-primary to-qq-primary-light text-white font-semibold text-base transition-all active:scale-[0.98] shadow-lg shadow-qq-primary/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              查看我的龙虾配置
            </button>

            <button
              onClick={() => setShowRawConfig(true)}
              className="w-full py-3.5 rounded-2xl bg-white border-2 border-qq-border text-qq-text font-semibold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Code2 className="w-5 h-5 text-qq-primary" />
              显示原始配置
            </button>

            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-2xl bg-white border border-qq-border text-qq-text-secondary font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重新配置
            </button>
          </motion.div>
        </div>
      </div>

      {/* 配置概览弹窗 */}
      <AnimatePresence>
        {showOverview && preset && config && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowOverview(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-white rounded-t-3xl max-h-[85%] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="shrink-0 px-6 pt-4 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-qq-text">
                    你的 OpenClaw 配置概览
                  </h2>
                  <button
                    onClick={() => setShowOverview(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-qq-text-secondary" />
                  </button>
                </div>
              </div>

              {/* 弹窗内容 */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8 space-y-5">
                {/* 人格类型 */}
                <div className="text-center py-4 bg-gradient-to-br from-qq-primary/5 to-qq-primary-light/5 rounded-2xl">
                  <h3 className="text-2xl font-black text-qq-primary mb-1">
                    {preset.personalityLabel}
                  </h3>
                  <p className="text-sm text-qq-text-secondary">
                    {preset.personalitySubtitle}
                  </p>
                </div>

                {/* 人格特质 */}
                <div>
                  <h4 className="text-sm font-semibold text-qq-text mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-qq-primary" />
                    人格特质
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {config.personality.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 沟通风格 */}
                <div>
                  <h4 className="text-sm font-semibold text-qq-text mb-2 flex items-center gap-2">
                    <MessageCircleIcon className="w-4 h-4 text-qq-primary" />
                    沟通风格
                  </h4>
                  <p className="text-sm text-qq-text-secondary bg-gray-50 rounded-xl p-3">
                    {config.personality.communicationStyle}
                  </p>
                </div>

                {/* 已挂载能力 */}
                <div>
                  <h4 className="text-sm font-semibold text-qq-text mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-qq-primary" />
                    已挂载能力
                  </h4>
                  <div className="space-y-2">
                    {config.capabilities.plugins.map((plugin) => (
                      <div
                        key={plugin}
                        className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl"
                      >
                        <div className="w-2 h-2 bg-qq-primary rounded-full" />
                        <span className="text-sm text-qq-text">{plugin}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 关注领域 */}
                <div>
                  <h4 className="text-sm font-semibold text-qq-text mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-qq-primary" />
                    关注领域
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {config.preferences.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soul 摘要 */}
                <div>
                  <h4 className="text-sm font-semibold text-qq-text mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-qq-primary" />
                    Soul 身份认同
                  </h4>
                  <p className="text-sm text-qq-text-secondary bg-gray-50 rounded-xl p-3 leading-relaxed">
                    {config.soul.identity}
                  </p>
                </div>

                {/* 价值观 */}
                <div>
                  <h4 className="text-sm font-semibold text-qq-text mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-qq-primary" />
                    核心信念
                  </h4>
                  <div className="space-y-2">
                    {config.soul.values.map((value) => (
                      <div
                        key={value}
                        className="flex items-center gap-2 text-sm text-qq-text"
                      >
                        <span className="text-qq-primary">•</span>
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 关闭按钮 */}
                <button
                  onClick={() => setShowOverview(false)}
                  className="w-full py-3.5 rounded-2xl bg-qq-primary text-white font-semibold text-base"
                >
                  知道了
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 原始配置展示弹窗 */}
      <AnimatePresence>
        {showRawConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setShowRawConfig(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-white rounded-t-3xl max-h-[90%] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="shrink-0 px-6 pt-4 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-qq-text">
                    原始配置代码
                  </h2>
                  <button
                    onClick={() => setShowRawConfig(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-qq-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Tab 切换 */}
              <div className="shrink-0 px-6 mb-4">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button className="flex-1 py-2 rounded-lg bg-white text-sm font-medium text-qq-text shadow-sm">
                    JSON 配置
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-sm font-medium text-qq-text-secondary">
                    soul.md
                  </button>
                </div>
              </div>

              {/* 内容区 */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8 space-y-6">
                {/* JSON 配置 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-qq-text flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-qq-primary" />
                      openclaw.config.json
                    </h4>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 px-3 py-1.5 bg-qq-primary/10 text-qq-primary rounded-lg text-xs font-medium"
                    >
                      {copiedJson ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 rounded-2xl p-4 text-xs overflow-x-auto leading-relaxed">
                    <code>
                      {config
                        ? JSON.stringify(config, null, 2)
                        : "// 配置未生成"}
                    </code>
                  </pre>
                </div>

                {/* soul.md */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-qq-text flex items-center gap-2">
                      <FileText className="w-4 h-4 text-qq-primary" />
                      soul.md
                    </h4>
                    <button
                      onClick={handleCopySoul}
                      className="flex items-center gap-1 px-3 py-1.5 bg-qq-primary/10 text-qq-primary rounded-lg text-xs font-medium"
                    >
                      {copiedSoul ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-300 rounded-2xl p-4 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    <code>{soul || "// Soul 配置未生成"}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
