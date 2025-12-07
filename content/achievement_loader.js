// Условия

// Протоколы
const isHTTP = (url) => url.protocol === 'http:';
const isHTTPS = (url) => url.protocol === 'https:';
const isFileProtocol = (url) => url.protocol === 'file:';
const isChromeProtocol = (url) => url.protocol === 'chrome:';

// Домены
const domainIncludes = (pattern) => (url) => 
  url.hostname.includes(pattern);

const domainMatches = (regex) => (url) =>
  regex.test(url.hostname);

const domainEndsWith = (suffix) => (url) =>
  url.hostname.endsWith(suffix);

const isYouTube = domainIncludes('youtube.com');
const isVK = domainIncludes('vk.com');
const isGoogle = domainIncludes('google.com');
const isYandex = domainIncludes('yandex.ru');
const isWikipedia = domainIncludes('wikipedia.org');
const isGitHub = domainIncludes('github.com');

// АЧИВКИ
const ACHIEVEMENTS = {
    http: {
        title: 'Небезопасный HTTP',
        description: 'Посети сайт с HTTP. HTTP передает данные в открытом виде — это как отправлять открытку вместо письма в конверте.',
        icon: '🔓',
        condition: isHTTP,
        points: 10
    },
    https: {
        title: 'Безопасное соединение',
        description: 'Посети сайт с HTTPS. Браузер шифрует данные между тобой и сайтом — как секретный разговор.',
        icon: '🔒',
        condition: isHTTPS,
        points: 20
    },
    vk: {
        title: 'ВКонтакте',
        description: 'Посетил многомиллионную соцсеть. Обрати внимание на URL: vk.com — это домен второго уровня в зоне .com.',
        icon: '👥',
        condition: isVK,
        points: 15
    },
    wiki: {
        title: 'Свободная Энциклопедия',
        description: 'Посети Википедию — некоммерческий проект на домене .org. Знаешь ли ты, что Wikipedia работает на пожертвования?',
        icon: '📕',
        condition: isWikipedia,
        points: 30
    },
    file: {
        title: 'Локальные файлы',
        description: 'Открыл файл с компьютера через file://. Браузер может показывать локальные файлы, но для веб-страниц нужен сервер.',
        icon: '💾',
        condition: isFileProtocol,
        points: 5
    },
    chrome: {
        title: 'Внутренности браузера',
        description: 'Зашел на страницу chrome://. У браузеров есть служебные страницы для настроек и диагностики.',
        icon: '🔧',
        condition: isChromeProtocol,
        points: 5
    },
    youtube: {
        title: 'Видеохостинг',
        description: 'YouTube использует поддомены (www, m) и сложную систему доставки контента через CDN.',
        icon: '📺',
        condition: isYouTube,
        points: 15
    },
    github: {
        title: 'Хостинг кода',
        description: 'GitHub — платформа для разработчиков. Обрати внимание на структуру URL: github.com/пользователь/репозиторий.',
        icon: '🐙',
        condition: isGitHub,
        points: 20
    },
    google: {
        title: 'Поисковый гигант',
        description: 'Google использует поддомены для сервисов: drive.google.com, maps.google.com. Это называется субдоменированием.',
        icon: '🔍',
        condition: isGoogle,
        points: 15
    },
    yandex: {
        title: 'Российский IT',
        description: 'Яндекс использует домен .ru и имеет множество сервисов на поддоменах. У национальных компаний часто домены своей страны.',
        icon: '🌍',
        condition: isYandex,
        points: 15
    },
    ip_address: {
        title: 'Прямой доступ',
        description: 'Использовал IP-адрес вместо домена. IP — числовой адрес сайта в интернете, домены созданы для удобства людей.',
        icon: '📡',
        condition: (url) => /^(\d{1,3}\.){3}\d{1,3}$/.test(url.hostname),
        points: 10
    },
    port: {
        title: 'Нестандартный порт',
        description: 'Сайт использует нестандартный порт (не 80 или 443). Порт — как номер квартиры в IP-адресе-доме.',
        icon: '🚪',
        condition: (url) => url.port && ![80, 443, ''].includes(Number(url.port)),
        points: 10
    },
    subdomain: {
        title: 'Глубина поддоменов',
        description: 'Нашел сайт с несколькими поддоменами. Структура sub.sub2.domain.com показывает иерархию.',
        icon: '📊',
        condition: (url) => url.hostname.split('.').length >= 4,
        points: 10
    },
    long_domain: {
        title: 'Длинный домен',
        description: 'Очень длинное доменное имя. Домены могут содержать до 63 символов в каждой части.',
        icon: '🦒',
        condition: (url) => url.hostname.length > 30,
        points: 5
    },
    short_domain: {
        title: 'Короткий и ценный',
        description: 'Короткий домен (типа x.com). Короткие домены ценятся и часто стоят дорого.',
        icon: '⚡',
        condition: (url) => url.hostname.length <= 6 && !url.hostname.includes('.'),
        points: 20
    },
    punycode: {
        title: 'Международный домен',
        description: 'Домен с национальными символами (например, .рф). На самом деле браузер преобразует его в Punycode.',
        icon: '🌐',
        condition: (url) => url.hostname.includes('xn--'),
        points: 15
    },
    parameters: {
        title: 'Параметры запроса',
        description: 'URL содержит параметры после ?. Они передают данные на сервер: site.com?search=query&page=2.',
        icon: '🔗',
        condition: (url) => url.search.length > 0,
        points: 5
    },
    anchor: {
        title: 'Якорная навигация',
        description: 'URL содержит якорь (#). Он указывает на конкретное место на странице и не отправляется на сервер.',
        icon: '⚓',
        condition: (url) => url.hash.length > 0,
        points: 5
    },
    onion: {
        title: 'Луковый маршрут',
        description: 'Сайт в зоне .onion использует сеть Tor для анонимности. Это специальная псевдо-доменная зона.',
        icon: '🧅',
        condition: domainEndsWith('.onion'),
        points: 40
    },
    gov: {
        title: 'Государственный ресурс',
        description: 'Сайт государственной организации. Домены .gov (США) или .gov.ru (Россия) зарезервированы для правительства.',
        icon: '🏛️',
        condition: (url) => url.hostname.endsWith('.gov') || url.hostname.endsWith('.gov.ru'),
        points: 25
    },
    edu: {
        title: 'Образование',
        description: 'Образовательный ресурс. Домен .edu используется учебными заведениями в США.',
        icon: '🎓',
        condition: domainEndsWith('.edu'),
        points: 25
    },
    localhost: {
        title: 'Локальный сервер',
        description: 'Зашел на localhost — адрес твоего собственного компьютера для веб-разработки.',
        icon: '💻',
        condition: (url) => url.hostname === 'localhost' || url.hostname === '127.0.0.1',
        points: 10
    },
    cloud: {
        title: 'Облачный хостинг',
        description: 'Сайт на облачной платформе (AWS, Azure, Cloudflare). Современные сайты часто размещаются в облаке.',
        icon: '☁️',
        condition: (url) => 
            url.hostname.includes('amazonaws.com') || 
            url.hostname.includes('azurewebsites.net') ||
            url.hostname.endsWith('cloudfront.net'),
        points: 20
    },
    cdn: {
        title: 'Сеть доставки контента',
        description: 'Ресурс загружен через CDN (Content Delivery Network). Это ускоряет загрузку сайтов по всему миру.',
        icon: '🚀',
        condition: (url) => 
            url.hostname.includes('cdn') || 
            url.hostname.includes('cloudfront') ||
            url.hostname.includes('akamai'),
        points: 15
    },
    tracker: {
        title: 'Трекинговые параметры',
        description: 'URL содержит UTM-метки для отслеживания. Маркетологи используют их для аналитики: utm_source, utm_medium и т.д.',
        icon: '📈',
        condition: (url) => url.search.includes('utm_'),
        points: 10
    },
    feed: {
        title: 'RSS/Atom фид',
        description: 'Лента новостей сайта. /feed, /rss, .xml — форматы для подписки на обновления через RSS-ридеры.',
        icon: '📰',
        condition: (url) => 
            url.pathname.endsWith('/feed') || 
            url.pathname.endsWith('/rss') ||
            url.pathname.endsWith('.xml') && 
            (url.pathname.includes('rss') || url.pathname.includes('feed')),
        points: 15
    },
    sitemap: {
        title: 'Карта сайта',
        description: 'XML sitemap. /sitemap.xml — файл для поисковых систем со списком всех страниц сайта.',
        icon: '🗺️',
        condition: (url) => url.pathname.endsWith('sitemap.xml'),
        points: 10
    },
    robots: {
        title: 'Инструкции для роботов',
        description: 'Robots.txt. /robots.txt — файл с инструкциями для поисковых роботов, какие страницы сканировать, а какие нет.',
        icon: '🤖',
        condition: (url) => url.pathname.endsWith('robots.txt'),
        points: 10
    },
    pdf: {
        title: 'Документ PDF',
        description: 'Открыл PDF документ. Браузеры могут показывать PDF напрямую или предлагать скачать.',
        icon: '📄',
        condition: (url) => url.pathname.endsWith('.pdf'),
        points: 10
    },
    language: {
        title: 'Языковая версия',
        description: 'Сайт с указанием языка. /en/, /ru/, ?lang= — указывают языковую версию контента.',
        icon: '🗣️',
        condition: (url) => 
            url.pathname.match(/^\/(en|ru|es|fr|de|zh|ja)\//) || 
            url.search.includes('lang=') ||
            url.search.includes('locale='),
        points: 10
    },
};

window.achievements = ACHIEVEMENTS;
console.log('RUNET: Loaded achievements');