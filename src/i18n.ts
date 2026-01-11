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
