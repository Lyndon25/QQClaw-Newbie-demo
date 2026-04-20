import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  generateConfigFromTags,
  OpenClawConfig,
  OpenClawPreset,
} from "@/lib/openClawPresets";

interface AppState {
  completedChannels: string[];
  collectedTags: string[];
  openClawConfig: OpenClawConfig | null;
  soulMarkdown: string | null;
  matchedPreset: OpenClawPreset | null;
  completeChannel: (channel: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleTag: (tag: string) => void;
  generateOpenClaw: (presetId?: string) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      completedChannels: [],
      collectedTags: [],
      openClawConfig: null,
      soulMarkdown: null,
      matchedPreset: null,

      completeChannel: (channel: string) => {
        const current = get().completedChannels;
        if (!current.includes(channel)) {
          set({ completedChannels: [...current, channel] });
        }
      },

      addTag: (tag: string) => {
        const current = get().collectedTags;
        if (!current.includes(tag)) {
          set({ collectedTags: [...current, tag] });
        }
      },

      removeTag: (tag: string) => {
        set({ collectedTags: get().collectedTags.filter((t) => t !== tag) });
      },

      toggleTag: (tag: string) => {
        const current = get().collectedTags;
        if (current.includes(tag)) {
          set({ collectedTags: current.filter((t) => t !== tag) });
        } else {
          set({ collectedTags: [...current, tag] });
        }
      },

      generateOpenClaw: (presetId?: string) => {
        const tags = get().collectedTags;
        const { config, soulMd, preset } = generateConfigFromTags(
          tags.length > 0 ? tags : ["通用配置"],
          presetId
        );
        set({
          openClawConfig: config,
          soulMarkdown: soulMd,
          matchedPreset: preset,
        });
      },

      resetProgress: () => {
        set({
          completedChannels: [],
          collectedTags: [],
          openClawConfig: null,
          soulMarkdown: null,
          matchedPreset: null,
        });
      },
    }),
    {
      name: "lobster-assistant-storage",
    }
  )
);
