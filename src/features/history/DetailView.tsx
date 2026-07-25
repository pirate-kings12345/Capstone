import React, { useState, useRef } from 'react';
import { 
  Share2, FileDown, Heart, Check, Sparkles, AlertTriangle, 
  ShieldAlert, Globe, Utensils, Search, Copy, RefreshCw, BookOpen, 
  HelpCircle, User, Activity, Anchor, Droplet, DollarSign, Database 
} from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';
import { AppLayout } from '../../layouts/AppLayout';
import { SpeciesInfo } from '../../types';

type UserType = 'Fishermen' | 'Fish Farmers' | 'Fish Vendors' | 'Students' | 'Researchers' | 'Consumers';

export const DetailView: React.FC = () => {
  const { navigate, goBack, selectedSpecies } = useAppNavigation();
  const { toggleSaveResult, isSaved } = useAppStore();

  const [activeUserType, setActiveUserType] = useState<UserType>('Students');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<'sci' | 'full' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // References for scroll navigation
  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    highlights: useRef<HTMLDivElement>(null),
    profile: useRef<HTMLDivElement>(null),
    habitat: useRef<HTMLDivElement>(null),
    fishing: useRef<HTMLDivElement>(null),
    aquaculture: useRef<HTMLDivElement>(null),
    market: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    nutrition: useRef<HTMLDivElement>(null),
    aidetails: useRef<HTMLDivElement>(null),
  };

  if (!selectedSpecies) return null;

  const saved = isSaved(selectedSpecies);

  // Scroll helper
  const scrollToSection = (section: keyof typeof sectionRefs) => {
    const ref = sectionRefs[section];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add temporary visual feedback glow
      setHighlightedSection(section);
      setTimeout(() => setHighlightedSection(null), 3000);
    }
  };

  // Search routing logic
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const performSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Check matches mapping
    if (q.includes('protein') || q.includes('nutrition') || q.includes('calorie') || q.includes('fat') || q.includes('cook') || q.includes('eat')) {
      scrollToSection('nutrition');
    } else if (q.includes('disease') || q.includes('aquaculture') || q.includes('ph') || q.includes('feed') || q.includes('culture') || q.includes('grow')) {
      scrollToSection('aquaculture');
    } else if (q.includes('price') || q.includes('market') || q.includes('grade') || q.includes('vendor') || q.includes('fresh')) {
      scrollToSection('market');
    } else if (q.includes('restrict') || q.includes('catch') || q.includes('weight') || q.includes('fisherman') || q.includes('fishing') || q.includes('breed') || q.includes('size')) {
      scrollToSection('fishing');
    } else if (q.includes('depth') || q.includes('temperature') || q.includes('water') || q.includes('habitat') || q.includes('distrib')) {
      scrollToSection('habitat');
    } else if (q.includes('kingdom') || q.includes('phylum') || q.includes('scientific') || q.includes('class') || q.includes('order') || q.includes('fact') || q.includes('lifespan') || q.includes('diet')) {
      scrollToSection('education');
    } else if (q.includes('color') || q.includes('length') || q.includes('weight') || q.includes('shape') || q.includes('profile')) {
      scrollToSection('profile');
    } else if (q.includes('confidence') || q.includes('model') || q.includes('dataset') || q.includes('accuracy')) {
      scrollToSection('aidetails');
    } else {
      scrollToSection('profile'); // fallback
    }
  };

  // Sustainability cosmetics
  const getSustainIcon = () => {
    switch (selectedSpecies.sustainabilityStatus) {
      case "Sustainable":
        return <Check className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />;
      case "Caution":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    }
  };

  const getSustainColors = () => {
    switch (selectedSpecies.sustainabilityStatus) {
      case "Sustainable":
        return "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5";
      case "Caution":
        return "border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-500/5";
      default:
        return "border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-500/5";
    }
  };

  // Clipboard copy utilities
  const handleCopyScientificName = () => {
    navigator.clipboard.writeText(selectedSpecies.scientificName);
    setCopiedText('sci');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCopyFullInfo = () => {
    const summary = `
Fish Species: ${selectedSpecies.commonName}
Scientific Name: ${selectedSpecies.scientificName}
Family: ${selectedSpecies.family}
Sustainability: ${selectedSpecies.sustainabilityStatus}
Water Type: ${selectedSpecies.habitat.waterType}
Average Length: ${selectedSpecies.profile.averageLength}
Average Weight: ${selectedSpecies.profile.averageWeight}
    `.trim();
    navigator.clipboard.writeText(summary);
    setCopiedText('full');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleShareResult = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
    }, 1505);
  };

  // Dynamic Insights list rendering according to the filter behaviors requested:
  const renderUserTypeHighlights = () => {
    switch (activeUserType) {
      case 'Fishermen':
        return [
          { label: 'Commercial Importance', value: selectedSpecies.fishermanGuide.commercialImportance },
          { label: 'Catch Size Limit', value: selectedSpecies.fishermanGuide.catchSize },
          { label: 'Catch Weight Limit', value: selectedSpecies.fishermanGuide.catchWeight },
          { label: 'Fishing Method', value: selectedSpecies.fishermanGuide.recommendedFishingMethod },
          { label: 'Fishing Restrictions', value: selectedSpecies.fishermanGuide.fishingRestrictions },
          { label: 'Conservation Status', value: selectedSpecies.sustainabilityStatus },
          { label: 'Breeding Season', value: selectedSpecies.fishermanGuide.breedingSeason },
          { label: 'Habitat Type', value: selectedSpecies.habitat.habitat },
          { label: 'Water Depth', value: selectedSpecies.habitat.waterDepth },
          { label: 'Sustainability Tips', value: selectedSpecies.fishermanGuide.sustainabilityTips },
          { label: 'Market Price', value: selectedSpecies.market.averagePrice },
        ];
      case 'Fish Farmers':
        return [
          { label: 'Suitable for Aquaculture', value: selectedSpecies.aquaculture.suitable },
          { label: 'Culture Method', value: selectedSpecies.aquaculture.cultureMethod },
          { label: 'Water Temperature', value: selectedSpecies.aquaculture.waterTemperature },
          { label: 'Water pH Range', value: selectedSpecies.aquaculture.waterPh },
          { label: 'Growth Period', value: selectedSpecies.aquaculture.growthPeriod },
          { label: 'Harvest Size', value: selectedSpecies.aquaculture.harvestSize },
          { label: 'Feeding Guide', value: selectedSpecies.aquaculture.feedingGuide },
          { label: 'Common Diseases', value: selectedSpecies.aquaculture.commonDiseases },
          { label: 'Disease Prevention', value: selectedSpecies.aquaculture.diseasePrevention },
        ];
      case 'Fish Vendors':
        return [
          { label: 'Average Market Price', value: selectedSpecies.market.averagePrice },
          { label: 'Quality Grade', value: selectedSpecies.market.qualityGrade },
          { label: 'Freshness Indicators', value: selectedSpecies.market.freshnessIndicators },
          { label: 'Storage Method', value: selectedSpecies.market.storage },
          { label: 'Shelf Life', value: selectedSpecies.market.shelfLife },
          { label: 'Market Demand', value: selectedSpecies.market.marketDemand },
        ];
      case 'Students':
        return [
          { label: 'Scientific Classification', value: `${selectedSpecies.education.kingdom} â†’ ${selectedSpecies.education.phylum} â†’ ${selectedSpecies.education.class} â†’ ${selectedSpecies.education.order} â†’ ${selectedSpecies.family}` },
          { label: 'Species Description', value: selectedSpecies.education.description },
          { label: 'Habitat Type', value: selectedSpecies.habitat.habitat },
          { label: 'Distribution', value: selectedSpecies.habitat.distribution },
          { label: 'Dietary Feeding', value: selectedSpecies.education.diet },
          { label: 'Estimated Lifespan', value: selectedSpecies.education.lifespan },
          { label: 'Interesting Fact', value: selectedSpecies.education.interestingFacts[0] },
          { label: 'Similar Species', value: selectedSpecies.education.similarSpecies.join(', ') },
        ];
      case 'Researchers':
        return [
          { label: 'Scientific Name', value: selectedSpecies.scientificName },
          { label: 'Taxonomy', value: `Kingdom: ${selectedSpecies.education.kingdom}, Phylum: ${selectedSpecies.education.phylum}, Class: ${selectedSpecies.education.class}, Order: ${selectedSpecies.education.order}` },
          { label: 'Habitat Range', value: selectedSpecies.habitat.habitat },
          { label: 'Distribution Range', value: selectedSpecies.habitat.distribution },
          { label: 'Morphology', value: `${selectedSpecies.profile.bodyShape} (${selectedSpecies.profile.dominantColor})` },
          { label: 'Environmental Conditions', value: `Water: ${selectedSpecies.habitat.waterType}, Temp: ${selectedSpecies.habitat.temperature}, Depth: ${selectedSpecies.habitat.waterDepth}` },
          { label: 'Recognition Confidence', value: `${selectedSpecies.confidence.toFixed(2)}%` },
          { label: 'Method', value: selectedSpecies.recognitionMethod },
          { label: 'Dataset', value: selectedSpecies.datasetVersion },
          { label: 'Scan Info', value: `${selectedSpecies.date} at ${selectedSpecies.time}` },
        ];
      case 'Consumers':
        return [
          { label: 'Safe to Eat', value: selectedSpecies.nutrition.safeToEat },
          { label: 'Nutrition Facts', value: `Calories: ${selectedSpecies.nutrition.calories}, Protein: ${selectedSpecies.nutrition.protein}` },
          { label: 'Fat content', value: selectedSpecies.nutrition.fat },
          { label: 'Omega-3 Content', value: selectedSpecies.nutrition.omega3 },
          { label: 'Cooking Methods', value: selectedSpecies.nutrition.cookingMethods },
          { label: 'Storage', value: selectedSpecies.nutrition.storage },
          { label: 'Freshness Indicators', value: selectedSpecies.nutrition.freshnessIndicators },
        ];
      default:
        return [];
    }
  };

  // Section list definitions
  const sectionContent = [
    {
      id: 'profile' as const,
      title: 'Fish Profile',
      icon: User,
      ref: sectionRefs.profile,
      data: [
        { label: 'Common Name', value: selectedSpecies.commonName },
        { label: 'Local Name', value: selectedSpecies.localName },
        { label: 'Scientific Name', value: selectedSpecies.scientificName },
        { label: 'Family', value: selectedSpecies.family },
        { label: 'Body Shape', value: selectedSpecies.profile.bodyShape },
        { label: 'Dominant Color', value: selectedSpecies.profile.dominantColor },
        { label: 'Average Length', value: selectedSpecies.profile.averageLength },
        { label: 'Average Weight', value: selectedSpecies.profile.averageWeight },
      ]
    },
    {
      id: 'habitat' as const,
      title: 'Habitat Information',
      icon: Droplet,
      ref: sectionRefs.habitat,
      data: [
        { label: 'Water Type', value: selectedSpecies.habitat.waterType },
        { label: 'Habitat Range', value: selectedSpecies.habitat.habitat },
        { label: 'Distribution', value: selectedSpecies.habitat.distribution },
        { label: 'Water Temperature', value: selectedSpecies.habitat.temperature },
        { label: 'Water Depth', value: selectedSpecies.habitat.waterDepth },
      ]
    },
    {
      id: 'fishing' as const,
      title: "Fisherman's Guide",
      icon: Anchor,
      ref: sectionRefs.fishing,
      data: [
        { label: 'Commercial Importance', value: selectedSpecies.fishermanGuide.commercialImportance },
        { label: 'Catch Size Limit', value: selectedSpecies.fishermanGuide.catchSize },
        { label: 'Catch Weight Limit', value: selectedSpecies.fishermanGuide.catchWeight },
        { label: 'Breeding Season', value: selectedSpecies.fishermanGuide.breedingSeason },
        { label: 'Fishing Restrictions', value: selectedSpecies.fishermanGuide.fishingRestrictions },
        { label: 'Recommended Hook', value: selectedSpecies.fishermanGuide.recommendedFishingMethod },
        { label: 'Sustainability Tips', value: selectedSpecies.fishermanGuide.sustainabilityTips },
      ]
    },
    {
      id: 'aquaculture' as const,
      title: 'Aquaculture Parameters',
      icon: Activity,
      ref: sectionRefs.aquaculture,
      data: [
        { label: 'Suitable for Culturing', value: selectedSpecies.aquaculture.suitable },
        { label: 'Culture Method', value: selectedSpecies.aquaculture.cultureMethod },
        { label: 'Ideal Water Temp', value: selectedSpecies.aquaculture.waterTemperature },
        { label: 'Ideal pH Range', value: selectedSpecies.aquaculture.waterPh },
        { label: 'Feeding Guidelines', value: selectedSpecies.aquaculture.feedingGuide },
        { label: 'Growth Period', value: selectedSpecies.aquaculture.growthPeriod },
        { label: 'Harvesting Size', value: selectedSpecies.aquaculture.harvestSize },
        { label: 'Harvesting Windows', value: selectedSpecies.aquaculture.harvestPeriod },
        { label: 'Common Diseases', value: selectedSpecies.aquaculture.commonDiseases },
        { label: 'Disease Prevention', value: selectedSpecies.aquaculture.diseasePrevention },
      ]
    },
    {
      id: 'market' as const,
      title: 'Market Information',
      icon: DollarSign,
      ref: sectionRefs.market,
      data: [
        { label: 'Average Price', value: selectedSpecies.market.averagePrice },
        { label: 'Quality Grade', value: selectedSpecies.market.qualityGrade },
        { label: 'Freshness Indicators', value: selectedSpecies.market.freshnessIndicators },
        { label: 'Recommended Storage', value: selectedSpecies.market.storage },
        { label: 'Estimated Shelf Life', value: selectedSpecies.market.shelfLife },
        { label: 'Market Demand', value: selectedSpecies.market.marketDemand },
      ]
    },
    {
      id: 'education' as const,
      title: 'Educational Classification',
      icon: BookOpen,
      ref: sectionRefs.education,
      data: [
        { label: 'Kingdom', value: selectedSpecies.education.kingdom },
        { label: 'Phylum', value: selectedSpecies.education.phylum },
        { label: 'Class', value: selectedSpecies.education.class },
        { label: 'Order', value: selectedSpecies.education.order },
        { label: 'Dietary Habits', value: selectedSpecies.education.diet },
        { label: 'Lifespan', value: selectedSpecies.education.lifespan },
      ],
      listArrays: [
        { label: 'Interesting Facts', items: selectedSpecies.education.interestingFacts },
        { label: 'Similar Species', items: selectedSpecies.education.similarSpecies },
      ],
      description: selectedSpecies.education.description
    },
    {
      id: 'nutrition' as const,
      title: 'Nutrition Information',
      icon: Utensils,
      ref: sectionRefs.nutrition,
      data: [
        { label: 'Safe to Consume', value: selectedSpecies.nutrition.safeToEat },
        { label: 'Calories', value: selectedSpecies.nutrition.calories },
        { label: 'Protein content', value: selectedSpecies.nutrition.protein },
        { label: 'Fat content', value: selectedSpecies.nutrition.fat },
        { label: 'Omega-3 Content', value: selectedSpecies.nutrition.omega3 },
        { label: 'Cooking Methods', value: selectedSpecies.nutrition.cookingMethods },
        { label: 'Storage Method', value: selectedSpecies.nutrition.storage },
        { label: 'Freshness Standard', value: selectedSpecies.nutrition.freshnessIndicators },
      ]
    },
    {
      id: 'aidetails' as const,
      title: 'Scan Details',
      icon: Database,
      ref: sectionRefs.aidetails,
      data: [
        { label: 'Species Identified', value: selectedSpecies.commonName },
        { label: 'Confidence', value: `${selectedSpecies.confidence.toFixed(2)}%` },
        { label: 'Recognition Latency', value: `${selectedSpecies.recognitionTime} seconds` },
        { label: 'Method', value: selectedSpecies.recognitionMethod },
        { label: 'Model Version', value: selectedSpecies.modelVersion },
        { label: 'Dataset', value: selectedSpecies.datasetVersion },
        { label: 'Scan Date', value: selectedSpecies.date },
        { label: 'Scan Time', value: selectedSpecies.time },
      ]
    }
  ];

  // Logic to re-order the sections according to User Type selector
  const orderedSections = [...sectionContent].sort((a, b) => {
    const priorityMap: Record<UserType, string> = {
      'Fishermen': 'fishing',
      'Fish Farmers': 'aquaculture',
      'Fish Vendors': 'market',
      'Students': 'education',
      'Researchers': 'aidetails',
      'Consumers': 'nutrition',
    };

    const targetSection = priorityMap[activeUserType];
    if (a.id === targetSection) return -1;
    if (b.id === targetSection) return 1;
    return 0;
  });

  return (
    <AppLayout title={selectedSpecies.commonName}  showBack>
    <div className="space-y-6 pb-12 font-sans max-w-2xl mx-auto">
      
      {/* Action buttons */}
      <div className="flex justify-end bg-white/30 dark:bg-black/25 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFavorite(!favorite)}
            className="p-2 rounded-full hover:bg-slate-205 dark:hover:bg-white/10 text-slate-600 dark:text-slate-305 transition-colors cursor-pointer"
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => toggleSaveResult(selectedSpecies)}
            className="p-2 rounded-full hover:bg-slate-205 dark:hover:bg-white/10 text-slate-605 dark:text-slate-305 transition-colors cursor-pointer"
            title={saved ? "Saved" : "Save result"}
          >
            <Check className={`w-4 h-4 ${saved ? 'text-emerald-500 stroke-[3]' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI recognition header display panel */}
      <section ref={sectionRefs.overview} className="glass-card rounded-2xl border border-slate-200/50 dark:border-white/10 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] bg-cyan-400/10 blur-2xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          {/* Photo */}
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-inner border border-white/20 flex-shrink-0 relative group">
            <img
              src={selectedSpecies.imageUrl}
              alt={selectedSpecies.commonName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.05]"
            />
            <div className="absolute inset-0 border border-cyan-400/35 pointer-events-none" />
          </div>

          {/* Core Info */}
          <div className="flex-grow space-y-2 text-center sm:text-left">
            <div className="bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-400/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 glow-pulse">
              <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 stroke-[3]" />
              <span className="text-[10px] font-black tracking-wider text-cyan-600 dark:text-cyan-400">
                âœ” FISH SUCCESSFULLY IDENTIFIED
              </span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-808 dark:text-white leading-none">
              {selectedSpecies.commonName}
            </h2>
            <p className="text-xs italic text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider">
              {selectedSpecies.scientificName}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
              <div className="bg-slate-500/5 p-1.5 rounded-lg border border-slate-200/30 dark:border-white/5 text-center">
                <p className="text-slate-400 font-medium">Confidence</p>
                <p className="text-cyan-600 dark:text-cyan-400 font-black">{selectedSpecies.confidence.toFixed(2)}%</p>
              </div>
              <div className="bg-slate-500/5 p-1.5 rounded-lg border border-slate-200/30 dark:border-white/5 text-center">
                <p className="text-slate-400 font-medium">Time</p>
                <p className="text-slate-700 dark:text-white">{selectedSpecies.recognitionTime}s</p>
              </div>
              <div className="bg-slate-500/5 p-1.5 rounded-lg border border-slate-200/30 dark:border-white/5 text-center font-bold">
                <p className="text-slate-400 font-medium">Method</p>
                <p className="text-slate-700 dark:text-white truncate">{selectedSpecies.recognitionMethod.split(' ')[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Card & Actions */}
      <section className="glass-card-light dark:glass-card rounded-2xl border border-slate-200/50 dark:border-white/10 p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">LOCAL NAME</span>
            <span className="text-slate-800 dark:text-white font-black">{selectedSpecies.localName}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">FAMILY</span>
            <span className="text-slate-800 dark:text-white font-black">{selectedSpecies.family}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">HARVEST STATUS</span>
            <span className="text-slate-800 dark:text-white font-black flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${selectedSpecies.sustainabilityStatus === 'Sustainable' ? 'bg-emerald-500' : selectedSpecies.sustainabilityStatus === 'Caution' ? 'bg-amber-500' : 'bg-rose-500'}`} />
              {selectedSpecies.sustainabilityStatus}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">AQUACULTURE STATUS</span>
            <span className="text-slate-800 dark:text-white font-black">{selectedSpecies.aquaculture.suitable}</span>
          </div>
        </div>

        <div className="waterline h-[1px] w-full" />

        {/* Buttons Action tray */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button 
            onClick={() => scrollToSection('profile')}
            className="h-10 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            View Full Info
          </button>
          
          <button
            onClick={() => toggleSaveResult(selectedSpecies)}
            className={`h-10 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              saved 
                ? 'bg-emerald-500/10 border-emerald-305 text-emerald-600 dark:text-emerald-400' 
                : 'bg-white/50 border-slate-200 dark:border-white/10 text-slate-750 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {saved ? 'Saved' : 'Save Result'}
          </button>

          <button 
            onClick={handleShareResult}
            className="h-10 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-600" />
            <span>{copiedLink ? 'Copied!' : 'Share Result'}</span>
          </button>

          <button 
            onClick={() => navigate('Camera')}
            className="h-10 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-305 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Scan Again
          </button>
        </div>
      </section>

      {/* USER TYPE SELECTOR FILTER CHIPS */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">View By Role</h3>
        <div className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
          {[
            { key: 'Fishermen', label: 'Fishermen' },
            { key: 'Fish Farmers', label: 'Farmers' },
            { key: 'Fish Vendors', label: 'Vendors' },
            { key: 'Students', label: 'Students' },
            { key: 'Researchers', label: 'Researchers' },
            { key: 'Consumers', label: 'Consumers' },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setActiveUserType(type.key as UserType)}
              className={`px-4.5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeUserType === type.key
                  ? 'bg-cyan-600 text-white shadow-md font-black'
                  : 'bg-slate-200/50 dark:bg-white/10 text-slate-750 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'
              }`}
            >
              {type.label}
            </button>
          ))}

        </div>
      </section>

      {/* USER TYPE PRIORITIZED HIGHLIGHTS CARD */}
      <section ref={sectionRefs.highlights} className="glass-card rounded-2xl border border-cyan-400/30 p-5 space-y-4 shadow-sm relative overflow-hidden bg-cyan-500/5">
        <div className="absolute top-0 right-0 p-3">
          <Sparkles className="w-5 h-5 text-cyan-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            Key Insights for {activeUserType}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {renderUserTypeHighlights().map((item, idx) => (
            <div key={idx} className="flex justify-between items-start py-3 border-b border-cyan-500/10 gap-4 last:border-0">
              <span className="font-semibold text-slate-600 dark:text-slate-300 text-xs leading-tight flex-shrink-0">{item.label}</span>
              <span className="font-bold text-slate-800 dark:text-white text-right text-xs leading-snug max-w-[55%]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Navigation Panel */}
      <div className="space-y-4">
        {/* Search inside result bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fish information..." 
            className="w-full h-12 pl-11 pr-20 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-semibold text-xs text-slate-800 dark:text-white"
          />
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <button
            type="submit"
            className="absolute right-2 top-2 h-8 bg-cyan-600/10 hover:bg-cyan-605/20 text-cyan-600 dark:text-cyan-400 border border-cyan-400/20 text-[10px] font-bold px-3 rounded-lg transition-colors cursor-pointer"
          >
            Jump to
          </button>
        </form>

        {/* QUICK NAVIGATION TABS */}
        <section className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
          {[
            { label: 'Overview', route: 'overview' as const },
            { label: 'Highlights', route: 'highlights' as const },
            { label: 'Profile', route: 'profile' as const },
            { label: 'Habitat', route: 'habitat' as const },
            { label: 'Fishing', route: 'fishing' as const },
            { label: 'Aquaculture', route: 'aquaculture' as const },
            { label: 'Market', route: 'market' as const },
            { label: 'Education', route: 'education' as const },
            { label: 'Nutrition', route: 'nutrition' as const },
            { label: 'AI Details', route: 'aidetails' as const },
          ].map((tab) => (
            <button
              key={tab.route}
              onClick={() => scrollToSection(tab.route)}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-205 dark:hover:bg-white/10 text-[10px] font-black uppercase rounded-lg border border-slate-200/50 dark:border-white/5 transition-all text-slate-600 dark:text-slate-400 whitespace-nowrap cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              {tab.label}
            </button>
          ))}
        </section>
      </div>

      {/* Sustainable warning alert */}
      <section className={`rounded-2xl p-5 border-l-4 border-solid ${getSustainColors()} flex flex-col gap-2.5 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-500/10 justify-center flex items-center">
            {getSustainIcon()}
          </div>
          <span className="text-base font-black tracking-tight">{selectedSpecies.sustainabilityStatus} Status</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {selectedSpecies.sustainabilityDescription}
        </p>
      </section>

      {/* COPY UTILITIES & EXTRA CONTROLS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={handleCopyScientificName}
          className="h-10 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform cursor-pointer text-slate-700 dark:text-slate-300"
        >
          <Copy className="w-3.5 h-3.5 text-cyan-600" />
          <span>{copiedText === 'sci' ? 'Copied Scientific!' : 'Copy Scientific Name'}</span>
        </button>

        <button
          onClick={handleCopyFullInfo}
          className="h-10 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform cursor-pointer text-slate-700 dark:text-slate-305"
        >
          <Copy className="w-3.5 h-3.5 text-cyan-600" />
          <span>{copiedText === 'full' ? 'Copied Profile!' : 'Copy Fish Info'}</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="h-10 col-span-2 sm:col-span-1 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform cursor-pointer text-slate-700 dark:text-slate-300"
        >
          <FileDown className="w-3.5 h-3.5 text-cyan-600" />
          <span>{downloadingPdf ? 'Exporting...' : 'Export to PDF'}</span>
        </button>
      </div>

      {/* FULL INFORMATION CARDS SECTIONS (ORDERED DYNAMICALLY) */}
      <section className="space-y-4">
        {orderedSections.map((sec) => {
          const SectionIcon = sec.icon;
          const isHighlighted = highlightedSection === sec.id;
          
          return (
            <div
              key={sec.id}
              ref={sec.ref}
              className={`glass-card-light dark:glass-card rounded-2xl border p-5 space-y-5 shadow-sm transition-all duration-500 ${
                isHighlighted 
                  ? 'border-cyan-400 ring-2 ring-cyan-400/20 scale-[1.01] shadow-lg shadow-cyan-400/10' 
                  : 'border-slate-200/50 dark:border-white/10'
              }`}
            >
              {/* Header Title */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                  <SectionIcon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wide">{sec.title}</h3>
              </div>

              {/* Body summary text */}
              {sec.id === 'education' && sec.description && (
                <p className="text-sm font-normal text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-500/5 p-4 rounded-xl border border-slate-200/30 dark:border-white/5">
                  {sec.description}
                </p>
              )}

              {/* Data list rows grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {sec.data.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-2.5 border-b border-slate-200/40 dark:border-white/5 gap-4">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 text-xs flex-shrink-0">{item.label}</span>
                    <span className="font-bold text-slate-800 dark:text-white text-right text-xs leading-snug" title={item.value}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional arrays facts list */}
              {sec.id === 'education' && sec.listArrays && (
                <div className="space-y-3 pt-2">
                  {sec.listArrays.map((arr, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">{arr.label}</span>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-1 leading-relaxed">
                        {arr.items.map((str, sIdx) => (
                          <li key={sIdx}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Back to top logs view helper */}
      <div className="text-center pt-2">
        <button
          onClick={() => navigate('History')}
          className="px-4 py-2 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-xs font-bold rounded-xl transition-all text-slate-705 dark:text-slate-200 cursor-pointer inline-flex items-center gap-1.5"
        >
          View Recent Scans List
        </button>
      </div>

    </div>
    </AppLayout>
  );
};

export default DetailView;














