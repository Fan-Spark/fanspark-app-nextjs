import { 
  Package,
  Star,
  Battery,
  Trophy
} from "lucide-react";

export const collections = [
  {
    id: 'stellar-ardent-issue-1',
    slug: 'stellar-ardent-issue-1-comic-book-stellar-comet',
    name: 'Issue #1 Comic Book: Stellar Comet',
    subtitle: 'Stellar Ardent',
    description: 'First issue of the Stellar Ardent comic series featuring epic space adventures',
    image: '/first_campaign_banner.png',
    status: 'active',
    totalItems: 3,
    mintedItems: 156,
    campaignEndDate: '2025-12-15T23:59:59Z',
    features: ['campaigns', 'gacha', 'battery-game', 'quests'],
    navigation: [
      { 
        id: 'campaigns', 
        name: 'Campaigns', 
        icon: Package, 
        path: '/campaigns',
        description: 'Collection campaigns and rewards',
        gradient: 'from-blue-500 to-purple-600'
      },
      { 
        id: 'gacha', 
        name: 'Spark of Luck (Gacha)', 
        icon: Star, 
        path: '/gacha',
        description: 'Collection-specific gacha system',
        gradient: 'from-purple-500 to-pink-500',
        status: 'coming-soon'
      },
      { 
        id: 'battery-game', 
        name: 'Restore Power! (Battery Game)', 
        icon: Battery, 
        path: '/battery-game',
        description: 'Energy management for this collection',
        gradient: 'from-green-500 to-emerald-500',
        status: 'coming-soon'
      },
      { 
        id: 'quests', 
        name: 'Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Collection-specific missions',
        gradient: 'from-orange-500 to-red-500',
        status: 'coming-soon'
      }
    ],
    contractAddress: '0x...',
    network: 'ethereum'
  },
  {
    id: 'super-space-defenders',
    slug: 'super-space-defenders',
    name: 'Super Space Defenders',
    subtitle: 'Coming Soon',
    description: 'Epic space defenders ready to protect the universe',
    image: '/reward-crate.png',
    status: 'coming-soon',
    totalItems: 5,
    mintedItems: 0,
    campaignEndDate: '2025-12-31T23:59:59Z',
    features: ['campaigns', 'gacha', 'quests'],
    navigation: [
      { 
        id: 'campaigns', 
        name: 'Campaigns', 
        icon: Package, 
        path: '/campaigns',
        description: 'Defender campaigns and missions',
        gradient: 'from-red-500 to-orange-600'
      },
      { 
        id: 'gacha', 
        name: 'Defender Gacha', 
        icon: Star, 
        path: '/gacha',
        description: 'Summon powerful defenders',
        gradient: 'from-purple-500 to-pink-500'
      },
      { 
        id: 'quests', 
        name: 'Battle Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Epic defender missions',
        gradient: 'from-yellow-500 to-orange-500'
      }
    ]
  },
  {
    id: 'the-spectre',
    slug: 'the-spectre',
    name: 'The Spectre',
    subtitle: 'Coming Soon',
    description: 'Mysterious spectre collection with dark powers',
    image: '/reward-crate.png',
    status: 'coming-soon',
    totalItems: 10,
    mintedItems: 0,
    campaignEndDate: '2025-12-31T23:59:59Z',
    features: ['campaigns', 'battery-game', 'quests'],
    navigation: [
      { 
        id: 'campaigns', 
        name: 'Shadow Campaigns', 
        icon: Package, 
        path: '/campaigns',
        description: 'Dark mysterious campaigns',
        gradient: 'from-indigo-500 to-purple-600'
      },
      { 
        id: 'battery-game', 
        name: 'Dark Energy', 
        icon: Battery, 
        path: '/battery-game',
        description: 'Harness spectral energy',
        gradient: 'from-cyan-500 to-blue-500'
      },
      { 
        id: 'quests', 
        name: 'Shadow Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Journey through shadows',
        gradient: 'from-pink-500 to-purple-500'
      }
    ]
  }
];

export const getCollectionBySlug = (slug) => {
  return collections.find(collection => collection.slug === slug);
};

export const getActiveCollections = () => {
  return collections.filter(collection => collection.status === 'active');
};

export const getAllCollections = () => {
  return collections;
};
