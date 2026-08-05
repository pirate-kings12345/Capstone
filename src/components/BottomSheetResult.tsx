import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Heart, Camera, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { SpeciesInfo } from '../types';
import { useAppStore } from '../app/store';
import { useAppNavigation } from '../navigation/AppNavigator';

interface BottomSheetResultProps {
  species: SpeciesInfo | null;
  onClose: () => void;
  onScanAgain: () => void;
}

const CollapsibleSection: React.FC<{ title: string; content?: string }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!content) return null;

  return (
    <div className="border border-slate-100 rounded-3xl bg-slate-50 overflow-hidden mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-100 transition-colors"
      >
        <span className="font-extrabold text-sm text-[#111111]">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 pt-1 overflow-hidden text-sm font-medium text-slate-600 leading-relaxed"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BottomSheetResult: React.FC<BottomSheetResultProps> = ({
  species,
  onClose,
  onScanAgain,
}) => {
  const { toggleSaveResult, isSaved } = useAppStore();
  const { navigate } = useAppNavigation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (species) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [species]);

  if (!species) return null;

  const saved = isSaved(species);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `AQUAID: ${species.commonName}`,
          text: `Check out this ${species.commonName} (${species.scientificName}) I scanned with AQUAID!`,
        });
      }
    } catch (err) {
      console.log('Sharing failed or was cancelled', err);
    }
  };

  const handleScanAgain = () => {
    onClose();
    onScanAgain();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, bounce: 0.2 }}
            className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col h-[90vh] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="w-full pt-4 pb-2 flex justify-center shrink-0 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-32">
              {/* Hero Image Section inside bottom sheet */}
              <div className="relative w-full h-64 bg-slate-900 rounded-[32px] shadow-md overflow-hidden mt-2 mb-6">
                <img 
                  src={species.imageUrl} 
                  alt={species.commonName}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                      Successfully Identified
                    </span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{species.commonName}</h2>
                  <p className="text-white/70 font-medium italic mt-0.5 text-base">
                    {species.scientificName}
                  </p>
                </div>
              </div>

              {/* Collapsible Info Sections */}
              <div className="space-y-1">
                <CollapsibleSection title="English Name" content={species.commonName} />
                <CollapsibleSection title="Local Name" content={species.localName} />
                <CollapsibleSection title="Scientific Name" content={species.scientificName} />
                <CollapsibleSection title="Family" content={species.family} />
                <CollapsibleSection title="Description" content={species.education?.description} />
                <CollapsibleSection title="Habitat" content={species.habitat?.habitat} />
                <CollapsibleSection title="Distribution" content={species.habitat?.distribution} />
                <CollapsibleSection title="Conservation Status" content={species.sustainabilityStatus} />
                <CollapsibleSection title="Sustainability Notes" content={species.sustainabilityDescription} />
                <CollapsibleSection title="Common Uses" content={species.fishermanGuide?.commercialImportance} />
              </div>
            </div>

            {/* Fixed Bottom Action Bar inside sheet */}
            <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 sm:px-6 pb-safe shrink-0">
              <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
                <button 
                  onClick={() => toggleSaveResult(species)}
                  className="flex flex-col items-center justify-center py-3 gap-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${saved ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-bold text-slate-600">
                    {saved ? 'Saved' : 'Save Result'}
                  </span>
                </button>
                
                <button 
                  onClick={handleScanAgain}
                  className="flex flex-col items-center justify-center py-3 gap-1.5 bg-[#1F3FAF] hover:bg-[#1a3696] text-white rounded-2xl shadow-lg shadow-[#1F3FAF]/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Scan Again</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center py-3 gap-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                >
                  <Share2 className="w-5 h-5 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-600">Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheetResult;
