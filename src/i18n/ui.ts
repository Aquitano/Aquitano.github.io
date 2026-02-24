export const languages = {
    de: 'Deutsch',
    en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'de';

export const ui = {
    de: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'Über mich',
        'nav.projects': 'Projekte',
        'nav.contact': 'Kontakt',
        'nav.menu': 'Menü',
        'nav.close': 'Schließen',
        'nav.openMenu': 'Menü öffnen',
        'nav.closeMenu': 'Menü schließen',
        'nav.toHome': 'Thomas Breindl – Zur Startseite',
        'nav.mainNav': 'Hauptnavigation',

        // Hero
        'hero.subtitle': 'Softwareentwickler, Designer und Student.',
        'hero.projects': 'Projekte',
        'hero.or': 'oder',
        'hero.aboutMe': 'Über Mich',
        'hero.scrollToPortfolio': 'Zum Portfolio scrollen',
        'hero.mainLinks': 'Hauptlinks',

        // Portfolio
        'portfolio.my': 'Meine',
        'portfolio.projects': 'Projekte',
        'portfolio.filter': 'Projektfilter',
        'portfolio.found': 'Projekte gefunden',
        'portfolio.notFound': 'Keine Projekte gefunden',
        'portfolio.list': 'Projektliste',
        'portfolio.all': 'Alle',
        'portfolio.featured': 'Empfohlen',
        'portfolio.productDesign': 'Produktdesign',

        // Project card
        'project.viewProject': 'Projekt ansehen',
        'project.new': 'NEU',
        'project.newLabel': 'Neues Projekt',
        'project.tags': 'Projekt-Tags',

        // Project detail
        'project.featured': 'Ausgewähltes Projekt',
        'project.overview': 'Überblick',
        'project.contributions': 'Beiträge',
        'project.links': 'Links',
        'project.tasksCompleted': 'Aufgaben abgeschlossen',
        'project.back': 'Zurück',
        'project.fullView': 'Vollständige Projektansicht',
        'project.image': 'Projektbild',

        // Timeline
        'timeline.title': 'Berufserfahrung',
        'timeline.subtitle': 'Systeme, die skalieren',
        'timeline.experience': 'Berufserfahrung',
        'timeline.achievements': 'Wichtige Erfolge',
        'timeline.skills': 'Fähigkeiten & Tools',
        'timeline.languages': 'Sprachen',
        'timeline.years': 'Jahre',
        'timeline.about': 'Über mich',
        'timeline.present': 'Heute',

        // Contact
        'contact.title': 'Kontakt aufnehmen',
        'contact.subtitle': 'Schreiben Sie mir eine Nachricht',
        'contact.details': 'Kontaktdaten',
        'contact.location': 'Standort',
        'contact.locationValue': 'Passau, Deutschland',
        'contact.fullName': 'Vollständiger Name',
        'contact.email': 'E-Mail',
        'contact.emailHint': 'Ihre E-Mail wird nur für die Kontaktaufnahme verwendet.',
        'contact.phone': 'Telefonnummer',
        'contact.message': 'Nachricht',
        'contact.messagePlaceholder': 'Ihre Nachricht...',
        'contact.submit': 'Absenden',
        'contact.form': 'Kontaktformular',
        'contact.errorRequired': 'Bitte füllen Sie alle Pflichtfelder aus.',
        'contact.errorEmail': 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
        'contact.errorPhone': 'Bitte geben Sie eine gültige Telefonnummer an (9-15 Ziffern).',
        'contact.success': 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
        'contact.errorSend': 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        'contact.errorNetwork': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
        'contact.namePlaceholder': 'Max Mustermann',
        'contact.emailPlaceholder': 'max@beispiel.de',
        'contact.phonePlaceholder': '+49 123 456789',

        // Footer
        'footer.menu': 'Menü',
        'footer.socials': 'Soziale Netzwerke',
        'footer.allRights': 'Alle Rechte vorbehalten.',
        'footer.localTime': 'Ortszeit',
        'footer.localTimeLabel': 'Aktuelle Ortszeit',
        'footer.opensNewTab': 'öffnet in neuem Tab',

        // 404
        'error.title': 'Seite nicht gefunden',
        'error.message': 'Die angeforderte Seite existiert nicht oder wurde verschoben.',
        'error.back': 'Zurück zur Startseite',

        // General
        'general.skipToContent': 'Zum Inhalt springen',
        'general.loading': 'Seite wird geladen',
        'general.scrollToTop': 'Nach oben scrollen',
        'general.themeToggle': 'Farbschema umschalten',
        'general.switchLang': 'Switch to English',

        // SEO
        'seo.homeTitle': 'Thomas Breindl | Portfolio',
        'seo.homeDesc':
            'Thomas Breindl – Softwareentwickler und Student aus Passau. Projekte in Webentwicklung, Java, TypeScript und mehr.',
        'seo.homeOgTitle': 'Thomas Breindl | Portfolio – Softwareentwickler',
        'seo.contactTitle': 'Kontakt | Thomas Breindl',
        'seo.contactDesc': 'Thomas Breindl kontaktieren. Portfolio-Anfragen willkommen.',
        'seo.timelineTitle': 'Über mich | Thomas Breindl',
        'seo.timelineDesc':
            'Berufserfahrung, Fähigkeiten und Tools – Thomas Breindl, Softwareentwickler mit Schwerpunkt Java, TypeScript und Cloud-Technologien.',
        'seo.404Title': '404 – Seite nicht gefunden | Thomas Breindl',
        'seo.404Desc': 'Die angeforderte Seite wurde nicht gefunden.',
        'seo.defaultDesc': 'Willkommen auf dem Portfolio von Thomas Breindl!',
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        'nav.menu': 'Menu',
        'nav.close': 'Close',
        'nav.openMenu': 'Open menu',
        'nav.closeMenu': 'Close menu',
        'nav.toHome': 'Thomas Breindl – Go to homepage',
        'nav.mainNav': 'Main navigation',

        // Hero
        'hero.subtitle': 'Software developer, designer and student.',
        'hero.projects': 'Projects',
        'hero.or': 'or',
        'hero.aboutMe': 'About Me',
        'hero.scrollToPortfolio': 'Scroll to portfolio',
        'hero.mainLinks': 'Main links',

        // Portfolio
        'portfolio.my': 'My',
        'portfolio.projects': 'Projects',
        'portfolio.filter': 'Project filter',
        'portfolio.found': 'projects found',
        'portfolio.notFound': 'No projects found',
        'portfolio.list': 'Project list',
        'portfolio.all': 'All',
        'portfolio.featured': 'Featured',
        'portfolio.productDesign': 'Product Design',

        // Project card
        'project.viewProject': 'View Project',
        'project.new': 'NEW',
        'project.newLabel': 'New project',
        'project.tags': 'Project tags',

        // Project detail
        'project.featured': 'Featured Project',
        'project.overview': 'Overview',
        'project.contributions': 'Key Contributions',
        'project.links': 'Links',
        'project.tasksCompleted': 'tasks completed',
        'project.back': 'Back',
        'project.fullView': 'Full project view',
        'project.image': 'Project image',

        // Timeline
        'timeline.title': 'Work Experience',
        'timeline.subtitle': 'Building systems that scale',
        'timeline.experience': 'Professional Experience',
        'timeline.achievements': 'Key achievements',
        'timeline.skills': 'Skills & Tools',
        'timeline.languages': 'Languages',
        'timeline.years': 'years',
        'timeline.about': 'About',
        'timeline.present': 'Present',

        // Contact
        'contact.title': 'Get in Touch',
        'contact.subtitle': 'Send me a message',
        'contact.details': 'Contact Details',
        'contact.location': 'Location',
        'contact.locationValue': 'Passau, Germany',
        'contact.fullName': 'Full Name',
        'contact.email': 'Email',
        'contact.emailHint': 'Your email will only be used to get in touch with you.',
        'contact.phone': 'Phone Number',
        'contact.message': 'Message',
        'contact.messagePlaceholder': 'Your message...',
        'contact.submit': 'Submit',
        'contact.form': 'Contact form',
        'contact.errorRequired': 'Please fill out all required fields.',
        'contact.errorEmail': 'Please enter a valid email address.',
        'contact.errorPhone': 'Please enter a valid phone number (9-15 digits).',
        'contact.success': 'Thank you! Your message has been sent successfully.',
        'contact.errorSend': 'An error occurred while sending. Please try again.',
        'contact.errorNetwork': 'Network error. Please check your internet connection.',
        'contact.namePlaceholder': 'Jane Doe',
        'contact.emailPlaceholder': 'jane@example.com',
        'contact.phonePlaceholder': '+1 234 567890',

        // Footer
        'footer.menu': 'Menu',
        'footer.socials': 'Socials',
        'footer.allRights': 'All rights reserved.',
        'footer.localTime': 'Local time',
        'footer.localTimeLabel': 'Current local time',
        'footer.opensNewTab': 'opens in new tab',

        // 404
        'error.title': 'Page Not Found',
        'error.message': 'The requested page does not exist or has been moved.',
        'error.back': 'Back to Homepage',

        // General
        'general.skipToContent': 'Skip to content',
        'general.loading': 'Page loading',
        'general.scrollToTop': 'Scroll to top',
        'general.themeToggle': 'Toggle color scheme',
        'general.switchLang': 'Auf Deutsch wechseln',

        // SEO
        'seo.homeTitle': 'Thomas Breindl | Portfolio',
        'seo.homeDesc':
            'Thomas Breindl – Software developer and student from Passau, Germany. Projects in web development, Java, TypeScript and more.',
        'seo.homeOgTitle': 'Thomas Breindl | Portfolio – Software Developer',
        'seo.contactTitle': 'Contact | Thomas Breindl',
        'seo.contactDesc': 'Get in touch with Thomas Breindl. Portfolio inquiries welcome.',
        'seo.timelineTitle': 'About | Thomas Breindl',
        'seo.timelineDesc':
            'Work experience, skills and tools – Thomas Breindl, software developer focused on Java, TypeScript and cloud technologies.',
        'seo.404Title': '404 – Page Not Found | Thomas Breindl',
        'seo.404Desc': 'The requested page was not found.',
        'seo.defaultDesc': 'Welcome to the portfolio of Thomas Breindl!',
    },
} as const;

export type TranslationKey = keyof (typeof ui)[typeof defaultLang];
