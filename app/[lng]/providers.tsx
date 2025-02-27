'use client';
 
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
 
export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_CLIENT_KEY}
      chain={base}
      config={{
        appearance: {
          name: 'Mesa Wallet', 
          logo: 'https://mesa.mypinata.cloud/ipfs/bafkreifesm2kzzlgzamioix4i5yt3mwvpxqh5vaq6k4b5lzmbk4yuaaiwu', 
        },
      }}
      >
      {props.children}
    </OnchainKitProvider>
  );
}