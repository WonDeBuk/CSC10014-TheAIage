// demo.ts
import { Conversation } from "../type";

export const demoConversations: Conversation[] = [
  {
    id: '1',
    name: 'Anh Nguyễn',
    avatar: 'AN',
    preview: 'Em cần hỗ trợ về bài tập toán...',
    time: '2m',
    unread: 2,
    tags: ['16 tuổi', 'Lớp 10A'],
    messages: [
      { id: 1, dir: 'in', text: 'Chào cô! Em cần hỗ trợ về bài tập toán hôm nay ạ.', time: '14:30' },
      { id: 2, dir: 'out', text: 'Chào em! Cô sẵn sàng giúp em. Em gặp khó khăn ở phần nào?', time: '14:32' },
    ],
  },
  { id: '2', name: 'Mai Trần', avatar: 'MT', preview: 'Cảm ơn cô đã giúp em...', time: '15m', unread: 1, tags: [], messages: [] },
  { id: '3', name: 'Hùng Lê', avatar: 'HL', preview: 'Thầy ơi, em có thể hỏi về...', time: '1h', unread: 0, tags: [], messages: [] },
  { id: '4', name: 'Linh Ngô', avatar: 'LN', preview: 'Em đã hoàn thành bài tập...', time: '3h', unread: 0, tags: [], messages: [] },
];

export default demoConversations;