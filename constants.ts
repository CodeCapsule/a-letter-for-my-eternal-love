import { FolderItem, Photo, Question } from './types';

export const INITIAL_PHOTOS: Photo[] = [
  { id: '1', url: 'https://picsum.photos/800/600?random=1', caption: 'Our First Date ❤️' },
  { id: '2', url: 'https://picsum.photos/800/600?random=2', caption: 'Sunset Walks 🌅' },
  { id: '3', url: 'https://picsum.photos/800/600?random=3', caption: 'Coffee Mornings ☕' },
  { id: '4', url: 'https://picsum.photos/800/600?random=4', caption: 'Adventure Time 🌍' },
  { id: '5', url: 'https://picsum.photos/800/600?random=5', caption: 'Cozy Nights ❄️' },
  { id: '6', url: 'https://picsum.photos/800/600?random=6', caption: 'Just Us Two 💑' },
];

export const TRIVIA_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Where did we first meet?",
    options: ["Coffee Shop", "At a Party", "Online", "Through Friends"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "What is our favorite date night activity?",
    options: ["Movies", "Dinner out", "Hiking", "Staying in"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the traditional gift for a 50th Anniversary?",
    options: ["Silver", "Gold", "Diamond", "Pearl"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Which of these flowers traditionally symbolizes lasting love?",
    options: ["Tulip", "Orchid", "Rose", "Red Camellia"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "How many days have we been together in spirit?",
    options: ["Not enough", "Millions", "Forever", "All of the above"],
    correctAnswer: 3,
  },
];

export const ROOT_FOLDER: FolderItem = {
  id: 'root',
  name: 'My Heart',
  type: 'folder',
  children: [
    {
      id: 'sweet-memories',
      name: 'Sweet Memories',
      type: 'folder',
      children: [
        { id: 'note-1', name: 'First Kiss.txt', type: 'text', content: "It was magical, under the starlight. I'll never forget it." },
        { id: 'note-2', name: 'Our Song.txt', type: 'text', content: "Play 'Perfect' by Ed Sheeran whenever you miss me." },
      ]
    },
    {
      id: 'future-dreams',
      name: 'Future Dreams',
      type: 'folder',
      children: [
        { id: 'dream-1', name: 'Travel List.txt', type: 'text', content: "1. Japan\n2. Switzerland\n3. Paris" },
        { id: 'dream-2', name: 'House Goals.txt', type: 'text', content: "A small cottage with a big garden and a dog." },
      ]
    },
    { 
      id: 'poem', 
      name: 'For You.txt', 
      type: 'text', 
      content: "Press play to listen to our song. 🎵" 
    },
    { id: 'secret', name: 'Open Me.txt', type: 'text', content: "I love you more than words can say! Happy Anniversary! 💖" },
  ]
};