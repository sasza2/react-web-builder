import React, { useState } from 'react';

import en from '@/locales/en';

const createDotNotation = (prefix: string, translations: Record<string, string>) => {
  const map: Record<string, string> = {};

  const apply = (recPrefix: string, recTranslations: Record<string, string>) => {
    const getKey = (key: string) => {
      if (recPrefix) return `${recPrefix}.${key}`;
      return key;
    };

    if (!recTranslations) return;

    Object.entries(recTranslations).forEach(([key, value]) => {
      if (typeof value === 'string') {
        map[getKey(key)] = value;
        return;
      }

      apply(
        getKey(key),
        recTranslations[key] as unknown as Record<string, string>,
      );
    });
  };

  apply(prefix, translations);

  return map;
};

const createDotNotationAsText = (prefix: string): string => {
  const translationsDotNotation = createDotNotation(prefix, en as unknown as Record<string, string>);
  return Object.entries(translationsDotNotation)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .reduce((text, [key, value]) => `${text}'${key}': '${value.replace(/'/g, "\\'")}',\n`, '');
};

export function DotNotation() {
  const [prefix, setPrefix] = useState('');

  return (
    <>
      <div>
        <input
          onChange={(e) => setPrefix(e.target.value)}
          value={prefix}
        />
      </div>
      <textarea
        style={{ height: 'calc(100vh - 50px)', width: '100vw' }}
        value={createDotNotationAsText(prefix)}
      />
    </>
  );
}

const meta = {
  component: DotNotation,
  title: 'WebBuilder/Translations',
};

export default meta;
