import { create } from 'zustand';

interface Notification {
    userPicture: string;
    username: string;
    type: string;
    time: string;
    isRead: boolean;
}

interface NewMessageType {
    message: string;
    user_id: number;
    conv_id: number;
}

interface AppState {
    user: any; // Replace 'any' with the appropriate type
    messagePages: string;
    selectedIndex: number;
    selectedConv: number;
    socket: any; // Replace 'any' with your WebSocket instance type
    newNotif: Notification | null;
    numberOfNotif: number;
    newMessageSocket: NewMessageType | null;
    numberOfMessage: number;

    setSocket: (socketInstance: any) => void;
    setUser: (user: any) => void;
    setNewNotif: (newNotif: Notification|null) => void;
    setNumberOfNotif: (numberOfNotif: number) => void;
    setNumberOfMessage: (numberOfMessage: number) => void;
    setMessagePages: (messagePages: string) => void;
    setSelectedIndex: (selectedIndex: number) => void;
    setSelectedConv: (selectedConv: number) => void;
    setNewMessageSocket: (newMessageSocket: NewMessageType | null) => void;
}

const useStore = create<AppState>((set) => ({
    // Define state
    user: null,
    messagePages: 'both',
    selectedIndex: 0,
    selectedConv: 0,
    socket: null,
    newNotif: null,
    numberOfNotif: 0,
    newMessageSocket: null,
    numberOfMessage: 0,

    // Define actions
    setSocket: (socketInstance) => set({ socket: socketInstance }),
    setUser: (user) => set({ user }),
    setNewNotif: (newNotif) => set({ newNotif }),
    setNumberOfNotif: (numberOfNotif) => set({ numberOfNotif }),
    setNumberOfMessage: (numberOfMessage) => set({ numberOfMessage }),
    setMessagePages: (messagePages) => set({ messagePages }),
    setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
    setSelectedConv: (selectedConv) => set({ selectedConv }),
    setNewMessageSocket: (newMessageSocket) => set({ newMessageSocket }),
}));

export default useStore;
