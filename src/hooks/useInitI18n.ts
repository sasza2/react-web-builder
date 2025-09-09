import i18n from "i18next";
import { useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";

import { useProperties } from "@/components/PropertiesProvider";
import { DEFAULT_LANGUAGE } from "@/consts";
import en from "@/locales/en";

const getDefaultLanguage = (translations: Record<string, string>) => {
	if (translations?.locale) return translations.locale;
	return DEFAULT_LANGUAGE;
};

const initI18n = (translations: Record<string, string>) => {
	const newInstanceI18n = i18n.createInstance();
	const language = getDefaultLanguage(translations);
	const init = newInstanceI18n.use(initReactI18next).init({
		ns: ["common"],
		defaultNS: "common",
		resources: {
			[language]: {
				common: translations || en,
			},
		},
		lng: language,
		fallbackLng: language,
	});

	return {
		instance: newInstanceI18n,
		init,
	};
};

export const useInitI18n = () => {
	const { translations } = useProperties() as {
		translations: Record<string, string>;
	};
	const [locale, setLocale] = useState(() => getDefaultLanguage(translations));

	const [instanceI18n, setInstanceI18n] = useState<typeof i18n>(
		() => initI18n(translations).instance,
	);

	useEffect(() => {
		if (!translations || !translations.locale || translations.locale === locale)
			return;

		setLocale(translations.locale);

		let mounted = true;

		const { instance, init } = initI18n(translations);
		init.then(() => {
			if (mounted) setInstanceI18n(instance);
		});

		return () => {
			mounted = false;
		};
	}, [translations?.locale]);

	return instanceI18n;
};
