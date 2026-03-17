export const languages = {
  ru: 'Русский',
  en: 'English',
};

export const defaultLang = 'ru';

export const ui = {
  ru: {
    'nav.home': 'Главная',
    'nav.it': 'IT',
    'nav.podcasts': 'Подкасты',
    'nav.audiobooks': 'Аудиокниги',
    'nav.cosplay': 'Косплей',
    'nav.publications': 'Публикации',
    'nav.other': 'Другое',
    'about.title': 'Об Антоне Леневе',
    'about.description': 'Программист, разработчик, косплеер, чтец аудиокниг и ведущий подкаста из Рыбинска',
    'social.title': 'Социальные сети',
    'archive.original': 'Оригинал',
    'archive.archived': 'Архив',
    'archive.backToPublications': 'Назад к публикациям',
    'cosplay.title': 'Косплей',
    'cosplay.description': 'Создание костюмов персонажей из игр, фильмов и комиксов',
    'cosplay.costumes': 'Костюмы',
    'cosplay.events': 'События',
    'cosplay.shoots': 'Фотосессии',
    'cosplay.photographer': 'Фотограф',
    'cosplay.location': 'Локация',
    'cosplay.date': 'Дата',
    'cosplay.materials': 'Материалы',
    'cosplay.buildTime': 'Время создания',
    'cosplay.participants': 'Участники',
    'cosplay.guide': 'Инструкция',
    'cosplay.video': 'Видео',
    'cosplay.photos': 'Фотографии',
    'cosplay.backToGallery': 'Назад к галерее',
    'cosplay.backToCostume': 'Назад к костюму',
    'cosplay.linkedCostumes': 'Костюмы на этом событии',
    'cosplay.photoOf': 'из',
  },
  en: {
    'nav.home': 'Home',
    'nav.it': 'IT',
    'nav.podcasts': 'Podcasts',
    'nav.audiobooks': 'Audiobooks',
    'nav.cosplay': 'Cosplay',
    'nav.publications': 'Publications',
    'nav.other': 'Other',
    'about.title': 'About Anton Lenev',
    'about.description': 'Programmer, developer, cosplayer, audiobook narrator and podcast host from Rybinsk',
    'social.title': 'Social Networks',
    'archive.original': 'Original',
    'archive.archived': 'Archive',
    'archive.backToPublications': 'Back to Publications',
    'cosplay.title': 'Cosplay',
    'cosplay.description': 'Creating costumes of characters from games, movies and comics',
    'cosplay.costumes': 'Costumes',
    'cosplay.events': 'Events',
    'cosplay.shoots': 'Photo Shoots',
    'cosplay.photographer': 'Photographer',
    'cosplay.location': 'Location',
    'cosplay.date': 'Date',
    'cosplay.materials': 'Materials',
    'cosplay.buildTime': 'Build Time',
    'cosplay.participants': 'Participants',
    'cosplay.guide': 'Build Guide',
    'cosplay.video': 'Video',
    'cosplay.photos': 'Photos',
    'cosplay.backToGallery': 'Back to Gallery',
    'cosplay.backToCostume': 'Back to Costume',
    'cosplay.linkedCostumes': 'Costumes at this Event',
    'cosplay.photoOf': 'of',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
