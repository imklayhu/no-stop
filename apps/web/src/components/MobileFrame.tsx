import React from "react";

type MobileFrameProps = {
  children: React.ReactNode;
  dark?: boolean;
  borderClassName?: string;
  className?: string;
};

export default function MobileFrame({ children }: MobileFrameProps) {
  return <div className={`relative w-full h-screen `}>{children}</div>;
}
