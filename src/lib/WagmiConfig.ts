import { createConfig, http } from 'wagmi'
import { liskSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'



export const config = createConfig({
  chains: [ liskSepolia],
  transports: {
    [liskSepolia.id]: http(),
  },
  connectors: [
    injected(), // MetaMask or any browser wallet
  ],
})
