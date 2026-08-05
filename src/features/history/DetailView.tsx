import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Heart, ChevronLeft, ChevronDown } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';

// This function can be moved to a shared utility file if used elsewhere
const getBadgeStyles = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'sustainable':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'caution':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'threatened':
    case 'endangered':
    case 'vulnerable':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const InfoCard: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({ title, children, delay = 0.2 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
  >
    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</h2>
    <div className="text-[#111111] text-[15px] leading-relaxed font-medium space-y-3">
      {children}
    </div>
  </motion.div>
);

const generateFaq = (species: SpeciesInfo) => {
  const faqs: { q: string; a: string }[] = [];
  if (!species) return faqs;

  if (species.fishermanGuide?.commercialImportance) {
    faqs.push({
      q: `Why is ${species.commonName} important?`,
      a: species.fishermanGuide.commercialImportance,
    });
  }

  if (species.habitat?.habitat) {
    faqs.push({
      q: `Where is ${species.commonName} commonly found?`,
      a: species.habitat.habitat,
    });
  }

  const dietKeywords = ['eats', 'feeds on', 'preys on', 'consumes', 'diet consists of'];
  const description = species.education?.description?.toLowerCase() || '';
  let dietInfo: string | null = null;
  
  if(species.education?.description) {
    for (const keyword of dietKeywords) {
      if (description.includes(keyword)) {
         const sentences = species.education.description.split(/(?<=[.?!])\s+/);
         const dietSentence = sentences.find(s => s.toLowerCase().includes(keyword));
         if(dietSentence) {
             dietInfo = dietSentence.trim();
             break;
         }
      }
    }
  }

  if (dietInfo) {
      faqs.push({
          q: `What does ${species.commonName} eat?`,
          a: dietInfo,
      });
  }

  if (species.sustainabilityStatus && species.sustainabilityStatus !== 'Data Deficient') {
      const isSustainable = species.sustainabilityStatus.toLowerCase() === 'sustainable';
      faqs.push({
          q: `Is eating ${species.commonName} sustainable?`,
          a: `${isSustainable ? 'Yes' : 'It requires caution.'} The official conservation status is "${species.sustainabilityStatus}". ${species.sustainabilityDescription || ''}`.trim()
      });
  }

  return faqs.slice(0, 4);
};

const AccordionItem: React.FC<{ q: string; a: string; }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-bold text-slate-800 text-sm flex-1 pr-4">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export const DetailView: React.FC = () => {
  const { goBack, selectedSpecies } = useAppNavigation();
  const { toggleSaveResult, isSaved } = useAppStore();

  if (!selectedSpecies) return null;

  const saved = isSaved(selectedSpecies);
  const faqs = generateFaq(selectedSpecies);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `AQUAID: ${selectedSpecies.commonName}`,
          text: `Learn about the ${selectedSpecies.commonName} (${selectedSpecies.scientificName}) on AQUAID!`,
        });
      }
    } catch (err) {
      console.log('Sharing failed or was cancelled', err);
    }
  };

  const sustainabilityStatus = selectedSpecies.sustainabilityStatus || 'Data Deficient';

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC] font-sans pb-28">
      {/* Top Header / Nav */}
      <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 pointer-events-none">
        <button 
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto border border-white/20 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[45vh] bg-slate-900 rounded-b-[40px] shadow-lg overflow-hidden">
        <img 
          src={selectedSpecies.imageUrl} 
          alt={selectedSpecies.commonName}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`inline-block px-3 py-1.5 rounded-full border mb-3 text-xs font-bold tracking-wider ${getBadgeStyles(sustainabilityStatus)}`}
          >
            {sustainabilityStatus}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black tracking-tight"
          >
            {selectedSpecies.commonName}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-white/70 font-medium italic mt-1 text-lg"
          >
            {selectedSpecies.scientificName}
          </motion.p>
        </div>
      </div>

      {/* Information Section */}
      <div className="px-4 mt-6 space-y-4">
        {selectedSpecies.education?.description && (
          <InfoCard title="Description" delay={0.3}>
            <p>{selectedSpecies.education.description}</p>
          </InfoCard>
        )}
        
        <InfoCard title="Classification" delay={0.35}>
          <p><strong>Family:</strong> {selectedSpecies.family || 'N/A'}</p>
          {selectedSpecies.localName && <p><strong>Local Name:</strong> {selectedSpecies.localName}</p>}
        </InfoCard>

        {(selectedSpecies.habitat?.habitat || selectedSpecies.habitat?.distribution) && (
          <InfoCard title="Habitat & Distribution" delay={0.4}>
            {selectedSpecies.habitat.habitat && <p><strong>Habitat:</strong> {selectedSpecies.habitat.habitat}</p>}
            {selectedSpecies.habitat.distribution && <p><strong>Distribution:</strong> {selectedSpecies.habitat.distribution}</p>}
          </InfoCard>
        )}

        {selectedSpecies.sustainabilityDescription && (
          <InfoCard title="Sustainability Notes" delay={0.45}>
            <p>{selectedSpecies.sustainabilityDescription}</p>
          </InfoCard>
        )}

        {selectedSpecies.fishermanGuide?.commercialImportance && (
          <InfoCard title="Common Uses" delay={0.5}>
            <p>{selectedSpecies.fishermanGuide.commercialImportance}</p>
          </InfoCard>
        )}

        {/* People Also Ask Section */}
        {faqs.length > 0 && (
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-4"
          >
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-6">People Also Ask</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 sm:px-6 pb-safe z-50">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button 
            onClick={() => toggleSaveResult(selectedSpecies)}
            className="flex flex-col items-center justify-center py-3 gap-1.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
          >
            <Heart className={`w-5 h-5 transition-all ${saved ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
            <span className="text-xs font-bold text-slate-700">
              {saved ? 'Saved' : 'Save to Favorites'}
            </span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex flex-col items-center justify-center py-3 gap-1.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
