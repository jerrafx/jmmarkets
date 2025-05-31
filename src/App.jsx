import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, User, LayoutDashboard, Eye, ChevronDown, Menu, X, DollarSign, Percent, BarChart2, TrendingUp, Settings, PlusCircle, Edit3, Trash2, Image as ImageIcon, LogIn, Moon, Sun, Send, MapPin, Phone, Mail, Home, CalendarDays, Rocket, Target, Award, Building, CheckCircle, XCircle, BookOpen, ShieldCheck, LogOut, Key, ChevronUp, Brain, Youtube as YoutubeIcon, ArrowDownRight, Copyright, Layers, ListChecks, Smile, Meh, Frown, AlertTriangle, UploadCloud, Zap, TrendingDown, Lightbulb, Scale, FileImage, ExternalLink, Handshake, Clock } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setLogLevel } from 'firebase/app';

// Admin PIN en de ID waaronder admin data wordt opgeslagen/gelezen in Firestore
const THE_ADMIN_PIN = "86878"; // Hardgecodeerde PIN
const ADMIN_DATA_OWNER_ID = "XtGudx6G6PMUwPJS3yLXOzPujeM2"; // Vaste ID voor admin data opslag

// Firebase Configuratie
const firebaseConfig = typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : { // Fallback voor lokale ontwikkeling
        apiKey: "AIzaSyCOYo3G-jVzG-ZDmsdjaJchvZXBRUwELBk", // Replace with your actual dev keys if needed
        authDomain: "jmarketsnl.firebaseapp.com", // Replace with your actual dev keys if needed
        projectId: "jmarketsnl", // Replace with your actual dev keys if needed
        storageBucket: "jmarketsnl.firebasestorage.app", // Replace with your actual dev keys if needed
        messagingSenderId: "557370275644", // Replace with your actual dev keys if needed
        appId: "YOUR_APP_ID" // Replace with your actual dev keys if needed
      };
const appId = typeof __app_id !== 'undefined' ? __app_id : 'jmarkets-journal-app-prod'; // Default App ID
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
setLogLevel('debug'); // Firebase logging


