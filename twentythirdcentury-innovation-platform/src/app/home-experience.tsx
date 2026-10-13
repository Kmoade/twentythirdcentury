"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  Heart,
  HeartHandshake,
  Headphones,
  Lightbulb,
  LifeBuoy,
  Menu,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Waves,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type Specialist = {
  id: string;
  name: string;
  role: string;
  summary: string;
  opening: string;
  icon: LucideIcon;
  tone: string;
  badge: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type Story = {
  id: string;
  tag: string;
  title: string;
  description: string;
  readTime: string;
  icon: LucideIcon;
  color: string;
  body: string[];
};

type CommunityPost = {
  id: string;
  author: string;
  initials: string;
  time: string;
  tag: string;
  body: string;
  likes: number;
  color: string;
};

const specialists: Specialist[] = [
  {
    id: "mira",
    name: "Mira",
    role: "Calm companion",
    summary: "A softer place to start, one small step at a time.",
    opening:
      "Hey, I’m Mira. We can take this one step at a time. What feels most present for you right now?",
    icon: HeartHandshake,
    tone: "lilac",
    badge: "A MOMENT TO BREATHE",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Tech scout",
    summary: "Make sense of new technology and find what matters to you.",
    opening:
      "Hi, I’m Atlas. Bring me a technology question, a new idea, or something you’re curious about. Where should we begin?",
    icon: Compass,
    tone: "aqua",
    badge: "CURIOUS BY NATURE",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Creative spark",
    summary: "Turn a half-formed thought into one doable next move.",
    opening:
      "Hi, I’m Nova. Big ideas are welcome, and so are tiny ones. What have you been wanting to make or try?",
    icon: Lightbulb,
    tone: "peach",
    badge: "MAKE A LITTLE SOMETHING",
  },
];

const stories: Story[] = [
  {
    id: "edge-ai",
    tag: "AI, CLOSER TO HOME",
    title: "The next AI wave is happening on your device",
    description:
      "Smaller models are bringing useful, more personal tools to phones and laptops — sometimes without sending your question to the cloud.",
    readTime: "4 min read",
    icon: Sparkles,
    color: "story-violet",
    body: [
      "For a long time, the most capable AI lived in enormous data centers. A quieter shift is bringing more of that capability onto the devices we already carry.",
      "Smaller models can help with everyday tasks like organizing notes, summarizing a long page, or making a tool work when a connection is spotty. The trade-off is that a small model is not magic: it can still make mistakes, and it has less room to know everything.",
      "The hopeful part is choice. As these tools improve, more people can experiment with technology that is useful, personal, and designed around real life — not just the next big demo.",
    ],
  },
  {
    id: "agents",
    tag: "THE NEW INTERFACE",
    title: "AI agents are learning to do the small stuff",
    description:
      "A look at the emerging helpers that can connect a few steps together — and why keeping a human in the loop matters.",
    readTime: "5 min read",
    icon: Zap,
    color: "story-yellow",
    body: [
      "An AI agent is a tool that can try a sequence of steps toward a goal: find a file, sort a list, or draft a plan. That sounds simple, but it changes how we interact with software.",
      "The best use cases are still practical and bounded. People remain in charge of what an agent can access, what it can change, and whether its suggestions are actually right.",
      "This is not about replacing human judgment. It is about making technology a little less exhausting — and leaving more time for the parts of life that need a person.",
    ],
  },
  {
    id: "clean-energy",
    tag: "BETTER BY DESIGN",
    title: "Why the future of tech also runs on better batteries",
    description:
      "From repairable gadgets to smarter grids, a more sustainable tech future is built one useful upgrade at a time.",
    readTime: "3 min read",
    icon: Waves,
    color: "story-green",
    body: [
      "The most exciting technology is not always the flashiest. Batteries, power systems, and the design choices behind our everyday devices shape how much energy our digital lives need.",
      "Researchers and engineers are exploring new chemistries, longer-lasting products, and ways to reuse materials. Progress is real, but it takes patience, investment, and thoughtful design.",
      "A better future is not one perfect invention. It is lots of practical ideas that make the things we use work better for more people, for longer.",
    ],
  },
];

const initialPosts: CommunityPost[] = [
  {
    id: "note-1",
    author: "softsignal",
    initials: "ss",
    time: "4h ago",
    tag: "A SMALL WIN",
    body: "A reminder I needed today: making it through a hard morning is still making it through something.",
    likes: 28,
    color: "post-lilac",
  },
  {
    id: "note-2",
    author: "pixelsandtea",
    initials: "pt",
    time: "6h ago",
    tag: "MADE A THING",
    body: "Built the tiniest pixel plant after work. It has three leaves and zero responsibilities. Feeling weirdly proud.",
    likes: 41,
    color: "post-mint",
  },
  {
    id: "note-3",
    author: "tomorrowclub",
    initials: "tc",
    time: "yesterday",
    tag: "GOOD SIGNAL",
    body: "You do not have to feel hopeful every second to keep a little room open for what might get better.",
    likes: 63,
    color: "post-peach",
  },
];

const moods = [
  { id: "heavy", face: "☁️", label: "A lot" },
  { id: "low", face: "🌧️", label: "A little heavy" },
  { id: "in-between", face: "🌤️", label: "In-between" },
  { id: "curious", face: "🌱", label: "Curious" },
  { id: "bright", face: "☀️", label: "Ready for more" },
];

const moodNotes: Record<string, string> = {
  heavy: "Thanks for being honest. You don’t have to solve the whole day right now.",
  low: "It’s okay to take things gently. One kind thing for yourself is enough to begin.",
  "in-between": "In-between is a real place to be. You can start exactly where you are.",
  curious: "Curiosity is a lovely place to begin. Follow one small question today.",
  bright: "We’re glad you’re here. Let’s put a little of that energy toward something you care about.",
};

const musicSearches = [
  { label: "New releases", mood: "Find something brand new", query: "new music releases this week", color: "music-lime" },
  { label: "Going viral", mood: "Songs people are sharing", query: "viral songs right now", color: "music-lilac" },
  { label: "Indie energy", mood: "A little lift, a little heart", query: "new indie pop music", color: "music-peach" },
];

function shuffleNumbers() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [numbers[index], numbers[swapIndex]] = [numbers[swapIndex], numbers[index]];
  }
  return numbers;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function HomeExperience() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<Specialist | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postDraft, setPostDraft] = useState("");
  const [gameState, setGameState] = useState<"ready" | "playing" | "done">("ready");
  const [gameTime, setGameTime] = useState(30);
  const [gameScore, setGameScore] = useState(0);
  const [gameBoard, setGameBoard] = useState<number[]>(() => shuffleNumbers());
  const [nextNumber, setNextNumber] = useState(1);
  const [activeSound, setActiveSound] = useState("soft-reset");
  const [soundPlaying, setSoundPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<{ context: AudioContext; oscillators: OscillatorNode[] } | null>(null);

  useEffect(() => {
    if (activeGuide || helpOpen || selectedStory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeGuide, helpOpen, selectedStory]);

  useEffect(() => {
    if (!activeGuide) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeGuide, messages, chatLoading]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = window.setInterval(() => {
      setGameTime((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer);
          setGameState("done");
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameState]);

  useEffect(
    () => () => {
      if (audioRef.current) {
        audioRef.current.oscillators.forEach((oscillator) => {
          try {
            oscillator.stop();
          } catch {
            // The oscillator may already be stopped.
          }
        });
        void audioRef.current.context.close();
      }
    },
    [],
  );

  function navigateTo(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openGuide(guide: Specialist) {
    setActiveGuide(guide);
    setMessages([{ id: makeId(), role: "assistant", content: guide.opening }]);
    setPreviewMode(true);
    setDraft("");
  }

  async function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || !activeGuide || chatLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: makeId(), role: "user", content },
    ];
    setMessages(nextMessages);
    setDraft("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialist: activeGuide.id,
          messages: nextMessages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      });
      const result = (await response.json()) as { reply?: string; preview?: boolean; error?: string };
      if (!response.ok || !result.reply) {
        throw new Error(result.error || "The guide could not reply right now.");
      }
      setPreviewMode(Boolean(result.preview));
      setMessages((current) => [
        ...current,
        { id: makeId(), role: "assistant", content: result.reply ?? "" },
      ]);
    } catch {
      setPreviewMode(true);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            "I’m sorry, I couldn’t reach the guide just now. You still deserve support. If it helps, try naming one thing you can see, one thing you can feel, and one person you could reach out to.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function openSupport() {
    setHelpOpen(true);
  }

  function startGame() {
    setGameBoard(shuffleNumbers());
    setNextNumber(1);
    setGameScore(0);
    setGameTime(30);
    setGameState("playing");
  }

  function chooseGameTile(value: number) {
    if (gameState !== "playing") return;
    if (value !== nextNumber) {
      setNextNumber(1);
      setGameBoard(shuffleNumbers());
      return;
    }
    if (value === 9) {
      setGameScore((score) => score + 1);
      setNextNumber(1);
      setGameBoard(shuffleNumbers());
    } else {
      setNextNumber(value + 1);
    }
  }

  function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = postDraft.trim();
    if (!body) return;
    setPosts((current) => [
      {
        id: makeId(),
        author: "you",
        initials: "you",
        time: "just now",
        tag: "A NOTE FROM YOU",
        body,
        likes: 0,
        color: "post-mint",
      },
      ...current,
    ]);
    setPostDraft("");
  }

  function toggleSound() {
    if (audioRef.current) {
      audioRef.current.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already be stopped.
        }
      });
      void audioRef.current.context.close();
      audioRef.current = null;
      setSoundPlaying(false);
      return;
    }

    try {
      const context = new window.AudioContext();
      const master = context.createGain();
      master.gain.value = 0.025;
      master.connect(context.destination);
      const frequencies: Record<string, number[]> = {
        "soft-reset": [174.61, 261.63, 349.23],
        "little-lift": [220, 277.18, 329.63],
        "deep-focus": [130.81, 196, 261.63],
      };
      const oscillators = (frequencies[activeSound] ?? frequencies["soft-reset"]).map((frequency, index) => {
        const oscillator = context.createOscillator();
        const layer = context.createGain();
        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        layer.gain.value = index === 0 ? 0.55 : 0.2;
        oscillator.connect(layer);
        layer.connect(master);
        oscillator.start();
        return oscillator;
      });
      audioRef.current = { context, oscillators };
      setSoundPlaying(true);
    } catch {
      setSoundPlaying(false);
    }
  }

  function chooseSound(id: string) {
    if (audioRef.current) {
      audioRef.current.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already be stopped.
        }
      });
      void audioRef.current.context.close();
      audioRef.current = null;
      setSoundPlaying(false);
    }
    setActiveSound(id);
  }

  function closeModals() {
    setHelpOpen(false);
    setSelectedStory(null);
    setActiveGuide(null);
  }

  useEffect(() => {
    if (!activeGuide && !helpOpen && !selectedStory) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModals();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // The modal state controls the listener lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGuide, helpOpen, selectedStory]);

  const bottomNavigation = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "guides", label: "Guides", icon: MessageCircle },
    { id: "discover", label: "Explore", icon: Compass },
    { id: "sound", label: "Sound", icon: Headphones },
  ];

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <button className="brand-lockup" onClick={() => navigateTo("home")} aria-label="TwentyThirdCentury home">
          <span className="brand-mark"><span>23</span><Sparkles size={12} /></span>
          <span className="brand-wordmark">twentythird<span>century</span><small>THE FUTURE IS YOURS</small></span>
        </button>

        <div className="side-label">YOUR SPACE</div>
        <nav className="side-navigation" aria-label="Main navigation">
          {[
            { id: "home", label: "The horizon", icon: Sparkles },
            { id: "guides", label: "AI companions", icon: MessageCircle },
            { id: "discover", label: "Tech frontier", icon: Compass },
            { id: "play", label: "Pocket game", icon: Zap },
            { id: "sound", label: "Music & moods", icon: Headphones },
            { id: "community", label: "Good signal", icon: Heart },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`side-nav-item ${activeSection === item.id ? "is-active" : ""}`}
                onClick={() => navigateTo(item.id)}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.id === "guides" && <span className="nav-count">3</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />

        <div className="side-hope-card">
          <div className="side-hope-spark"><Sparkles size={16} /></div>
          <p>“You don’t have to see the whole staircase.”</p>
          <span>Just the next step.</span>
        </div>
        <button className="side-support-button" onClick={openSupport}>
          <LifeBuoy size={17} />
          <span>Talk to someone</span>
          <ArrowUpRight size={14} className="support-arrow" />
        </button>
        <div className="sidebar-footer"><span className="status-dot" /> A human-first space</div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => navigateTo("home")} aria-label="Go to home">
            <span className="brand-mark"><span>23</span><Sparkles size={11} /></span>
            <span>twentythirdcentury</span>
          </button>
          <div className="topbar-kicker"><span className="topbar-live-dot" /> A little space for what’s next</div>
          <div className="topbar-actions">
            <span className="topbar-mantra">Keep going, at your pace.</span>
            <button className="top-support-button" onClick={openSupport}>
              <LifeBuoy size={15} /> <span>Need a human?</span>
            </button>
          </div>
        </header>

        <main className="dashboard">
          <section className="support-banner" aria-label="Support is available">
            <div className="support-banner-icon"><HeartHandshake size={18} /></div>
            <div className="support-banner-copy">
              <strong>Going through something heavy?</strong>
              <span>You deserve real support, not just a screen.</span>
            </div>
            <button onClick={openSupport}>Find immediate support <ArrowUpRight size={15} /></button>
          </section>

          <section className="hero-panel" id="home">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> A NEW DAY. A NEW POSSIBILITY.</div>
              <h1>The future is<br /><em>still</em> yours to build.</h1>
              <p>Whatever today feels like, it isn’t the whole story. Find a little support, follow a spark of curiosity, and take your next step at your own pace.</p>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => openGuide(specialists[0])}>
                  Talk it through <ArrowRight size={16} />
                </button>
                <button className="hero-text-link" onClick={() => navigateTo("discover")}>
                  Explore what’s next <ArrowDownRight size={16} />
                </button>
              </div>
              <div className="hero-caption"><span className="caption-stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></span> Small steps count. So do you.</div>
            </div>

            <div className="hero-art" aria-label="An illustration of a glowing horizon">
              <div className="hero-glow hero-glow-one" />
              <div className="hero-glow hero-glow-two" />
              <div className="orbit orbit-outer" />
              <div className="orbit orbit-middle" />
              <div className="orbit orbit-inner" />
              <div className="planet-core"><span>23</span><small>YOUR HORIZON</small></div>
              <span className="orbit-spark spark-one"><Sparkles size={15} /></span>
              <span className="orbit-spark spark-two"><Star size={12} fill="currentColor" /></span>
              <span className="orbit-spark spark-three"><span /></span>
              <div className="hope-note-card">
                <div className="hope-note-top"><span className="tiny-sun"><Sparkles size={13} /></span> A NOTE FOR TODAY</div>
                <p>There is more ahead<br />than you can see from here.</p>
                <span className="hope-note-signoff">keep a little room for it <span>↗</span></span>
              </div>
              <span className="hero-orbit-caption">NO RUSH. JUST POSSIBILITY.</span>
            </div>
          </section>

          <section className="checkin-section" aria-labelledby="checkin-heading">
            <div className="section-heading checkin-heading">
              <div>
                <span className="section-kicker">A QUICK CHECK-IN</span>
                <h2 id="checkin-heading">How are you arriving today?</h2>
                <p>No score. No pressure. Just a moment to notice.</p>
              </div>
              <span className="checkin-private"><ShieldCheck size={14} /> Just for this moment</span>
            </div>
            <div className="mood-row">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  className={`mood-option ${selectedMood === mood.id ? "selected" : ""}`}
                  onClick={() => setSelectedMood(mood.id)}
                  aria-pressed={selectedMood === mood.id}
                >
                  <span className="mood-face" aria-hidden="true">{mood.face}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <div className="mood-response" role="status">
                <Sparkles size={15} /> <span>{moodNotes[selectedMood]}</span>
                {selectedMood === "heavy" && <button onClick={openSupport}>Talk to a person <ArrowRight size={13} /></button>}
              </div>
            )}
          </section>

          <section className="section-block" id="guides" aria-labelledby="guides-heading">
            <div className="section-heading section-heading-row">
              <div>
                <span className="section-kicker">IN YOUR CORNER</span>
                <h2 id="guides-heading">Meet your AI companions.</h2>
                <p>Different kinds of help for wherever you are right now.</p>
              </div>
              <span className="section-aside-note">A starting point, not a substitute for human care.</span>
            </div>
            <div className="guides-grid">
              {specialists.map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <button key={guide.id} className={`guide-card guide-${guide.tone}`} onClick={() => openGuide(guide)}>
                    <div className="guide-card-top">
                      <span className="guide-avatar"><Icon size={20} strokeWidth={1.8} /></span>
                      <span className="guide-arrow"><ArrowUpRight size={17} /></span>
                    </div>
                    <span className="guide-badge">{guide.badge}</span>
                    <h3>{guide.name}<span className="guide-dot">.</span></h3>
                    <p className="guide-role">{guide.role}</p>
                    <p className="guide-summary">{guide.summary}</p>
                    <span className="guide-card-footer"><span className="online-dot" /> Here when you need a starting point <ChevronRight size={14} /></span>
                    <span className="guide-index">0{index + 1}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="frontier-section section-block" id="discover" aria-labelledby="frontier-heading">
            <div className="section-heading section-heading-row">
              <div>
                <span className="section-kicker">THE WORLD KEEPS MOVING</span>
                <h2 id="frontier-heading">A glimpse of what’s next.</h2>
                <p>Curious about the tech shaping tomorrow? Start here.</p>
              </div>
              <span className="watchlist-label"><span /> THE FRONTIER WATCHLIST</span>
            </div>
            <div className="discovery-grid">
              <div className="tech-card">
                <div className="tech-card-head">
                  <div className="tech-head-icon"><Sparkles size={17} /></div>
                  <div><span className="tech-head-eyebrow">FRESH IDEAS, CLEAR SIGNAL</span><h3>Trending in technology</h3></div>
                  <span className="curated-tag">CURATED</span>
                </div>
                <div className="story-list">
                  {stories.map((story, index) => {
                    const Icon = story.icon;
                    return (
                      <button key={story.id} className="story-row" onClick={() => setSelectedStory(story)}>
                        <span className={`story-icon ${story.color}`}><Icon size={17} /></span>
                        <span className="story-copy">
                          <span className="story-tag">{story.tag}</span>
                          <strong>{story.title}</strong>
                          <span className="story-meta"><Clock3 size={12} /> {story.readTime}</span>
                        </span>
                        <span className="story-row-arrow"><ArrowUpRight size={16} /></span>
                        <span className="story-row-index">0{index + 1}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="tech-card-foot"><Sparkles size={13} /> A hand-picked watchlist, not live headlines.</div>
              </div>

              <div className="game-card" id="play">
                <div className="game-card-top">
                  <span className="game-pill"><Zap size={12} fill="currentColor" /> POCKET-SIZE PLAY</span>
                  <span className="game-timer"><Timer size={14} /> {gameState === "playing" ? `00:${String(gameTime).padStart(2, "0")}` : "00:30"}</span>
                </div>
                <div className="game-intro">
                  <div>
                    <span className="section-kicker">A TINY RESET</span>
                    <h3>Orbit sequence</h3>
                    <p>Tap the numbers in order.<br />A small game. A fresh little focus.</p>
                  </div>
                  <div className="game-planet" aria-hidden="true"><span>✳</span><i /></div>
                </div>
                <div className="game-board" aria-label="Orbit sequence game board">
                  {gameBoard.map((number) => (
                    <button
                      key={number}
                      className={`game-tile ${gameState === "playing" && number === nextNumber ? "tile-next" : ""} ${gameState === "playing" ? "tile-playable" : ""}`}
                      onClick={() => chooseGameTile(number)}
                      disabled={gameState !== "playing"}
                      aria-label={`Number ${number}${gameState === "playing" && number === nextNumber ? ", next in sequence" : ""}`}
                    >{number}</button>
                  ))}
                </div>
                <div className="game-bottom">
                  <div className="game-score"><span className="score-star"><Star size={14} fill="currentColor" /></span><span><strong>{gameScore}</strong> {gameScore === 1 ? "orbit" : "orbits"}</span></div>
                  {gameState === "playing" ? (
                    <span className="game-next">NEXT <b>{nextNumber}</b></span>
                  ) : gameState === "done" ? (
                    <span className="game-next">ROUND COMPLETE</span>
                  ) : (
                    <span className="game-next">30 SEC · JUST FOR FUN</span>
                  )}
                  <button className="game-start-button" onClick={startGame}>{gameState === "playing" ? "Restart" : gameState === "done" ? "Again" : "Play"} <ArrowRight size={14} /></button>
                </div>
                <div className="game-end-note" aria-live="polite">
                  {gameState === "done" ? "That was your little reset. Nice work showing up." : gameState === "playing" ? "Find 1, then 2, all the way to 9." : "No high scores, no pressure. Just a moment for you."}
                </div>
              </div>
            </div>
          </section>

          <section className="section-block community-section" id="community" aria-labelledby="community-heading">
            <div className="section-heading section-heading-row">
              <div>
                <span className="section-kicker">THE GOOD SIGNAL</span>
                <h2 id="community-heading">A few words from the in-between.</h2>
                <p>Small wins, honest notes, and things worth carrying with you.</p>
              </div>
              <span className="community-count"><span className="community-live-dot" /> A softer corner of the internet</span>
            </div>
            <form className="post-composer" onSubmit={submitPost}>
              <span className="composer-avatar">you</span>
              <label className="sr-only" htmlFor="post-draft">Write a community note</label>
              <input
                id="post-draft"
                value={postDraft}
                onChange={(event) => setPostDraft(event.target.value)}
                maxLength={220}
                placeholder="Leave a kind thought, a tiny win, or a note for someone who needs it…"
              />
              <button type="submit" disabled={!postDraft.trim()}><span>Share a note</span><ArrowRight size={15} /></button>
            </form>
            <p className="community-demo-note">A gentle demo feed. Your note stays in this page session and isn’t saved.</p>
            <div className="community-grid">
              {posts.slice(0, 3).map((post) => (
                <article className={`community-card ${post.color}`} key={post.id}>
                  <div className="community-card-top">
                    <span className="post-avatar">{post.initials}</span>
                    <span className="post-author"><strong>@{post.author}</strong><span>{post.time}</span></span>
                    <span className="post-tag">{post.tag}</span>
                  </div>
                  <p className="post-body">“{post.body}”</p>
                  <div className="post-card-footer">
                    <button
                      className={`post-like ${likedPosts[post.id] ? "is-liked" : ""}`}
                      onClick={() => setLikedPosts((current) => ({ ...current, [post.id]: !current[post.id] }))}
                      aria-label={`${likedPosts[post.id] ? "Unlike" : "Like"} note by ${post.author}`}
                      aria-pressed={Boolean(likedPosts[post.id])}
                    ><Heart size={15} fill={likedPosts[post.id] ? "currentColor" : "none"} /> {post.likes + (likedPosts[post.id] ? 1 : 0)}</button>
                    <span><Sparkles size={13} /> Pass the good signal on</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section-block sound-section" id="sound" aria-labelledby="sound-heading">
            <div className="section-heading section-heading-row">
              <div>
                <span className="section-kicker">SOUNDTRACK YOUR NEXT STEP</span>
                <h2 id="sound-heading">Music for the moment you’re in.</h2>
                <p>Find a new favorite or make a little room to breathe.</p>
              </div>
              <span className="sound-note"><AudioLines size={15} /> TAKE WHAT YOU NEED</span>
            </div>
            <div className="music-grid">
              <div className="ambient-card">
                <div className="ambient-art" aria-hidden="true">
                  <div className="ambient-orbit ambient-orbit-a" />
                  <div className="ambient-orbit ambient-orbit-b" />
                  <div className="ambient-core"><Waves size={26} /></div>
                  <span className="ambient-star ambient-star-a">✳</span>
                  <span className="ambient-star ambient-star-b">✦</span>
                  <div className={`sound-bars ${soundPlaying ? "bars-active" : ""}`}><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
                </div>
                <div className="ambient-copy">
                  <span className="section-kicker">A LITTLE BREATHING SPACE</span>
                  <h3>Make a little room.</h3>
                  <p>Original, gentle tones made in your browser. No track list, no rush — just a quieter minute.</p>
                  <div className="ambient-controls">
                    <button className="ambient-play-button" onClick={toggleSound} aria-label={soundPlaying ? "Pause ambient tones" : "Play ambient tones"}>
                      {soundPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                      {soundPlaying ? "Pause the moment" : "Play a little calm"}
                    </button>
                    <span className="sound-original"><AudioLines size={13} /> ORIGINAL AMBIENT TONES</span>
                  </div>
                  <div className="tone-options" aria-label="Choose ambient tone">
                    {[
                      { id: "soft-reset", label: "Soft reset" },
                      { id: "little-lift", label: "Little lift" },
                      { id: "deep-focus", label: "Deep focus" },
                    ].map((tone) => (
                      <button key={tone.id} className={activeSound === tone.id ? "tone-active" : ""} onClick={() => chooseSound(tone.id)} aria-pressed={activeSound === tone.id}>{tone.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="music-discovery-card">
                <div className="music-discovery-head">
                  <span className="music-head-icon"><Music2 size={17} /></span>
                  <div><span className="section-kicker">FIND YOUR NEXT FAVORITE</span><h3>What’s moving right now?</h3></div>
                </div>
                <p className="music-discovery-intro">Explore live Spotify searches for fresh sounds, viral finds, and new indie favorites.</p>
                <div className="music-search-list">
                  {musicSearches.map((search) => (
                    <a
                      key={search.label}
                      className="music-search-row"
                      href={`https://open.spotify.com/search/${encodeURIComponent(search.query)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={`music-search-art ${search.color}`}><Music2 size={16} /></span>
                      <span className="music-search-copy"><strong>{search.label}</strong><small>{search.mood}</small></span>
                      <span className="music-live-link">EXPLORE <ExternalLink size={12} /></span>
                    </a>
                  ))}
                </div>
                <p className="music-disclaimer">Spotify results update in real time and may vary by region. Opens Spotify in a new tab.</p>
              </div>
            </div>
          </section>

          <footer className="page-footer">
            <div className="footer-brand"><span className="footer-star"><Sparkles size={16} /></span><span>Keep a little room for what’s next.</span></div>
            <div className="footer-meta"><span>AI companions aren’t therapists or crisis services.</span><button onClick={openSupport}>Find real-world support <ArrowUpRight size={13} /></button></div>
          </footer>
        </main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => navigateTo(item.id)} className={activeSection === item.id ? "mobile-nav-active" : ""}>
              <Icon size={19} strokeWidth={1.8} /><span>{item.label}</span>
            </button>
          );
        })}
        <button className="mobile-nav-help" onClick={openSupport}><LifeBuoy size={19} /><span>Help</span></button>
      </nav>

      {activeGuide && (
        <div className="dialog-backdrop chat-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveGuide(null); }}>
          <section className="chat-dialog" role="dialog" aria-modal="true" aria-labelledby="chat-title">
            <div className="chat-header">
              <div className={`chat-avatar guide-${activeGuide.tone}`}><activeGuide.icon size={20} /></div>
              <div className="chat-heading-copy"><span className="chat-online"><span /> HERE WITH YOU</span><h2 id="chat-title">Talk with {activeGuide.name}</h2><p>{activeGuide.role} · not a therapist</p></div>
              <button className="dialog-close" onClick={() => setActiveGuide(null)} aria-label="Close companion chat"><X size={19} /></button>
            </div>
            <div className="chat-context-note"><ShieldCheck size={14} /> This site doesn’t save chat history. If live AI is enabled, messages go to its AI provider. This chat isn’t monitored for emergencies.</div>
            <div className="chat-messages" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.role === "user" ? "message-user" : "message-guide"}`}>
                  {message.role === "assistant" && <span className="message-avatar"><activeGuide.icon size={13} /></span>}
                  <p>{message.content}</p>
                </div>
              ))}
              {chatLoading && <div className="chat-message message-guide"><span className="message-avatar"><activeGuide.icon size={13} /></span><div className="typing-indicator" aria-label="Companion is thinking"><i /><i /><i /></div></div>}
              <div ref={messagesEndRef} />
            </div>
            {messages.length <= 1 && (
              <div className="chat-prompts">
                <span>NOT SURE WHERE TO START?</span>
                {[
                  "I feel a little overwhelmed",
                  "Help me find one small next step",
                ].map((prompt) => <button key={prompt} onClick={() => { setDraft(prompt); chatInputRef.current?.focus(); }}>{prompt} <ArrowUpRight size={12} /></button>)}
              </div>
            )}
            <form className="chat-composer" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="chat-input">Write a message to {activeGuide.name}</label>
              <textarea
                ref={chatInputRef}
                id="chat-input"
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write what’s on your mind…"
                maxLength={1000}
                disabled={chatLoading}
              />
              <button type="submit" disabled={!draft.trim() || chatLoading} aria-label="Send message"><Send size={17} /></button>
            </form>
            <div className="chat-footer-note">
              <span>{previewMode ? "PREVIEW GUIDE · replies may be scripted" : "AI-GENERATED · can make mistakes"}</span>
              <span>Not therapy or crisis support</span>
            </div>
            <button className="chat-crisis-link" onClick={() => { setActiveGuide(null); setHelpOpen(true); }}><LifeBuoy size={13} /> Need help right now? Find a real person.</button>
          </section>
        </div>
      )}

      {helpOpen && (
        <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setHelpOpen(false); }}>
          <section className="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title">
            <button className="dialog-close support-dialog-close" onClick={() => setHelpOpen(false)} aria-label="Close support information"><X size={19} /></button>
            <div className="support-dialog-mark"><HeartHandshake size={25} /></div>
            <span className="section-kicker">YOU DESERVE A REAL PERSON</span>
            <h2 id="support-title">You don’t have to carry this alone.</h2>
            <p className="support-dialog-intro">If you might hurt yourself or someone else, or you don’t feel safe, reach out to a person who can help right now. This website isn’t monitored.</p>
            <div className="support-options">
              <a href="tel:988" className="support-option support-option-primary">
                <span className="support-option-icon"><LifeBuoy size={18} /></span>
                <span><strong>Call 988</strong><small>Suicide & Crisis Lifeline · U.S. and Canada</small></span>
                <ArrowUpRight size={17} />
              </a>
              <a href="sms:988" className="support-option support-option-primary">
                <span className="support-option-icon"><MessageCircle size={18} /></span>
                <span><strong>Text 988</strong><small>Call and text support · U.S. and Canada</small></span>
                <ArrowUpRight size={17} />
              </a>
              <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="support-option">
                <span className="support-option-icon"><Compass size={18} /></span>
                <span><strong>Find a local helpline</strong><small>Free, confidential support in 130+ countries</small></span>
                <ExternalLink size={16} />
              </a>
              <a href="tel:911" className="support-option">
                <span className="support-option-icon"><Heart size={18} /></span>
                <span><strong>Immediate danger?</strong><small>Call your local emergency number now</small></span>
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="support-dialog-foot"><ShieldCheck size={14} /> If calling feels hard, ask someone you trust to stay with you while you reach out.</div>
          </section>
        </div>
      )}

      {selectedStory && (
        <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStory(null); }}>
          <article className="story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-dialog-title">
            <button className="dialog-close" onClick={() => setSelectedStory(null)} aria-label="Close story"><X size={19} /></button>
            <span className="story-dialog-icon"><selectedStory.icon size={21} /></span>
            <span className="section-kicker">{selectedStory.tag} · THE FRONTIER</span>
            <h2 id="story-dialog-title">{selectedStory.title}</h2>
            <p className="story-dialog-intro">{selectedStory.description}</p>
            <div className="story-dialog-meta"><Clock3 size={14} /> {selectedStory.readTime} <span /> A hopeful, human take on technology</div>
            <div className="story-dialog-body">{selectedStory.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <button
              className={`save-story-button ${savedStories[selectedStory.id] ? "saved" : ""}`}
              onClick={() => setSavedStories((current) => ({ ...current, [selectedStory.id]: !current[selectedStory.id] }))}
            >{savedStories[selectedStory.id] ? <Check size={15} /> : <Bookmark size={15} />}{savedStories[selectedStory.id] ? "Saved for later" : "Keep this idea"}</button>
          </article>
        </div>
      )}
    </div>
  );
}
