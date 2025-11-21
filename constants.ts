import { SeriesData } from './types';

export const MOCK_SERIES: SeriesData = {
  id: 'we-are-your-parents',
  title: 'Nós Somos Seus Pais',
  description: 'Após anos separados, uma revelação chocante traz à tona segredos de uma família bilionária. A jovem herdeira, criada na pobreza, descobre que seus pais biológicos controlam metade da cidade.',
  tags: ['Drama', 'Romance', 'Vingança', 'Bilionário'],
  cast: ['Sofia Martins', 'Lucas Silva', 'Helena Rocha'],
  totalEpisodes: 65,
  rating: 4.8,
  episodes: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Episódio ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/${i + 100}/300/500`,
    // Using a sample vertical video for demo purposes
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    isLocked: i > 2, // First 3 free
    views: `${(Math.random() * 100).toFixed(1)}k`,
    duration: '1:30'
  })),
  comments: [
    {
      id: 1,
      user: 'Maria C.',
      avatar: 'https://picsum.photos/seed/user1/50/50',
      text: 'Eu não acredito que ela perdoou ele tão rápido! 😱',
      likes: 142,
      timestamp: '2h atrás'
    },
    {
      id: 2,
      user: 'João P.',
      avatar: 'https://picsum.photos/seed/user2/50/50',
      text: 'A produção dessa série tá incrível. O plot twist do ep 5 foi tudo.',
      likes: 89,
      timestamp: '5h atrás'
    },
    {
      id: 3,
      user: 'Ana Souza',
      avatar: 'https://picsum.photos/seed/user3/50/50',
      text: 'Alguém tem cupom pra desbloquear mais episódios??',
      likes: 256,
      timestamp: '1d atrás'
    }
  ]
};

export const COIN_PACKAGES = [
  { amount: 100, price: 'R$ 4,90', bonus: 0 },
  { amount: 500, price: 'R$ 19,90', bonus: 50 },
  { amount: 1500, price: 'R$ 49,90', bonus: 200 },
];