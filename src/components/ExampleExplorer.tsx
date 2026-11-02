import React, { useState, useMemo } from 'react';
import { Plus, Play, Check } from 'lucide-react';
import {
  SamasExample,
  SamasCategoryId,
  SAMAS_CATEGORIES,
  getResultLevel,
} from '../data/samasExamples';
import { soundEngine } from '../utils/soundEffects';

interface ExampleExplorerProps {
  examples: SamasExample[];
  discoveredIds: string[];
  onLoadExampleOnMachine: (exampleId: string) => void;
  onAddCustomExample: (newEx: Omit<SamasExample, 'id' | 'isCoreExhibition'>) => void;
}

export const ExampleExplorer: React.FC<ExampleExplorerProps> = ({
  examples,
  discoveredIds,
  onLoadExampleOnMachine,
  onAddCustomExample,
}) => {
  const [tableCategoryFilter, setTableCategoryFilter] = useState<'all' | SamasCategoryId>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [purvapada, setPurvapada] = useState('');
  const [purvapadaTranslit, setPurvapadaTranslit] = useState('');
  const [uttarapada, setUttarapada] = useState('');
  const [uttarapadaTranslit, setUttarapadaTranslit] = useState('');
  const [samastapada, setSamastapada] = useState('');
  const [samastapadaTranslit, setSamastapadaTranslit] = useState('');
  const [categoryId, setCategoryId] = useState<SamasCategoryId>('tatpurusha');
  const [vigraha, setVigraha] = useState('');
  const [hindiMeaning, setHindiMeaning] = useState('');
  const [englishMeaning, setEnglishMeaning] = useState('');

  const filteredTableExamples = useMemo(() => {
    if (tableCategoryFilter === 'all') return examples;
    return examples.filter((ex) => ex.categoryId === tableCategoryFilter);
  }, [examples, tableCategoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purvapada.trim() || !uttarapada.trim() || !samastapada.trim() || !vigraha.trim()) {
      return;
    }

    const catInfo =
      SAMAS_CATEGORIES.find((c) => c.id === categoryId) || SAMAS_CATEGORIES[1];

    onAddCustomExample({
      purvapada: purvapada.trim(),
      purvapadaTranslit: purvapadaTranslit.trim() || purvapada.trim(),
      purvapadaMeaning: 'पूर्वपद',
      uttarapada: uttarapada.trim(),
      uttarapadaTranslit: uttarapadaTranslit.trim() || uttarapada.trim(),
      uttarapadaMeaning: 'उत्तरपद',
      samastapada: samastapada.trim(),
      samastapadaTranslit: samastapadaTranslit.trim() || samastapada.trim(),
      categoryId,
      samasTypeSanskrit: catInfo.sanskritName,
      samasTypeEnglish: `${catInfo.transliteration} (${catInfo.englishName})`,
      vigraha: vigraha.trim(),
      vigrahaTranslit: vigraha.trim(),
      hindiMeaning: hindiMeaning.trim() || `${purvapada.trim()} एवं ${uttarapada.trim()} का समास`,
      englishMeaning:
        englishMeaning.trim() || `Compound of ${purvapada.trim()} and ${uttarapada.trim()}`,
      grammaticalExplanationHindi: `${catInfo.sanskritName} के नियमानुसार पूर्वपद "${purvapada.trim()}" तथा उत्तरपद "${uttarapada.trim()}" के मेल से "${samastapada.trim()}" समस्त पद निर्मित हुआ है।`,
      grammaticalExplanationEnglish: `Formed according to ${catInfo.transliteration} rules from "${purvapada.trim()}" and "${uttarapada.trim()}".`,
    });

    soundEngine.playCelebratoryJingle();
    setPurvapada('');
    setPurvapadaTranslit('');
    setUttarapada('');
    setUttarapadaTranslit('');
    setSamastapada('');
    setSamastapadaTranslit('');
    setVigraha('');
    setHindiMeaning('');
    setEnglishMeaning('');
    setShowAddForm(false);
  };

  return (
    <section
      id="example-database"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-semibold tracking-wider text-[#F3D078] mb-2">
            02. VERIFIED SANSKRIT REPOSITORY · प्रामाणिक समास कोषः
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FDF8EE] tracking-tight">
            Verified <span className="text-gold-gradient">Sanskrit Samas Treasury</span> (
            {examples.length})
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#FDF8EE]/75 max-w-2xl">
            Every example below is grammatically verified against classical Sanskrit references.
            Click any compound to spin the slot machine directly to that example, or add a new
            verified classroom example for your exhibition.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            setShowAddForm((prev) => !prev);
          }}
          className="px-5 py-3 rounded-xl bg-gold-button text-[#1A0408] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Example Form' : 'Add Custom Verified Example'}</span>
        </button>
      </div>

      {/* Category Filter Bar for Database Table */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            soundEngine.playCategorySelect();
            setTableCategoryFilter('all');
          }}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            tableCategoryFilter === 'all'
              ? 'bg-[#D4AF37] text-[#120407]'
              : 'bg-[#1D060B] text-[#FDF8EE]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
          }`}
        >
          All Examples ({examples.length})
        </button>
        {SAMAS_CATEGORIES.map((cat) => {
          const count = examples.filter((e) => e.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundEngine.playCategorySelect();
                setTableCategoryFilter(cat.id);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-devanagari font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tableCategoryFilter === cat.id
                  ? 'bg-[#D4AF37] text-[#120407]'
                  : 'bg-[#1D060B] text-[#FDF8EE]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
              }`}
            >
              {cat.sanskritName} ({count})
            </button>
          );
        })}
      </div>

      {/* Expandable Form to Add Custom Verified Example */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-[#1D060B] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-[#F3D078]">
                Add Verified Sanskrit Example to Machine Pool
              </h3>
              <p className="text-xs text-[#FDF8EE]/70">
                New examples are immediately added to the slot machine reels for this exhibition.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                १. पूर्वपद (First Word in Devanagari) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ग्रामम्"
                value={purvapada}
                onChange={(e) => setPurvapada(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] font-devanagari text-base focus:outline-none focus:border-[#F3D078]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                २. उत्तरपद (Second Word in Devanagari) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. गतः"
                value={uttarapada}
                onChange={(e) => setUttarapada(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] font-devanagari text-base focus:outline-none focus:border-[#F3D078]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                ३. समस्त पद (Compound Word) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ग्रामगतः"
                value={samastapada}
                onChange={(e) => setSamastapada(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] font-devanagari text-base focus:outline-none focus:border-[#F3D078]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                समास का प्रकार (Samas Category) *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as SamasCategoryId)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] font-devanagari text-sm focus:outline-none focus:border-[#F3D078]"
              >
                {SAMAS_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.sanskritName} ({cat.transliteration})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                विग्रहः (Grammatical Vigraha) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ग्रामं गतः"
                value={vigraha}
                onChange={(e) => setVigraha(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] font-devanagari text-base focus:outline-none focus:border-[#F3D078]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                Transliteration (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. grāmagataḥ"
                value={samastapadaTranslit}
                onChange={(e) => setSamastapadaTranslit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] text-sm focus:outline-none focus:border-[#F3D078]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                हिन्दी अर्थ (Hindi Meaning)
              </label>
              <input
                type="text"
                placeholder="e.g. गाँव को गया हुआ"
                value={hindiMeaning}
                onChange={(e) => setHindiMeaning(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] font-devanagari text-sm focus:outline-none focus:border-[#F3D078]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F3D078] mb-1">
                English Meaning
              </label>
              <input
                type="text"
                placeholder="e.g. One who has gone to the village"
                value={englishMeaning}
                onChange={(e) => setEnglishMeaning(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#120306] border border-[#D4AF37]/40 text-[#FDF8EE] text-sm focus:outline-none focus:border-[#F3D078]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border border-[#D4AF37]/30 text-xs font-semibold text-[#FDF8EE]/75 hover:text-[#FDF8EE] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gold-button text-[#1A0408] text-xs font-bold cursor-pointer"
            >
              Save &amp; Add to Reels
            </button>
          </div>
        </form>
      )}

      {/* Database Table */}
      <div className="rounded-2xl bg-[#1D060B] border border-[#D4AF37]/35 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4AF37]/30 bg-[#140407] text-xs font-semibold text-[#F3D078]">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">पूर्वपद + उत्तरपद</th>
                <th className="py-3.5 px-4">समस्त पद (Compound)</th>
                <th className="py-3.5 px-4">समास का प्रकार (Type)</th>
                <th className="py-3.5 px-4">विग्रहः (Vigraha)</th>
                <th className="py-3.5 px-4">अर्थः (Meaning &amp; Explanation)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15 text-sm">
              {filteredTableExamples.map((ex, index) => {
                const isDiscovered = discoveredIds.includes(ex.id);
                return (
                  <tr
                    key={ex.id}
                    className="hover:bg-[#280810] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono-num text-xs text-[#F3D078]/70">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-devanagari font-bold text-[#FDF8EE] text-base">
                        {ex.purvapada} <span className="text-[#D4AF37]">+</span> {ex.uttarapada}
                      </div>
                      <div className="text-xs text-[#FDF8EE]/60">
                        {ex.purvapadaTranslit} + {ex.uttarapadaTranslit}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-devanagari font-extrabold text-[#F3D078] text-lg flex items-center gap-1.5 flex-wrap">
                        <span>{ex.samastapada}</span>
                        {isDiscovered && (
                          <Check
                            className="w-3.5 h-3.5 text-[#D4AF37]"
                            aria-label="Discovered in session"
                          />
                        )}
                        {(() => {
                          const lvl = getResultLevel(ex);
                          if (lvl === 'master') {
                            return (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/25 text-amber-300 border border-amber-400/40">
                                🏆 MASTER
                              </span>
                            );
                          }
                          if (lvl === 'rare') {
                            return (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/25 text-sky-300 border border-sky-400/40">
                                ⭐ RARE
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div className="text-xs text-[#FDF8EE]/60 font-mono-num">
                        {ex.samastapadaTranslit}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-devanagari font-semibold text-[#FDF8EE]">
                        {ex.samasTypeSanskrit}
                      </div>
                      <div className="text-xs text-[#FDF8EE]/60">
                        {ex.samasSubtypeSanskrit || ex.samasTypeEnglish}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-devanagari font-bold text-[#FDF8EE]">
                        {ex.vigraha}
                      </div>
                      <div className="text-xs text-[#FDF8EE]/60">{ex.vigrahaTranslit}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-devanagari text-xs font-semibold text-[#FDF8EE]/90">
                        {ex.hindiMeaning}
                      </div>
                      <div className="text-xs text-[#FDF8EE]/65 mt-0.5">
                        {ex.englishMeaning}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onLoadExampleOnMachine(ex.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D0A12] hover:bg-[#D4AF37] text-[#F3D078] hover:text-[#120407] border border-[#D4AF37]/40 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Spin This</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
