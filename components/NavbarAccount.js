"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

import Navmenu from "./Navmenu";

export default function NavbarAccount() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isMounted) {
    return null;
  }

  if (isConnecting) {
    return <div>Loading...</div>;
  }

  return address ? (
    <Navmenu address={address} disconnect={disconnect} />
  ) : (
    <ConnectButton />
  );
}
