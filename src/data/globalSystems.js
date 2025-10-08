import { 
  Home,
  Globe2,
  Gem,
  Sparkles,
  Zap,
  ShoppingBag,
  Info,
  Package,
  Dice6,
  Battery,
  Trophy
} from "lucide-react";

export const globalNavigation = [
  {
    id: 'home',
    name: 'Home',
    icon: Home,
    href: '/',
    description: 'Welcome to FanSpark',
    status: 'active',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'campaigns',
    name: 'Campaigns',
    icon: Package,
    href: '/',
    description: 'Browse all campaigns',
    status: 'active',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'universes',
    name: 'Universes',
    icon: Globe2,
    href: '/universes',
    description: 'Explore different worlds',
    status: 'coming-soon',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'collectibles',
    name: 'Collectibles',
    icon: Gem,
    href: '/collectibles',
    description: 'Digital collectibles & NFTs',
    status: 'coming-soon',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'spark-of-luck',
    name: 'Spark of luck',
    icon: Sparkles,
    href: '/spark-of-luck',
    description: 'Try your luck today',
    status: 'coming-soon',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'restore-power',
    name: 'Restore Power!',
    icon: Zap,
    href: '/restore-power',
    description: 'Recharge your energy',
    status: 'coming-soon',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'shop',
    name: 'Shop',
    icon: ShoppingBag,
    href: '/shop',
    description: 'Browse exclusive items',
    status: 'coming-soon',
    gradient: 'from-orange-500 to-red-600'
  },
  
  
  {
    id: 'daily-gacha',
    name: 'Daily Gacha System', 
    icon: Dice6,
    href: '/daily-gacha',
    description: 'Platform-wide gacha rewards',
    status: 'coming-soon',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'battery-game',
    name: 'Battery Game',
    icon: Battery,
    href: '/battery-game', 
    description: 'Global energy management',
    status: 'coming-soon',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'quest-system',
    name: 'Quest System',
    icon: Trophy,
    href: '/quest-system',
    description: 'Platform-wide missions',
    status: 'coming-soon',
    gradient: 'from-orange-500 to-red-500'
  },{
    id: 'about',
    name: 'About',
    icon: Zap,
    href: '/about',
    description: 'Learn more about us',
    status: 'coming-soon',
    gradient: 'from-orange-500 to-red-500'
  },
];
