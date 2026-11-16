"use client";

import {
  ConnectButton,
  useConnectModal,
  useAccountModal,
} from "@rainbow-me/rainbowkit";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { Web3Provider } from "./Web3Provider";

type WalletControlsProps = {
  accountStatus: "avatar" | "full";
  requestId: number;
};

const Controls = ({ accountStatus, requestId }: WalletControlsProps) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, isReconnecting } = useAccount();
  const opened = useRef(0);
  useEffect(() => {
    const open = isConnected ? openAccountModal : openConnectModal;
    if (requestId <= opened.current || !open || isReconnecting) return;
    // Let provider hydration and the closing mobile dialog finish before opening the portal.
    const frame = requestAnimationFrame(() => {
      opened.current = requestId;
      open();
    });
    return () => cancelAnimationFrame(frame);
  }, [
    requestId,
    openConnectModal,
    openAccountModal,
    isConnected,
    isReconnecting,
  ]);
  return (
    <ConnectButton
      chainStatus="icon"
      showBalance={false}
      accountStatus={accountStatus}
    />
  );
};

const WalletControls = (props: WalletControlsProps) => (
  <Web3Provider synchronizeSession>
    <Controls {...props} />
  </Web3Provider>
);

export default WalletControls;
