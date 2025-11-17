import { 
  Package,
  Star,
  Battery,
  Trophy
} from "lucide-react";

export const campaigns = [
  {
    id: 'super-space-defenders',
    slug: 'super-space-defenders',
    name: 'The Stellar Collection - Series 1 The Fallen Star',
    creator: 'Super Nifty Megacorp',
    description: 'The Stellar Collection – Series 1 The Fallen Star is a free drop of 2,222 AI-generated digital collectible profile pictures, kickstarting the Stellar Ardent universe. Get in early before everyone else!',
    image: '/first_campaign_banner.png',
    status: 'active',
    totalItems: 3,
    mintedItems: 156,
    campaignEndDate: '2025-12-15T23:59:59Z',
     productType: 'Digital Collectibles',
    location: 'Los Angeles, CA',
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
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      },
      { 
        id: 'battery-game', 
        name: 'Restore Power! (Battery Game)', 
        icon: Battery, 
        path: '/battery-game',
        description: 'Energy management for this collection',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      },
      { 
        id: 'quests', 
        name: 'Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Collection-specific missions',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      }
    ],
    contractAddress: '0x...',
    network: 'ethereum'
  },
  // {
  //   id: 'super-space-defenders',
  //   slug: 'super-space-defenders',
  //   name: 'Super Space Defenders',
  //   subtitle: 'Coming Soon',
  //   description: 'Epic space defenders ready to protect the universe',
  //   image: '/reward-crate.png',
  //   status: 'coming-soon',
  //   totalItems: 5,
  //   mintedItems: 0,
  //   features: ['campaigns', 'gacha', 'quests'],
  //   navigation: [
  //     { 
  //       id: 'campaigns', 
  //       name: 'Campaigns', 
  //       icon: Package, 
  //       path: '/campaigns',
  //       description: 'Defender campaigns and missions',
  //       gradient: 'from-blue-500 to-purple-600'
  //     },
  //     { 
  //       id: 'gacha', 
  //       name: 'Defender Gacha', 
  //       icon: Star, 
  //       path: '/gacha',
  //       description: 'Summon powerful defenders',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     },
  //     { 
  //       id: 'quests', 
  //       name: 'Battle Quests', 
  //       icon: Trophy, 
  //       path: '/quests',
  //       description: 'Epic defender missions',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     }
  //   ]
  // },
  // {
  //   id: 'the-spectre',
  //   slug: 'the-spectre',
  //   name: 'The Spectre',
  //   subtitle: 'Coming Soon',
  //   description: 'Mysterious spectre collection with dark powers',
  //   image: '/spectre-project-bg-01.png',
  //   status: 'coming-soon',
  //   totalItems: 10,
  //   mintedItems: 0,
  //   campaignEndDate: '2025-12-31T23:59:59Z',
  //   features: ['campaigns', 'battery-game', 'quests'],
  //   navigation: [
  //     { 
  //       id: 'campaigns', 
  //       name: 'Shadow Campaigns', 
  //       icon: Package, 
  //       path: '/campaigns',
  //       description: 'Dark mysterious campaigns',
  //       gradient: 'from-blue-500 to-purple-600'
  //     },
  //     { 
  //       id: 'battery-game', 
  //       name: 'Dark Energy', 
  //       icon: Battery, 
  //       path: '/battery-game',
  //       description: 'Harness spectral energy',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     },
  //     { 
  //       id: 'quests', 
  //       name: 'Shadow Quests', 
  //       icon: Trophy, 
  //       path: '/quests',
  //       description: 'Journey through shadows',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     }
  //   ]
  // },
  ,
  {
  id: 'spectre-neo-kyoto',
  slug: 'spectre-neo-kyoto',
  name: 'Spectre: Neo-Kyōto Rebirth – Issue #1',

  description:
    "In a dystopian cyberpunk future ruled by SYNEX, 16-year-old Joe Hoshino becomes Spectre a forbidden fusion of flesh and ancient AI and a hunted symbol of rebellion in Neo-Kyōto.",

  image: '/spectre-project-bg-01.png',
  status: 'coming-soon',
  totalItems: 5,
  mintedItems: 0,
  campaignEndDate: '2025-12-10T23:59:59Z', // you can change this
  creator: 'Unknown',
  remainingTime: 'Coming soon',
  productType: 'Comic Books',
  location: 'Neo-Kyōto (Fictional)',

  navigation: [
    { 
      id: 'campaigns',
      name: 'Campaigns',
      icon: Package,
      path: '/campaigns',
      description: 'Spectre missions and story arcs',
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'gacha',
      name: 'Spectre Gacha',
      icon: Star,
      path: '/gacha',
      description: 'Summon characters from Neo-Kyōto',
      gradient: 'from-red-500 to-orange-600',
      status: 'coming-soon'
    },
    { 
      id: 'quests',
      name: 'Battle Quests',
      icon: Trophy,
      path: '/quests',
      description: 'Cyberpunk action missions',
      gradient: 'from-red-500 to-orange-600',
      status: 'coming-soon'
    }
  ]
}
,
  // {
  //   id: 'stellar-collection-series-1',
  //   slug: 'stellar-collection-series-1',
  //   name: 'The Stellar Collection - Series 1 The Fallen Star',
 
  //   description: 'The Stellar Collection – Series 1 The Fallen Star is a free drop of 2,222 AI-generated digital collectible profile pictures, kickstarting the Stellar Ardent universe. Get in early before everyone else!',
  //   image: '/first_campaign_banner.png',
  //   status: 'coming-soon',
  //   totalItems: 3,
  //   mintedItems: 156,
  //   creator: 'Super Nifty Megacorp',
  //   remainingTime: '8 days left',
  //   productType: 'Digital Collectibles',
  //   location: 'Los Angeles, CA',
  //   // features: ['campaigns', 'gacha', 'battery-game', 'quests'],
  //   navigation: [
  //     { 
  //       id: 'campaigns', 
  //       name: 'Campaigns', 
  //       icon: Package, 
  //       path: '/campaigns',
  //       description: 'Collection campaigns and rewards',
  //       gradient: 'from-blue-500 to-purple-600'
  //     },
  //     { 
  //       id: 'gacha', 
  //       name: 'Spark of Luck (Gacha)', 
  //       icon: Star, 
  //       path: '/gacha',
  //       description: 'Collection-specific gacha system',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     },
  //     { 
  //       id: 'battery-game', 
  //       name: 'Restore Power! (Battery Game)', 
  //       icon: Battery, 
  //       path: '/battery-game',
  //       description: 'Energy management for this collection',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     },
  //     { 
  //       id: 'quests', 
  //       name: 'Quests', 
  //       icon: Trophy, 
  //       path: '/quests',
  //       description: 'Collection-specific missions',
  //       gradient: 'from-red-500 to-orange-600',
  //       status: 'coming-soon'
  //     }
  //   ],
  //   contractAddress: '0x...',
  //   network: 'ethereum'
  // },
  {
    id: 'ratti-entertainment',
    slug: 'ratti-entertainment',
    name: 'The Legend of New Shaolin Issue #1 Comic Book - Ten Thousand',

    description: 'Issue #1 of a Black Salt spin-off, agent Sam Tharp accidentally kills a crime lord\'s son and must flee to New Shaolin to protect his kids from deadly revenge.',
    image: '/the-legend-of-new-shaolin-featured-image-01-new.png',
    status: 'coming-soon',
    totalItems: 5,
    mintedItems: 0,
    campaignEndDate: '2025-11-22T23:59:59Z',
    creator: 'Ratti Entertainment',
    remainingTime: '9 days left',
    productType: 'Comic Books',
    location: 'Las Vegas, NV',
    // features: ['campaigns', 'gacha', 'quests'],
    navigation: [
      { 
        id: 'campaigns', 
        name: 'Campaigns', 
        icon: Package, 
        path: '/campaigns',
        description: 'Defender campaigns and missions',
        gradient: 'from-blue-500 to-purple-600'
      },
      { 
        id: 'gacha', 
        name: 'Defender Gacha', 
        icon: Star, 
        path: '/gacha',
        description: 'Summon powerful defenders',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      },
      { 
        id: 'quests', 
        name: 'Battle Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Epic defender missions',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      }
    ]
  },
  {
    id: 'flamewrite-entertainment',
    slug: 'flamewrite-entertainment',
    name: 'The Sacred Trial Grounds Graphic Novel Volume One',
  
    description: 'Volume one of a new epic graphic novel series. Princess Shofara strives to unite warring tribes as her planet faces rising tensions and the arrival of an unknown race.',
    image: '/gongora-featured-image-01-new.png',
    status: 'coming-soon',
    totalItems: 10,
    mintedItems: 0,
    campaignEndDate: '2025-11-22T23:59:59Z',
    creator: 'Flamewrite Entertainment',
    remainingTime: '9 days left',
    productType: 'Graphic Novels',
    location: 'Miami, FL',
    // features: ['campaigns', 'battery-game', 'quests'],
    navigation: [
      { 
        id: 'campaigns', 
        name: 'Shadow Campaigns', 
        icon: Package, 
        path: '/campaigns',
        description: 'Dark mysterious campaigns',
        gradient: 'from-blue-500 to-purple-600'
      },
      { 
        id: 'battery-game', 
        name: 'Dark Energy', 
        icon: Battery, 
        path: '/battery-game',
        description: 'Harness spectral energy',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      },
      { 
        id: 'quests', 
        name: 'Shadow Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Journey through shadows',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      }
    ]
  },
  {
    id: 'aurora-evolution',
    slug: 'aurora-evolution',
    name: 'The Aurora Evolution Episode 01 Motion Comic',
    description: 'The Aurora Evolution Episode 01 is the first chapter of an epic space opera trilogy, a customizable and interactive motion comic series.',
    image: '/the-aurora-evolution-banner-new-01.png',
    status: 'coming-soon',
    totalItems: 5,
    mintedItems: 0,
    campaignEndDate: '2025-11-24T23:59:59Z',
    creator: 'Space Labs',
    remainingTime: '11 days left',
    productType: 'Motion Comics',
    location: 'Los Angeles, CA',
    // features: ['campaigns', 'gacha', 'quests'],
    navigation: [
      { 
        id: 'campaigns', 
        name: 'Campaigns', 
        icon: Package, 
        path: '/campaigns',
        description: 'Defender campaigns and missions',
        gradient: 'from-blue-500 to-purple-600'
      },
      { 
        id: 'gacha', 
        name: 'Defender Gacha', 
        icon: Star, 
        path: '/gacha',
        description: 'Summon powerful defenders',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      },
      { 
        id: 'quests', 
        name: 'Battle Quests', 
        icon: Trophy, 
        path: '/quests',
        description: 'Epic defender missions',
        gradient: 'from-red-500 to-orange-600',
        status: 'coming-soon'
      }
    ]
  },
  
 
  
];

export const getCampaignBySlug = (slug) => {
  return campaigns.find(campaign => campaign.slug === slug);
};

export const getActiveCampaigns = () => {
  return campaigns.filter(campaign => campaign.status === 'active');
};

export const getAllCampaigns = () => {
  return campaigns;
};
