import React, { useState, useEffect, useCallback } from "react";
import { Flame, BookOpen, Layers, Check, X, RotateCcw, Award, ChevronRight, Map as MapIcon, ArrowLeft } from "lucide-react";

// ---------- Palette (applied via inline style, not Tailwind arbitrary classes) ----------
const C = {
  ink: "#16233D",       // deep navy - header / dark surfaces
  parchment: "#EFE8D8", // page background
  parchmentDeep: "#E3D9C2",
  sage: "#5F8567",      // success / road fill
  brass: "#C79A3F",     // highlight / streak
  rust: "#A8503A",      // "don't know yet" / miss
  charcoal: "#2B2A26",  // body text
  cream: "#FAF7EE",
};

const FONT_DISPLAY = '"Iowan Old Style", "Palatino Linotype", Georgia, "Times New Roman", serif';
const FONT_BODY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif';
const FONT_MONO = '"SF Mono", "JetBrains Mono", Menlo, monospace';

// ---------- Story content (Phase 1 — controlled vocabulary) ----------
const STORIES = [
  {
    id: "creation",
    phase: 1,
    title: "The First Days",
    subtitle: "Genesis 1",
    paragraphs: [
      "In the beginning, there was no earth. There was no light. God said, \"Let there be light.\" And there was light.",
      "God made the sky. God made the earth. God made the sea.",
      "God said, \"Let there be plants.\" Green plants grew on the earth.",
      "God made the sun. God made the moon. God made the stars.",
      "God made fish for the sea. God made birds for the sky.",
      "God made animals for the earth. Big animals and small animals.",
      "Then God made a man. His name was Adam. God made a woman. Her name was Eve.",
      "God looked at everything He made. It was good.",
    ],
    vocab: [
      ["beginning", "início"], ["earth", "terra"], ["light", "luz"], ["sky", "céu"],
      ["sea", "mar"], ["plant", "planta"], ["grew", "cresceu"], ["sun", "sol"],
      ["moon", "lua"], ["star", "estrela"], ["fish", "peixe"], ["bird", "pássaro"],
      ["animal", "animal"], ["man", "homem"], ["woman", "mulher"], ["name", "nome"],
      ["everything", "tudo"], ["good", "bom"],
    ],
  },
  {
    id: "adam-eve",
    phase: 1,
    title: "Adam and Eve",
    subtitle: "Genesis 2-3",
    paragraphs: [
      "God put Adam and Eve in a beautiful garden. The garden had many trees. The trees had good fruit.",
      "God said, \"You can eat fruit from every tree. But do not eat fruit from this one tree.\"",
      "A snake talked to Eve. The snake said, \"Eat the fruit. It is good.\"",
      "Eve ate the fruit. She gave some to Adam. Adam ate it too.",
      "Now Adam and Eve were afraid. They hid from God.",
      "God asked, \"Why do you hide?\"",
      "Adam said, \"We ate the fruit.\"",
      "God was sad. Adam and Eve had to leave the garden.",
    ],
    vocab: [
      ["garden", "jardim"], ["tree", "árvore"], ["fruit", "fruta"], ["eat", "comer"],
      ["snake", "cobra"], ["talked", "falou"], ["afraid", "com medo"], ["hid", "escondeu"],
      ["asked", "perguntou"], ["why", "por quê"], ["sad", "triste"], ["leave", "sair"],
    ],
  },
  {
    id: "noah",
    phase: 2,
    title: "Noah and the Big Boat",
    subtitle: "Genesis 6-9",
    paragraphs: [
      "Many years after Adam and Eve, people on earth were not good. They did bad things every day.",
      "God looked at the earth. He was sad. But one man was different. His name was Noah. Noah loved God.",
      "God said to Noah, \"I will send a big flood. Water will cover the earth. Build a boat. A very big boat.\"",
      "Noah said, \"How big?\"",
      "God told him the size. It was very, very big.",
      "Noah worked for many years. He built the boat with wood. His sons helped him.",
      "When the boat was ready, God said, \"Bring two of every animal. A male and a female. Bring your family too.\"",
      "Noah brought his wife, his sons, and their wives. He brought animals — lions, elephants, birds, and many more.",
      "Then it started to rain. It rained for forty days and forty nights. Water covered the whole earth. Only Noah's boat stayed safe on the water.",
      "After many days, the rain stopped. Noah waited. He sent out a bird to look for dry land. The bird came back — no land yet.",
      "Noah waited seven more days. He sent the bird again. This time, the bird came back with a green leaf. Dry land was near!",
      "Finally, the boat stopped on a mountain. Noah opened the door. Everyone came out — his family and all the animals.",
      "Noah said thank you to God. God made a promise. He put a rainbow in the sky. \"This rainbow is my promise,\" God said. \"I will never send a flood like this again.\"",
    ],
    vocab: [
      ["many", "muitos"], ["people", "pessoas"], ["bad", "mau"], ["different", "diferente"],
      ["loved", "amou"], ["send", "enviar"], ["flood", "enchente"], ["cover", "cobrir"],
      ["build", "construir"], ["boat", "barco"], ["wood", "madeira"], ["worked", "trabalhou"],
      ["son", "filho"], ["ready", "pronto"], ["bring", "trazer"], ["male", "macho"],
      ["female", "fêmea"], ["family", "família"], ["wife", "esposa"], ["rained", "choveu"],
      ["stopped", "parou"], ["waited", "esperou"], ["dry", "seco"], ["land", "terra firme"],
      ["near", "perto"], ["finally", "finalmente"], ["mountain", "montanha"], ["door", "porta"],
      ["promise", "promessa"], ["rainbow", "arco-íris"], ["never", "nunca"], ["again", "de novo"],
    ],
  },
  {
    id: "joseph",
    phase: 2,
    title: "Joseph and His Brothers",
    subtitle: "Genesis 37-45",
    paragraphs: [
      "Jacob had twelve sons. He loved Joseph more than the others. He gave Joseph a beautiful coat.",
      "Joseph's brothers were angry. They did not like that their father loved Joseph more.",
      "One night, Joseph had a dream. In the dream, his brothers bowed down to him. Joseph told his brothers about the dream. This made them more angry.",
      "One day, the brothers took Joseph and sold him. Men took Joseph far away, to Egypt. He became a slave there.",
      "But God was with Joseph. Joseph worked hard. He was smart and honest. Soon, an important man trusted him with everything.",
      "Later, Joseph had trouble. A woman lied about him. Joseph went to prison. But even in prison, Joseph did not give up. He helped other men understand their dreams.",
      "One night, the king of Egypt had strange dreams. No one could understand them. Someone remembered Joseph. \"He understands dreams,\" the man said.",
      "The king called for Joseph. Joseph listened to the dreams. He said, \"Seven years of good food are coming. Then seven years of no food will come. Egypt must save food now.\"",
      "The king was impressed. He made Joseph a powerful leader. Joseph saved food for many years.",
      "When the hard years came, Joseph's brothers traveled to Egypt to buy food. They did not know it was Joseph — he looked different now, and spoke like an Egyptian leader.",
      "Joseph recognized them. At first, he was quiet. But then he told them the truth: \"I am Joseph, your brother.\"",
      "The brothers were afraid. But Joseph forgave them. He said, \"God used this for good. You meant to hurt me, but God saved many lives.\"",
      "Joseph brought his whole family to Egypt. They lived together again, safe and happy.",
    ],
    vocab: [
      ["brother", "irmão"], ["coat", "casaco"], ["angry", "com raiva"], ["dream", "sonho"],
      ["bowed", "curvou-se"], ["sold", "vendeu"], ["slave", "escravo"], ["smart", "esperto"],
      ["honest", "honesto"], ["trusted", "confiou"], ["trouble", "problema"], ["lied", "mentiu"],
      ["prison", "prisão"], ["understand", "entender"], ["strange", "estranho"], ["remembered", "lembrou"],
      ["listened", "escutou"], ["saved", "salvou"], ["powerful", "poderoso"], ["leader", "líder"],
      ["traveled", "viajou"], ["recognized", "reconheceu"], ["truth", "verdade"], ["forgave", "perdoou"],
      ["hurt", "machucar"], ["together", "juntos"],
    ],
  },
  {
    id: "moses",
    phase: 2,
    title: "Moses and the Red Sea",
    subtitle: "Exodus 1-14",
    paragraphs: [
      "Many years later, Pharaoh was the king of Egypt. The people of Israel were slaves in Egypt. They worked very hard every day.",
      "God saw their pain. God chose a man named Moses to help them. Moses said to Pharaoh, \"Let my people go.\"",
      "Pharaoh said no. God sent many hard things to Egypt. Still, Pharaoh said no.",
      "Finally, Pharaoh let the people go. Moses led them out of Egypt. Thousands of people walked together.",
      "But then Pharaoh changed his mind. He sent his army after them. Horses and soldiers moved fast.",
      "The people of Israel came to the Red Sea. Water was in front of them. The army was behind them. They were afraid.",
      "Moses lifted his hand. God pushed the water apart. Dry ground appeared in the middle of the sea!",
      "The people walked through the sea on dry ground. Walls of water stood on both sides.",
      "Pharaoh's army followed them into the sea. But God let the water come back together. The army could not follow anymore.",
      "The people of Israel were safe. They sang and thanked God for saving them.",
    ],
    vocab: [
      ["king", "rei"], ["pain", "dor"], ["chose", "escolheu"], ["army", "exército"],
      ["soldier", "soldado"], ["horse", "cavalo"], ["lifted", "levantou"], ["pushed", "empurrou"],
      ["appeared", "apareceu"], ["wall", "parede"], ["followed", "seguiu"], ["safe", "seguro"],
      ["sang", "cantou"], ["thanked", "agradeceu"],
    ],
  },
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const addDays = (dateStr, n) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const BOX_INTERVAL = { 1: 1, 2: 3, 3: 7 };

// builds a smooth S-curve path connecting a list of {x,y} points
function pathFromPoints(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1], p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function EnglishRoad() {
  const [tab, setTab] = useState("leitura");
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState({ completedStoryIds: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null, completedDays: [] });
  const [cards, setCards] = useState({}); // word -> {box, nextReview, pt}
  const [reviewIdx, setReviewIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  // ---- load ----
  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("progress");
        if (p) setProgress(JSON.parse(p.value));
      } catch (e) { /* no data yet */ }
      try {
        const c = await window.storage.get("flashcards");
        if (c) setCards(JSON.parse(c.value));
      } catch (e) { /* no data yet */ }
      setLoaded(true);
    })();
  }, []);

  const saveProgress = useCallback(async (next) => {
    setProgress(next);
    try { await window.storage.set("progress", JSON.stringify(next)); } catch (e) { console.error(e); }
  }, []);

  const saveCards = useCallback(async (next) => {
    setCards(next);
    try { await window.storage.set("flashcards", JSON.stringify(next)); } catch (e) { console.error(e); }
  }, []);

  const currentIndex = STORIES.findIndex(s => !progress.completedStoryIds.includes(s.id));
  const currentStory = currentIndex === -1 ? null : STORIES[currentIndex];
  const displayStory = selectedStoryId ? STORIES.find(s => s.id === selectedStoryId) : currentStory;

  const goToStory = (id) => {
    setSelectedStoryId(id);
    setJustCompleted(false);
    setTab("leitura");
  };

  const completeStory = async () => {
    if (!currentStory) return;
    const today = todayStr();
    const nextCards = { ...cards };
    currentStory.vocab.forEach(([word, pt]) => {
      if (!nextCards[word]) nextCards[word] = { box: 1, nextReview: today, pt };
    });
    await saveCards(nextCards);

    let { currentStreak, longestStreak, lastCompletedDate, completedDays } = progress;
    if (lastCompletedDate !== today) {
      if (lastCompletedDate === addDays(today, -1)) currentStreak += 1;
      else currentStreak = 1;
      longestStreak = Math.max(longestStreak, currentStreak);
      lastCompletedDate = today;
      completedDays = [...new Set([...completedDays, today])];
    }
    await saveProgress({
      completedStoryIds: [...progress.completedStoryIds, currentStory.id],
      currentStreak, longestStreak, lastCompletedDate, completedDays,
    });
    setJustCompleted(true);
  };

  const dueWords = Object.entries(cards).filter(([, v]) => v.nextReview <= todayStr()).map(([w]) => w);
  const activeWord = dueWords[reviewIdx];
  const activeCard = activeWord ? cards[activeWord] : null;

  const answerCard = async (knew) => {
    if (!activeWord) return;
    const c = cards[activeWord];
    const box = knew ? Math.min(3, c.box + 1) : 1;
    const nextReview = addDays(todayStr(), BOX_INTERVAL[box]);
    const next = { ...cards, [activeWord]: { ...c, box, nextReview } };
    await saveCards(next);
    setFlipped(false);
    setReviewIdx(i => i + 1);
  };

  const last7 = Array.from({ length: 7 }, (_, i) => addDays(todayStr(), i - 6));

  if (!loaded) return null;

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.parchment, minHeight: "100vh", color: C.charcoal }}>
      {/* Header */}
      <div style={{ background: C.ink, padding: "28px 20px 40px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.14em", color: C.brass, textTransform: "uppercase", margin: 0 }}>
            English Road
          </p>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.cream, margin: "6px 0 0", fontWeight: 500 }}>
            Sua jornada de leitura
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, color: C.brass }}>
            <Flame size={18} fill={C.brass} strokeWidth={0} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 14 }}>{progress.currentStreak} dia{progress.currentStreak !== 1 ? "s" : ""} seguidos</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 480, margin: "-20px auto 0", padding: "0 20px" }}>
        <div style={{ display: "flex", background: C.cream, borderRadius: 12, padding: 4, boxShadow: "0 4px 14px rgba(22,35,61,0.15)" }}>
          {[
            ["leitura", "Leitura", BookOpen],
            ["mapa", "Mapa", MapIcon],
            ["flashcards", "Flashcards", Layers],
            ["progresso", "Progresso", Award],
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setJustCompleted(false);
                setFlipped(false);
                setReviewIdx(0);
                if (key === "leitura") setSelectedStoryId(null);
              }}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "10px 4px", borderRadius: 9, border: "none", cursor: "pointer",
                background: tab === key ? C.ink : "transparent",
                color: tab === key ? C.cream : C.charcoal,
                fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 60px" }}>
        {tab === "leitura" && (
          <ReadingTab
            story={displayStory}
            justCompleted={justCompleted}
            onComplete={completeStory}
            onBackToMap={() => setTab("mapa")}
          />
        )}
        {tab === "mapa" && (
          <MapTab
            stories={STORIES}
            completedIds={progress.completedStoryIds}
            currentIndex={currentIndex}
            onSelect={goToStory}
          />
        )}
        {tab === "flashcards" && (
          <FlashcardTab
            totalDue={dueWords.length}
            activeWord={activeWord}
            activeCard={activeCard}
            flipped={flipped}
            setFlipped={setFlipped}
            onAnswer={answerCard}
            totalCards={Object.keys(cards).length}
          />
        )}
        {tab === "progresso" && (
          <ProgressTab progress={progress} last7={last7} totalWords={Object.keys(cards).length} />
        )}
      </div>
    </div>
  );

  function ReadingTab({ story, justCompleted, onComplete, onBackToMap }) {
    if (!story) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20 }}>Todas as histórias concluídas! 🎉</p>
          <p style={{ color: "#6b6a63", fontSize: 14, marginTop: 8 }}>Mais histórias chegam em breve.</p>
          <button onClick={onBackToMap} style={{
            marginTop: 16, background: "none", border: `1.5px solid ${C.ink}`, borderRadius: 10,
            padding: "8px 16px", color: C.ink, fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <MapIcon size={15} /> Ver mapa
          </button>
        </div>
      );
    }
    const isReplay = progress.completedStoryIds.includes(story.id);
    return (
      <div>
        <button onClick={onBackToMap} style={{
          background: "none", border: "none", color: C.rust, fontWeight: 700, fontSize: 13,
          display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0, marginBottom: 12,
        }}>
          <ArrowLeft size={14} /> Mapa
        </button>

        <div style={{ background: C.cream, borderRadius: 16, padding: "22px 20px", boxShadow: "0 2px 10px rgba(22,35,61,0.08)" }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.rust, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" }}>
            Fase {story.phase} · {story.subtitle}
          </p>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, margin: "6px 0 16px" }}>{story.title}</h2>
          {story.paragraphs.map((p, i) => (
            <p key={i} style={{ fontFamily: FONT_DISPLAY, fontSize: 17, lineHeight: 1.7, margin: "0 0 14px", color: C.charcoal }}>
              {p}
            </p>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#6b6a63", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>
            Vocabulário novo
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {story.vocab.map(([w, pt]) => (
              <span key={w} style={{ background: C.parchmentDeep, borderRadius: 8, padding: "6px 10px", fontSize: 13 }}>
                <b>{w}</b> <span style={{ color: "#6b6a63" }}>· {pt}</span>
              </span>
            ))}
          </div>
        </div>

        {isReplay ? (
          <div style={{ marginTop: 22, textAlign: "center", padding: "14px", borderRadius: 12, background: C.parchmentDeep, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Check size={16} color={C.sage} />
            <span style={{ fontSize: 14 }}>Você já concluiu essa história — só revisitando.</span>
          </div>
        ) : !justCompleted ? (
          <button onClick={onComplete} style={{
            marginTop: 22, width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: C.sage, color: C.cream, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
          }}>
            <Check size={18} /> Marcar como lida
          </button>
        ) : (
          <div style={{ marginTop: 22, textAlign: "center", padding: "14px", borderRadius: 12, background: C.parchmentDeep }}>
            <p style={{ margin: 0, fontSize: 14 }}>Boa! Vocabulário adicionado aos seus flashcards.</p>
            <button onClick={() => setTab("flashcards")} style={{
              marginTop: 10, background: "none", border: "none", color: C.ink, fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 14,
            }}>
              Revisar agora <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  function MapTab({ stories, completedIds, currentIndex, onSelect }) {
    const colX = [66, 214];
    const rowGap = 116;
    const topPad = 60;
    const points = stories.map((s, i) => ({ x: colX[i % 2], y: topPad + i * rowGap, story: s }));
    const height = topPad + (stories.length - 1) * rowGap + 60;
    const pathD = pathFromPoints(points);

    return (
      <div>
        <div style={{ background: C.cream, borderRadius: 16, padding: "10px 6px 4px", boxShadow: "0 2px 10px rgba(22,35,61,0.08)" }}>
          <svg viewBox={`0 0 280 ${height}`} width="100%" height={height}>
            <path d={pathD} fill="none" stroke={C.parchmentDeep} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke={C.brass} strokeWidth="3" strokeDasharray="14 12" strokeLinecap="round" opacity="0.7" />

            {points.map((p, i) => {
              const done = completedIds.includes(p.story.id);
              const isCurrent = i === currentIndex;
              const locked = !done && !isCurrent;
              const showPhaseLabel = i === 0 || stories[i].phase !== stories[i - 1].phase;
              const fill = done ? C.sage : isCurrent ? C.brass : C.parchmentDeep;
              return (
                <g key={p.story.id}>
                  {showPhaseLabel && (
                    <text x={p.x} y={p.y - 34} textAnchor="middle" fontSize="10" fill={C.rust}
                      fontFamily={FONT_MONO} letterSpacing="1" style={{ textTransform: "uppercase" }}>
                      Fase {p.story.phase}
                    </text>
                  )}
                  <g
                    transform={`translate(${p.x},${p.y})`}
                    onClick={() => !locked && onSelect(p.story.id)}
                    style={{ cursor: locked ? "default" : "pointer" }}
                  >
                    {isCurrent && <circle r="27" fill="none" stroke={C.brass} strokeWidth="2" opacity="0.45" />}
                    <circle r="20" fill={fill} stroke={C.ink} strokeWidth={locked ? 1.5 : 0} opacity={locked ? 0.7 : 1} />
                    {done ? (
                      <text y="6" textAnchor="middle" fontSize="17" fill={C.cream}>✓</text>
                    ) : locked ? (
                      <text y="6" textAnchor="middle" fontSize="13" fill="#8a8477">🔒</text>
                    ) : (
                      <text y="6" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.ink}>{i + 1}</text>
                    )}
                    {isCurrent && <text y="46" textAnchor="middle" fontSize="18">🏍️</text>}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {stories.map((s, i) => {
            const done = completedIds.includes(s.id);
            const isCurrent = i === currentIndex;
            const locked = !done && !isCurrent;
            return (
              <div key={s.id} onClick={() => !locked && goToStory(s.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                background: C.cream, borderRadius: 10, opacity: locked ? 0.55 : 1,
                cursor: locked ? "default" : "pointer",
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: done ? C.sage : isCurrent ? C.brass : C.parchmentDeep,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: done ? C.cream : C.ink,
                }}>
                  {done ? "✓" : i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500 }}>{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function FlashcardTab({ totalDue, activeWord, activeCard, flipped, setFlipped, onAnswer, totalCards }) {
    if (totalCards === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b6a63" }}>
          <Layers size={28} style={{ marginBottom: 10 }} />
          <p>Leia sua primeira história para desbloquear os flashcards.</p>
        </div>
      );
    }
    if (!activeWord) {
      return (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20 }}>Nada pendente por hoje ✓</p>
          <p style={{ color: "#6b6a63", fontSize: 14, marginTop: 8 }}>Você tem {totalCards} palavras na memória. Volte amanhã para a próxima revisão.</p>
        </div>
      );
    }
    return (
      <div>
        <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#6b6a63", marginBottom: 14 }}>{totalDue} pendente{totalDue !== 1 ? "s" : ""} hoje</p>
        <div
          onClick={() => setFlipped(f => !f)}
          style={{
            background: C.ink, borderRadius: 18, height: 220, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 6px 18px rgba(22,35,61,0.25)",
          }}
        >
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.brass, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {flipped ? "Português" : "English"}
          </p>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: C.cream, margin: "8px 0 0" }}>
            {flipped ? activeCard.pt : activeWord}
          </p>
          <p style={{ color: "#8b93a3", fontSize: 12, marginTop: 14 }}>toque para {flipped ? "voltar" : "ver a resposta"}</p>
        </div>

        {flipped && (
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => onAnswer(false)} style={{
              flex: 1, padding: "14px", borderRadius: 12, border: `1.5px solid ${C.rust}`, background: "none",
              color: C.rust, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
            }}>
              <RotateCcw size={16} /> Não sabia
            </button>
            <button onClick={() => onAnswer(true)} style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "none", background: C.sage,
              color: C.cream, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
            }}>
              <Check size={16} /> Sabia
            </button>
          </div>
        )}
      </div>
    );
  }

  function ProgressTab({ progress, last7, totalWords }) {
    const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
    return (
      <div>
        <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
          <Stat label="Sequência atual" value={progress.currentStreak} icon={Flame} />
          <Stat label="Recorde" value={progress.longestStreak} icon={Award} />
          <Stat label="Palavras" value={totalWords} icon={Layers} />
        </div>

        <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#6b6a63", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Últimos 7 dias
        </p>
        <div style={{ background: C.cream, borderRadius: 16, padding: "20px 16px", position: "relative" }}>
          {/* road */}
          <div style={{ position: "absolute", left: 16, right: 16, top: 44, height: 3, background: "repeating-linear-gradient(90deg, #d8d2bd 0 8px, transparent 8px 16px)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {last7.map((d, i) => {
              const done = progress.completedDays.includes(d);
              const isToday = d === todayStr();
              return (
                <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 30 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%", zIndex: 1,
                    background: done ? C.sage : C.parchmentDeep,
                    border: isToday ? `2px solid ${C.brass}` : "2px solid transparent",
                  }} />
                  <span style={{ fontSize: 11, color: "#6b6a63" }}>{dayLabels[new Date(d + "T00:00:00").getDay()]}</span>
                  {isToday && <span style={{ fontSize: 22, lineHeight: 1 }}>🏍️</span>}
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#6b6a63", marginTop: 18, lineHeight: 1.6 }}>
          Esmeralda te acompanha na estrada — cada dia de leitura é mais um quilômetro rodado até ler inglês com conforto.
        </p>
      </div>
    );
  }

  function Stat({ label, value, icon: Icon }) {
    return (
      <div style={{ flex: 1, background: C.cream, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
        <Icon size={16} color={C.brass} style={{ marginBottom: 6 }} />
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, margin: 0 }}>{value}</p>
        <p style={{ fontSize: 10, color: "#6b6a63", margin: "2px 0 0" }}>{label}</p>
      </div>
    );
  }
}
