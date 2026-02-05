import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView
} from 'framer-motion';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// SafeIcon component for rendering Lucide icons safely
const SafeIcon = ({ name, size = 24, className, color }) => {
  const iconMap = {
    'arrow-right': ArrowRight,
    'arrow-left': ArrowLeft,
    'x': X,
    'menu': Menu,
    'grid-3x3': Grid3x3,
    'list': List,
    'expand': Expand,
    'camera': Camera,
    'image': Image,
    'sun': Sun,
    'moon': Moon,
    'download': Download,
    'share': Share,
    'heart': Heart,
    'maximize': Maximize,
    'minimize': Minimize,
    'zoom-in': ZoomIn,
    'zoom-out': ZoomOut,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'play': Play,
    'pause': Pause,
  };

  // Convert kebab-case to camelCase
  const convertToCamel = (str) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  };

  // Convert camelCase to PascalCase
  const convertToPascal = (str) => {
    const camel = convertToCamel(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  let IconComponent = iconMap[name?.toLowerCase()];

  // Fallback to dynamic lookup if not in map
  if (!IconComponent && name) {
    const pascalName = convertToPascal(name);
    try {
      const lucideModule = LucideReact;
      IconComponent = lucideModule[pascalName];
    } catch (e) {
      IconComponent = null;
    }
  }

  if (!IconComponent) {
    return <div className={cn('flex items-center justify-center bg-gray-200 rounded', className)} style={{ width: size, height: size }}><span className="text-gray-400 text-xs">?</span></div>;
  }

  return <IconComponent size={size} className={className} color={color} />;
};

// Import icons directly
import {
  ArrowRight,
  ArrowLeft,
  X,
  Menu,
  Grid3x3,
  List,
  Expand,
  Camera,
  Image as ImageIcon,
  Sun,
  Moon,
  Download,
  Share2 as Share,
  Heart,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

// Gallery data - using the user's provided images
const galleryImages = [
  {
    id: 1,
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg',
    title: 'Фотография 1',
    description: 'Первое изображение из коллекции',
    category: 'general',
    size: 'large'
  },
  {
    id: 2,
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg',
    title: 'Фотография 2',
    description: 'Второе изображение из коллекции gallery',
    category: 'nature',
    size: 'medium'
  },
  {
    id: 3,
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg',
    title: 'Фотография 3',
    description: 'Третье изображение из коллекции',
    category: 'abstract',
    size: 'medium'
  }
];

// Lightbox Component
const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Image container */}
      <motion.div
        className="relative max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          style={{ transform: `scale(${scale})` }}
          onLoad={() => setIsLoading(false)}
        />

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <h3 className="text-white text-xl font-bold">{currentImage.title}</h3>
          <p className="text-gray-300 text-sm">{currentImage.description}</p>
          <p className="text-gray-400 text-xs mt-2">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </motion.div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm">
        <button
          onClick={(e) => { e.stopPropagation(); setScale(Math.max(0.5, scale - 0.25)); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="px-3 py-1 text-white text-sm font-medium self-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setScale(Math.min(3, scale + 0.25)); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

// Gallery Item Component
const GalleryItem = ({ image, index, onClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-zinc-900/50 ${
        image.size === 'large'
          ? 'md:col-span-2 md:row-span-2'
          : image.size === 'medium'
            ? 'md:col-span-1 md:row-span-2'
            : ''
      }`}
      onClick={() => onClick(index)}
    >
      <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-zinc-950/0 transition-all duration-500 z-10" />

      <img
        src={image.url}
        alt={image.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ minHeight: image.size === 'large' ? '500px' : image.size === 'medium' ? '400px' : '250px' }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-xl font-bold mb-2">{image.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{image.description}</p>
          <div className="flex items-center gap-2 mt-4 text-red-400 text-sm font-medium">
            <Maximize className="w-4 h-4" />
            <span>Нажмите для просмотра</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const aboutRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Fixed Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                PhotoGallery
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Главная', ref: heroRef },
                { label: 'Галерея', ref: galleryRef },
                { label: 'О нас', ref: aboutRef },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.ref)}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-zinc-950 border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {[
                  { label: 'Главная', ref: heroRef },
                  { label: 'Галерея', ref: galleryRef },
                  { label: 'О нас', ref: aboutRef },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.ref)}
                    className="block w-full text-left text-lg font-medium text-gray-300 hover:text-white py-2 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center px-4 md:px-6 pt-20"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-400 backdrop-blur-sm">
                <Camera className="w-4 h-4 inline mr-2" />
                Профессиональная фотогалерея
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Мир в
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                объективе
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Откройте для себя коллекцию уникальных фотографий. Каждый кадр — это история, эмоция и мгновение вечности.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
                className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/30 flex items-center justify-center gap-2"
              >
                Смотреть галерею
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                className="group bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
              >
                Подробнее
                <Expand className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            >
              <div className="w-1.5 h-3 bg-white/60 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Gallery Section */}
        <section id="gallery" ref={galleryRef} className="py-20 md:py-32 px-4 md:px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-400 mb-4">
                <Grid3x3 className="w-4 h-4 inline mr-2" />
                Коллекция работ
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Галерея
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Каждая фотография рассказывает свою уникальную историю. Нажмите на изображение для полноэкранного просмотра.
              </p>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {galleryImages.map((image, index) => (
                <GalleryItem
                  key={image.id}
                  image={image}
                  index={index}
                  onClick={openLightbox}
                />
              ))}
            </div>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <button className="group bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 mx-auto">
                <span>Загрузить ещё</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-400 mb-6">
                  <Camera className="w-4 h-4 inline mr-2" />
                  О проекте
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Искусство
                  </span>
                  <br />
                  <span className="text-red-500">
                    в каждом кадре
                  </span>
                </h2>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                  Наша фотогалерея — это пространство, где каждая фотография рассказывает свою историю. Мы собираем лучшие работы и представляем их в удобном, элегантном формате.
                </p>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  Особенности нашей галереи: адаптивный дизайн для всех устройств, быстрая загрузка благодаря оптимизации изображений, удобный просмотр в полноэкранном режиме с масштабированием.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <Grid3x3 className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-300">Адаптивная сетка</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <ZoomIn className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-300">Масштабирование</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <ImageIcon className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-300">Lazy Loading</span>
                  </div>
                </div>
              </motion.div>

              {/* Visual Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                  <img
                    src={galleryImages[0]?.url}
                    alt="About gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Floating stat cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">150+</div>
                      <div className="text-sm text-gray-400">Фотографий</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-6 -right-6 bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">2.5K</div>
                      <div className="text-sm text-gray-400">Лайков</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-zinc-950">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-400 mb-4">
                <Grid3x3 className="w-4 h-4 inline mr-2" />
                Возможности
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Почему выбирают
                </span>
                <br />
                <span className="text-red-500">нас</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Maximize,
                  title: 'Полноэкранный просмотр',
                  description: 'Увеличивайте изображения с сохранением качества. Удобная навигация между фото.',
                  color: 'red'
                },
                {
                  icon: ImageIcon,
                  title: 'Lazy Loading',
                  description: 'Изображения загружаются по мере прокрутки. Экономия трафика и быстрая загрузка.',
                  color: 'purple'
                },
                {
                  icon: Grid3x3,
                  title: 'Адаптивная сетка',
                  description: 'Оптимальное отображение на любых устройствах: от смартфонов до 4K мониторов.',
                  color: 'blue'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all duration-500"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110',
                    feature.color === 'red' && 'bg-red-600/20',
                    feature.color === 'purple' && 'bg-purple-600/20',
                    feature.color === 'blue' && 'bg-blue-600/20'
                  )}>
                    <feature.icon className={cn(
                      'w-7 h-7',
                      feature.color === 'red' && 'text-red-500',
                      feature.color === 'purple' && 'text-purple-500',
                      feature.color === 'blue' && 'text-blue-500'
                    )} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-950 border-t border-white/5 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">PhotoGallery</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Профессиональная фотогалерея с эксклюзивными работами. Создаем визуальные истории с 2024 года.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-white font-bold mb-4">Навигация</h4>
                <ul className="space-y-2">
                  {['Главная', 'Галерея', 'О нас', 'Контакты'].map((item) => (
                    <li key={item}>
                      <button className="text-gray-400 hover:text-white transition-colors text-sm">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-white font-bold mb-4">Контакты</h4>
                <ul className="space-y-3">
                  <li className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    gallery@example.com
                  </li>
                  <li className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    +7 (999) 123-45-67
                  </li>
                </ul>
                <div className="flex gap-3 mt-6">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <p className="text-gray-500 text-sm">
                © 2024 PhotoGallery. Все права защищены.
              </p>
              <div className="flex gap-6 text-sm">
                <button className="text-gray-500 hover:text-gray-300 transition-colors">
                  Политика конфиденциальности
                </button>
                <button className="text-gray-500 hover:text-gray-300 transition-colors">
                  Условия использования
                </button>
              </div>
            </motion.div>
          </div>
        </footer>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={galleryImages}
            currentIndex={currentImageIndex}
            isOpen={lightboxOpen}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;