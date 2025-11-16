import React from "react";

interface AvatarProps {
  text: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ text, size = 40, className = "" }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-blue-500 to-green-400 ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      {text}
    </div>
  );
};

export default Avatar;
