"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Check,
  X,
  ChevronRight,
  Radar,
  FileBarChart,
  Sparkles,
  Lock,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

type Step = "intro" | "auth-sheet" | "scanning" | "report" | "success";

const reportItems = [
  { label: "沟通风格", value: "简练直接", icon: "🎯" },
  { label: "高频关注", value: "科技、数码", icon: "💻" },
  { label: "社交活跃", value: "中等", icon: "🗣️" },
  { label: "信息处理", value: "结构化", icon: "📊" },
  { label: "情绪表达", value: "内敛", icon: "🛡️" },
  { label: "兴趣领域", value: "效率工具", icon: "⚡" },
];

const permissions = [
  { label: "基础信息", desc: "昵称、头像、互动频率" },
  { label: "行为数据", desc: "聊天习惯、常用词汇、活跃时段" },
  { label: "偏好标签", desc: "兴趣、关注、互动对象" },
];

export default function ChannelD() {
  const router = useRouter();
  const { completeChannel, addTag } = useAppStore();
  const [step, setStep] = useState<Step>("intro");
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (step === "scanning") {
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("report"), 300);
            return 100;
          }
          return prev + 2;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleAuthConfirm = () => {
    setStep("scanning");
  };

  const handleReportConfirm = () => {
    reportItems.forEach((item) => addTag(item.value));
    completeChannel("channel-d");
    setStep("success");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const toggleItem = (label: string) => {
    setSelectedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <PageTransition direction="right">
      <div className="h-full flex flex-col bg-qq-bg relative">
        <Navbar
          title="配置优化"
          onBack={() => {
            if (step === "intro") router.back();
            else if (step === "auth-sheet") setStep("intro");
            else if (step === "scanning") setStep("auth-sheet");
            else if (step === "report") setStep("intro");
            else router.push("/");
          }}
        />

        <div className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
          {/* Intro 页面 */}
          {step === "intro" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-br from-qq-primary to-qq-primary-light rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-qq-primary/25 mb-6"
                >
                  <Shield className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-qq-text mb-2">
                  配置数据优化
                </h2>
                <p className="text-sm text-qq-text-secondary max-w-[260px] mx-auto">
                  授权 QQ 数据，让龙虾根据你的真实行为优化 OpenClaw 配置
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-qq-text-secondary uppercase tracking-wide">
                  优化维度
                </h3>
                {[
                  { icon: "🔒", title: "隐私安全", desc: "数据仅本地处理" },
                  { icon: "📊", title: "多维分析", desc: "覆盖 6 大配置维度" },
                  { icon: "⚡", title: "实时生成", desc: "3 秒快速出报告" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-qq-text">
                        {item.title}
                      </p>
                      <p className="text-xs text-qq-text-secondary">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("auth-sheet")}
                className="w-full py-3.5 rounded-2xl bg-qq-primary text-white font-semibold text-base transition-all active:scale-[0.98] shadow-lg shadow-qq-primary/25"
              >
                开始数据授权优化
              </button>
            </motion.div>
          )}

          {/* 扫描中 */}
          {step === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative w-40 h-40 mb-8">
                {/* 外圈旋转 */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-qq-primary/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 rounded-full border-4 border-dashed border-qq-primary/40"
                />
                {/* 中心 */}
                <div className="absolute inset-8 bg-gradient-to-br from-qq-primary to-qq-primary-light rounded-full flex items-center justify-center shadow-lg">
                  <Radar className="w-8 h-8 text-white" />
                </div>
                {/* 扫描线 */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-qq-primary/20 to-transparent rounded-tl-full origin-bottom-right" />
                </motion.div>
              </div>

              <h3 className="text-lg font-semibold text-qq-text mb-2">
                正在分析你的配置偏好...
              </h3>
              <p className="text-sm text-qq-text-secondary mb-6">
                龙虾正在读取你的行为模式
              </p>

              <div className="w-full max-w-[280px]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-qq-text-secondary">分析进度</span>
                  <span className="font-medium text-qq-primary">
                    {Math.round(scanProgress)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-qq-primary to-qq-primary-light rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* 动态提示 */}
              <motion.div
                key={Math.floor(scanProgress / 20)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-sm text-qq-text-secondary text-center"
              >
                {scanProgress < 30 && "正在读取高频词汇..."}
                {scanProgress >= 30 && scanProgress < 60 && "分析沟通风格..."}
                {scanProgress >= 60 && scanProgress < 90 && "匹配配置维度..."}
                {scanProgress >= 90 && "生成优化报告..."}
              </motion.div>
            </motion.div>
          )}

          {/* 报告页 */}
          {step === "report" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileBarChart className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-qq-text mb-1">
                  配置分析报告
                </h2>
                <p className="text-sm text-qq-text-secondary">
                  基于你的数据，龙虾为你生成了以下配置建议
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-qq-text-secondary uppercase tracking-wide">
                  已读取配置维度
                </h3>
                {reportItems.map((item) => {
                  const isSelected = selectedItems.includes(item.label);
                  return (
                    <motion.div
                      key={item.label}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleItem(item.label)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-transparent"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-qq-text">
                          {item.label}
                        </p>
                        <p className="text-xs text-qq-text-secondary">
                          {item.value}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </motion.div>
                  );
                })}
                <p className="text-xs text-qq-text-secondary text-center">
                  点击可筛选要应用的配置维度
                </p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReportConfirm}
                className="w-full py-3.5 rounded-2xl bg-qq-primary text-white font-semibold text-base transition-all active:scale-[0.98] shadow-lg shadow-qq-primary/25"
              >
                确认应用此配置偏好
              </motion.button>
            </motion.div>
          )}

          {/* 成功 */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-qq-text mb-2">
                配置已优化
              </h3>
              <p className="text-sm text-qq-text-secondary text-center">
                你的 OpenClaw 配置已根据数据报告更新
                <br />
                正在返回配置大厅...
              </p>
            </motion.div>
          )}
        </div>

        {/* 授权弹窗 */}
        <AnimatePresence>
          {step === "auth-sheet" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-50 flex items-end"
              onClick={() => setStep("intro")}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full bg-white rounded-t-3xl p-6 pb-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-qq-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-qq-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-qq-text mb-1">
                    龙虾申请访问数据
                  </h3>
                  <p className="text-sm text-qq-text-secondary">
                    用于优化你的 OpenClaw 配置
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
                  {permissions.map((perm) => (
                    <div key={perm.label} className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-qq-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-qq-text">
                          {perm.label}
                        </p>
                        <p className="text-xs text-qq-text-secondary">
                          {perm.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAuthConfirm}
                    className="w-full py-3.5 rounded-2xl bg-qq-primary text-white font-semibold text-base transition-all active:scale-[0.98]"
                  >
                    授权并优化配置
                  </button>
                  <button
                    onClick={() => setStep("intro")}
                    className="w-full py-3.5 rounded-2xl bg-gray-100 text-qq-text font-medium text-base transition-all active:scale-[0.98]"
                  >
                    拒绝
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
