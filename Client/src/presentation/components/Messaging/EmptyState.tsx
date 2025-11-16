// EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Chọn cuộc trò chuyện",
  description = "Chọn cuộc trò chuyện để bắt đầu",
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl text-gray-400 mb-6">
        💬
      </div>
      <div className="text-lg font-semibold mb-2">{title}</div>
      <div className="text-sm text-gray-500 max-w-xs">{description}</div>
    </div>
  );
};

export default EmptyState;
