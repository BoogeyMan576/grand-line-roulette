import { Metadata } from "next";
import { gameMetadata } from "../metadata";

export const metadata: Metadata = {
  ...gameMetadata,
  title: "Play Spin Battle",
  description: "Spin the wheel and build your ultimate One Piece crew!",
};

export default function SpinBattleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}