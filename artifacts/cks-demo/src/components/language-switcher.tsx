import { useLanguage } from '@/lib/i18n';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`language-switch ${className}`} role="group" aria-label={t('Language')}>
      <button
        type="button"
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={language === 'de'}
        onClick={() => setLanguage('de')}
      >
        DE
      </button>
    </div>
  );
}
