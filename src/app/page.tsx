"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  MessageCircle,
  FileUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Zap,
  Wand2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PageTransition from "@/components/PageTransition";

const channels = [
  {
    id: "channel-a",
    title: "角色模板",
    desc: "选择预设角色，快速配置 OpenClaw 人格",
    icon: User,
    color: "bg-blue-50 text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    id: "channel-b",
    title: "对话定制",
    desc: "通过对话告诉龙虾你的偏好与需求",
    icon: MessageCircle,
    color: "bg-green-50 text-green-600",
    borderColor: "border-green-200",
  },
  {
    id: "channel-c",
    title: "文件导入",
    desc: "导入已有配置或聊天记录，智能解析",
    icon: FileUp,
    color: "bg-purple-50 text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    id: "channel-d",
    title: "数据授权",
    desc: "授权 QQ 数据，让龙虾更懂你",
    icon: ShieldCheck,
    color: "bg-orange-50 text-orange-600",
    borderColor: "border-orange-200",
  },
];

export default function Home() {
  const router = useRouter();
  const { completedChannels, generateOpenClaw, resetProgress } = useAppStore();
  const hasCompletedAny = completedChannels.length > 0;

  const handleChannelClick = (id: string) => {
    router.push(`/${id}`);
  };

  const handleGenerateNow = () => {
    generateOpenClaw();
    router.push("/result");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition direction="right">
      <div className="h-full flex flex-col bg-qq-bg">
        {/* 顶部标题区 */}
        <div className="px-6 pt-10 pb-6 bg-gradient-to-br from-qq-primary to-qq-primary-light text-white">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-1"
              >
                配置你的 OpenClaw
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/80 text-sm"
              >
                选择配置方式，打造专属龙虾助手
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"
            >
              <Wand2 className="w-7 h-7 text-white" />
            </motion.div>
          </div>

          {/* 进度指示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center gap-2"
          >
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedChannels.length / channels.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <span className="text-sm font-medium">
              配置完成 {completedChannels.length}/{channels.length}
            </span>
          </motion.div>
        </div>

        {/* 通道卡片列表 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 px-4 py-6 space-y-4 overflow-y-auto no-scrollbar"
        >
          {channels.map((channel) => {
            const isCompleted = completedChannels.includes(channel.id);
            const Icon = channel.icon;

            return (
              <motion.button
                key={channel.id}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChannelClick(channel.id)}
                className={`w-full flex items-center gap-4 p-5 bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md text-left ${
                  isCompleted
                    ? "border-qq-success bg-green-50/50"
                    : `border-transparent ${channel.borderColor} hover:border-qq-primary/30`
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${channel.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-qq-text">
                      {channel.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-qq-success shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-qq-text-secondary mt-0.5">
                    {channel.desc}
                  </p>
                </div>

                <ChevronRight
                  className={`w-5 h-5 shrink-0 ${
                    isCompleted ? "text-qq-success" : "text-qq-text-secondary"
                  }`}
                />
              </motion.button>
            );
          })}

          {/* 提示文案 */}
          <motion.div
            variants={itemVariants}
            className="text-center px-2 py-3"
          >
            <p className="text-xs text-qq-text-secondary leading-relaxed">
              每个配置通道都会让龙虾更了解你。
              <br />
              不必完成全部，随时可以生成专属配置。
            </p>
          </motion.div>
        </motion.div>

        {/* 底部按钮区 */}
        <div className="p-4 bg-white border-t border-qq-border space-y-3">
          {hasCompletedAny ? (
            <>
              {/* 快速生成按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button
                  onClick={handleGenerateNow}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-qq-primary to-qq-primary-light text-white font-semibold text-base transition-all duration-200 active:scale-[0.98] shadow-lg shadow-qq-primary/25 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  我觉得OK了，帮我配置个性化龙虾
                </button>
              </motion.div>
              <p className="text-center text-xs text-qq-text-secondary">
                你也可以继续选择其他配置方式补充信息
              </p>
            </>
          ) : (
            <p className="text-center text-sm text-qq-text-secondary py-2">
              选择至少一个配置通道，即可生成你的 OpenClaw
            </p>
          )}

          {completedChannels.length > 0 && (
            <button
              onClick={resetProgress}
              className="w-full py-2 text-sm text-qq-text-secondary hover:text-qq-text transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置配置进度
            </button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
