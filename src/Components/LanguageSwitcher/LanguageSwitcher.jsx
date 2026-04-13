import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LANGUAGES = [
  { code: 'uk', label: 'UA', flag: '🇺🇦' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  // Щоб додати нову мову: { code: 'pl', label: 'PL', flag: '🇵🇱' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLng = i18n.resolvedLanguage || i18n.language?.split('-')[0] || 'en';

  return (
    <div className="lang-switcher">
      {LANGUAGES.map((lang, idx) => (
        <span key={lang.code}>
          <button
            className={`lang-btn${currentLng === lang.code ? ' lang-btn--active' : ''}`}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-label={`Switch to ${lang.label}`}
            title={lang.flag}
          >
            {lang.flag} {lang.label}
          </button>
          {idx < LANGUAGES.length - 1 && (
            <span className="lang-divider">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
