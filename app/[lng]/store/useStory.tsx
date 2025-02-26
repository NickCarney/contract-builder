//file to store necessary components for story implementation
import {create} from 'zustand';
import { persist } from 'zustand/middleware'

// needs to store song title
interface SplitsState {
  address: `0x${string}`;
  isConnected: boolean;
  updateAddress: (value : `0x${string}`) => void;
  updateIsConnected: (value: boolean) => void;
} 

const useStory = create<SplitsState>()(
  persist(
    (set) => ({
    address: "0x",
    updateAddress: (value) => set({ address: value }),
    isConnected: false,
    updateIsConnected: (value) => set({ isConnected: value }),
}),
{
  name: 'story-age',
  partialize: (state) => ({ song: state.address, recording: state.isConnected }) 
}
)
);

export default useStory;