// Kleurenpalet
const themes = {
  dark: { bg: 'bg-slate-900', text: 'text-slate-200', cardBg: 'bg-slate-800', cardText: 'text-slate-300', primaryAccent: 'text-blue-400', primaryAccentBg: 'bg-blue-600', primaryAccentHoverBg: 'bg-blue-700', borderColor: 'border-slate-700', inputBg: 'bg-slate-700', inputText: 'text-slate-200', placeholderText: 'text-slate-500', subtleText: 'text-slate-400', subtleBg: 'bg-slate-800', timelineLine: 'border-slate-600', timelineDotBorder: 'border-slate-900', quoteText: 'text-slate-600', adminButtonBg: 'bg-emerald-600', adminButtonHoverBg: 'bg-emerald-700', chartGrid: 'stroke-slate-700', chartAxis: 'fill-slate-400', chartLabel: 'fill-slate-300', chartLine: 'stroke-blue-400', chartPoint: 'fill-blue-400', chartGradientFrom: 'rgba(59, 130, 246, 0.3)', chartGradientTo: 'rgba(59, 130, 246, 0.0)', textPositive: 'text-green-400', textNegative: 'text-red-400', tabActiveBg: 'bg-blue-600', tabInactiveBg: 'bg-slate-700', tabActiveText: 'text-white', tabInactiveText: 'text-slate-300', footerText: 'text-slate-500', filterButtonActiveBg: 'bg-blue-500', filterButtonInactiveBg: 'bg-slate-700', filterButtonActiveText: 'text-white', filterButtonInactiveText: 'text-slate-300', mood: ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'], moodBg: ['bg-red-500/20', 'bg-orange-500/20', 'bg-yellow-500/20', 'bg-lime-500/20', 'bg-green-500/20'], disabledButtonBg: 'bg-slate-700', disabledButtonText: 'text-slate-500' },
  light: { bg: 'bg-slate-50', text: 'text-slate-800', cardBg: 'bg-white', cardText: 'text-slate-700', primaryAccent: 'text-blue-600', primaryAccentBg: 'bg-blue-600', primaryAccentHoverBg: 'bg-blue-700', borderColor: 'border-slate-300', inputBg: 'bg-slate-200', inputText: 'text-slate-800', placeholderText: 'text-slate-400', subtleText: 'text-slate-500', subtleBg: 'bg-slate-100', timelineLine: 'border-slate-300', timelineDotBorder: 'border-slate-50', quoteText: 'text-slate-400', adminButtonBg: 'bg-emerald-500', adminButtonHoverBg: 'bg-emerald-600', chartGrid: 'stroke-slate-300', chartAxis: 'fill-slate-500', chartLabel: 'fill-slate-700', chartLine: 'stroke-blue-600', chartPoint: 'fill-blue-600', chartGradientFrom: 'rgba(37, 99, 235, 0.2)', chartGradientTo: 'rgba(37, 99, 235, 0.0)', textPositive: 'text-green-600', textNegative: 'text-red-600', tabActiveBg: 'bg-blue-600', tabInactiveBg: 'bg-slate-200', tabActiveText: 'text-white', tabInactiveText: 'text-slate-600', footerText: 'text-slate-400', filterButtonActiveBg: 'bg-blue-600', filterButtonInactiveBg: 'bg-slate-200', filterButtonActiveText: 'text-white', filterButtonInactiveText: 'text-slate-600', mood: ['text-red-600', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'], moodBg: ['bg-red-600/20', 'bg-orange-500/20', 'bg-yellow-500/20', 'bg-lime-500/20', 'bg-green-500/20'], disabledButtonBg: 'bg-slate-200', disabledButtonText: 'text-slate-400'}
};

// Nederlandse Trading Quotes
const tradingQuotesNL = [
  "Meer transacties betekent niet meer winst.", "Mentaal > Technisch.", "De trend is je vriend.", "Plan je transactie en handel volgens je plan.", "Beperk je verliezen, laat je winsten lopen.",
  "Riskeer nooit meer dan je je kunt veroorloven te verliezen.", "De markt is een middel om geld over te hevelen van de ongeduldige naar de geduldige.", "Vecht niet tegen de Fed (of de markt).",
  "Discipline is de brug tussen doelen en prestaties.", "Angst en hebzucht zijn je grootste vijanden.", "Accepteer verliezen als onderdeel van het vak.", "Focus op het proces, niet alleen op de uitkomst.",
  "Een goede setup met slechte uitvoering is een verliezende transactie.", "De beste handelaren zijn meesters in risicobeheer.", "Geduld is een schone zaak in trading.", "Over-traden is een veelgemaakte fout.",
  "Houd een trading journaal bij om van je fouten te leren.", "Emotionele stabiliteit is de sleutel tot consistent handelen.", "Begrijp het 'waarom' achter je transacties.", "Stop nooit met leren.",
  "Pas je aan aan veranderende marktomstandigheden.", "Bescherm je kapitaal ten koste van alles.", "Eenvoud presteert vaak beter dan complexiteit.", "Jaag de markt niet na.",
  "Laat de markt naar jou toekomen.", "Consistentie boven grote winsten.", "Risicomanagement is niet optioneel.", "Ken je voordeel (edge).", "Handel wat je ziet, niet wat je denkt.", "De markt is je niets verschuldigd."
];

// Stemming Labels
const moodLabels = {
    1: "Zeer Slecht - Impulsief, geen plan gevolgd.",
    2: "Slecht - Afgeweken van plan, emotioneel.",
    3: "Neutraal - Plan gevolgd, maar ruimte voor verbetering.",
    4: "Goed - Plan goed gevolgd, goede mindset.",
    5: "Zeer Goed - Perfecte uitvoering, top mindset."
};


// --- Componenten ---

const RandomQuotesBackground = ({ count = 3, themeColors }) => {
  // Component to display random trading quotes in the background.
  const [randomQuotes, setRandomQuotes] = useState([]);
  useEffect(() => {
    const selectedQuotes = [];
    const availableQuotes = [...tradingQuotesNL];
    // Define possible positions for the quotes to avoid overlap and ensure variety.
    const possiblePositions = [
      { top: '10%', left: '5%' }, { top: '15%', left: '80%' },
      { top: '75%', left: '10%' }, { top: '80%', left: '75%' },
      { top: '40%', left: '5%' }, { top: '50%', left: '85%' },
    ];
    const shuffledPositions = possiblePositions.sort(() => 0.5 - Math.random()); // Shuffle positions for randomness.

    for (let i = 0; i < count; i++) {
      if (availableQuotes.length === 0 || i >= shuffledPositions.length) break; // Stop if no more quotes or positions.
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      const position = shuffledPositions[i];
      selectedQuotes.push({
        text: availableQuotes.splice(randomIndex, 1)[0], // Select and remove a quote.
        top: position.top,
        left: position.left,
        rotation: `${Math.random() * 10 - 5}deg`, // Random rotation for visual appeal.
        size: `0.75rem` // Fixed size for quotes.
      });
    }
    setRandomQuotes(selectedQuotes);
  }, [count]); // Rerun if count changes.

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0"> {/* Container for quotes, behind other content. */}
      {randomQuotes.map((q, index) => (
        <p
          key={index}
          className={`absolute italic ${themeColors.quoteText} opacity-20 select-none`} // Styling for quotes.
          style={{
            top: q.top,
            left: q.left,
            transform: `translate(-50%, -50%) rotate(${q.rotation})`, // Position and rotate.
            fontSize: q.size,
            maxWidth: '150px', // Limit width to prevent long lines.
            textAlign: 'center',
          }}
        >
          {q.text}
        </p>
      ))}
    </div>
  );
};

const TypingEffect = ({ textParts, speed = 150, themeColors, onTypingComplete }) => {
  // Component to create a typing animation effect for text.
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); // Current character index in the current part.
  const [currentPartIndex, setCurrentPartIndex] = useState(0); // Current part of the text array.
  const [isComplete, setIsComplete] = useState(false); // Flag for when typing is fully complete.
  const hasRunOnceRef = useRef(false); // Ref to ensure animation runs only once if desired.

  useEffect(() => {
    // Stop if animation is complete, no text, or already run once.
    if (isComplete || !textParts || textParts.length === 0 || hasRunOnceRef.current) {
        if (hasRunOnceRef.current && onTypingComplete) {
            onTypingComplete(); // Callback when typing is done.
        }
        return;
    }

    const currentTextToType = textParts[currentPartIndex]?.text || ""; // Text of the current part.

    if (currentIndex < currentTextToType.length) {
      // If not at the end of the current part, type next character.
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + currentTextToType[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer); // Cleanup timer.
    } else {
      // Current part is finished.
      if (currentPartIndex < textParts.length - 1) {
        // Move to the next part.
        setCurrentPartIndex(prev => prev + 1);
        setCurrentIndex(0); // Reset character index for the new part.
      } else {
        // All parts are finished.
        setIsComplete(true);
        hasRunOnceRef.current = true; // Mark as run.
        if (onTypingComplete) onTypingComplete(); // Callback.
      }
    }
  }, [currentIndex, currentPartIndex, speed, textParts, isComplete, onTypingComplete, displayText]);

  // Display full text immediately if animation is complete or has run once.
  const fullTypedText = isComplete || hasRunOnceRef.current ? textParts.map(p => p.text).join('') : displayText;

  return (
    <span>
      {textParts?.map((part, index) => (
        // Apply different color to the first part if specified.
        <span key={index} className={index === 0 ? themeColors.primaryAccent : themeColors.text}>
          {/* Logic to display the correctly typed portion of text with colors */}
          {fullTypedText.startsWith(textParts.slice(0, index + 1).map(p=>p.text).join(''))
            ? fullTypedText.slice(
                textParts.slice(0, index).map(p => p.text).join('').length,
                textParts.slice(0, index + 1).map(p => p.text).join('').length
              )
            : (index < currentPartIndex ? part.text : '') // Show full part if already typed
          }
        </span>
      ))}
      {/* Blinking cursor effect */}
      {!isComplete && !hasRunOnceRef.current && <span className={`border-r-4 ${themeColors.primaryAccent.replace('text-', 'border-')} animate-pulse ml-1`}></span>}
    </span>
  );
};


const LandingPage = ({ onNavigateToDashboard, onNavigateToTimeline, onNavigateToContact, theme, toggleTheme, themeColors, onNavigateToAdminLogin, isAdmin }) => {
  // Main landing page component.
  const brandNameParts = [ { text: "J", colorClass: themeColors.primaryAccent }, { text: "Markets.nl", colorClass: themeColors.text } ];
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false);

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} flex flex-col justify-center items-center p-6 sm:p-8 font-inter relative`}>
      <RandomQuotesBackground count={4} themeColors={themeColors} /> {/* Background quotes */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center space-x-3">
        {/* Theme toggle button */}
        <button onClick={toggleTheme} className={`p-2 rounded-full hover:${themeColors.inputBg} ${themeColors.subtleText} transition-colors`} title="Toggle Thema">
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
      <div className="text-center relative z-10"> {/* Main content area */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4">
          Welkom bij <TypingEffect textParts={brandNameParts} speed={120} themeColors={themeColors} onTypingComplete={() => setTypingAnimationComplete(true)} />
        </h1>
        <p className={`text-lg sm:text-xl md:text-2xl ${themeColors.subtleText} mb-8 sm:mb-10 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto`}>
          De persoonlijke trackrecord van Jeremy Mlynarczyk, uw partner in de wereld van trading.
        </p>
        <div className="flex flex-col items-center space-y-4">
            {/* Navigation buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-xl md:max-w-2xl">
                <button onClick={onNavigateToTimeline} className={`bg-transparent border-2 ${themeColors.primaryAccent.replace('text-','border-')} hover:${themeColors.primaryAccentBg} ${themeColors.primaryAccent} hover:text-white font-semibold py-3 px-6 rounded-lg text-base sm:text-lg transition-colors duration-300 inline-flex items-center justify-center`}> <User size={20} className="mr-2 sm:mr-3" /> Mijn Reis </button>
                <button onClick={onNavigateToDashboard} className={`${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-4 px-8 md:py-5 md:px-10 rounded-lg text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out inline-flex items-center justify-center`}> <Eye size={22} className="mr-2 sm:mr-3" /> Neem een kijkje </button>
                <button onClick={onNavigateToContact} className={`bg-transparent border-2 ${themeColors.primaryAccent.replace('text-','border-')} hover:${themeColors.primaryAccentBg} ${themeColors.primaryAccent} hover:text-white font-semibold py-3 px-6 rounded-lg text-base sm:text-lg transition-colors duration-300 inline-flex items-center justify-center`}> <Send size={20} className="mr-2 sm:mr-3" /> Contact </button>
            </div>
            {/* External links / Coming soon features */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-xl md:max-w-2xl">
                <div className="relative group w-full sm:w-auto">
                    <a href="https://www.youtube.com/@jmarketsnl" target="_blank" rel="noopener noreferrer" className={`bg-transparent border-2 ${themeColors.primaryAccent.replace('text-','border-')} hover:${themeColors.primaryAccentBg} ${themeColors.primaryAccent} hover:text-white font-semibold py-3 px-6 rounded-lg text-base sm:text-lg transition-colors duration-300 inline-flex items-center w-full justify-center`}> <YoutubeIcon size={20} className="mr-2 sm:mr-3" /> Youtube </a>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-max px-2"> {/* Tooltip */}
                        <ArrowDownRight size={16} className={`${themeColors.subtleText} transform -rotate-90 -mr-1`} />
                        <p className={`italic text-xs ${themeColors.subtleText} bg-opacity-50 ${themeColors.cardBg} p-1 rounded-md shadow-md`}>Hier mijn analyses & onderbouwingen!</p>
                    </div>
                </div>
                <div className="relative group w-full sm:w-auto">
                    <button
                        disabled // Disabled button
                        className={`${themeColors.disabledButtonBg} ${themeColors.disabledButtonText} font-semibold py-3 px-6 rounded-lg text-base sm:text-lg inline-flex items-center w-full justify-center cursor-not-allowed`}
                    >
                        <Handshake size={20} className="mr-2 sm:mr-3" /> Partnerschap
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-max px-2"> {/* Tooltip */}
                        <Clock size={14} className={`${themeColors.subtleText} mr-1`} />
                        <p className={`italic text-xs ${themeColors.subtleText} bg-opacity-50 ${themeColors.cardBg} p-1 rounded-md shadow-md`}>Binnenkort beschikbaar!</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      {/* Admin login button, shown if not admin */}
      {!isAdmin && ( <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20"> <button onClick={onNavigateToAdminLogin} className={`text-xs ${themeColors.subtleText} hover:${themeColors.primaryAccent} transition-colors p-2 rounded-md flex items-center`}> <LogIn size={14} className="mr-1"/> Admin Inloggen </button> </div> )}
    </div>
  );
};

const PageHeader = ({ title, onNavigateToDashboard, onNavigateToContact, onToggleTheme, currentTheme, themeColors, showHomeButton = false, onNavigateToHome }) => {
  // Reusable page header component.
  return (
    <div className={`p-3 sm:p-4 ${themeColors.subtleBg} shadow-md flex justify-between items-center sticky top-0 z-40`}>
      {/* Logo/Brand name - clickable to navigate home */}
      <button onClick={onNavigateToHome} className="focus:outline-none">
        <h1 className={`text-xl sm:text-2xl font-bold ${themeColors.primaryAccent}`}>
          J<span className={themeColors.text}>Markets.nl</span>
        </h1>
      </button>
      {/* Navigation icons */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {showHomeButton && onNavigateToHome && title !== "JMarkets.nl" && ( // Show home button if not on landing page.
            <button onClick={onNavigateToHome} title="Home" className={`p-2 rounded-md hover:${themeColors.inputBg} transition-colors ${themeColors.subtleText}`}>
                <Home size={18} sm:size={20} />
            </button>
        )}
        {onNavigateToDashboard && ( <button onClick={onNavigateToDashboard} title="Dashboard Overzicht" className={`p-2 rounded-md hover:${themeColors.inputBg} transition-colors ${themeColors.subtleText}`}> <LayoutDashboard size={18} sm:size={20} /> </button> )}
        {onNavigateToContact && ( <button onClick={onNavigateToContact} title="Contact" className={`p-2 rounded-md hover:${themeColors.inputBg} transition-colors ${themeColors.subtleText}`}> <Send size={18} sm:size={20} /> </button> )}
        <button onClick={onToggleTheme} className={`p-2 rounded-md hover:${themeColors.inputBg} transition-colors ${themeColors.subtleText}`} title="Toggle Thema"> {currentTheme === 'dark' ? <Sun size={18} sm:size={20} /> : <Moon size={18} sm:size={20} />} </button>
      </div>
    </div>
  );
};

const TimelineEvent = ({ year, title, description, icon, themeColors, isLast = false, index, imageUrl, imageAlt }) => {
  // Component for a single event in the timeline.
  const IconComponent = icon; // Dynamically render icon.
  // Alternate alignment for timeline items.
  const alignmentClass = index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row';
  return (
    <div className={`relative group py-12 md:py-16 flex flex-col md:${alignmentClass} items-start`}>
      {/* Timeline connecting line */}
      {!isLast && <div className={`absolute top-0 h-full w-px ${themeColors.timelineLine} group-hover:${themeColors.primaryAccent.replace('text-','border-')} transition-colors duration-300 left-2 md:left-1/2 md:-ml-px md:group-hover:left-1/2 ${index % 2 === 0 ? 'md:right-1/2 md:left-auto md:-mr-px md:group-hover:right-1/2 md:group-hover:left-auto ' : ''}`}></div>}

      {/* Left/Right part of the timeline event (icon, year, title) */}
      <div className={`w-full md:w-1/2 flex mb-8 md:mb-0 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
        <div className={`relative pl-10 md:pl-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
          {/* Timeline dot */}
          <div className={`absolute top-1 -left-0 md:left-auto w-5 h-5 rounded-full ${themeColors.primaryAccentBg} border-4 ${themeColors.timelineDotBorder} z-10 md:${index % 2 === 0 ? '-right-2.5' : '-left-2.5'} md:top-1/2 md:-mt-2.5 group-hover:scale-125 transition-transform duration-300`}></div>
          <div className={`p-6 sm:p-8 rounded-xl ${themeColors.cardBg} shadow-2xl w-full max-w-md text-left md:${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
            {IconComponent && <IconComponent size={40} sm:size={48} className={`${themeColors.primaryAccent} mb-3 sm:mb-4 mr-auto md:${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`} />}
            <h3 className={`text-2xl sm:text-3xl font-bold ${themeColors.primaryAccent}`}>{year}</h3>
            <h4 className={`text-xl sm:text-2xl font-semibold mt-1 sm:mt-2 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
          </div>
        </div>
      </div>

      {/* Right/Left part of the timeline event (description, image) */}
      <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
         <div className={`md:max-w-md p-6 sm:p-8 rounded-xl ${themeColors.subtleBg} shadow-lg pl-10 md:pl-8 ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}>
            <p className={`text-base sm:text-lg leading-relaxed ${themeColors.cardText}`}>{description}</p>
            {imageUrl && ( // Display image if URL is provided.
                <div className="mt-4">
                    <img src={imageUrl} alt={imageAlt || title} className="rounded-lg shadow-md max-w-full h-auto border ${themeColors.borderColor}" />
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

const MyJourneyTimelinePage = ({ onBackToHome, onNavigateToDashboard, onNavigateToContact, theme, toggleTheme, themeColors }) => {
  // Page displaying the personal journey timeline.
  const [scrollLinePath, setScrollLinePath] = useState("M 50 0 V 0"); // SVG path for the scroll-animated line.
  const svgRef = useRef(null); // Ref for the SVG element.
  const journeyContainerRef = useRef(null); // Ref for the scrollable container.

  useEffect(() => {
    // Effect to handle scroll animation for the timeline line.
    const container = journeyContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (svgRef.current) {
        const containerScrollTop = container.scrollTop;
        const containerScrollHeight = container.scrollHeight - container.clientHeight;
        const scrollPercentage = containerScrollHeight > 0 ? (containerScrollTop / containerScrollHeight) * 100 : 0;

        const svgHeight = svgRef.current.clientHeight;
        let lineEndY = (scrollPercentage / 100) * svgHeight;
        // Add some subtle variations to the line path for a more organic feel.
        const variations = Math.sin(scrollPercentage * 0.1) * 10 + Math.cos(scrollPercentage * 0.05) * 5;
        lineEndY += variations;
        lineEndY = Math.max(0, Math.min(svgHeight, lineEndY)); // Clamp within SVG bounds.
        // Update SVG path string to draw a quadratic Bezier curve.
        setScrollLinePath(`M 50 0 Q 50 ${lineEndY/2}, ${50 + Math.sin(scrollPercentage * 0.2) * 15} ${lineEndY}`);
      }
    };
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set line position.
    return () => container.removeEventListener('scroll', handleScroll); // Cleanup.
  }, []);

  // Data for timeline events.
  const timelineData = [
    { year: "2020", title: "De Vonk: Trading Ontdekt", description: "Het begon allemaal als 15-jarige, midden in de COVID-19 pandemie. De wereld stond stil, en uit pure verveling (en een gezonde dosis nieuwsgierigheid) dook ik in de wereld van online business modellen. Trading sprong eruit – de dynamiek, de grafieken, de potentie. Het was alsof er een nieuwe wereld voor me openging, een uitdaging die ik direct met beide handen aangreep. De eerste YouTube video's over 'day trading' en 'forex' voelden als een openbaring.", icon: Zap },
    { year: "Begin 2021", title: "Eerste Stappen & Strategieën", description: "De initiële fase was een duik in het diepe: boeken, video's, cursussen. Ik experimenteerde met alles wat los en vast zat op demo-accounts. Van simpele support/resistance tot ingewikkelde indicatoren – het was een ontdekkingsreis vol 'aha!' momenten en, eerlijk is eerlijk, de nodige beginnersfouten. Elke fout was een les, elke kleine winst een motivatie om dieper te graven.", icon: BookOpen },
    { year: "Medio 2021", title: "De Harde Les: Realiteit van Verlies", description: "Toen kwam de onvermijdelijke klap: de eerste echte verliezen op een live account. Dit was mentaal zwaar, een echte test van mijn doorzettingsvermogen. Het dwong me om de psychologische kant van trading serieus te nemen en het cruciale belang van risicomanagement te omarmen. Een les die pijnlijk was, maar goud waard. Het besef daalde in dat trading geen 'snel rijk' schema is.", icon: TrendingDown },
    { year: "2022", title: "Verfijning & Specialisatie", description: "Gewapend met nieuwe inzichten en een gezonde dosis realisme begon ik mijn aanpak te verfijnen. Ik focuste me op het ontwikkelen van een persoonlijke 'edge', een strategie die resoneerde met mijn persoonlijkheid en marktanalyse. Dit betekende uren backtesten, data analyseren en me specialiseren in specifieke markten, met name de NASDAQ (NQ & MNQ futures). Kwaliteit boven kwantiteit werd het motto.", icon: Settings },
    { year: "2023", title: "De Weg naar Consistentie", description: "Dit jaar stond in het teken van discipline en het bouwen aan routine. Vallen en opstaan, maar met een duidelijke opwaartse trend in mijn begrip en resultaten. Een strikt tradingplan, inclusief pre-market analyse en post-market review, en een gedetailleerd journaal werden mijn onmisbare tools. De focus verschoof van 'geld verdienen' naar 'het proces perfect uitvoeren'.", icon: Scale },
    { year: "Eind 2024", title: "Doorbraak: Duurzame Winstgevendheid", description: "Het moment waarop alle puzzelstukjes op hun plaats vielen. Na jaren van toewijding, analyse en constante aanpassing, bereikte ik een stabiele, duurzame winstgevendheid. Het was het bewijs dat een gedisciplineerde aanpak, een solide strategie en een onwrikbare mindset de sleutels tot succes zijn in deze uitdagende wereld.", icon: Award },
    { year: "Begin 2025", title: "Eerste Funded Account!", description: "Mijn eerste échte funded account! Een enorme mijlpaal en het tastbare bewijs dat hard werken, discipline en een solide strategie lonen. Ontzettend trots op dit resultaat en dit gaf de brandstof voor de volgende stap: het delen van mijn kennis.", imageUrl: "https://i.postimg.cc/8kqHrb1k/Certificate-for-Jeremy-Mlynarczyk.png", imageAlt: "Funded Account Certificaat", icon: CheckCircle },
    { year: "Medio 2025 - Heden", title: "Oprichting JMarkets.nl", description: "Met een solide trackrecord en een brandende passie om mijn reis en lessen te delen, is JMarkets.nl geboren. Mijn missie? Andere traders inspireren, begeleiden en voorzien van transparante, eerlijke inzichten. Dit platform is een weerspiegeling van die missie – een plek voor groei, leren en community.", icon: Building }
  ];
  const jeremyImageUrl = "https://i.postimg.cc/7PSx7WK6/temp-Imagebb-Rt-Yq.avif"; // Profile image.

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-inter flex flex-col`}>
      <PageHeader title="Mijn Reis als Trader" onNavigateToDashboard={onNavigateToDashboard} onNavigateToContact={onNavigateToContact} onToggleTheme={toggleTheme} currentTheme={theme} themeColors={themeColors} showHomeButton={true} onNavigateToHome={onBackToHome} />
      <div ref={journeyContainerRef} className="flex-grow overflow-y-auto journey-container relative"> {/* Scrollable container */}
        <RandomQuotesBackground count={4} themeColors={themeColors} />
        {/* Animated SVG line */}
        <svg ref={svgRef} className="absolute top-0 left-0 h-full w-10 md:w-16 pointer-events-none z-0 opacity-30" preserveAspectRatio="none"> <path d={scrollLinePath} stroke={themeColors.primaryAccent.replace('text-','')} strokeWidth="2" fill="none" /> </svg>

        <div className="container mx-auto max-w-4xl p-4 md:p-8 relative z-10"> {/* Content container */}
          <div className="text-center mb-10 md:mb-16">
            <img src={jeremyImageUrl} alt="Jeremy Mlynarczyk - JMarkets.nl" className="mx-auto mb-6 rounded-full w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover border-4 border-blue-500 shadow-xl" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/${themeColors.cardBg.substring(3)}/${themeColors.text.substring(5)}?text=JM`;}} /> {/* Placeholder on error */}
            <p className={`text-base sm:text-lg ${themeColors.subtleText}`}>Een chronologisch overzicht van mijn ontwikkeling en de oprichting van JMarkets.nl.</p>
          </div>
          <div className="relative"> {timelineData.map((event, index) => ( <TimelineEvent key={event.year + '-' + index} {...event} themeColors={themeColors} isLast={index === timelineData.length - 1} index={index} /> ))} </div>
          <div className="text-center mt-10 md:mt-16 pb-10"> <button onClick={onBackToHome} className={`${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}> Terug naar Home </button> </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = ({ onBackToHome, onNavigateToDashboard, theme, toggleTheme, themeColors }) => {
  // Page for contact information and form.
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false); // State for form submission feedback.
  const [feedbackMessage, setFeedbackMessage] = useState('');


  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct mailto link for sending an email.
    const subject = encodeURIComponent(`Bericht van ${formData.name} via JMarkets.nl`);
    const body = encodeURIComponent(
        `Naam: ${formData.name}\nEmail: ${formData.email}\n\nBericht:\n${formData.message}`
    );
    window.location.href = `mailto:info@jmarkets.nl?subject=${subject}&body=${body}`; // Opens default email client.

    setFeedbackMessage("Bedankt voor uw bericht! Open uw e-mailprogramma om het te verzenden.");
    setIsSubmitted(true);
  };

  const inputClass = `w-full p-3 rounded-md ${themeColors.inputBg} ${themeColors.inputText} ${themeColors.borderColor} border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`;
  const labelClass = `block text-sm font-medium mb-1 ${themeColors.subtleText}`;

  return ( <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-inter`}> <PageHeader title="Neem Contact Op" onNavigateToDashboard={onNavigateToDashboard} onToggleTheme={toggleTheme} currentTheme={theme} themeColors={themeColors} showHomeButton={true} onNavigateToHome={onBackToHome} /> <div className="flex flex-col justify-center items-center p-4 md:p-8"> <div className={`w-full max-w-3xl ${themeColors.cardBg} p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl`}> {/* Contact info and Calendly link */} <div className="grid md:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 mb-8 sm:mb-10"> <div> <h2 className={`text-lg sm:text-xl font-semibold mb-3 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Contactinformatie</h2> <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base"> <li className="flex items-center"><Mail size={18} sm:size={20} className={`${themeColors.primaryAccent} mr-2 sm:mr-3`}/> info@jmarkets.nl</li> <li className="flex items-center"><Phone size={18} sm:size={20} className={`${themeColors.primaryAccent} mr-2 sm:mr-3`}/> +31 6 13797726</li> <li className="flex items-center"><MapPin size={18} sm:size={20} className={`${themeColors.primaryAccent} mr-2 sm:mr-3`}/> Nederland, Groningen, Opsplitting 19 Stadskanaal</li> </ul> </div> <div> <h2 className={`text-lg sm:text-xl font-semibold mb-3 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Plan een Gesprek</h2> <p className={`${themeColors.cardText} mb-3 text-sm sm:text-base`}>Interesse in een persoonlijke kennismaking? Plan direct een gratis 30-minuten gesprek.</p> <a href="https://calendly.com/jeremy-mlynarczyk/30min" target="_blank" rel="noopener noreferrer" className={`${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg inline-flex items-center text-sm sm:text-md transition-colors`}> <CalendarDays size={18} sm:size={20} className="mr-2"/> Plan een Call </a> </div> </div> {/* Contact form or submission feedback */} {isSubmitted ? ( <div className={`text-center p-3 sm:p-4 rounded-md ${themeColors.primaryAccentBg.replace('bg-','bg-opacity-20')} ${themeColors.primaryAccent} text-sm sm:text-base`}> {feedbackMessage} </div> ) : ( <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 border-t ${themeColors.borderColor} pt-6 sm:pt-8"> <h2 className={`text-lg sm:text-xl font-semibold mb-1 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Stuur een Bericht</h2> <div> <label htmlFor="name" className={labelClass}>Naam</label> <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Uw naam" required /> </div> <div> <label htmlFor="email" className={labelClass}>Email</label> <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="uw@email.com" required /> </div> <div> <label htmlFor="message" className={labelClass}>Bericht</label> <textarea name="message" id="message" rows="3" className={inputClass} placeholder="Uw bericht..." required value={formData.message} onChange={handleChange}></textarea> </div> <button type="submit" className={`${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-3 px-6 rounded-lg w-full text-base sm:text-lg transition-colors`}> Verstuur Bericht </button> </form> )} <button onClick={onBackToHome} className={`mt-6 sm:mt-8 w-full bg-transparent border-2 ${themeColors.primaryAccent.replace('text-','border-')} hover:${themeColors.primaryAccentBg} ${themeColors.primaryAccent} hover:text-white font-semibold py-3 px-6 rounded-lg text-base sm:text-lg transition-colors`}> Terug naar Home </button> </div> </div> </div> );};

const MoodSmiley = ({ moodValue, themeColors, size = 18 }) => {
    // Component to display a smiley icon based on mood value.
    const moodConfig = [ // Configuration for different moods.
        { icon: Frown, color: themeColors.mood[0], label: moodLabels[1] },
        { icon: Frown, color: themeColors.mood[1], label: moodLabels[2] },
        { icon: Meh, color: themeColors.mood[2], label: moodLabels[3] },
        { icon: Smile, color: themeColors.mood[3], label: moodLabels[4] },
        { icon: Smile, color: themeColors.mood[4], label: moodLabels[5] }
    ];
    const currentMood = moodValue && moodValue >=1 && moodValue <=5 ? moodConfig[moodValue - 1] : null; // Get current mood config.

    if (!currentMood) { // Fallback if mood value is invalid.
        return <span className={`text-xs ${themeColors.subtleText}`}>Kies stemming</span>;
    }
    const IconComponent = currentMood.icon;

    return (
        <div className="flex items-center" title={`Stemming: ${currentMood.label}`}> {/* Tooltip with mood label */}
            <IconComponent className={`${currentMood.color}`} size={size} />
        </div>
    );
};

const AdminTradeInputForm = ({ themeColors, userId, accounts }) => {
  // Form for admin to input new trades.
  const [pair, setPair] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today.
  const [tradeTime, setTradeTime] = useState(new Date().toTimeString().slice(0,5)); // Default to current time.
  const [riskAmount, setRiskAmount] = useState('');
  const [rr, setRr] = useState(''); // Risk/Reward Ratio.
  const [outcome, setOutcome] = useState('win'); // 'win' or 'loss'.
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // TradingView chart image URL.
  const [imageUrlOptional, setImageUrlOptional] = useState(''); // Optional image (e.g., order proof).
  const [reasoning, setReasoning] = useState(''); // Trade reasoning/notes.
  const [mood, setMood] = useState(null); // Trader's mood during the trade.
  const [feedback, setFeedback] = useState(''); // Feedback message for user.
  const [optionalImageFile, setOptionalImageFile] = useState(null); // State for the uploaded file.
  const [uploading, setUploading] = useState(false); // Uploading state.
  const fileInputRef = useRef(null); // Ref for file input to reset it.

  const handleFileChange = async (event) => {
    // Handles optional image file upload.
    const file = event.target.files[0];
    // Only allow upload if logged in as admin (via PIN, so userId will be ADMIN_DATA_OWNER_ID).
    if (file && userId && userId === ADMIN_DATA_OWNER_ID) {
        setOptionalImageFile(file);
        setUploading(true);
        setFeedback('Afbeelding uploaden...');
        // Construct file path in Firebase Storage.
        const filePath = `artifacts/${appId}/users/${ADMIN_DATA_OWNER_ID}/tradeImages/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen to upload progress and completion/error.
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setFeedback(`Uploaden: ${Math.round(progress)}%`);
            },
            (error) => {
                console.error("Upload fout:", error);
                setFeedback("Fout bij uploaden afbeelding.");
                setUploading(false);
                setOptionalImageFile(null);
                if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input.
            },
            () => {
                // On successful upload, get download URL and update state.
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('Bestand beschikbaar op', downloadURL);
                    setImageUrlOptional(downloadURL);
                    setFeedback('Afbeelding succesvol geüpload!');
                    setUploading(false);
                });
            }
        );
    } else {
        setFeedback("Fout: Admin rechten vereist voor file upload.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure admin rights (userId prop will be ADMIN_DATA_OWNER_ID if admin is logged in via PIN).
    if (userId !== ADMIN_DATA_OWNER_ID) {
        setFeedback("Fout: Geen admin rechten om trades toe te voegen.");
        return;
    }
    // Validations.
    if (!selectedAccountId) { setFeedback("Selecteer een account."); return; }
    if (!mood) { setFeedback("Selecteer een stemming voor de trade."); return; }
    const risk = parseFloat(riskAmount);
    const rewardRatio = parseFloat(rr);
    if (isNaN(risk) || isNaN(rewardRatio) || risk <= 0) { setFeedback("Ongeldige invoer voor risico of RR."); return; }
    let pnl = outcome === 'win' ? risk * rewardRatio : -risk; // Calculate P&L.

    // Construct trade object.
    const newTrade = {
        userId: ADMIN_DATA_OWNER_ID, // Always store under the admin's data ID.
        accountId: selectedAccountId,
        pair,
        date: Timestamp.fromDate(new Date(`${date}T${tradeTime || '00:00'}`)), // Combine date and time.
        tradeTime: tradeTime || null,
        riskAmount: risk,
        rr: rewardRatio,
        outcome,
        pnl,
        imageUrl,
        imageUrlOptional,
        reasoning,
        mood,
        createdAt: serverTimestamp() // Firestore server timestamp.
    };
    try {
      // Add trade to Firestore.
      const tradesCollectionPath = `/artifacts/${appId}/users/${ADMIN_DATA_OWNER_ID}/trades`;
      await addDoc(collection(db, tradesCollectionPath), newTrade);
      setFeedback("Trade succesvol toegevoegd!");
      // Reset form fields.
      setPair(''); setDate(new Date().toISOString().split('T')[0]); setTradeTime(new Date().toTimeString().slice(0,5)); setRiskAmount(''); setRr(''); setOutcome('win'); setSelectedAccountId(''); setImageUrl(''); setImageUrlOptional(''); setReasoning(''); setMood(null); setOptionalImageFile(null);
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input.
      setTimeout(() => setFeedback(''), 3000); // Clear feedback after 3s.
    } catch (error) { console.error("Fout bij toevoegen trade: ", error); setFeedback("Fout bij toevoegen trade. Controleer Firestore regels en console."); }
  };
  // Common styling classes for inputs and labels.
  const inputClass = `w-full p-3 rounded-md ${themeColors.inputBg} ${themeColors.inputText} ${themeColors.borderColor} border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`;
  const labelClass = `block text-sm font-medium mb-1 ${themeColors.subtleText}`;

  return (
    <div className={`${themeColors.cardBg} p-6 rounded-xl shadow-lg`}>
      <h3 className={`text-xl font-semibold mb-6 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Nieuwe Trade Toevoegen</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pair input with quick select buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0"><label htmlFor="pair" className={labelClass}>Handelspaar (bijv. EURUSD)</label><input type="text" id="pair" value={pair} onChange={e => setPair(e.target.value)} className={inputClass} required /></div>
            <div className="flex space-x-2 items-end">
                <button type="button" onClick={() => setPair('MNQ')} className={`px-3 py-2 text-xs rounded-md ${themeColors.inputBg} ${themeColors.inputText} hover:opacity-80`}>MNQ</button>
                <button type="button" onClick={() => setPair('NQ')} className={`px-3 py-2 text-xs rounded-md ${themeColors.inputBg} ${themeColors.inputText} hover:opacity-80`}>NQ</button>
            </div>
        </div>
        {/* Date and Time inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label htmlFor="date" className={labelClass}>Datum</label><input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} required /></div>
            <div><label htmlFor="tradeTime" className={labelClass}>Tijd</label><input type="time" id="tradeTime" value={tradeTime} onChange={e => setTradeTime(e.target.value)} className={inputClass} /></div>
        </div>
        {/* Risk Amount, RR, Outcome, Account */}
        <div><label htmlFor="riskAmount" className={labelClass}>Risico in $</label><input type="number" step="0.01" id="riskAmount" value={riskAmount} onChange={e => setRiskAmount(e.target.value)} className={inputClass} placeholder="bijv. 100" required /></div>
        <div><label htmlFor="rr" className={labelClass}>Behaalde Risk/Reward Ratio (RR)</label><input type="number" step="0.01" id="rr" value={rr} onChange={e => setRr(e.target.value)} className={inputClass} placeholder="bijv. 2.5" required /></div>
        <div> <label className={labelClass}>Uitkomst</label> <select id="outcome" value={outcome} onChange={e => setOutcome(e.target.value)} className={inputClass}> <option key="outcome-win" value="win">Winst</option> <option key="outcome-loss" value="loss">Verlies</option> </select> </div>
        <div> <label htmlFor="account" className={labelClass}>Account</label> <select id="account" value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className={inputClass} required> <option key="select-account-placeholder" value="">Selecteer Account</option> {accounts.map((acc, index) => { if (!acc || typeof acc.id !== 'string' || acc.id.trim() === '') { console.warn("AdminTradeInputForm: Ongeldig account of account ID bij index", index, acc); return null; } return <option key={`${acc.id}-${index}`} value={acc.id}>{acc.name}</option>; })} </select> </div>
        {/* Image URLs and Reasoning */}
        <div><label htmlFor="imageUrl" className={labelClass}>Image URL (TradingView)</label><input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inputClass} placeholder="https://www.tradingview.com/chart/..." /></div>
        {/* Optional Image Upload */}
        <div>
            <label htmlFor="imageUrlOptionalFile" className={labelClass}>Optionele Afbeelding (bijv. Order Bewijs)</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${themeColors.borderColor} border-dashed rounded-md`}>
                <div className="space-y-1 text-center">
                    <UploadCloud className={`mx-auto h-12 w-12 ${themeColors.subtleText}`} />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="imageUrlOptionalFile" className={`relative cursor-pointer ${themeColors.cardBg} rounded-md font-medium ${themeColors.primaryAccent} hover:text-opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}>
                            <span>Upload een bestand</span>
                            <input id="imageUrlOptionalFile" name="imageUrlOptionalFile" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                        </label>
                    </div>
                    <p className={`text-xs ${themeColors.subtleText}`}>PNG, JPG, GIF tot 10MB</p>
                    {optionalImageFile && !uploading && <p className={`text-xs ${themeColors.primaryAccent} mt-1`}>Geselecteerd: {optionalImageFile.name}</p>}
                    {uploading && <p className={`text-xs ${themeColors.primaryAccent} mt-1 animate-pulse`}>Uploaden...</p>}
                </div>
            </div>
        </div>
        <div><label htmlFor="reasoning" className={labelClass}>Onderbouwing</label><textarea id="reasoning" rows="4" value={reasoning} onChange={e => setReasoning(e.target.value)} className={inputClass} placeholder="Denkgedachte, analyse..."></textarea></div>
        {/* Mood selection */}
        <div> <label className={labelClass}>Stemming (verplicht)</label> <div className="flex space-x-2 mt-1"> {[1, 2, 3, 4, 5].map(value => { const moodConfig = [ { icon: Frown, color: themeColors.mood[0], bgColor: themeColors.moodBg[0] }, { icon: Frown, color: themeColors.mood[1], bgColor: themeColors.moodBg[1] }, { icon: Meh, color: themeColors.mood[2], bgColor: themeColors.moodBg[2] }, { icon: Smile, color: themeColors.mood[3], bgColor: themeColors.moodBg[3] }, { icon: Smile, color: themeColors.mood[4], bgColor: themeColors.moodBg[4] }]; const Icon = moodConfig[value-1].icon; return ( <button key={value} type="button" onClick={() => setMood(value)} className={`p-2 rounded-full transition-all duration-150 ${mood === value ? `${moodConfig[value-1].bgColor} ring-2 ${moodConfig[value-1].color.replace('text-','ring-')}` : `${themeColors.inputBg} hover:opacity-70`}`}> <Icon className={`${moodConfig[value-1].color}`} size={24} /> </button> ); })} </div> </div>
        {/* Submit button and feedback */}
        <button type="submit" disabled={uploading} className={`${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-3 px-6 rounded-lg w-full text-lg transition-colors disabled:opacity-50`}> {uploading ? 'Bezig met uploaden...' : 'Trade Opslaan'} </button>
        {feedback && <p className={`mt-4 text-sm ${feedback.includes("succesvol") ? themeColors.primaryAccent : 'text-red-500'}`}>{feedback}</p>}
      </form>
    </div> );
};

const AdminAccountManagement = ({ themeColors, userId, onAccountAdded, accounts: initialAccounts, setAccounts: updateParentAccounts }) => {
  // Component for admin to add and manage trading accounts.
  const [accountName, setAccountName] = useState('');
  const [startKapitaal, setStartKapitaal] = useState(''); // Starting capital.
  const [accountStatus, setAccountStatus] = useState('active'); // 'active' or 'inactive'.
  const [feedback, setFeedback] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation.
  const [accountToDelete, setAccountToDelete] = useState(null); // Account targeted for deletion.
  const [localAccounts, setLocalAccounts] = useState(initialAccounts || []); // Local copy of accounts for display.

  useEffect(() => {
    setLocalAccounts(initialAccounts || []); // Sync with parent accounts prop.
  }, [initialAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure admin rights.
    if (userId !== ADMIN_DATA_OWNER_ID) { setFeedback("Fout: Geen admin rechten om accounts toe te voegen."); return; }
    // Validations.
    if (!accountName.trim()) { setFeedback("Account naam mag niet leeg zijn."); return; }
    const kapitaalNum = parseFloat(startKapitaal);
    if (isNaN(kapitaalNum) || kapitaalNum < 0) { setFeedback("Ongeldig startkapitaal ingevoerd."); return; }

    // New account object.
    const newAccount = { userId: ADMIN_DATA_OWNER_ID, name: accountName, startKapitaal: kapitaalNum, status: accountStatus, createdAt: serverTimestamp() };
    try {
      // Add to Firestore.
      const accountsCollectionPath = `/artifacts/${appId}/users/${ADMIN_DATA_OWNER_ID}/accounts`;
      const docRef = await addDoc(collection(db, accountsCollectionPath), newAccount);
      setFeedback(`Account "${accountName}" succesvol toegevoegd!`);
      const addedAccount = { id: docRef.id, ...newAccount };
      if(onAccountAdded) onAccountAdded(addedAccount); // Callback to update parent state.
      setLocalAccounts(prev => [...prev, addedAccount]); // Update local display.
      // Reset form.
      setAccountName(''); setStartKapitaal(''); setAccountStatus('active');
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) { console.error("Fout bij toevoegen account: ", error); setFeedback("Fout bij toevoegen account. Controleer Firestore regels en console."); }
  };

  const handleDeleteAttempt = (account) => { // Show delete confirmation modal.
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => { // Actual deletion logic.
    if (!accountToDelete || userId !== ADMIN_DATA_OWNER_ID) return;
    try {
      const accountDocRef = doc(db, `/artifacts/${appId}/users/${ADMIN_DATA_OWNER_ID}/accounts`, accountToDelete.id);
      await deleteDoc(accountDocRef);
      // Update parent or local state to remove the account from display.
      if (updateParentAccounts) {
        updateParentAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountToDelete.id));
      } else {
        setLocalAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountToDelete.id));
      }
      setFeedback(`Account "${accountToDelete.name}" succesvol verwijderd.`);
      setShowDeleteModal(false); setAccountToDelete(null);
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) { console.error("Fout bij verwijderen account:", error); setFeedback("Fout bij verwijderen account."); setShowDeleteModal(false); setAccountToDelete(null); }
  };

  const inputClass = `w-full p-3 rounded-md ${themeColors.inputBg} ${themeColors.inputText} ${themeColors.borderColor} border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`;
  const labelClass = `block text-sm font-medium mb-1 ${themeColors.subtleText}`;

  return (
    <>
      {/* Form to add new account */}
      <div className={`${themeColors.cardBg} p-6 rounded-xl shadow-lg mt-8`}>
        <h3 className={`text-xl font-semibold mb-6 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Account Toevoegen/Beheren</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="accountName" className={labelClass}>Account Naam</label><input type="text" id="accountName" value={accountName} onChange={e => setAccountName(e.target.value)} className={inputClass} placeholder="bijv. Persoonlijk EUR" required /></div>
          <div><label htmlFor="startKapitaal" className={labelClass}>Startkapitaal in $</label><input type="number" step="0.01" id="startKapitaal" value={startKapitaal} onChange={e => setStartKapitaal(e.target.value)} className={inputClass} placeholder="bijv. 10000" required /></div>
          <div> <label htmlFor="accountStatus" className={labelClass}>Status</label> <select id="accountStatus" value={accountStatus} onChange={e => setAccountStatus(e.target.value)} className={inputClass}> <option key="status-active" value="active">Actief</option> <option key="status-inactive" value="inactive">Inactief</option> </select> </div>
          <button type="submit" className={`${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-3 px-6 rounded-lg w-full text-lg transition-colors`}>Account Opslaan</button>
          {feedback && <p className={`mt-4 text-sm ${feedback.includes("succesvol") ? themeColors.primaryAccent : 'text-red-500'}`}>{feedback}</p>}
        </form>
      </div>
      {/* List of existing accounts */}
      {localAccounts && localAccounts.length > 0 && (
        <div className={`${themeColors.cardBg} p-6 rounded-xl shadow-lg mt-8`}>
          <h4 className={`text-lg font-semibold mb-4 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Bestaande Accounts</h4>
          <ul className="space-y-2">
            {localAccounts.map((acc, index) => (
              <li key={`${acc.id}-${index}`} className={`flex justify-between items-center p-3 rounded-md ${themeColors.subtleBg}`}>
                <div>
                  <p className={themeColors.cardText}>{acc.name}</p>
                  <p className={`text-xs ${themeColors.subtleText}`}>Start: ${(acc.startKapitaal || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})} | Aangemaakt: {acc.createdAt && typeof acc.createdAt.toDate === 'function' ? acc.createdAt.toDate().toLocaleDateString('nl-NL') : 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${acc.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>{acc.status}</span>
                  <button onClick={() => handleDeleteAttempt(acc)} className="p-1 text-red-500 hover:text-red-400 transition-colors"> <Trash2 size={18}/> </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Delete confirmation modal */}
      {showDeleteModal && accountToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${themeColors.cardBg} p-6 rounded-lg shadow-xl max-w-sm w-full`}>
            <div className="flex items-center mb-4"> <AlertTriangle size={24} className="text-red-500 mr-3"/> <h4 className={`text-lg font-semibold ${themeColors.text}`}>Account Verwijderen</h4> </div>
            <p className={`${themeColors.cardText} text-sm mb-6`}> Weet u zeker dat u het account "{accountToDelete.name}" wilt verwijderen? Alle bijbehorende trades blijven bestaan maar zijn niet meer gekoppeld. Deze actie kan niet ongedaan worden gemaakt. </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setShowDeleteModal(false); setAccountToDelete(null); }} className={`px-4 py-2 text-sm rounded-md ${themeColors.inputBg} ${themeColors.inputText} hover:opacity-80 transition-opacity`} > Annuleren </button>
              <button onClick={confirmDeleteAccount} className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors" > Verwijder </button>
            </div>
          </div>
        </div>
      )}
    </>
  );};

const UserAccountStatusList = ({ themeColors, userId, allTrades, onSelectAccountTrades }) => {
  // Component to display account status for users (reads from ADMIN_DATA_OWNER_ID for public view).
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAccountId, setExpandedAccountId] = useState(null); // Track expanded account details.

  useEffect(() => {
    // Data for public view is always fetched from ADMIN_DATA_OWNER_ID.
    const dataViewerId = ADMIN_DATA_OWNER_ID;
    if (!dataViewerId) { // Should not happen if ADMIN_DATA_OWNER_ID is defined.
        setLoading(false);
        setAccounts([]);
        return;
    }
    const accountsCollectionPath = `/artifacts/${appId}/users/${dataViewerId}/accounts`;
    const q = query(collection(db, accountsCollectionPath));
    const unsubscribe = onSnapshot(q, (querySnapshot) => { // Real-time listener for accounts.
        const accs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccounts(accs);
        setLoading(false);
    }, (error) => {
        console.error("Fout bij ophalen accounts (UserAccountStatusList): ", error);
        setLoading(false);
        setAccounts([]);
    });
    return () => unsubscribe(); // Cleanup listener.
  }, []); // No dependency on `userId` prop, as it always shows admin's data for public.

  const toggleDetails = (accountId) => { setExpandedAccountId(prevId => (prevId === accountId ? null : accountId)); };

  const getAccountDetails = (account) => {
    // Calculate P&L and other details for an account based on allTrades.
    const tradesForAccount = allTrades.filter(trade => trade.accountId === account.id);
    const totalPnlForAccount = tradesForAccount.reduce((sum, trade) => sum + trade.pnl, 0);
    const currentBalance = (account.startKapitaal || 0) + totalPnlForAccount;
    const pnlSinceStart = currentBalance - (account.startKapitaal || 0);
    return { tradeCount: tradesForAccount.length, totalPnl: totalPnlForAccount, currentBalance: currentBalance, pnlSinceStart: pnlSinceStart };
  };

  if (loading) return <p className={`${themeColors.subtleText} text-center py-4`}>Account status laden...</p>;
  if (accounts.length === 0) return <p className={`${themeColors.subtleText} text-center py-4`}>Nog geen accounts beschikbaar.</p>;

  return (
    <div className={`${themeColors.cardBg} p-4 sm:p-6 rounded-xl shadow-lg mt-8`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Account Status <em className={`text-xs ${themeColors.subtleText} opacity-75`}>Hier kan u ook bij staan!</em></h3>
      <ul className="space-y-3">
        {accounts.map((acc, index) => {
          if (!acc || typeof acc.id !== 'string' || acc.id.trim() === '') { console.warn("UserAccountStatusList: Ongeldig account of account ID", acc); return null;}
          const details = getAccountDetails(acc);
          return (
            <li key={`${acc.id}-${index}`} className={`${themeColors.subtleBg} rounded-md overflow-hidden`}>
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 `}>
                <div className="flex-grow mb-2 sm:mb-0">
                  <span className={`${themeColors.cardText} font-semibold`}>{acc.name}</span>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs mt-1">
                    <span className={`${themeColors.subtleText} mr-2 mb-1 sm:mb-0`}>Huidig: {details.currentBalance.toLocaleString('nl-NL', { style: 'currency', currency: 'USD' })}</span>
                    <span className={`${details.pnlSinceStart >= 0 ? themeColors.textPositive : themeColors.textNegative}`}> {details.pnlSinceStart >= 0 ? '+' : ''}{details.pnlSinceStart.toLocaleString('nl-NL', { style: 'currency', currency: 'USD' })} </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 self-start sm:self-center">
                  <span className={`text-xs ${themeColors.subtleText} mr-2`}>Trades: {details.tradeCount}</span>
                  {/* Button to filter trades by this account in the TradeList component */}
                  <button onClick={() => onSelectAccountTrades(acc.id)} className={`px-2 py-1 text-xs rounded-md ${themeColors.filterButtonInactiveBg} ${themeColors.filterButtonInactiveText} hover:opacity-80 transition-colors`} > Bekijk </button>
                  <button onClick={() => toggleDetails(acc.id)} className={`${themeColors.primaryAccent} hover:opacity-75 p-1 rounded`}> {expandedAccountId === acc.id ? <ChevronUp size={16} sm:size={18}/> : <ChevronDown size={16} sm:size={18}/>} </button>
                </div>
              </div>
              {/* Expanded details view */}
              {expandedAccountId === acc.id && (
                <div className={`p-3 border-t ${themeColors.borderColor} bg-opacity-50 ${themeColors.inputBg} text-xs sm:text-sm`}>
                  <p className={`${themeColors.cardText}`}>Startkapitaal: <span className="font-semibold">{(acc.startKapitaal || 0).toLocaleString('nl-NL', { style: 'currency', currency: 'USD' })}</span></p>
                  <p className={`${themeColors.cardText}`}>P/L van Trades: <span className={`font-semibold ${details.totalPnl >= 0 ? themeColors.textPositive : themeColors.textNegative}`}>{details.totalPnl.toLocaleString('nl-NL', { style: 'currency', currency: 'USD' })}</span></p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div> );
};

const KPI_Card = ({ title, value, icon, unit = '', themeColors, isPnl = false }) => {
  // Reusable card for displaying Key Performance Indicators.
  const IconComponent = icon;
  let valueColor = themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900';
  // Apply positive/negative color styling if it's a P&L value.
  if (isPnl) {
    const numericString = String(value).replace(/[^\d,.-]/g, '').replace(',', '.'); // Sanitize for parsing.
    const numericValue = parseFloat(numericString);
    if (!isNaN(numericValue)) {
      if (numericValue > 0) valueColor = themeColors.textPositive;
      else if (numericValue < 0) valueColor = themeColors.textNegative;
    }
  }
  return (
    <div className={`${themeColors.cardBg} p-4 sm:p-5 md:p-6 rounded-xl shadow-lg flex items-center space-x-3 sm:space-x-4 transition-all duration-300 hover:shadow-blue-500/20`}>
      <div className={`p-2 sm:p-3 rounded-full ${themeColors.primaryAccentBg.replace('bg-','bg-opacity-20')} ${themeColors.primaryAccent}`}>
        {IconComponent && <IconComponent size={20} sm:size={24} />}
      </div>
      <div>
        <p className={`text-xs sm:text-sm ${themeColors.subtleText}`}>{title}</p>
        <p className={`text-xl sm:text-2xl font-bold ${valueColor}`}>{value}{unit}</p>
      </div>
    </div> );
};

const SimpleEquityChart = ({ data, themeColors }) => {
  // Component to render a simple equity curve chart using SVG.
  if (!data || data.length === 0) { return <p className={`${themeColors.subtleText} text-center py-10`}>Onvoldoende data voor grafiek.</p>; }
  if (data.length === 1 && data[0].date === "Start") { return <p className={`${themeColors.subtleText} text-center py-10`}>Voeg trades toe om de equity curve te zien.</p>; }

  // Chart dimensions and padding.
  const chartHeight = 380;
  const chartWidth = 750; // Increased width for better display of more data points
  const yPadding = 70;
  const xPadding = 90; // Increased xPadding for y-axis labels

  const equities = data.map(p => p.equity);
  let minEquity = Math.min(...equities);
  let maxEquity = Math.max(...equities);

  // Calculate visual range for Y-axis with buffer.
  const dataRange = maxEquity - minEquity;
  const visualBuffer = dataRange === 0 ? 100 : dataRange * 0.20; // 20% buffer or 100 if flat
  let visualMinEquity = minEquity - visualBuffer;
  let visualMaxEquity = maxEquity + visualBuffer;

  // Ensure Y-axis starts at 0 if all data is positive.
  if (minEquity >= 0 && visualMinEquity < 0) {
    visualMinEquity = 0;
  }

  // Ensure a minimum visual range if data is flat or very close.
  if (visualMaxEquity - visualMinEquity < 250 && dataRange === 0) { // If completely flat
      visualMinEquity = equities[0] - 125;
      visualMaxEquity = equities[0] + 125;
  } else if (visualMaxEquity - visualMinEquity < 250) { // If range is too small
      const mid = (visualMaxEquity + visualMinEquity) / 2;
      visualMinEquity = mid - 125;
      visualMaxEquity = mid + 125;
  }


  // Round visual min/max to nearest 50 for cleaner labels if range is small, or adapt step otherwise.
  visualMinEquity = Math.floor(visualMinEquity / 50) * 50;
  visualMaxEquity = Math.ceil(visualMaxEquity / 50) * 50;


  const visualRange = visualMaxEquity - visualMinEquity === 0 ? 250 : visualMaxEquity - visualMinEquity; // Prevent division by zero.

  // Function to generate SVG path for the line (smoothed with Bezier curves).
  const linePath = (points) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const x_mid = (points[i].x + points[i + 1].x) / 2;
      const cp_x1 = (x_mid + points[i].x) / 2; // Control point 1
      const cp_x2 = (x_mid + points[i + 1].x) / 2; // Control point 2
      path += ` C ${cp_x1},${points[i].y} ${cp_x2},${points[i+1].y} ${points[i+1].x},${points[i+1].y}`;
    }
    return path;
  };

  // Map data points to SVG coordinates.
  const chartPoints = data.map((point, index) => {
    const x = (index / Math.max(1, data.length - 1)) * (chartWidth - 2 * xPadding) + xPadding;
    const y = chartHeight - yPadding - ((point.equity - visualMinEquity) / visualRange) * (chartHeight - 2 * yPadding);
    return {x, y};
  });

  // Path for the area fill under the line.
  const areaPath = `M ${xPadding},${chartHeight - yPadding} L ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${chartWidth - xPadding},${chartHeight - yPadding} Z`;

  // Generate Y-axis labels.
  const yAxisLabels = [];
  const numYLabels = 5; // Desired number of Y labels.
  const yStep = Math.max(250, Math.ceil(visualRange / (numYLabels -1) / 250) * 250); // Ensure step is at least 250, or a multiple of 250.
  let currentYLabel = Math.floor(visualMinEquity / yStep) * yStep;
  if (currentYLabel < visualMinEquity && visualMinEquity !== 0) currentYLabel += yStep; // Adjust if first label is below min
  if (visualMinEquity === 0 && currentYLabel < 0) currentYLabel = 0; // Ensure starts at 0 if appropriate

  for (let val = currentYLabel; val <= visualMaxEquity + yStep/2 ; val += yStep) {
      if (val >= visualMinEquity - yStep/2) { // Add label if within visual range
          const yPos = chartHeight - yPadding - ((val - visualMinEquity) / visualRange) * (chartHeight - 2 * yPadding);
          yAxisLabels.push({ value: val.toLocaleString('nl-NL', { style: 'decimal', minimumFractionDigits:0, maximumFractionDigits:0 }), y: yPos });
      }
  }
  // Ensure at least min and max labels if dynamic ones are not generated (e.g. small range)
  if (yAxisLabels.length === 0 && visualRange > 0) {
      yAxisLabels.push({ value: visualMinEquity.toLocaleString('nl-NL', { style: 'decimal', minimumFractionDigits:0, maximumFractionDigits:0 }), y: chartHeight - yPadding });
      yAxisLabels.push({ value: visualMaxEquity.toLocaleString('nl-NL', { style: 'decimal', minimumFractionDigits:0, maximumFractionDigits:0 }), y: yPadding });
  }


  // Generate X-axis labels (e.g., first, middle, last date).
  const xAxisLabels = [];
  if (data.length > 0) {
    const firstPointDate = data[0].date === "Start" && data.length > 1 ? data[1].date : data[0].date;
    xAxisLabels.push({ text: firstPointDate, x: xPadding });
    if (data.length > 2) { // Add a middle label if enough data points.
      const midIndex = Math.floor(data.length / 2);
      // Only add if different from start/end
      if (data[midIndex].date !== firstPointDate && data[midIndex].date !== data[data.length -1].date) {
        xAxisLabels.push({ text: data[midIndex].date, x: chartWidth / 2 });
      }
    }
    if (data.length > 1 && data[data.length - 1].date !== firstPointDate) { // Add last label if different from first.
      xAxisLabels.push({ text: data[data.length - 1].date, x: chartWidth - xPadding });
    }
  }

  return (
    <div className="w-full overflow-x-auto flex justify-center"> {/* Allow horizontal scroll for wider chart */}
      <svg width={chartWidth} height={chartHeight + 60} viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`} className="max-w-full font-inter">
        <defs>
          <linearGradient id="equityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={themeColors.chartGradientFrom} />
            <stop offset="100%" stopColor={themeColors.chartGradientTo} />
          </linearGradient>
        </defs>
        {/* Y-axis Title */}
        <text x={xPadding / 3 - 15} y={chartHeight / 2} transform={`rotate(-90 ${xPadding/3 - 15} ${chartHeight/2})`} textAnchor="middle" className={`text-sm font-semibold ${themeColors.chartLabel}`}> Equity ($) </text>
        {/* X-axis Title (conceptual, labels serve this purpose) */}
        <text x={chartWidth - xPadding + 30} y={chartHeight + yPadding } textAnchor="end" className={`text-sm font-semibold ${themeColors.chartLabel}`}> Datum </text>

        {/* Y-axis grid lines and labels */}
        {yAxisLabels.map((label, i) => (
          <g key={`y-axis-group-${i}`}>
            <line x1={xPadding} y1={label.y} x2={chartWidth - xPadding} y2={label.y} className={themeColors.chartGrid} strokeOpacity="0.3" strokeDasharray="4 4" />
            <text x={xPadding - 15} y={label.y + 4} textAnchor="end" className={`text-xs ${themeColors.chartAxis}`}>${label.value}</text>
          </g>
        ))}
        {/* X-axis labels */}
        {xAxisLabels.map((label, i) => (
          <text key={`x-label-${i}`} x={label.x} y={chartHeight - yPadding + 35} textAnchor={i === 0 ? "start" : i === xAxisLabels.length -1 && xAxisLabels.length > 1 ? "end" : "middle"} className={`text-xs ${themeColors.chartAxis}`}>{label.text}</text>
        ))}

        {/* Equity line and area fill */}
        {chartPoints.length > 1 && ( // Only draw if more than one point.
          <>
            <path d={areaPath} fill="url(#equityGradient)" opacity="0.6" />
            <path d={linePath(chartPoints)} fill="none" className={themeColors.chartLine} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dot for the last point */}
            <circle cx={chartPoints[chartPoints.length-1].x} cy={chartPoints[chartPoints.length-1].y} r="4.5" className={themeColors.chartPoint} stroke={themeColors.cardBg} strokeWidth="2.5"/>
          </>
        )}
      </svg>
    </div>
  );};

const DashboardNavbar = ({ onToggleTheme, currentTheme, themeColors, onNavigateToTimeline, onNavigateToContact, isAdmin, onAdminLogout, onTabChange, activeTab, onNavigateToLanding }) => {
    // Navigation bar for the dashboard view.
    const baseNavLinks = [ // Common links for all users.
        { name: 'Overzicht', icon: LayoutDashboard, action: () => onTabChange('overview') },
        { name: 'Mijn Reis', icon: User, action: onNavigateToTimeline },
        { name: 'Contact', icon: Send, action: onNavigateToContact },
    ];
    if (isAdmin) { baseNavLinks.push({ name: 'Admin', icon: ShieldCheck, action: () => onTabChange('admin') }); } // Add Admin tab if admin.

    return (
        <nav className={`${themeColors.cardBg} ${themeColors.text} p-3 sm:p-4 shadow-lg flex justify-between items-center sticky top-0 z-50 font-inter`}>
            {/* Logo/Brand */}
            <button onClick={onNavigateToLanding} className="flex items-center focus:outline-none">
                <span className={`text-lg sm:text-xl font-bold ${themeColors.primaryAccent}`}>J<span className={themeColors.text}>Markets.nl</span></span>
            </button>
            {/* Navigation links and theme/logout buttons */}
            <div className="flex items-center space-x-1">
                {baseNavLinks.map(link => {
                    const Icon = link.icon;
                    return (
                        <button
                            key={link.name}
                            onClick={() => { if(link.action) link.action(); }}
                            title={link.name}
                            // Apply active styling based on current tab.
                            className={`p-2 rounded-md hover:${themeColors.inputBg} transition-colors flex items-center text-xs sm:text-sm ${activeTab === link.name.toLowerCase() ? `${themeColors.primaryAccentBg} text-white` : `${themeColors.subtleText}`}`}
                        >
                            <Icon size={18} sm:size={20}/>
                            <span className="hidden sm:inline ml-1 sm:ml-2">{link.name}</span> {/* Show text on larger screens */}
                        </button>
                    )
                })}
                {/* Admin logout button */}
                {isAdmin && (
                    <button
                        onClick={onAdminLogout}
                        title="Admin Uitloggen"
                        className={`p-2 rounded-md hover:bg-red-700 bg-red-600 text-white transition-colors flex items-center text-xs sm:text-sm`}
                    >
                        <LogOut size={18} sm:size={20} />
                        <span className="hidden sm:inline ml-1 sm:ml-2">Logout</span>
                    </button>
                )}
                {/* Theme toggle button */}
                <button
                    onClick={onToggleTheme}
                    className={`p-2 rounded-md hover:${themeColors.inputBg} transition-colors ${themeColors.subtleText}`}
                    title="Toggle Thema"
                >
                    {currentTheme === 'dark' ? <Sun size={18} sm:size={20} /> : <Moon size={18} sm:size={20} />}
                </button>
            </div>
        </nav>
    );
};

const TradeList = ({ trades, accounts, themeColors, selectedAccountFilterId }) => {
    // Component to display a list of trades, filterable by account.
    const [expandedTradeId, setExpandedTradeId] = useState(null); // Track which trade details are expanded.

    const getAccountNameById = (accountId) => { // Helper to find account name from ID.
        const account = accounts.find(acc => acc.id === accountId);
        return account ? account.name : 'N/A';
    };

    const getMoodForTradeDisplay = (moodValue) => { // Helper to display mood icon.
        if (moodValue >= 1 && moodValue <= 5) {
            return (
                <div className="flex items-center space-x-1">
                    <MoodSmiley moodValue={moodValue} themeColors={themeColors} size={16} />
                </div>
            );
        }
        return <div className="flex items-center space-x-1"><Meh className={themeColors.mood[2]} size={16} /></div>; // Default if no mood.
    };

    // Filter trades based on the selected account ID, or show all if 'cumulative'.
    const filteredTrades = selectedAccountFilterId === 'cumulative'
        ? trades
        : trades.filter(trade => trade.accountId === selectedAccountFilterId);

    if (filteredTrades.length === 0) {
        return <p className={`${themeColors.subtleText} text-center py-4`}>Geen trades gevonden voor deze selectie.</p>;
    }

    return (
        <div className={`${themeColors.cardBg} p-4 sm:p-6 rounded-xl shadow-lg mt-8`}>
            <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Trades Bekijken</h3>
            <ul className="space-y-3">
                {filteredTrades.map(trade => (
                    <li key={trade.id} className={`${themeColors.subtleBg} rounded-md overflow-hidden`}>
                        {/* Trade summary row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3">
                            <div className="flex items-center flex-grow mb-2 sm:mb-0 flex-wrap"> {/* Allow wrapping on small screens */}
                                <span className="mr-2 mb-1 sm:mb-0">{getMoodForTradeDisplay(trade.mood)}</span>
                                <span className={`font-semibold mr-2 ${trade.pnl >= 0 ? themeColors.textPositive : themeColors.textNegative}`}>
                                    {trade.pnl >=0 ? '+' : ''}{trade.pnl.toLocaleString('nl-NL', {style: 'currency', currency: 'USD'})}
                                </span>
                                <span className={`text-xs sm:text-sm ${themeColors.cardText} mr-2`}>{getAccountNameById(trade.accountId)}</span>
                                <span className={`text-xs ${themeColors.subtleText} mr-2`}>{trade.date && typeof trade.date.toDate === 'function' ? trade.date.toDate().toLocaleDateString('nl-NL') : 'N/A'}</span>
                                {trade.tradeTime && <span className={`text-xs ${themeColors.subtleText}`}>({trade.tradeTime})</span>}
                            </div>
                            {/* Expand/collapse details button */}
                            <button
                                onClick={() => setExpandedTradeId(expandedTradeId === trade.id ? null : trade.id)}
                                className={`${themeColors.primaryAccent} hover:opacity-75 p-1 rounded text-xs sm:text-sm inline-flex items-center self-start sm:self-center mt-2 sm:mt-0`}
                            >
                                Details {expandedTradeId === trade.id ? <ChevronUp size={16} className="ml-1"/> : <ChevronDown size={16} className="ml-1"/>}
                            </button>
                        </div>
                        {/* Expanded trade details */}
                        {expandedTradeId === trade.id && (
                            <div className={`p-3 border-t ${themeColors.borderColor} space-y-3 text-xs sm:text-sm`}>
                                {trade.reasoning && (
                                    <div>
                                        <h4 className={`font-medium ${themeColors.cardText} mb-1`}>Onderbouwing:</h4>
                                        <p className={`whitespace-pre-wrap ${themeColors.subtleText}`}>{trade.reasoning}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className={`font-medium ${themeColors.cardText} mb-1`}>Stemming:</h4>
                                    <p className={`${themeColors.subtleText} italic`}>{moodLabels[trade.mood] || "Geen specifieke stemming genoteerd."}</p>
                                </div>
                                {trade.imageUrl && ( // Display TradingView chart image
                                    <div className="my-2">
                                        <p className={`font-medium ${themeColors.cardText} mb-1`}>Grafiek:</p>
                                        <img
                                            src={trade.imageUrl}
                                            alt={`Trade chart ${trade.pair}`}
                                            className="rounded-md max-w-full h-auto sm:max-w-md mx-auto shadow-md border ${themeColors.borderColor}"
                                            onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
                                        />
                                    </div>
                                )}
                                 {trade.imageUrlOptional && ( // Display optional uploaded image
                                    <div className="my-2">
                                        <p className={`font-medium ${themeColors.cardText} mb-1`}>Order Bewijs:</p>
                                        <img
                                            src={trade.imageUrlOptional}
                                            alt={`Order bewijs ${trade.pair}`}
                                            className="rounded-md max-w-full h-auto sm:max-w-xs mx-auto shadow-md border ${themeColors.borderColor}"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                                {(!trade.imageUrl && !trade.imageUrlOptional && !trade.reasoning) && ( // Fallback if no extra details
                                    <p className={`${themeColors.subtleText}`}>Geen extra details beschikbaar voor deze trade.</p>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const DashboardView = ({ onBackToLanding, currentTheme, toggleTheme, themeColors, onNavigateToTimeline, onNavigateToContact, userId, isAdmin, onAdminLogout, navigateTo }) => {
    // Main dashboard view component, showing KPIs, equity curve, and admin panel if applicable.
    const [kpiValues, setKpiValues] = useState({ totalPL: 0, winRate: 0, avgRRR: 0, totalTrades: 0, evPerTrade: 0, maxDrawdown: 0, avgDrawdown: 0, avgDaysBetweenTrades: 0 });
    const [accounts, setAccounts] = useState([]); // List of trading accounts.
    const [activeMainTab, setActiveMainTab] = useState('overview'); // 'overview' or 'admin'.
    const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('monthlyGrowth'); // For analytics sub-tabs.
    const [equityCurveData, setEquityCurveData] = useState([]); // Data for the equity chart.
    const [allTrades, setAllTrades] = useState([]); // All trades for calculations.
    const [tradesLoading, setTradesLoading] = useState(true); // Loading state for trades.
    const [selectedAccountFilterId, setSelectedAccountFilterId] = useState('cumulative'); // Filter for KPIs/chart.
    const tradesSectionRef = useRef(null); // Ref to scroll to trades list.

    const scrollToTrades = () => { // Helper to scroll to the trades list.
        if (tradesSectionRef.current) {
            tradesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSelectAccountTrades = (accountId) => { // Set filter and scroll.
        setSelectedAccountFilterId(accountId);
        setTimeout(() => { // Delay scroll slightly for UI to update.
            scrollToTrades();
        }, 100);
    };

    // Effect to fetch accounts. Data is always fetched from ADMIN_DATA_OWNER_ID.
    useEffect(() => {
        const dataOwnerId = ADMIN_DATA_OWNER_ID;
        if (dataOwnerId) {
            const accountsPath = `/artifacts/${appId}/users/${dataOwnerId}/accounts`;
            const unsubAccounts = onSnapshot(query(collection(db, accountsPath)), (snap) => {
                const fetchedAccounts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAccounts(fetchedAccounts);
            }, (error) => {
                console.error("Fout bij ophalen accounts: ", error);
                setAccounts([]);
            });
            return () => unsubAccounts(); // Cleanup listener.
        } else {
            setAccounts([]); // Should not happen.
        }
    }, []); // Runs once on mount.

    // Effect to fetch trades and calculate KPIs/equity curve based on selected filter.
    // Data is always fetched from ADMIN_DATA_OWNER_ID.
    useEffect(() => {
        const dataOwnerId = ADMIN_DATA_OWNER_ID;

        if (dataOwnerId && (selectedAccountFilterId === 'cumulative' || accounts.length > 0)) {
            setTradesLoading(true);
            const tradesPath = `/artifacts/${appId}/users/${dataOwnerId}/trades`;
            const tradesQuery = query(collection(db, tradesPath), orderBy("date", "asc")); // Order trades by date.
            const unsubTrades = onSnapshot(tradesQuery, (snapshot) => {
                const fetchedTradesRaw = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setAllTrades(fetchedTradesRaw); // Store all trades for other components like UserAccountStatusList.

                // Filter trades for current view (KPIs, chart).
                const tradesToProcess = selectedAccountFilterId === 'cumulative' ? fetchedTradesRaw : fetchedTradesRaw.filter(trade => trade.accountId === selectedAccountFilterId);
                const selectedAccountData = selectedAccountFilterId === 'cumulative' ? null : accounts.find(acc => acc.id === selectedAccountFilterId);

                // Calculate equity curve data.
                let cumulativePnl = selectedAccountFilterId === 'cumulative' ? 0 : (selectedAccountData?.startKapitaal || 0);
                const initialCurvePointDate = tradesToProcess.length > 0 && tradesToProcess[0].date && typeof tradesToProcess[0].date.toDate === 'function' ? tradesToProcess[0].date.toDate().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Start";
                const curveData = [{ date: initialCurvePointDate, equity: cumulativePnl, tradeNumber: 0 }];

                // Initialize KPI calculation variables.
                let totalPnlForKpi = 0;
                let winningTrades = 0;
                let losingTrades = 0;
                let sumOfWinTradeRR = 0;
                let sumOfPnlWins = 0;
                let sumOfPnlLosses = 0;
                const tradeDrawdownPercentages = [];

                tradesToProcess.forEach((trade, index) => {
                    cumulativePnl += trade.pnl;
                    if (trade.date && typeof trade.date.toDate === 'function') {
                        curveData.push({ date: trade.date.toDate().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }), equity: cumulativePnl, tradeNumber: index + 1 });
                    }
                    totalPnlForKpi += trade.pnl;
                    if (trade.outcome === 'win') {
                        winningTrades++;
                        sumOfPnlWins += trade.pnl;
                        if (typeof trade.rr === 'number') { sumOfWinTradeRR += trade.rr; }
                    } else {
                        losingTrades++;
                        sumOfPnlLosses += Math.abs(trade.pnl); // Losses are negative, sum absolute for avg loss calc.
                        // Calculate drawdown percentage for this losing trade.
                        const accountForTrade = accounts.find(acc => acc.id === trade.accountId);
                        const startKapitalForDD = selectedAccountFilterId === 'cumulative' ? (accountForTrade?.startKapitaal || 0) : (selectedAccountData?.startKapitaal || 0);
                        if (startKapitalForDD > 0 && typeof trade.riskAmount === 'number') {
                            const drawdownPercent = (trade.riskAmount / startKapitalForDD) * 100;
                            tradeDrawdownPercentages.push(drawdownPercent);
                        }
                    }
                });
                setEquityCurveData(curveData);

                // Calculate final KPIs.
                const numTrades = tradesToProcess.length;
                const winRate = numTrades > 0 ? winningTrades / numTrades : 0;
                const lossRate = numTrades > 0 ? losingTrades / numTrades : 0;
                const avgWin = winningTrades > 0 ? sumOfPnlWins / winningTrades : 0;
                const avgLoss = losingTrades > 0 ? sumOfPnlLosses / losingTrades : 0; // Avg loss is positive value.
                const evPerTrade = (winRate * avgWin) - (lossRate * avgLoss); // Expected Value.
                const maxIndividualTradeDrawdown = tradeDrawdownPercentages.length > 0 ? Math.max(...tradeDrawdownPercentages) : 0;
                const avgIndividualTradeDrawdown = tradeDrawdownPercentages.length > 0 ? tradeDrawdownPercentages.reduce((a,b) => a+b, 0) / tradeDrawdownPercentages.length : 0;

                // Calculate average days between trades.
                let avgDaysBetween = 0;
                if (tradesToProcess.length > 1) {
                    let totalDaysDiff = 0;
                    for (let i = 1; i < tradesToProcess.length; i++) {
                        if (tradesToProcess[i-1].date && typeof tradesToProcess[i-1].date.toDate === 'function' && tradesToProcess[i].date && typeof tradesToProcess[i].date.toDate === 'function') {
                            const date1 = tradesToProcess[i-1].date.toDate();
                            const date2 = tradesToProcess[i].date.toDate();
                            const diffTime = Math.abs(date2 - date1);
                            totalDaysDiff += Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days.
                        }
                    }
                    avgDaysBetween = totalDaysDiff / (tradesToProcess.length - 1);
                }

                setKpiValues({ totalPL: totalPnlForKpi, winRate: winRate * 100, avgRRR: winningTrades > 0 ? sumOfWinTradeRR / winningTrades : 0, totalTrades: numTrades, evPerTrade: evPerTrade, maxDrawdown: maxIndividualTradeDrawdown, avgDrawdown: avgIndividualTradeDrawdown, avgDaysBetweenTrades: avgDaysBetween });
                setTradesLoading(false);
            }, (error) => { console.error("Fout bij ophalen trades: ", error); setTradesLoading(false); setAllTrades([]); });
            return () => unsubTrades(); // Cleanup listener.
        } else if (!dataOwnerId) { // Should not happen.
            setAccounts([]); setEquityCurveData([]); setAllTrades([]);
            setKpiValues({ totalPL: 0, winRate: 0, avgRRR: 0, totalTrades: 0, evPerTrade: 0, maxDrawdown: 0, avgDrawdown: 0, avgDaysBetweenTrades: 0 });
            setTradesLoading(false);
        }
    }, [accounts, selectedAccountFilterId]); // Re-run if accounts or filter changes.

    // Redirect from admin tab if not admin.
    useEffect(() => { if (!isAdmin && activeMainTab === 'admin') { setActiveMainTab('overview'); } }, [isAdmin, activeMainTab]);

    const handleAccountAdded = (newAccount) => { setAccounts(prev => [...prev, newAccount]); }; // Update accounts list when admin adds one.

    // KPI data for display.
    const kpiData = [
        { title: "Totaal Netto Winst/Verlies", value: kpiValues.totalPL.toLocaleString('nl-NL', { style: 'currency', currency: 'USD' }), icon: DollarSign, isPnl: true },
        { title: "Win Rate", value: kpiValues.winRate.toFixed(1), icon: Percent, unit: '%' },
        { title: "Gem. Risk/Reward Ratio", value: kpiValues.avgRRR.toFixed(2), icon: TrendingUp },
        { title: "Totaal Aantal Trades", value: kpiValues.totalTrades, icon: BarChart2 },
    ];

    // Tabs for the analytics section.
    const analyticsTabs = [
        { id: 'monthlyGrowth', label: 'Maandelijkse Groei (%)', icon: TrendingUp },
        { id: 'yearlyGrowth', label: 'Jaarlijkse Groei (%)', icon: CalendarDays },
        { id: 'nerdStats', label: 'Voor de Nerds', icon: Brain },
    ];

    return ( <div className={`min-h-screen font-inter ${themeColors.bg} ${themeColors.text}`}> <DashboardNavbar onToggleTheme={toggleTheme} currentTheme={currentTheme} themeColors={themeColors} onNavigateToTimeline={onNavigateToTimeline} onNavigateToContact={onNavigateToContact} isAdmin={isAdmin} onAdminLogout={onAdminLogout} onTabChange={setActiveMainTab} activeTab={activeMainTab} onNavigateToLanding={() => navigateTo('landing')} /> <main className="p-4 sm:p-6 md:p-8 space-y-8"> {/* Overview Tab Content */} {activeMainTab === 'overview' && ( <section id="dashboard-overview"> <h2 className={`text-2xl sm:text-3xl font-semibold mb-1 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Dashboard Overzicht</h2> <em className={`text-xs ${themeColors.subtleText} opacity-75 block mb-4`}>Visuele weergave van de vermogensgroei.</em> {/* Account filter buttons */} <div className="mb-6 flex flex-wrap gap-2 items-center"> <span className={`mr-2 text-sm ${themeColors.subtleText}`}>Toon data voor:</span> <button onClick={() => setSelectedAccountFilterId('cumulative')} className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${selectedAccountFilterId === 'cumulative' ? `${themeColors.filterButtonActiveBg} ${themeColors.filterButtonActiveText}` : `${themeColors.filterButtonInactiveBg} ${themeColors.filterButtonInactiveText} hover:opacity-80`}`}> Cumulatief </button> {accounts.map(acc => ( <button key={acc.id} onClick={() => setSelectedAccountFilterId(acc.id)} className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${selectedAccountFilterId === acc.id ? `${themeColors.filterButtonActiveBg} ${themeColors.filterButtonActiveText}` : `${themeColors.filterButtonInactiveBg} ${themeColors.filterButtonInactiveText} hover:opacity-80`}`}> {acc.name} </button> ))} </div> {/* KPI Cards */} <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"> {kpiData.map(kpi => <KPI_Card key={kpi.title} {...kpi} themeColors={themeColors} />)} </div> {/* Equity Curve Chart */} <div className={`${themeColors.cardBg} p-6 rounded-xl shadow-lg`}> <h3 className={`text-xl font-semibold mb-1 ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Equity Curve</h3> <em className={`text-xs ${themeColors.subtleText} opacity-75 block mb-4`}>Visuele weergave van de vermogensgroei.</em> <div className={`h-[450px] md:h-[550px] flex items-center justify-center rounded-md ${themeColors.text === 'text-slate-200' ? 'border-opacity-30' : 'border-opacity-50'}`}> {tradesLoading ? ( <p className={`${themeColors.subtleText}`}>Equity curve data laden...</p> ) : ( <SimpleEquityChart data={equityCurveData} themeColors={themeColors} /> )} </div> </div> {/* Analytics Section */} <div className={`${themeColors.cardBg} p-6 rounded-xl shadow-lg mt-8`}> <div className="flex border-b ${themeColors.borderColor} mb-4 overflow-x-auto pb-px"> {analyticsTabs.map(tab => { const IconComponent = tab.icon; return ( <button key={tab.id} onClick={() => setActiveAnalyticsTab(tab.id)} className={`flex-shrink-0 flex items-center py-3 px-3 sm:px-4 -mb-px font-medium text-xs sm:text-sm focus:outline-none transition-colors duration-200 ${activeAnalyticsTab === tab.id ? `border-b-2 ${themeColors.primaryAccent.replace('text-','border-')} ${themeColors.primaryAccent}` : `${themeColors.subtleText} hover:${themeColors.text}` }`}> {IconComponent && <IconComponent className="mr-1 sm:mr-2" size={16} sm:size={18}/>} {tab.label} </button> ); })} </div> <div> {activeAnalyticsTab === 'monthlyGrowth' && ( <div> <h4 className={`text-xl sm:text-2xl font-semibold ${themeColors.textPositive}`}>8% - 14%</h4> <p className={`text-xs italic ${themeColors.subtleText} mt-1`}>Resultaten gebaseerd op de afgelopen 500 trades, en alleen geldig bij 1% risico per trade.</p> </div> )} {activeAnalyticsTab === 'yearlyGrowth' && ( <div> <h4 className={`text-xl sm:text-2xl font-semibold ${themeColors.textPositive}`}>96% - 168%</h4> <p className={`text-xs italic ${themeColors.subtleText} mt-1`}>Resultaten gebaseerd op de afgelopen 500 trades, en alleen geldig bij 1% risico per trade.</p> </div> )} {activeAnalyticsTab === 'nerdStats' && ( <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"> <div><span className={`${themeColors.cardText} font-medium`}>Risk to Ruin %:</span> <span className={themeColors.subtleText}>0% (Gebaseerd op 500 trades)</span></div> <div><span className={`${themeColors.cardText} font-medium`}>Expected Value (EV) / Trade:</span> <span className={kpiValues.evPerTrade >= 0 ? themeColors.textPositive : themeColors.textNegative}>{kpiValues.evPerTrade.toLocaleString('nl-NL', {style: 'currency', currency: 'USD'})}</span></div> <div><span className={`${themeColors.cardText} font-medium`}>Max Drawdown % (per trade):</span> <span className={themeColors.textNegative}>{kpiValues.maxDrawdown.toFixed(2)}%</span></div> <div><span className={`${themeColors.cardText} font-medium`}>Gemiddelde Drawdown % (per trade):</span> <span className={themeColors.textNegative}>{kpiValues.avgDrawdown.toFixed(2)}%</span></div> <div><span className={`${themeColors.cardText} font-medium`}>Gem. Dagen Tussen Trades:</span> <span className={themeColors.subtleText}>{kpiValues.avgDaysBetweenTrades.toFixed(1)}</span></div> </div> )} </div> </div> {/* Trade List and User Account Status */} <div ref={tradesSectionRef}> <TradeList trades={allTrades} accounts={accounts} themeColors={themeColors} selectedAccountFilterId={selectedAccountFilterId} /> </div> <UserAccountStatusList themeColors={themeColors} userId={ADMIN_DATA_OWNER_ID} allTrades={allTrades} onSelectAccountTrades={handleSelectAccountTrades} /> </section> )} {/* Admin Panel Tab Content */} {isAdmin && activeMainTab === 'admin' && ( <section id="admin-panel" className="mt-2 space-y-8"> <h2 className={`text-2xl sm:text-3xl font-semibold ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Administrator Paneel</h2> <AdminTradeInputForm themeColors={themeColors} userId={ADMIN_DATA_OWNER_ID} accounts={accounts} /> <AdminAccountManagement themeColors={themeColors} userId={ADMIN_DATA_OWNER_ID} onAccountAdded={handleAccountAdded} accounts={accounts} setAccounts={setAccounts} /> </section> )} <button onClick={onBackToLanding} className={`mt-8 ${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out self-center`}> Terug naar Home </button> </main> </div> );};

const AdminLoginPage = ({ onSuccessfulAdminLogin, onBackToLanding, themeColors }) => {
  // Page for admin PIN login.
  const [pin, setPin] = useState(Array(5).fill('')); // Array to hold PIN digits.
  const [error, setError] = useState(''); // Error message for incorrect PIN.
  const inputRefs = useRef([]); // Refs for PIN input fields for focus management.

  const handleChange = (e, index) => {
    // Handle changes in PIN input fields.
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") { // Allow only single digits or empty.
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      // Auto-focus next input if a digit is entered.
      if (value && index < 4) { // Ensure index is within bounds for next input.
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to move focus to previous input.
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const enteredPin = pin.join('');
    if (enteredPin === THE_ADMIN_PIN) { // Check against the hardcoded PIN.
      console.log("PIN login succesvol");
      onSuccessfulAdminLogin(); // Callback on successful login.
    } else {
      setError('Ongeldige pincode.');
      setPin(Array(5).fill('')); // Reset PIN fields.
      if (inputRefs.current[0]) inputRefs.current[0].focus(); // Focus first input.
    }
  };

  const inputClass = `w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-semibold rounded-lg ${themeColors.inputBg} ${themeColors.inputText} ${themeColors.borderColor} border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors mx-1`;
  const labelClass = `block text-sm font-medium mb-2 ${themeColors.subtleText}`;

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} flex flex-col justify-center items-center p-8 font-inter`}>
      <div className={`w-full max-w-md ${themeColors.cardBg} p-8 md:p-10 rounded-xl shadow-2xl`}>
        <div className="text-center mb-8">
          <Key size={48} className={`${themeColors.primaryAccent} mx-auto mb-4`} />
          <h1 className={`text-3xl font-bold ${themeColors.text === 'text-slate-200' ? 'text-white' : 'text-slate-900'}`}>Admin Pincode</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="pin-0" className={labelClass}>Voer uw 5-cijferige pincode in:</label>
            <div className="flex justify-center space-x-2">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password" // Use password type to obscure digits.
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={el => inputRefs.current[index] = el}
                  className={inputClass}
                  autoComplete="off"
                />
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" className={`${themeColors.adminButtonBg} hover:${themeColors.adminButtonHoverBg} text-white font-semibold py-3 px-6 rounded-lg w-full text-lg transition-colors`}>
            Inloggen
          </button>
        </form>
        <button onClick={onBackToLanding} className={`mt-6 w-full bg-transparent border-2 ${themeColors.borderColor} hover:${themeColors.inputBg} ${themeColors.subtleText} font-semibold py-3 px-6 rounded-lg text-lg transition-colors`}>
          Terug naar Home
        </button>
      </div>
    </div>
  );
};

const FloatingCallButton = ({ themeColors }) => {
  // Floating action button to open Calendly link.
  const handleCallClick = () => {
    window.open('https://calendly.com/jeremy-mlynarczyk/30min', '_blank');
  };

  return (
    <button
      onClick={handleCallClick}
      title="Plan een Call"
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${themeColors.primaryAccentBg} hover:${themeColors.primaryAccentHoverBg} text-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-all duration-200 ease-in-out`}
    >
      <Phone size={20} sm:size={22} />
    </button>
  );
};

const Footer = ({themeColors}) => {
    // Simple footer component.
    return (
        <footer className={`py-4 text-center ${themeColors.footerText} opacity-75 text-xs sm:text-sm`}>
            <div className="container mx-auto px-6 flex items-center justify-center">
                <Copyright size={14} sm:size={16} className="mr-1.5"/>
                <p> www.jmarkets.nl - Jeremy Młynarczyk - Alle rechten voorbehouden</p>
            </div>
        </footer>
    );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('landing'); // Manages current page/view.
  const [currentUser, setCurrentUser] = useState(null); // Stores Firebase auth user or pseudo-admin.
  const [isAuthReady, setIsAuthReady] = useState(false); // Tracks if Firebase auth state is resolved.
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'.
  const [isAdmin, setIsAdmin] = useState(false); // True if admin PIN login is successful.
  const currentThemeColors = themes[theme]; // Gets color palette for current theme.

  // Navigation function with page transition effect.
  const navigateTo = (view) => {
    const pageContainer = document.getElementById('page-container');
    if (pageContainer) { // Fade out, change view, scroll to top, fade in.
      pageContainer.style.opacity = '0';
      setTimeout(() => {
        setCurrentView(view);
        window.scrollTo(0, 0);
        // Reset scroll for specific containers if they exist (e.g., timeline).
        const innerContainer = document.querySelector('.journey-container, .flex-grow.overflow-y-auto');
        if(innerContainer) innerContainer.scrollTop = 0;
        setTimeout(() => { pageContainer.style.opacity = '1'; }, 50); // Short delay for fade in.
      }, 250); // Duration of fade out.
    } else { // Fallback if no page container (should not happen).
      setCurrentView(view);
      window.scrollTo(0,0);
    }
  };

  // Effect for Firebase authentication state and user profile handling.
  useEffect(() => {
    const authListener = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, Firebase user:", user);
      if (user) {
        setCurrentUser(user); // Set current Firebase user.
        // Path to user's profile document in Firestore.
        const userDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}/profile`, 'info');
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // If profile exists, load theme preference.
          const profileData = userDocSnap.data();
          setTheme(profileData?.themePreference || 'light');
          // Admin status is determined by PIN login, not Firebase profile.
        } else if (user.uid !== ADMIN_DATA_OWNER_ID) {
          // If profile doesn't exist and user is not the admin data owner, create a new profile.
          // This is mainly for anonymous or newly signed-up (if implemented) users.
          try {
            await setDoc(userDocRef, {
              email: user.email || 'anoniem',
              name: user.displayName || 'Gebruiker',
              createdAt: Timestamp.now(),
              themePreference: 'light',
              isAdmin: false // Firestore 'isAdmin' flag, not used for app's admin logic.
            });
            setTheme('light'); // Default theme for new users.
            console.log("Nieuw profiel aangemaakt voor reguliere UID:", user.uid);
          } catch (error) { console.error("Fout bij aanmaken gebruikersprofiel:", error); }
        }
      } else {
        // No Firebase user. Attempt anonymous sign-in if no custom token is provided.
        if (typeof __initial_auth_token === 'undefined' || !__initial_auth_token) {
            console.log("Geen Firebase user, probeer anoniem in te loggen.");
            signInAnonymously(auth).catch(error => console.error("Anoniem inloggen mislukt:", error));
        }
        setCurrentUser(null);
        // isAdmin state (from PIN login) is preserved on Firebase user logout.
        // It's only reset by the explicit admin logout function.
        console.log("Firebase gebruiker uitgelogd. Lokale isAdmin blijft ongewijzigd indien via PIN gezet.");
      }
      setIsAuthReady(true); // Auth state is now resolved.
    });

    // Attempt custom token sign-in if available (e.g., from Canvas environment).
    const attemptCustomSignIn = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          console.log("Probeert custom token sign-in...");
          await signInWithCustomToken(auth, __initial_auth_token);
          console.log("Custom token sign-in succesvol.");
        } catch (error) {
          console.error("Custom token inloggen mislukt, probeer anoniem:", error);
          signInAnonymously(auth).catch(anonError => console.error("Anoniem inloggen ook mislukt na custom token fail:", anonError));
        }
      }
    };

    // Initial auth check: if no current user but token exists, try custom sign-in.
    // Otherwise, if no user and no token, try anonymous sign-in.
    if (!auth.currentUser && (typeof __initial_auth_token !== 'undefined' && __initial_auth_token)) {
      attemptCustomSignIn();
    } else if (!auth.currentUser && (typeof __initial_auth_token === 'undefined' || !__initial_auth_token)) {
      signInAnonymously(auth).catch(error => console.error("Initiële anonieme login mislukt:", error));
    }

    return () => authListener(); // Cleanup listener on unmount.
  }, [isAdmin]); // `isAdmin` dependency: if PIN admin logs out, auth state might change if a real Firebase user was also signed out.

  // Function to toggle theme and save preference to Firestore.
  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Determine whose profile to update for theme preference.
    // If PIN admin is active (currentUser.isPseudoAdmin), update ADMIN_DATA_OWNER_ID's profile.
    // Otherwise, update the current Firebase user's profile.
    const uidToUpdate = isAdmin && currentUser?.isPseudoAdmin ? ADMIN_DATA_OWNER_ID : currentUser?.uid;

    if (uidToUpdate) {
        try {
            const userDocRef = doc(db, `/artifacts/${appId}/users/${uidToUpdate}/profile`, 'info');
            const userDocSnap = await getDoc(userDocRef);
            if(userDocSnap.exists()){ // If profile exists, update it.
                 await updateDoc(userDocRef, { themePreference: newTheme });
            } else if (uidToUpdate === ADMIN_DATA_OWNER_ID) { // If ADMIN_DATA_OWNER_ID profile doesn't exist, create it.
                 await setDoc(userDocRef, { themePreference: newTheme, name: "Admin Data Storage", isAdmin: true }, {merge: true});
            } else { // For a regular user without a profile (should be rare here as onAuthStateChanged creates it).
                 await setDoc(userDocRef, { themePreference: newTheme, isAdmin: false }, {merge: true});
            }
            console.log("Thema voorkeur geüpdatet in Firestore voor UID:", uidToUpdate);
        } catch (error) {
            console.error("Fout bij updaten thema voorkeur:", error);
        }
    }
  };

  // Callback for successful admin PIN login.
  const handleSuccessfulAdminLogin = async () => {
    console.log("handleSuccessfulAdminLogin aangeroepen na PIN succes");
    setIsAdmin(true); // Set app-level admin state.
    // Create a "pseudo" user object for the PIN admin.
    // This makes `userId` in `DashboardView` and other components become `ADMIN_DATA_OWNER_ID`.
    setCurrentUser({ uid: ADMIN_DATA_OWNER_ID, isPseudoAdmin: true, email: 'admin-via-pin@jmarkets.nl' });
    navigateTo('dashboard'); // Navigate to dashboard.
    console.log("Admin status lokaal gezet. Genavigeerd naar dashboard. userId voor data wordt:", ADMIN_DATA_OWNER_ID);
  };

  // Callback for admin logout.
  const handleAdminLogout = async () => {
    console.log("Admin logout gestart...");
    setIsAdmin(false); // Reset app-level admin state.

    // If a real (non-anonymous, non-pseudo) Firebase user was signed in *before* PIN login,
    // signing them out here would revert to anonymous or prompt new login.
    // However, current logic with pseudo-admin means `currentUser.isPseudoAdmin` is true for PIN admin.
    if (auth.currentUser && !auth.currentUser.isAnonymous && !currentUser?.isPseudoAdmin) {
        try {
            await firebaseSignOut(auth); // Sign out the actual Firebase user.
            console.log("Firebase signOut succesvol voor niet-anonieme/niet-pseudo gebruiker.");
            setCurrentUser(null); // This will trigger onAuthStateChanged, likely leading to anonymous sign-in.
        } catch (error) {
            console.error("Fout bij Firebase signOut:", error);
        }
    } else {
        // If admin was via PIN, or Firebase user was already anonymous,
        // ensure currentUser reflects the current Firebase auth state (likely anonymous or null).
        setCurrentUser(auth.currentUser);
        if (!auth.currentUser) { // If truly no user, force anonymous sign-in.
            signInAnonymously(auth).catch(e => console.error("Anon sign in na admin logout mislukt", e));
        }
    }

    navigateTo('landing'); // Navigate back to landing page.
    console.log("Admin status gedeactiveerd en genavigeerd naar landing.");
  };

  // Props to pass down to view components.
  const pageProps = { theme, toggleTheme, themeColors: currentThemeColors, isAdmin };

  // Determine which view component to render based on `currentView` state.
  let viewComponent;
  if (currentView === 'landing') { viewComponent = <LandingPage onNavigateToDashboard={() => navigateTo('dashboard')} onNavigateToTimeline={() => navigateTo('timeline')} onNavigateToContact={() => navigateTo('contact')} onNavigateToAdminLogin={() => navigateTo('adminLogin')} {...pageProps} />; }
  else if (currentView === 'adminLogin') { viewComponent = <AdminLoginPage onSuccessfulAdminLogin={handleSuccessfulAdminLogin} onBackToLanding={() => navigateTo('landing')} themeColors={currentThemeColors} />; }
  else if (currentView === 'timeline') { viewComponent = <MyJourneyTimelinePage onBackToHome={() => navigateTo('landing')} onNavigateToDashboard={() => navigateTo('dashboard')} onNavigateToContact={() => navigateTo('contact')} {...pageProps} />; }
  else if (currentView === 'contact') { viewComponent = <ContactPage onBackToHome={() => navigateTo('landing')} onNavigateToDashboard={() => navigateTo('dashboard')} {...pageProps} />; }
  else if (currentView === 'dashboard') { viewComponent = <DashboardView onBackToLanding={() => navigateTo('landing')} currentTheme={theme} toggleTheme={toggleTheme} themeColors={currentThemeColors} onNavigateToTimeline={() => navigateTo('timeline')} onNavigateToContact={() => navigateTo('contact')} userId={isAdmin ? ADMIN_DATA_OWNER_ID : currentUser?.uid} isAdmin={isAdmin} onAdminLogout={handleAdminLogout} navigateTo={navigateTo}/>; }
  else { viewComponent = <div className={`min-h-screen ${currentThemeColors.bg} flex justify-center items-center ${currentThemeColors.text} font-inter`}><p>Ongeldige weergave.</p></div>; } // Fallback for invalid view.

  // Show loading message until Firebase auth is ready.
  if (!isAuthReady) { return <div className={`min-h-screen ${currentThemeColors.bg} flex justify-center items-center ${currentThemeColors.text} font-inter`}><p>Authenticatie laden...</p></div>; }

  // Render the main application structure.
  return (
    <div className="flex flex-col min-h-screen"> {/* Main container ensures footer is at bottom */}
      <div id="page-container" className="flex-grow transition-opacity duration-200 ease-in-out" style={{opacity: 1}}>
        {viewComponent}
      </div>
      <FloatingCallButton themeColors={currentThemeColors} /> {/* Persistent call button */}
      <Footer themeColors={currentThemeColors} /> {/* App footer */}
    </div>
  );
};

export default App;
