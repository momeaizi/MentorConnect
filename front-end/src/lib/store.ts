
import { create } from 'zustand';

interface Notification {
    userPicture: string;
    username: string;
    type: string;
    time: string;
    isRead: boolean;
}

const useStore = create((set:any) => ({
    // Define state
    user: null,
    messagePages: 'both',
    selectedIndex: null,
    selectedConv: null,
    socket: null,
    newNotif: null,
    numberOfNotif: 0,
    numberOfMessage: 0,


    // Define actions,
    setSocket: (socketInstance:any) => set({ socket: socketInstance }),
    setUser: (user:any) => set({ user }),
    setNewNotif: (newNotif:Notification) => set({ newNotif }),
    setNumberOfNotif: (numberOfNotif:number) => set({ numberOfNotif }),
    setNumberOfMessage: (numberOfMessage:number) => set({ numberOfMessage }),
    setMessagePages: (messagePages:string)=>set({messagePages}),
    setSelectedIndex: (selectedIndex:number)=>set({selectedIndex}),
    setSelectedConv: (selectedConv:number)=>set({selectedConv})
}));

export default useStore;



