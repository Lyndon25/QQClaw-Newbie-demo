"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Check, X, Loader2, Settings } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

type UploadState = "idle" | "uploading" | "parsing" | "success";

interface FileInfo {
  name: string;
  size: string;
}

export default function ChannelC() {
  const router = useRouter();
  const { completeChannel, addTag } = useAppStore();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [parsedTags, setParsedTags] = useState<string[]>([]);

  const mockUpload = useCallback(() => {
    const mockFiles = [
      { name: "我的OpenClaw配置.json", size: "12.4 KB" },
      { name: "聊天记录_导出.md", size: "156 KB" },
      { name: "个人偏好设置.yml", size: "4.1 KB" },
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];

    setFileInfo(randomFile);
    setUploadState("uploading");
    setProgress(0);

    // 模拟上传进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 25 + 5;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setUploadState("parsing");

      // 模拟解析
      setTimeout(() => {
        const tags = generateMockTags(randomFile.name);
        setParsedTags(tags);
        tags.forEach((tag) => addTag(tag));
        setUploadState("success");
      }, 1500);
    }, 2000);
  }, [addTag]);

  const generateMockTags = (filename: string): string[] => {
    if (filename.includes("OpenClaw")) {
      return ["已有配置继承", "技术向", "开发者模式"];
    }
    if (filename.includes("聊天")) {
      return ["社交活跃", "情感丰富", "对话偏好"];
    }
    return ["偏好导入", "自定义配置", "个性化设置"];
  };

  const handleComplete = () => {
    completeChannel("channel-c");
    router.push("/");
  };

  const handleReset = () => {
    setUploadState("idle");
    setProgress(0);
    setFileInfo(null);
    setParsedTags([]);
  };

  return (
    <PageTransition direction="right">
      <div className="h-full flex flex-col bg-qq-bg">
        <Navbar title="导入配置" />

        <div className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-qq-text mb-1">
              导入已有配置
            </h2>
            <p className="text-sm text-qq-text-secondary">
              支持导入 OpenClaw JSON 配置、聊天记录或偏好文件
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* 上传区域 - idle */}
            {uploadState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={mockUpload}
                className="border-2 border-dashed border-qq-primary/30 bg-white rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-qq-primary hover:bg-blue-50/30 transition-all duration-300"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-qq-primary/10 rounded-2xl flex items-center justify-center mb-5"
                >
                  <Upload className="w-10 h-10 text-qq-primary" />
                </motion.div>
                <h3 className="text-base font-semibold text-qq-text mb-2">
                  点击导入配置
                </h3>
                <p className="text-sm text-qq-text-secondary text-center">
                  支持 JSON、YAML、Markdown 等格式
                </p>
                <p className="text-xs text-qq-text-secondary/60 mt-3">
                  文件仅本地解析，不会上传至服务器
                </p>
              </motion.div>
            )}

            {/* 上传中 */}
            {(uploadState === "uploading" || uploadState === "parsing") && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                {fileInfo && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-qq-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-qq-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-qq-text truncate">
                        {fileInfo.name}
                      </p>
                      <p className="text-xs text-qq-text-secondary">
                        {fileInfo.size}
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-qq-text-secondary" />
                    </button>
                  </div>
                )}

                {/* 进度条 */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-qq-text-secondary">
                      {uploadState === "uploading" ? "正在读取..." : "正在解析配置..."}
                    </span>
                    <span className="font-medium text-qq-primary">
                      {Math.min(Math.round(progress), 100)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-qq-primary to-qq-primary-light rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>

                {uploadState === "parsing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mt-4 text-sm text-qq-text-secondary"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-qq-primary" />
                    龙虾正在分析你的配置偏好...
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 解析成功 */}
            {uploadState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-qq-text mb-1">
                    配置解析成功
                  </h3>
                  <p className="text-sm text-qq-text-secondary">
                    已从文件中提取以下配置维度
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {parsedTags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                    >
                      <Settings className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">
                        {tag}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete}
                  className="w-full py-3.5 rounded-2xl bg-qq-primary text-white font-semibold text-base transition-all active:scale-[0.98] shadow-lg shadow-qq-primary/25"
                >
                  确认导入，返回大厅
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
