import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Globe, 
  CheckCircle2, 
  ArrowLeft, 
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  Share2,
  Award,
  Flame,
  Zap,
  Bus,
  Store,
  Newspaper
} from 'lucide-react';

// --- Types ---
interface DonationOption {
  id: number;
  amount: number;
  title: string;
  description: string;
  isPopular?: boolean;
}

// --- Constants ---
const DONATION_OPTIONS: DonationOption[] = [
  { 
    id: 1, 
    amount: 180, 
    title: "שותף צעיר", 
    description: "תמיכה בפעילות שבועית אחת של תלמיד בישיבה",
  },
  { 
    id: 2, 
    amount: 360, 
    title: "חבר את\"ה", 
    description: "דוכן תפילין", 
    isPopular: true 
  },
  { 
    id: 3, 
    amount: 770, 
    title: "בונה עולם", 
    description: "חסות על מיניבוס אחד למבצע תפילין לאחד מערי הדרום",
  },
  { 
    id: 4, 
    amount: 1800, 
    title: "עמוד התווך", 
    description: "חסות על שני מינובוסים למבצע תפילין וכל הוצאות ההפצה במיניבוסים אלה (כיפות, קריאת שמע, עלוני הסבר, ועשרות עלוני שיחת השבוע)",
  },
];

const REVOLUTION_OPTIONS = [
  { 
    id: 'rev-1', 
    amount: 770, 
    title: "מיניבוס למבצע תפילין", 
    icon: Bus,
    description: "מימון מיניבוס מלא למבצע תפילין"
  },
  { 
    id: 'rev-2', 
    amount: 360, 
    title: "דוכן תפילין", 
    icon: Store,
    description: "הקמת ותפעול דוכן תפילין"
  },
  { 
    id: 'rev-3', 
    amount: 180, 
    title: "זיכוי הרבים", 
    icon: Newspaper,
    description: "שיחת השבוע",
    subDescription: "ועלוני חב\"ד השבועיים"
  },
];

const GOAL = 500000;
const INITIAL_RAISED = 342500;

// --- Components ---

