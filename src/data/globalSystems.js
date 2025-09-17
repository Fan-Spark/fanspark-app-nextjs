import { 
  Package,
  Dice6,
  Battery,
  Trophy
} from "lucide-react";

export const globalNavigation = [
  {
    id: 'collections',
    name: 'Collections',
    icon: Package,
    href: '/',
    description: 'Browse all collections',
    status: 'active',
    gradient: 'from-blue-500 to-purple-600'
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
  }
];
