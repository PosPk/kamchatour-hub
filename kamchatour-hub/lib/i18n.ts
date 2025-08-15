import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from '@assets/translations/ru.json';
import en from '@assets/translations/en.json';

export function initializeI18n() {
	if (!i18n.isInitialized) {
		i18n
			.use(initReactI18next)
							.init({
					resources: { ru: { translation: ru as any }, en: { translation: en as any } },
					lng: 'ru',
					fallbackLng: 'en',
					interpolation: { escapeValue: false }
				});
	}
	return i18n;
}