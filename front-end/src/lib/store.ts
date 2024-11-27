import { create } from 'zustand';

const useStore = create((set:any) => ({
    // Define state
    user: null,
    messagePages: 'both',
    selectedIndex: null,

    // Define actions,
    setUser: (user:any) => set({ user }),
    setMessagePages: (messagePages:string)=>set({messagePages}),
    setSelectedIndex: (selectedIndex:any)=>set({selectedIndex})
}));

export default useStore;



// const useStore = create((set: any) => ({
//   user: null,
//   socket: null,
//   selected: '1',
//   selectedReportItem: 0,
//   refreshAvatarNavbar: false,
//   reportView: 'both',
//   newMessage: null,
//   newReport: null,
//   alert: false,
//   alertData: {message:'', type:'error'},
  

//   setSocket: (socket: any) => set(() => ({ socket })),
//   setUser: (user:any) => set(()=>{{user}}),
//   setSelected: (selected: string) => set(() => ({ selected })),
//   setAlert: (alert: string) => set(() => ({ alert })),
//   setAlertData: (alertData: any) => set(() => ({ alertData })),
//   setNewMessage: (message: any) => set(() => ({ newMessage: message })),
//   setNewReport: (newReport: any) => set(() => ({ newReport })),
//   setRefreshAvatarNavbar: (refresh: boolean) => set(() => ({ refreshAvatarNavbar: refresh })),
//   setReportView: (view:any) => set(() => ({ reportView: view })),
//   setSelectedReportItem: (selectedReportItem: string) => set(() => ({ selectedReportItem })),
// }));
