import { Feature, Plan } from "@/types/subscribe";
import {
  IconBooks,
  IconChartBar,
  IconClipboardList,
  IconPencilPlus,
  IconRuler,
  IconSchool,
  IconTrendingUp,
  type Icon as TablerIcon,
} from '@tabler/icons-react';

export const DEFAULT_PLANS: Plan[] = [
  {
    id: 'monthly',
    price: 4.99,
  },
  {
    id: 'yearly',
    price: 39.00,
  },
  {
    id: 'lifetime',
    price: 99.00,
  },
];

export const FEATURES: Feature[] = [
	{ icon: IconClipboardList, title: 'Трекінг тренувань', description: 'Записуй тренування без зайвих кроків', free: true },
	{ icon: IconClipboardList, title: 'Плани тренувань', description: 'Створюй і зберігай власні програми', free: true },
	{ icon: IconBooks, title: 'Бібліотека вправ', description: 'Велика база вправ', free: true },
	{ icon: IconSchool, title: 'Експертні програми', description: 'Готові програми від тренерів', free: true },
	{ icon: IconRuler, title: 'Виміри тіла', description: 'Вага, відсоток жиру та окремі виміри', free: false },
	{ icon: IconPencilPlus, title: 'Власні вправи', description: 'Додавай вправи, яких немає в бібліотеці', free: false },
	{ icon: IconChartBar, title: 'Глибокий аналіз', description: 'Показники та навантаження по групах м’язів', free: false },
	{ icon: IconTrendingUp, title: 'Місячні підсумки', description: 'Прогрес і рекорди за місяць', free: false },
];