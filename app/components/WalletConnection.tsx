"use client"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import Image from "next/image";
import metamaskImage from "../[lng]/public/images/metamask.png";
import useStory from "./../[lng]/store/useStory";

function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const updateAddress = useStory((state) => state.updateAddress);
  const updateIsConnected = useStory((state) => state.updateIsConnected);
  
  if (isConnected) {
    updateAddress(address!);
    updateIsConnected(isConnected);
    return (
      <div>
        <div>Connected to {address}</div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="p-[3px]"
        >
          {/* {isPending ? "Connecting..." : `${connector.name}`} */}
          <Image src={metamaskImage} width={22} height={7} alt="M"></Image>
        </button>
      ))}
    </div>
  )
}

export default ConnectWallet;