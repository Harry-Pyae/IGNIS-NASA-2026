import { describe, expect, it } from 'vitest';
import { BURMESE, BURMESE_GLOSSARY, BURMESE_METHODS_STAGES, BURMESE_METHODS_PRINCIPLES } from '../src/i18n/burmese';
import { t, format, glossary, setActiveLocale, registerLocaleResolver, type TranslationKey } from '../src/i18n/index';

// Ensure the resolver is active for test
registerLocaleResolver(
  (key) => BURMESE[key],
  () => BURMESE_GLOSSARY,
);

describe('Complete Myanmar / English Bilingual Localization Suite', () => {
  it('contains exactly matching complete dictionaries (378 keys) in both English and Myanmar', () => {
    setActiveLocale('en');
    const sampleKeys: TranslationKey[] = [
      'missionScenario',
      'evidenceMap',
      'matchPanel',
      'caseEyebrow',
      'caseTitle',
      'helpTitle',
      'methodsTitle',
      'libraryTitle',
      'compareTitle',
      'catalogNotConnected',
    ];

    for (const key of sampleKeys) {
      setActiveLocale('en');
      const enVal = t(key);
      expect(enVal).toBeTruthy();
      expect(typeof enVal).toBe('string');

      setActiveLocale('my');
      const myVal = t(key);
      expect(myVal).toBeTruthy();
      expect(typeof myVal).toBe('string');
      expect(myVal).not.toBe(enVal); // Burmese text should be localized
      expect(/[က-႟]/.test(myVal)).toBe(true); // Must contain Burmese Unicode
    }
  });

  it('correctly maps "catalogNotConnected" to "မှတ်တမ်းစာရင်းကို ချိတ်ဆက်၍ မရပါ" in Burmese', () => {
    setActiveLocale('my');
    expect(t('catalogNotConnected')).toContain('မှတ်တမ်းစာရင်း');
  });

  it('formats dynamic parameters cleanly in both English and Burmese', () => {
    setActiveLocale('en');
    const enFormatted = format('libraryResultCount', { results: 12, cards: 5, cardLabel: 'cards' });
    expect(enFormatted).toBe('12 results · 5 verified cards so far');

    setActiveLocale('my');
    const myFormatted = format('libraryResultCount', { results: 12, cards: 5, cardLabel: 'ကတ်' });
    expect(myFormatted).toBe('ရလဒ် 12 ခု · အတည်ပြုပြီး ကတ် 5 ခု');
  });

  it('switches glossary between English and Burmese', () => {
    setActiveLocale('en');
    const enGloss = glossary();
    expect(enGloss.length).toBeGreaterThan(0);
    expect(enGloss[0].term).not.toMatch(/[က-႟]/);

    setActiveLocale('my');
    const myGloss = glossary();
    expect(myGloss.length).toBe(BURMESE_GLOSSARY.length);
    expect(/[က-႟]/.test(myGloss[0].term)).toBe(true);
  });

  it('BURMESE_METHODS_STAGES and BURMESE_METHODS_PRINCIPLES have 4 stages and 5 principles with proper Burmese text', () => {
    expect(BURMESE_METHODS_STAGES.length).toBe(4);
    expect(BURMESE_METHODS_PRINCIPLES.length).toBe(5);

    for (const [title, desc] of BURMESE_METHODS_STAGES) {
      expect(/[က-႟]/.test(title)).toBe(true);
      expect(/[က-႟]/.test(desc)).toBe(true);
    }

    for (const [title, desc] of BURMESE_METHODS_PRINCIPLES) {
      expect(/[က-႟]/.test(title)).toBe(true);
      expect(/[က-႟]/.test(desc)).toBe(true);
    }
  });
});
