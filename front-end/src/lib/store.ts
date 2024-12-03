import { create } from 'zustand';

interface Notification {
    userPicture: string;
    username: string;
    type: string;
    time: string;
    isUnread: boolean;
}

const useStore = create((set:any) => ({
    // Define state
    user: null,
    messagePages: 'both',
    selectedIndex: null,
    socket: null,
    newNotif: null,
    numberOfNotif: 0,

    
    
    
    // Define actions,
    setSocket: (socketInstance:any) => set({ socket: socketInstance }),
    setUser: (user:any) => set({ user }),
    setNewNotif: (newNotif:Notification) => set({ newNotif }),
    setNumberOfNotif: (numberOfNotif:number) => set({ numberOfNotif }),
    setMessagePages: (messagePages:string)=>set({messagePages}),
    setSelectedIndex: (selectedIndex:any)=>set({selectedIndex})
}));

export default useStore;



