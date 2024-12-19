// import useStore from '@/lib/store';
// import { io } from 'socket.io-client';


// export const initializeWebSocket = () => {
//   const socket = io('http://localhost:5000', {
//     transports: ['websocket'],
//   });

//   socket.on('connect', () => {
//     console.log('WebSocket connected');
//     useStore.getState().setSocket(socket);
//   });

//   socket.on('message', (data) => {
//     console.log('Message from server:', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('WebSocket disconnected');
//     useStore.getState().setSocket(null);
//   });

//   socket.on('connect_error', (error) => {
//     console.error('WebSocket connection error:', error);
//   });
// };