const Navbar = ({ onPrayersClick }: { onPrayersClick?: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="אתה לוגו" className="h-14 w-auto object-contain" referrerPolicy="no-referrer" />
          <img src="/logos/logo 15.png" alt="לוגו נוסף" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-secondary leading-tight">איגוד תלמידי הישיבות</h1>
            <p className="text-xs text-gray-600">קרית גת</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={onPrayersClick} className="text-gray-700 hover:text-primary font-bold transition-colors">סדר הנחת תפילין</button>
          <a href="#impact" className="text-gray-700 hover:text-primary font-medium transition-colors">ההשפעה שלנו</a>
          <a href="#donate" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg">תרום עכשיו</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#donate" className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-md md:hidden">תרום</a>
          <button className="md:hidden text-secondary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-4 flex flex-col gap-4"
          >
            <button onClick={() => { onPrayersClick?.(); setIsMenuOpen(false); }} className="text-right text-lg font-bold text-gray-800 p-2">סדר הנחת תפילין</button>
            <a href="#impact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">ההשפעה שלנו</a>
            <a href="#donate" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white text-center py-3 rounded-xl font-bold">תרום עכשיו</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onPrayersClick }: { onPrayersClick: () => void }) => {
  const [stack, setStack] = useState([
    "/photos/mivtzoim_img_1.JPG.jpeg",
    "/photos/mivtzoim_img_2.JPG.jpeg",
    "/photos/mivtzoim_img_3.JPG.jpeg",
    "/photos/mivtzoim_img_4.JPG.jpeg",
    "/photos/mivtzoim_img_5.JPG.jpeg",
    "/photos/mivtzoim_img_6.JPG.jpeg",
    "/photos/mivtzoim_img_7.JPG.jpg",
    "/photos/mivtzoim_img_8.JPG.jpeg",
    "/photos/mivtzoim_img_9.JPG.jpeg",
    "/photos/mivtzoim_img_10.JPG.jpeg",
    "/photos/mivtzoim_img_11.JPG.jpeg",
    "/photos/mivtzoim_img_12.JPG.jpeg",
    "/photos/mivtzoim_img_13.JPG.jpeg",
    "/photos/mivtzoim_img_14.JPG.jpeg",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStack((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-20 pb-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: 100, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="order-2 md:order-1"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3 text-right md:text-right flex items-center justify-end gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={16} className="text-primary" />
            </motion.div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
              קמפיין שותפות תשפ"ו
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-secondary mb-3 leading-[0.9] tracking-tighter text-right"
          >
            אייננעמען די <br />
            <span className="text-primary italic">וועלט!</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base sm:text-lg text-gray-600 mb-5 leading-relaxed max-w-lg text-right ml-auto md:ml-0"
          >
            יחד עם תלמידי ישיבת תומכי תמימים קרית גת, אנו יוצאים למבצע כיבוש העולם באור התורה והחסידות. השותפות שלך היא הכוח שלנו להמשיך ולהפיץ.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 justify-start"
          >
            <motion.a 
              href="#donate" 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="bg-primary text-white px-8 py-5 rounded-2xl font-black text-lg sm:text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              אני רוצה להיות שותף <ArrowLeft size={22} />
            </motion.a>
            <button 
              onClick={onPrayersClick}
              className="md:hidden bg-secondary text-white px-6 py-4 rounded-xl font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              סדר הנחת תפילין <BookOpen size={18} />
            </button>
          </motion.div>
        </motion.div>

        <div className="relative h-[350px] sm:h-[450px] md:h-[500px] flex items-center justify-center mt-8 md:mt-0 order-1 md:order-2">
          <AnimatePresence mode="popLayout">
            {stack.slice(0, 3).reverse().map((src, index) => {
              return (
                <motion.div
                  key={src}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1 - (2 - index) * 0.05, 
                    x: (2 - index) * 20,
                    y: (2 - index) * -10,
                    zIndex: index,
                  }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-56 sm:w-72 md:w-80 aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-gray-100"
                >
                  <img src={src} alt="Mivtzoim" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  {index === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-6 right-6 bg-white p-2 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 z-20 min-w-[60px]"
                    >
                      <img src="/logos/icon.png" alt="Icon" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-secondary">kiryat gat</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const DynamicImageSquare = ({ images, interval = 3000, className = "" }: { images: string[], interval?: number, className?: string }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const validImages = images.filter(img => !failedImages.has(img));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [validImages.length, interval]);

  if (validImages.length === 0) return <div className={className} />;

  const currentImage = validImages[index % validImages.length];

  return (
    <div className={`relative overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedImages(prev => new Set(prev).add(currentImage))}
        />
      </AnimatePresence>
    </div>
  );
};

const HanukkahHero = () => {
  const hanukkahImages = [
    "/photos/hanukkah_img_1.JPG.JPG",
    "/photos/hanukkah_img_2.JPG.JPG",
    "/photos/hanukkah_img_3.JPG.JPG",
    "/photos/hanukkah_img_4.JPG.JPG",
  ];

  return (
    <section className="py-16 bg-linear-to-br from-orange-600 via-orange-500 to-yellow-600 relative overflow-hidden">
      {/* Animated Background Sparks */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0, 0.4, 0],
              y: ["0%", "-20%"],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-right"
          >
            <div className="flex items-center justify-start gap-3 mb-6">
              <motion.div 
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 20px rgba(255,255,255,0.4)",
                    "0 0 0px rgba(255,255,255,0)"
                  ]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md border border-white/30"
              >
                <Flame size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">סיכום פעילות חנוכה</h2>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 font-medium max-w-xl"
            >
              במהלך ימי החנוכה, תלמידי הישיבה יצאו לפעילות חנוכה רחבת היקף בערי הדרום ובבסיסי צה"ל בדרום הארץ ועוטף עזה. התלמידים הגיעו למוצבים מרוחקים, שטחי כינוס, כשהם מצוידים במאות חנוכיות, אלפי סופגניות חמות והרבה שמחה חסידית.
            </motion.p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "חנוכיות", value: "500+" },
                { label: "סופגניות", value: "1,000+" },
                { label: "נרות של אור", value: "2,000+" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                    delay: 0.3 + (i * 0.1) 
                  }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 text-center shadow-lg group"
                >
                  <div className="text-2xl sm:text-3xl font-black text-white mb-1 group-hover:text-yellow-200 transition-colors">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs font-black text-white/80 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4 max-w-lg mx-auto md:mx-0"
          >
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="rounded-[24px] overflow-hidden shadow-2xl border-2 border-white/30 aspect-video bg-black/40 relative group"
              >
                <video src="/videos/hanukkah_vid_1.MP4" autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
              >
                <DynamicImageSquare 
                  images={[hanukkahImages[0], hanukkahImages[1]]} 
                  className="rounded-[24px] shadow-2xl border-2 border-white/30 aspect-square bg-white/5"
                />
              </motion.div>
            </div>
            <div className="space-y-4 pt-8">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
              >
                <DynamicImageSquare 
                  images={[hanukkahImages[2], hanukkahImages[3]]} 
                  className="rounded-[24px] shadow-2xl border-2 border-white/30 aspect-square bg-white/5"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="rounded-[24px] overflow-hidden shadow-2xl border-2 border-white/30 aspect-video bg-black/40 relative group"
              >
                <video src="/videos/hanukkah_vid_2.MP4" autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProgressSection = () => {
  const percentage = (INITIAL_RAISED / GOAL) * 100;
  
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-4 relative z-10"
      >
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-right w-full sm:w-auto">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-2">Fundraising Status</h3>
            <div className="text-5xl sm:text-6xl md:text-7xl font-black font-display leading-none">
              ₪{INITIAL_RAISED.toLocaleString()}
            </div>
          </div>
          <div className="text-right md:text-left w-full sm:w-auto">
            <div className="text-sm opacity-50 mb-1">Target Goal</div>
            <div className="text-2xl font-bold opacity-80">₪{GOAL.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-12">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_30px_rgba(223,151,38,0.6)]"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
          {[
            { label: "Completed", value: `${Math.round(percentage)}%` },
            { label: "Total Donors", value: "1,240" },
            { label: "Days Left", value: "22" },
            { label: "Shares", value: "4.8k" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="text-center md:text-right"
            >
              <div className="text-4xl font-black font-mono text-primary mb-1">{item.value}</div>
              <div className="text-xs uppercase tracking-widest opacity-50">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const DonationGrid = () => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [expandedOption, setExpandedOption] = useState<number | null>(null);

  const handleDonate = (amount: number) => {
    setSelectedAmount(amount);
    setIsModalOpen(true);
    setShowIframe(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Google Sheets
    try {
      const response = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          amount: selectedAmount,
          source: 'תרומה רגילה'
        }),
      });
      const data = await response.json();
      console.log('Google Sheets response:', data);
    } catch (error) {
      console.error('Failed to save donor info:', error);
    }

    setShowIframe(true);
  };

  const getMeshulamUrl = () => {
    const baseUrl = "https://meshulam.co.il/quick_payment?b=2c0a751deb063713a9db1fa3b1c11ad2";
    const params = new URLSearchParams({
      sum: selectedAmount?.toString() || '0',
      full_name: fullName,
      email: email,
    });
    return `${baseUrl}&${params.toString()}`;
  };

  const handleCustomDonate = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      handleDonate(amount);
    }
  };

  return (
    <section id="donate" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-secondary mb-4">בחר את מסלול השותפות שלך</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            כל תרומה, קטנה כגדולה, מצטרפת למפעל האדיר של הפצת המעיינות. בחרו את הסכום המתאים לכם והיו שותפים בכיבוש העולם באור החסידות.
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {DONATION_OPTIONS.map((option, i) => {
              return (
                <motion.div
                  key={option.id}
                  layoutId={`card-${option.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: i * 0.05 
                  }}
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setExpandedOption(option.id);
                    }
                  }}
                  className={`relative bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-lg border-2 transition-all duration-300 ${
                    window.innerWidth < 640 ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    option.isPopular ? 'border-primary ring-2 sm:ring-4 ring-primary/10' : 'border-transparent'
                  }`}
                >
                {option.isPopular && (
                  <div className="absolute -top-3 sm:-top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-primary text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-black whitespace-nowrap shadow-md border-1 sm:border-2 border-white">
                      הכי פופולרי
                    </div>
                  </div>
                )}

                <div className="text-center mb-4 sm:mb-6 relative z-10">
                  <h4 className="text-base sm:text-xl font-black text-secondary mb-1 leading-tight">{option.title}</h4>
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    <span className="text-sm sm:text-2xl font-bold text-primary">₪</span>
                    <span className="text-3xl sm:text-5xl font-black text-primary tracking-tighter">{option.amount}</span>
                  </div>
                </div>
                
                <p className="hidden sm:block text-gray-600 text-sm text-center mb-8 h-12 leading-relaxed font-medium">
                  {option.description}
                </p>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.innerWidth < 640) {
                      setExpandedOption(option.id);
                    } else {
                      handleDonate(option.amount);
                    }
                  }}
                  className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all cursor-pointer relative z-10 ${
                    option.isPopular 
                      ? 'bg-primary text-white shadow-md sm:shadow-lg' 
                      : 'bg-secondary/5 text-secondary hover:bg-secondary/10'
                  }`}
                >
                  בחר
                </button>
              </motion.div>
            );
          })}
          </div>

          <AnimatePresence>
            {expandedOption && window.innerWidth < 640 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExpandedOption(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
                  <motion.div
                    layoutId={`card-${expandedOption}`}
                    className="bg-white p-6 rounded-[32px] shadow-2xl border-2 border-primary w-full max-w-[320px] pointer-events-auto relative"
                  >
                    <button 
                      onClick={() => setExpandedOption(null)}
                      className="absolute top-4 left-4 text-gray-400 hover:text-secondary transition-colors p-1"
                    >
                      <X size={24} />
                    </button>

                    <div className="text-center mb-6">
                      <h4 className="text-xl font-black text-secondary mb-2">
                        {DONATION_OPTIONS.find(o => o.id === expandedOption)?.title}
                      </h4>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xl font-bold text-primary">₪</span>
                        <span className="text-4xl font-black text-primary tracking-tighter">
                          {DONATION_OPTIONS.find(o => o.id === expandedOption)?.amount}
                        </span>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="text-gray-600 text-sm text-center leading-relaxed font-medium px-2">
                        {DONATION_OPTIONS.find(o => o.id === expandedOption)?.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        const opt = DONATION_OPTIONS.find(o => o.id === expandedOption);
                        if (opt) handleDonate(opt.amount);
                        setExpandedOption(null);
                      }}
                      className="w-full py-4 bg-primary text-white rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      אני רוצה להיות שותף!
                    </button>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 max-w-xl mx-auto bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-1">סכום אחר</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
              <input 
                type="number" 
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="הכנס סכום..." 
                className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
          </div>
          <button 
            onClick={handleCustomDonate}
            className="w-full sm:w-auto bg-secondary text-white px-8 py-3 rounded-xl font-bold sm:mt-6 hover:bg-opacity-90 transition-all cursor-pointer"
          >
            תרום
          </button>
        </div>
      </div>

      {/* Donation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative bg-white w-full ${showIframe ? 'max-w-3xl h-[85vh]' : 'max-w-md'} rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 flex flex-col`}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <h3 className="text-2xl font-black text-secondary">
                  {showIframe ? 'תשלום מאובטח' : 'פרטי תרומה'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {showIframe ? (
                  <iframe 
                    src={getMeshulamUrl()}
                    className="w-full h-full border-none min-h-[500px]"
                    title="Meshulam Payment"
                  />
                ) : (
                  <div className="p-8">
                    <div className="bg-primary/10 p-4 rounded-2xl mb-6 text-center">
                      <div className="text-sm text-primary font-bold mb-1">סכום התרומה</div>
                      <div className="text-4xl font-black text-secondary">₪{selectedAmount?.toLocaleString()}</div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">שם מלא</label>
                        <input 
                          type="text" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">דוא"ל</label>
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" 
                        />
                      </div>
                      <div className="pt-4">
                        <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all">
                          המשך לתשלום מאובטח
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 text-center">
                        התשלום מאובטח בתקן PCI-DSS. פרטי האשראי אינם נשמרים במערכת.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ImpactSection = () => {
  const stats = [
    { icon: <Users />, label: "הנחות תפילין בשנה האחרונה", value: "25,200" },
    { icon: <BookOpen />, label: "אותיות בספר תורה כללי ושל ילדי ישראל", value: "18,490" },
    { icon: <Zap />, label: "קריאות מגילה", value: "1,000" },
    { icon: <Globe />, label: "מוקדי פעילות", value: "64" },
  ];

  return (
    <section id="impact" className="py-24 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-black text-secondary mb-6">ההשפעה של את"ה בשטח</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              איגוד תלמידי הישיבות (את"ה) הוא הלב הפועם של ישיבת תומכי תמימים קריית גת. מדי יום שישי בשעות הבוקר יוצאים תלמידי הישיבה למבצע תפילין, במיניבוסים מסודרים לכל אזור הדרום והעיר קריית גת. בשליחות הרבי מליובאוויטש, במטרה להכין את העולם לקבלת פני משיח.
            </p>
            <p className="text-lg font-bold text-secondary mb-6">
              פעילות את"ה כוללת מגוון רחב של יוזמות והשפעה בשטח:
            </p>
            <ul className="space-y-4">
              {[
                'פעילות מבצע תפילין בכל אזור הדרום.',
                'פעילות חנוכה בבסיסי צה"ל ובבתי רפואה ברחבי הארץ.',
                'הפצת המעיינות והפצת אור החסידות בקרב תושבי האזור.',
                'אלפי אותיות בספר תורה הכללי ושל ילדי ישראל',
                'קריאות מגילה ומשלוחי מנות בפורים',
                'מסיבות שבת',
                'עשרת הדברות בחג השבועות'
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 text-gray-700 font-medium"
                >
                  <CheckCircle2 className="text-primary" size={20} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, i) => {
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: i * 0.1 
                  }}
                  whileHover={{ scale: 1.1, y: -10, rotate: 2 }}
                  className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 text-center cursor-default"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black text-secondary mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Footer = ({ setView }: { setView?: (v: 'home' | 'prayers') => void }) => {
  return (
    <footer className="bg-secondary text-white pt-20 pb-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-right">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 sm:col-span-2 flex flex-col items-start md:items-center lg:items-start md:px-12 lg:px-0"
          >
            <img src="/logos/logo1.png" alt="אתה לוגו" className="h-12 w-auto object-contain mb-6" referrerPolicy="no-referrer" />
            <p className="text-gray-300 max-w-md leading-relaxed mb-8 text-right md:text-center lg:text-right">
              איגוד תלמידי הישיבות - ישיבת תומכי תמימים ליובאוויטש קרית גת. 
              פועלים להפצת המעיינות והכנת העולם לקבלת פני משיח צדקנו.
            </p>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Share2 size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Mail size={18} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-center lg:items-start"
          >
            <div className="text-right">
              <h5 className="text-lg font-bold mb-6 text-primary">צור קשר</h5>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center justify-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <span>אליהו הנביא 5, קרית גת</span>
                </li>
                <li className="flex items-center justify-start gap-3">
                  <Mail size={18} className="text-primary shrink-0" />
                  <span>mivtzoim.kg@gmail.com</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-center lg:items-start"
          >
            <div className="text-right">
              <h5 className="text-lg font-bold mb-6 text-primary">ניווט מהיר</h5>
              <ul className="space-y-4 text-gray-300">
                <li><button onClick={() => { window.scrollTo(0, 0); setView?.('home'); }} className="hover:text-primary transition-colors">דף הבית</button></li>
                <li><a href="#impact" className="hover:text-primary transition-colors">פעילות ודיווחים</a></li>
                <li><a href="#donate" className="hover:text-primary transition-colors">תרומה מאובטחת</a></li>
                <li><button onClick={() => { window.scrollTo(0, 0); setView?.('prayers'); }} className="hover:text-primary transition-colors">סדר הנחת תפילין</button></li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm font-medium">
          <p>© כל הזכויות שמורות לאיגוד תלמידי הישיבות קרית גת - תשפ"ו</p>
        </div>
      </div>
    </footer>
  );
};

const ImageMarquee = () => {
  const images = [
    "/photos/mivtzoim_img_1.JPG.jpeg",
    "/photos/mivtzoim_img_2.JPG.jpeg",
    "/photos/mivtzoim_img_3.JPG.jpeg",
    "/photos/mivtzoim_img_4.JPG.jpeg",
    "/photos/mivtzoim_img_5.JPG.jpeg",
    "/photos/mivtzoim_img_6.JPG.jpeg",
    "/photos/mivtzoim_img_7.JPG.jpg",
    "/photos/mivtzoim_img_8.JPG.jpeg",
    "/photos/mivtzoim_img_9.JPG.jpeg",
    "/photos/mivtzoim_img_10.JPG.jpeg",
    "/photos/mivtzoim_img_11.JPG.jpeg",
    "/photos/mivtzoim_img_12.JPG.jpeg",
    "/photos/mivtzoim_img_13.JPG.jpeg",
    "/photos/mivtzoim_img_14.JPG.jpeg",
  ];

  return (
    <section className="py-12 bg-secondary overflow-hidden relative">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-linear-to-b from-secondary via-transparent to-secondary" />
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 mb-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-primary/30" />
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="text-primary" fill="currentColor" />
              </motion.div>
              מבצע תפילין בפעולה
            </h2>
            <div className="h-px flex-1 bg-primary/30" />
          </motion.div>
      </div>

      <div className="relative flex w-full overflow-hidden group/marquee select-none touch-pan-y py-10" style={{ direction: 'ltr' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .group\\/marquee::-webkit-scrollbar { display: none; }
          .group\\/marquee { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
        <div className="animate-marquee flex whitespace-nowrap group-hover/marquee:[animation-play-state:paused]">
          {[...images, ...images, ...images].map((src, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05, zIndex: 20 }}
              className="w-64 sm:w-80 h-[400px] sm:h-[480px] flex-shrink-0 px-3 group relative transition-all duration-500"
            >
              <div className="w-full h-full rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10 relative bg-gray-800">
                <img 
                  src={src} 
                  alt={`פעילות ${i}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${i}/400/600`;
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white text-sm font-bold">מבצע תפילין - קרית גת</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PrayersView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
            <ArrowLeft size={20} className="rotate-180" />
            חזרה לדף הבית
          </button>
          <div className="flex items-center gap-2">
            <img src="/logos/logo.png" alt="אתה לוגו" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
            <img src="/logos/logo 15.png" alt="לוגו נוסף" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-[40px] p-4 md:p-12 shadow-inner border border-primary/10"
        >
          <h1 className="text-3xl md:text-4xl font-black text-secondary mb-8 text-center">סדר הנחת תפילין</h1>
          
          <div className="space-y-8 text-lg leading-relaxed text-gray-800 text-center">
            <p className="font-bold text-primary">
              ראוי להתפלל עם התפילין את תפילת שחרית במלואה. אם אין ביכולתך להתפלל את כל התפילה, חשוּב לומר את ברכת התורה ופרשת שמע ישראל
            </p>

            <section>
              <h2 className="text-xl font-black text-secondary mb-4 underline decoration-primary underline-offset-4">ברכת התורה:</h2>
              <p className="text-2xl md:text-3xl font-serif leading-relaxed">
                בָּרוּךְ אַתָּה אֲ-דנָֹי אֱ-לֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר בָּחַר בָּנוּ מִכָּל הָעַמִּים וְנָתַן לָנוּ אֶת תּוֹרָתוֹ. בָּרוּךְ אַתָּה אֲ-דנָֹי נוֹתֵן הַתּוֹרָה.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-secondary mb-4 underline decoration-primary underline-offset-4">נכון לומר קודם התפילה:</h2>
              <p className="text-xl md:text-2xl font-serif mb-4">
                הֲרֵינִי מְקַבֵּל עָלַי מִצְוַת עֲשֵׂה שֶׁל וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ
              </p>
              <p className="text-3xl md:text-4xl font-serif font-black mb-2">
                שְׁמַע יִשְׂרָאֵל, אֲ-דנָֹי אֱ-לֹהֵינוּ, אֲ-דנָֹי אֶחָד:
              </p>
              <p className="text-lg text-gray-500 mb-4">(בלחש) בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד:</p>
            </section>

            <section className="space-y-10 text-xl md:text-2xl font-serif leading-relaxed">
              <p className="text-justify [text-align-last:center]">
                <span className="float-right text-4xl font-black text-secondary ml-3 mb-1 leading-none">וְאָהַבְתָּ</span>
                אֵת אֲ-דנָֹי אֱ-לֹהֶיךָ, בְּכָל לְבָבְךָ, וּבְכָל נַפְשְׁךָ, וּבְכָל מְאדֶֹךָ: וְהָיוּ הַדְּבָרִים הָאֵלֶּה אֲשֶׁר אָנכִֹי מְצַוְּךָ הַיּוֹם עַל לְבָבֶךָ: וְשִׁנַּנְתָּם לְבָנֶיךָ וְדִבַּרְתָּ בָּם, בְּשִׁבְתְּךָ בְּבֵיתֶךָ, וּבְלֶכְתְּךָ בַדֶּרֶךְ, וּבְשָׁכְבְּךָ, וּבְקוּמֶךָ: וּקְשַׁרְתָּם לְאוֹת עַל יָדֶךָ, וְהָיוּ לְטטָֹפתֹ בֵּין עֵינֶיךָ: וּכְתַבְתָּם עַל מְזֻזוֹת בֵּיתֶךָ, וּבִשְׁעָרֶיךָ:
              </p>
              <p className="text-justify [text-align-last:center]">
                <span className="float-right text-4xl font-black text-secondary ml-3 mb-1 leading-none">וְהָיָה</span>
                אִם שָׁמעַֹ תִּשְׁמְעוּ אֶל מִצְוֹתַי אֲשֶׁר אָנכִֹי מְצַוֶּה אֶתְכֶם הַיּוֹם, לְאַהֲבָה אֶת אֲ-דנָֹי אֱ-לֹהֵיכֶם וּלְעָבְדוֹ, בְּכָל לְבַבְכֶם וּבְכָל נַפְשְׁכֶם: וְנָתתִּי מְטַר אַרְצְכֶם בְּעִתּוֹ יוֹרֶה וּמַלְקוֹשׁ, וְאָסַפְתָּ דְגָנֶךָ וְתִירשְֹׁךָ וְיִצְהָרֶךָ: וְנָתַתִּי עֵשֶׂב בְּשָׂדְךָ לִבְהֶמְתֶּךָ, וְאָכַלְתָּ וְשָׂבָעְתָּ: הִשָּׁמְרוּ לָכֶם פֶּן יִפְתֶּה לְבַבְכֶם, וְסַרְתֶּם וַעֲבַדְתֶּם אֱלֹהִים אֲחֵרִים וְהִשְׁתַּחֲוִיתֶם לָהֶם: וְחָרָה אַף אֲ-דנָֹי בָּכֶם וְעָצַר אֶת הַשָּׁמַיִם וְלֹא יִהְיֶה מָטָר וְהָאֲדָמָה לֹא תִתֵּן אֶת יְבוּלָהּ, וַאֲבַדְתֶּם מְהֵרָה מֵעַל הָאָרֶץ הַטּבָֹה אֲשֶׁר אֲ-דנָֹי נתֵֹן לָכֶם: וְשַׂמְתֶּם אֶת דְּבָרַי אֵלֶּה עַל לְבַבְכֶם וְעַל נַפְשְׁכֶם, וּקְשַׁרְתֶּם אתָֹם לְאוֹת עַל יֶדְכֶם וְהָיוּ לְטוֹטָפתֹ בֵּין עֵינֵיכֶם: וְלִמַּדְתֶּם אתָֹם אֶת בְּנֵיכֶם לְדַבֵּר בָּם, בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשָׁכְבְּךָ וּבְקוּמֶךָ: וּכְתַבְתָּם עַל מְזוּזוֹת בֵּיתֶךָ וּבִשְׁעָרֶיךָ: לְמַעַן יִרְבּוּ יְמֵיכֶם וִימֵי בְנֵיכֶם עַל הָאֲדָמָה אֲשֶׁר נִשְׁבַּע אֲ-דנָֹי לַאֲבתֵֹיכֶם לָתֵת לָהֶם, כִּימֵי הַשָּׁמַיִם עַל הָאָרֶץ:
              </p>
              <p className="text-justify [text-align-last:center]">
                <span className="float-right text-4xl font-black text-secondary ml-3 mb-1 leading-none">וַיֹּאמֶר</span>
                אֲ-דנָֹי אֶל משֶֹׁה לֵּאמרֹ: דַּבֵּר אֶל בְּנֵי יִשְׂרָאֵל וְאָמַרְתָּ אֲלֵהֶם וְעָשׂוּ לָהֶם צִיצִת עַל כַּנְפֵי בִגְדֵיהֶם לְדרֹתָֹם, וְנָתְנוּ עַל צִיצִת הַכָּנף פְּתִיל תְּכֵלֶת: וְהָיָה לָכֶם לְצִיצִת וּרְאִיתֶם אתֹוֹ, וּזְכַרְתֶּם אֶת כָּל מִצְוֹת אֲ-דנָֹי וַעֲשִׂיתֶם אתָֹם, וְלֹא תָתוּרוּ אַחֲרֵי לְבַבְכֶם וְאַחֲרֵי עֵינֵיכֶם אֲשֶׁר אַתֶּם זנִֹים אַחֲרֵיהֶם: לְמַעַן תִּזְכְּרוּ וַעֲשִׂיתֶם אֶת כָּל מִצְוֹתָי, וִהְיִיתֶם קְדשִֹׁים לֵאלֹהֵיכֶם: אֲנִי אֲ-דנָֹי אֱלֹהֵיכֶם אֲשֶׁר הוֹצֵאתִי אֶתְכֶם מֵאֶרֶץ מִצְרַיִם לִהְיוֹת לָכֶם לֵאלֹהִים, אֲנִי אֲ-דנָֹי אֱלֹהֵיכֶם אֲנִי אֲ-דנָֹי אֱ-לֹהֵיכֶם: (אֱמֶת:)
              </p>
            </section>

            <section className="pt-8 border-t border-primary/20">
              <p className="text-lg italic mb-4">בסיום התפילה יש לומר:</p>
              <p className="text-xl md:text-2xl font-serif mb-2">
                יְהִי רָצוֹן מִלְּפָנֶיךָ אֲ־דֹנָי אֱלהֵינוּ וֵאלהֵי אֲבוֹתֵינוּ, שֶׁיִבָּנֶה בֵּית הַמִקְדָּשׁ בִּמְהֵרָה בְיָמֵינוּ, וְתֵן חֶלְקֵנוּ בְּתוֹרָתֶךָ.
              </p>
              <p className="text-xl md:text-2xl font-serif">
                אַךְ צַדִּיקִים יוֹדוּ לִשְׁמֶךָ יֵשְׁבוּ יְשָׁרִים אֶת פָּנֶיךָ
              </p>
            </section>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-black text-secondary mb-4">היה שותף בהפצת המעיינות</h3>
          <p className="text-gray-600 mb-8">התרומה שלך מאפשרת לנו להגיע לעוד יהודי, להניח לו תפילין ולהאיר את נשמתו</p>
          <button onClick={() => { onBack(); setTimeout(() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all inline-block">
            לתרומה מאובטחת
          </button>
        </div>
      </main>
      <Footer setView={onBack ? () => onBack() : undefined} />
    </div>
  );
};

const RevolutionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleDonate = (amount: number) => {
    setSelectedAmount(amount);
    setShowIframe(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save to Google Sheets
    try {
      const option = REVOLUTION_OPTIONS.find(opt => opt.amount === selectedAmount);
      const response = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          amount: selectedAmount,
          source: `מהפכת האור - ${option?.title || 'כללי'}`
        }),
      });
      const data = await response.json();
      console.log('Google Sheets response:', data);
    } catch (error) {
      console.error('Failed to save donor info:', error);
    }

    setShowIframe(true);
  };

  const getMeshulamUrl = () => {
    const baseUrl = "https://meshulam.co.il/quick_payment?b=2c0a751deb063713a9db1fa3b1c11ad2";
    const params = new URLSearchParams({
      sum: selectedAmount?.toString() || '0',
      full_name: fullName,
      email: email,
    });
    return `${baseUrl}&${params.toString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative bg-white w-full ${showIframe ? 'max-w-3xl h-[85vh]' : 'max-w-2xl'} rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h3 className="text-2xl font-black text-secondary">
            {showIframe ? 'תשלום מאובטח' : 'אני שותף למהפכת האור!'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
          {showIframe ? (
            <iframe 
              src={getMeshulamUrl()}
              className="w-full h-full border-none min-h-[500px]"
              title="Meshulam Payment"
            />
          ) : selectedAmount ? (
            <div className="max-w-md mx-auto py-2 sm:py-4">
              <button 
                onClick={() => setSelectedAmount(null)}
                className="flex items-center gap-2 text-primary font-bold mb-4 sm:6 hover:underline"
              >
                <ArrowLeft size={16} className="rotate-180" />
                חזרה לבחירת מסלול
              </button>
              
              <div className="bg-primary/10 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 text-center">
                <div className="text-xs sm:text-sm text-primary font-bold mb-1">סכום התרומה</div>
                <div className="text-3xl sm:text-4xl font-black text-secondary">₪{selectedAmount.toLocaleString()}</div>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">שם מלא</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base" 
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">דוא"ל</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base" 
                  />
                </div>
                <div className="pt-2 sm:pt-4">
                  <button type="submit" className="w-full bg-primary text-white py-3 sm:py-4 rounded-2xl font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all">
                    המשך לתשלום מאובטח
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                {REVOLUTION_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDonate(option.amount)}
                    className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all group text-center flex flex-row sm:flex-col items-center gap-4 sm:gap-0"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary mb-0 sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <option.icon size={24} className="sm:hidden" />
                      <option.icon size={32} className="hidden sm:block" />
                    </div>
                    <div className="flex-1 text-right sm:text-center">
                      <h4 className="text-base sm:text-xl font-black text-secondary mb-0.5 sm:mb-2 leading-tight">{option.title}</h4>
                      <div className="text-xl sm:text-3xl font-black text-primary mb-1 sm:mb-4 leading-none">₪{option.amount}</div>
                      <p className="text-[10px] sm:text-sm text-gray-600 leading-tight sm:leading-relaxed">
                        {option.description}
                      </p>
                      {option.subDescription && (
                        <p className="text-[8px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{option.subDescription}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={onClose}
                className="mt-4 w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm sm:hidden"
              >
                סגור
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'prayers'>('home');
  const [isRevolutionModalOpen, setIsRevolutionModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (view === 'prayers') {
    return <PrayersView onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen font-sans" dir="rtl">
      <Navbar onPrayersClick={() => setView('prayers')} />
      <main>
        <Hero onPrayersClick={() => setView('prayers')} />
        <HanukkahHero />
        <ImageMarquee />
        <ImpactSection />
        <DonationGrid />
        
        {/* Testimonial Section */}
        <section className="py-24 bg-primary/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Heart className="text-primary mx-auto mb-6" size={48} />
              <h2 className="text-3xl font-black text-secondary">מה אומרים עלינו בשטח?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "ו. מרדכי", location: "תושב אשקלון", quote: "אני מניח תפילין בכל יום שישי רק בזכות הבחורים של את\"ה שמגיעים אלינו בחיוך." },
                { name: "יוסי א.", location: "בעל עסק בקרית גת", quote: "האור שהם מכניסים לחנות בכל יום שישי הוא הכוח שלי לכל השבוע. פשוט מדהים." },
                { name: "דניאל ל.", location: "חייל במילואים", quote: "בחנוכה הם הגיעו אלינו לעומק השטח עם סופגניות וחנוכיות. זה חימם לנו את הלב בצורה שאי אפשר לתאר." }
              ].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[32px] shadow-xl relative"
                >
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-serif text-2xl">"</div>
                  <p className="text-gray-700 italic mb-6 text-lg leading-relaxed text-right">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <div className="font-bold text-secondary">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.location}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-gray-100 flex items-center justify-center">
                      <Users className="text-primary/40" size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-linear-to-r from-secondary to-primary p-8 sm:p-12 rounded-[40px] text-white text-center relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black mb-6">מוכנים להפיץ את המעיינות?</h2>
                <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                  היו שותפים בפעילות האדירה של את"ה קרית גת - מבצע תפילין, הפצת אור החסידות, ופעילות חסד ענפה בבסיסי צה"ל ובמרחבי הדרום. יחד נכין את העולם לגאולה!
                </p>
                <button 
                  onClick={() => setIsRevolutionModalOpen(true)}
                  className="inline-block w-full sm:w-auto bg-white text-secondary px-12 py-5 rounded-2xl font-black text-xl hover:bg-opacity-90 transition-all shadow-xl cursor-pointer"
                >
                  אני שותף למהפכת האור!
                </button>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        <AnimatePresence>
          {isRevolutionModalOpen && (
            <RevolutionModal 
              isOpen={isRevolutionModalOpen} 
              onClose={() => setIsRevolutionModalOpen(false)} 
            />
          )}
        </AnimatePresence>
      </main>
      <Footer setView={setView} />
    </div>
  );
}
