"use client";

import { LucideIcon } from "lucide-react";

interface QuickReply {
  text: string;
  icon: LucideIcon;
}

interface QuickRepliesProps {
  replies: QuickReply[];
  onReply: (text: string) => void;
}

export default function QuickReplies({ replies, onReply }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {replies.map((reply, index) => {
        const IconComponent = reply.icon;
        return (
          <button
            key={index}
            onClick={() => onReply(reply.text)}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm px-4 py-2"
          >
            <IconComponent className="w-4 h-4" />
            <span>{reply.text}</span>
          </button>
        );
      })}
    </div>
  );
}