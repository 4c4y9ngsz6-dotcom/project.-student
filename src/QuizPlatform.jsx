import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Compass, PenTool, Headphones,
  Drama, Languages, BookMarked, Feather, Type,
  Lock, Sparkles, ChevronLeft, Check, Trophy, Crown, Medal, Award,
  User, ArrowLeft, Zap, Users, Settings, Plus, Trash2, Upload,
  Download, Edit3, FileJson, Eye, EyeOff, LogOut, Mail, Github,
  AlertCircle, CheckCircle2, Instagram, FileText, X, Loader2,
  TrendingUp, Activity, Sparkle, UserPlus, ChevronRight
} from 'lucide-react';
import {
  auth, onAuthStateChanged,
  signInWithGoogle, signInWithGithub, signUpWithEmail, signInWithEmail, logout,
  recordAttempt, subscribeLeaderboard, subscribeMemberCount, subscribeRecentActivity, subscribeRecentMembers
} from './firebase.js';

// ================================================================
//  ⚙️ ADMIN CONFIG — غيّر كلمة مرور المسؤول من هنا
// ================================================================
const ADMIN_PASSWORD = 'mjassim2026';

// 📱 SOCIAL LINKS
const SOCIAL = {
  instagram: 'https://www.instagram.com/ham7_d?igsh=dHFrOHdiZWdqam54&utm_source=qr',
  telegram: 'https://t.me/m0_h0',
};

const KEY = {
  questions: (sid) => `questions_${sid}`,
  attempts: 'attempts_log',
};

const SUBJECTS = [
  { id: 'methods',   name: 'طرائق التدريس',  icon: GraduationCap, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' },
  { id: 'guidance',  name: 'الإرشاد التربوي', icon: Compass,       color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
  { id: 'writing',   name: 'الكتابة',        icon: PenTool,       color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)' },
  { id: 'listening', name: 'الإصغاء',        icon: Headphones,    color: '#f472b6', glow: 'rgba(244, 114, 182, 0.4)' },
  { id: 'drama',     name: 'المسرحية',       icon: Drama,         color: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)' },
  { id: 'language',  name: 'اللغة',          icon: Languages,     color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.4)' },
  { id: 'novel',     name: 'الرواية',        icon: BookMarked,    color: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)' },
  { id: 'poetry',    name: 'الشعر',          icon: Feather,       color: '#c084fc', glow: 'rgba(192, 132, 252, 0.4)' },
  { id: 'grammar',   name: 'النحو',          icon: Type,          color: '#facc15', glow: 'rgba(250, 204, 21, 0.4)' },
];

// ================================================================
//  📚 DEFAULT BUILT-IN QUESTIONS — embedded in code, always available
//  These don't require window.storage to work
// ================================================================
const DEFAULT_NOVEL_QUESTIONS = [
  {"q": "What does 'Wuthering' mean as explained in Chapter 1?", "options": ["Peaceful countryside", "Atmospheric tumult in stormy weather", "A type of farmhouse", "Deep valley"], "correct": 1},
  {"q": "Lockwood describes Heathcliff as 'a dark-skinned gypsy in aspect.' Who is the speaker?", "options": ["Nelly Dean", "Joseph", "Mr Lockwood", "Isabella"], "correct": 2},
  {"q": "Lockwood calls the moors 'a perfect ______' — what word completes this phrase?", "options": ["lover's retreat", "haunted wasteland", "misanthropist's Heaven", "Victorian paradise"], "correct": 2},
  {"q": "P.14 — 'You would intimate that her spirit has taken the post of ministering angel and guards the fortunes of Wuthering Heights.' Who says this?", "options": ["Nelly Dean", "Lockwood", "Heathcliff", "Joseph"], "correct": 2},
  {"q": "What name and date appear carved above the door of Wuthering Heights?", "options": ["Heathcliff 1800", "Hareton Earnshaw 1500", "Catherine Linton 1600", "Hindley Earnshaw 1750"], "correct": 1},
  {"q": "'He'll love and hate equally under cover.' Who says this and about whom?", "options": ["Nelly about Heathcliff", "Lockwood about Heathcliff", "Heathcliff about Catherine", "Joseph about Hindley"], "correct": 1},
  {"q": "Who rescues Lockwood from the attacking dogs in Chapter 1?", "options": ["Heathcliff", "Joseph", "Hareton", "The housekeeper"], "correct": 3},
  {"q": "Lockwood's instinct says Heathcliff's reserve springs from 'an aversion to showy displays of ______.'", "options": ["wealth", "religion", "feeling", "violence"], "correct": 2},
  {"q": "What does Lockwood discover scratched into the paint in the bedroom in Chapter 3?", "options": ["Heathcliff's name three times", "Catherine Earnshaw, Catherine Heathcliff, Catherine Linton", "Old love letters", "Mr Earnshaw's will"], "correct": 1},
  {"q": "'The first creak of the oak startled him like an electric shock.' Who does this describe and who narrates?", "options": ["Edgar described by Nelly", "Heathcliff described by Lockwood", "Hindley described by Catherine", "Hareton described by Joseph"], "correct": 1},
  {"q": "'As I fancied by the motion of his arm's shadow dashing a tear from his eyes.' Who is observed doing this?", "options": ["Lockwood", "Joseph", "Heathcliff", "Young Cathy"], "correct": 2},
  {"q": "In Chapter 3 in Lockwood's second dream who does he encounter at the window?", "options": ["Young Cathy's ghost", "Hindley's spirit", "The ghost of Catherine Earnshaw calling herself Catherine Linton", "Mr Earnshaw's shadow"], "correct": 2},
  {"q": "Heathcliff cries out: 'Cathy! Come in! Come in!' What does this reveal about his state?", "options": ["He is sleepwalking", "He refuses to accept Catherine's absence — his longing overrides all rational boundary", "He is angry at Lockwood", "He is performing for Joseph"], "correct": 1},
  {"q": "How does Mr Earnshaw bring Heathcliff home in Chapter 4?", "options": ["He adopts him from an orphanage", "He finds him as a foundling in Liverpool", "He buys him from a travelling family", "He rescues him from the moors"], "correct": 1},
  {"q": "What gifts had the Earnshaw children been promised before the Liverpool trip?", "options": ["Books and toys", "A fiddle for Hindley and a whip for Catherine", "A dog for Hindley and a doll for Catherine", "New clothes and shoes"], "correct": 1},
  {"q": "How does Mr Earnshaw describe Heathcliff when he brings him home?", "options": ["'A burden I must bear'", "'A child of the devil'", "'A gift of God sent for a purpose'", "'A poor orphan who deserves charity'"], "correct": 2},
  {"q": "What literary device does Bronte use by having Nelly narrate to Lockwood?", "options": ["Stream of consciousness", "Frame narrative (story within a story)", "Epistolary form", "Allegory"], "correct": 1},
  {"q": "'Her spirits were always at high-water mark her tongue always going singing laughing and plaguing everybody who would not do the same.' Who says this and about whom?", "options": ["Lockwood about young Cathy", "Heathcliff about Catherine", "Nelly Dean about Catherine Earnshaw", "Joseph about Frances"], "correct": 2},
  {"q": "'A wild wicked slip she was but she had the bonniest eye the sweetest smile and lightest foot.' What literary technique is Nelly using?", "options": ["Hyperbole", "Personification", "Contrast or paradox — combining wildness with beauty and charm", "Allegory"], "correct": 2},
  {"q": "How does Mr Earnshaw die in Chapter 5?", "options": ["He is killed by Hindley", "He drowns on the moors", "He dies quietly in his chair while Catherine sings him to sleep", "He dies of fever"], "correct": 2},
  {"q": "The visit to Thrushcross Grange in Chapter 6 is compared to which biblical story?", "options": ["Noah's Ark", "David and Goliath", "Adam and Eve in the Garden of Eden", "The story of Job"], "correct": 2},
  {"q": "What happens to Catherine at Thrushcross Grange in Chapter 6?", "options": ["She is welcomed warmly", "A dog bites her and she is carried inside", "She is arrested for trespassing", "She falls ill with fever immediately"], "correct": 1},
  {"q": "What does Heathcliff do after being sent away from the Grange?", "options": ["Returns home immediately", "Stays near the window to make sure Catherine is cared for", "Cries alone on the moors", "Plots immediate revenge"], "correct": 1},
  {"q": "How long does Catherine stay at Thrushcross Grange after being bitten?", "options": ["One week", "Two weeks", "Five weeks", "Two months"], "correct": 2},
  {"q": "What does Heathcliff do that leads to punishment in Chapter 7?", "options": ["He attacks Edgar", "He throws hot apple sauce at Edgar", "He steals from the house", "He runs away to the moors"], "correct": 1},
  {"q": "Who comforts Heathcliff after his punishment in Chapter 7 and what does she tell him?", "options": ["Catherine — she tells him she loves him", "Nelly Dean — she tells him he is handsome and should take pride in himself", "Frances — she teaches him to read", "Joseph — he gives him money"], "correct": 1},
  {"q": "What does the phrase 'double character' mean in the context of Catherine's development in Chapter 7?", "options": ["She has a twin sister", "She acts one way in public and another in private", "She is torn between two identities — wild natural self and refined social self", "She pretends to like both Heathcliff and Edgar equally"], "correct": 2},
  {"q": "'For himself he grew desperate: his sorrow was of that kind that will not lament. He neither wept nor prayed; he cursed and defied.' Who says this and about whom?", "options": ["Lockwood about Heathcliff", "Catherine about Edgar", "Nelly Dean about Hindley after Frances's death", "Heathcliff about himself"], "correct": 2},
  {"q": "'The contrast resembled what you see in exchanging a bleak hilly coal country for a beautiful fertile valley.' What does the 'bleak hilly coal country' represent?", "options": ["Edgar Linton", "Thrushcross Grange", "Heathcliff — wild rough and passionate", "The moors as physical landscape only"], "correct": 2},
  {"q": "Who says the 'bleak hilly coal country vs fertile valley' quote?", "options": ["Heathcliff to Catherine", "Nelly Dean narrating to Lockwood", "Edgar to his sister Isabella", "Catherine to Nelly"], "correct": 1},
  {"q": "'80 — Mrs Dean raised the candle and I discerned a soft-featured face exceedingly resembling the young lady at the Heights but more pensive and amiable in expression.' Who is described?", "options": ["Heathcliff", "Hindley", "Edgar Linton", "Hareton"], "correct": 2},
  {"q": "'My love for Linton is like the foliage in the woods: time will change it. My love for Heathcliff resembles the eternal rocks beneath. Nelly I AM Heathcliff.' Who says this?", "options": ["Nelly Dean", "Edgar Linton", "Catherine Earnshaw", "Young Cathy"], "correct": 2},
  {"q": "'Nelly I AM Heathcliff.' What does this declaration mean?", "options": ["Catherine wants to dress like Heathcliff", "Catherine and Heathcliff share the same soul — their identities are inseparable", "Catherine has lost her own identity", "Catherine is pretending to confuse Nelly"], "correct": 1},
  {"q": "'He's more myself than I am. Whatever our souls are made of his and mine are the same and Linton's is as different as a moonbeam from lightning or frost from fire.' Who does lightning represent?", "options": ["Edgar Linton", "Hindley", "Heathcliff", "Hareton"], "correct": 2},
  {"q": "What does Heathcliff overhear of Catherine's conversation with Nelly in Chapter 9?", "options": ["Her declaration of love for him", "That marrying him would degrade her — but not her later words that he is her soul", "Her plan to run away with Edgar", "Her hatred of Wuthering Heights"], "correct": 1},
  {"q": "'98 — I was only going to say that heaven did not seem to be my home; and I broke my heart with weeping to come back to earth; and the angels were so angry that they flung me out.' Who says this and to whom?", "options": ["Heathcliff to Nelly", "Catherine to Nelly Dean explaining her dream", "Catherine to Edgar", "Nelly to Lockwood"], "correct": 1},
  {"q": "The storm in Chapter 9 when Catherine runs out is an example of what literary device?", "options": ["Allegory", "Pathetic fallacy — nature mirrors Catherine's intense emotions", "Dramatic irony", "Foreshadowing only"], "correct": 1},
  {"q": "'For the space of half a year the gunpowder lay as harmless as sand because no fire came near to explode it.' Who says this and what does it mean?", "options": ["Heathcliff comparing his own calm before revenge", "Nelly — Catherine's passionate nature (gunpowder) remains calm while Heathcliff (fire) is absent", "Edgar comparing the peace at Thrushcross Grange", "Joseph describing tension at Wuthering Heights"], "correct": 1},
  {"q": "'It was not the thorn bending to the honeysuckles but the honeysuckles embracing the thorn.' Who says this and what is the thorn?", "options": ["Heathcliff comparing himself to the thorn", "Nelly — the thorn is Catherine whose sharp wild nature does not soften; the Lintons embrace and adjust to her", "Edgar describing his love for Catherine", "Isabella comparing herself to the honeysuckle"], "correct": 1},
  {"q": "Who falls hopelessly in love with Heathcliff in Chapter 10?", "options": ["Young Cathy", "Nelly Dean", "Frances Earnshaw", "Isabella Linton"], "correct": 3},
  {"q": "'183 — The sea could be as readily contained in that horse-trough as her whole affection be monopolised by him.' Who says this and what does it mean?", "options": ["Catherine to Edgar", "Heathcliff to Nelly — comparing Catherine's boundless affection to the sea and Edgar to a mere horse-trough", "Nelly to Edgar warning him", "Isabella comparing her own love"], "correct": 1},
  {"q": "'131 — I felt that God had forsaken the stray sheep there to its own wicked wanderings and an evil beast prowled between it and the fold waiting his time to spring and destroy.' Who is the 'stray sheep' and who is the 'evil beast'?", "options": ["Catherine is the sheep; Edgar is the beast", "Hareton is the sheep; Heathcliff is the beast", "Hindley is the lost stray sheep; Heathcliff is the evil beast waiting to destroy him", "Lockwood is the sheep; Heathcliff is the beast"], "correct": 2},
  {"q": "'137 — I KNOW you have treated me infernally! And if you think I can be consoled by sweet words you are an idiot.' Who says this and to whom?", "options": ["Edgar to Nelly", "Heathcliff to Catherine — he fully understands her betrayal and refuses to be soothed", "Catherine to Heathcliff", "Isabella to Heathcliff"], "correct": 1},
  {"q": "'138 — Having levelled my palace don't erect a hovel and complacently admire your own charity in giving me that for a home.' What does Heathcliff mean?", "options": ["He is complaining about Wuthering Heights literally", "He criticizes Catherine for giving him only a token of affection after destroying their grand love", "He is criticizing Hindley for taking his room", "He blames Edgar for giving him a hovel"], "correct": 1},
  {"q": "'I seek no revenge on you. The tyrant grinds down his slaves and they don't turn against him; they crush those beneath them.' What does Heathcliff reveal?", "options": ["He plans to hurt Catherine directly", "He does not want revenge on anyone", "He will not hurt Catherine but will target others beneath her — like Hindley and Edgar", "He compares himself favorably to Edgar"], "correct": 2},
  {"q": "Who says 'Judas! Traitor! A deliberate deceiver' and about what?", "options": ["Catherine about Hindley", "Edgar about Heathcliff for betraying him", "Nelly when she sees Heathcliff embracing Isabella in the garden — calling him a betrayer of Catherine", "Isabella about Joseph"], "correct": 2},
  {"q": "'149 — I'll choose between these two: either to starve at once — that would be no punishment unless he had a heart — or to recover and leave the country.' Who says this?", "options": ["Isabella about Heathcliff", "Nelly about Catherine", "Catherine in her desperation and anger", "Edgar about Heathcliff"], "correct": 2},
  {"q": "What does Nelly find on her way to fetch the doctor in Chapter 12?", "options": ["Heathcliff waiting outside the Grange", "Isabella's dog nearly strangled hanging from a hook in the wall", "A letter from Heathcliff", "Hareton in the garden"], "correct": 1},
  {"q": "'167 — Is Mr Heathcliff a man? If so is he mad? And if not is he a devil?' Who says this and to whom?", "options": ["Nelly says this to Heathcliff directly", "Isabella writes this to Nelly in her letter from Wuthering Heights", "Lockwood says this about Heathcliff", "Catherine says this to Edgar"], "correct": 1},
  {"q": "'169 — His eyes too were like a ghostly Catherine's with all their beauty annihilated.' Who is being described?", "options": ["Heathcliff", "Joseph", "Hindley Earnshaw", "Hareton"], "correct": 2},
  {"q": "'183 — But do you imagine that I shall leave Catherine to his duty and humanity? And can you compare my feelings respecting Catherine to his?' Who says this?", "options": ["Edgar to Nelly", "Heathcliff to Nelly — showing contempt for Edgar's love and claiming his own is superior", "Catherine to Heathcliff", "Joseph to Nelly"], "correct": 1},
  {"q": "'196 — Catherine you know that I could as soon forget you as my existence! Is it not sufficient for your infernal selfishness that while you are at peace I shall writhe in the torments of hell?' Who says this?", "options": ["Edgar to Catherine on her deathbed", "Heathcliff to Catherine in their final meeting", "Nelly quoting Heathcliff later", "Catherine to Heathcliff"], "correct": 1},
  {"q": "'198 — I have not broken your heart — you have broken it; and in breaking it you have broken mine.' What literary device is used in this structure?", "options": ["Alliteration", "Chiasmus — repetition in reverse creating a mirror effect about mutual destruction", "Simile", "Pathetic fallacy"], "correct": 1},
  {"q": "'199 — I forgive what you have done to me. I love my murderer — but yours! How can I?' Who is Heathcliff calling 'murderer'?", "options": ["He calls Edgar Catherine's murderer", "He calls Catherine his own murderer — her choices killed the life he could have had", "He is referring to Hindley", "He calls Nelly a murderer"], "correct": 1},
  {"q": "'187 — The more the worms writhe the more I yearn to crush out their entrails!' Who says this and what does it reveal?", "options": ["Hindley about Heathcliff", "Heathcliff — revealing a compulsive sadistic pleasure in domination that grows with his enemies' pain", "Joseph about sinners generally", "Catherine about both Heathcliff and Edgar"], "correct": 1},
  {"q": "'188 — He might as well plant an oak in a flower-pot and expect it to thrive as imagine he can restore her to vigour in the soil of his shallow cares.' Who says this and what does the oak represent?", "options": ["Nelly describing Edgar's love as insufficient", "Heathcliff — the oak is Catherine wild and strong; Edgar's world is the flower-pot — shallow and confining", "Edgar comparing himself to the gardener", "Isabella describing the Heights"], "correct": 1},
  {"q": "'Catherine Earnshaw may you not rest as long as I am living! You said I killed you — haunt me then!' Who says this?", "options": ["Edgar at Catherine's graveside", "Nelly reporting Heathcliff's words", "Heathcliff addressing Catherine's ghost in anguished grief", "Lockwood reading from Catherine's diary"], "correct": 2},
  {"q": "'The murdered do haunt their murderers. Be with me always — take any form — drive me mad! Only do not leave me in this abyss where I cannot find you!' What does this reveal about Heathcliff?", "options": ["He wants to move on from Catherine", "He would rather be driven mad by her ghost than face life without any trace of her", "He believes she is in heaven", "He is planning to join her in death immediately"], "correct": 1},
  {"q": "Who is the daughter Catherine gives birth to before dying?", "options": ["Young Isabella", "The young Cathy we meet in Chapter 2", "Frances Earnshaw", "A daughter named after Nelly"], "correct": 1},
  {"q": "Where is Catherine buried?", "options": ["In a churchyard overlooking the moors", "In the Linton family vault", "At Wuthering Heights", "In the chapel garden"], "correct": 0},
  {"q": "'Treachery and violence are just return for treachery and violence.' Who says this?", "options": ["Nelly about Heathcliff's revenge", "Edgar about Hindley", "Heathcliff about Hindley", "Isabella — referring to how Heathcliff treated her"], "correct": 3},
  {"q": "What does Isabella do as her final act before leaving Wuthering Heights?", "options": ["She burns the house", "She leaves a note for Heathcliff", "She flings her wedding ring into the fire and stamps on it", "She takes all Hindley's money"], "correct": 2},
  {"q": "'230 — Now my bonny lad you are MINE! And we'll see if one tree won't grow as crooked as another with the same wind to twist it!' Who says this and to whom?", "options": ["Hindley to Hareton", "Heathcliff taking control of Hareton — vowing to shape him just as the wind shapes a crooked tree", "Edgar to young Cathy", "Nelly to Lockwood"], "correct": 1},
  {"q": "'228 — Had he had fair play?' Who says this and about whom?", "options": ["Heathcliff about himself", "Nelly wondering if Hindley ever had a fair chance in life", "Edgar about Heathcliff", "Lockwood about Hareton"], "correct": 1},
  {"q": "'246 — A pale delicate effeminate boy who might have been taken for my master's younger brother so strong was the resemblance: but there was a sickly peevishness in his aspect that Edgar Linton never had.' Who is described?", "options": ["Hareton Earnshaw", "Edgar Linton", "Linton Heathcliff", "Young Mr Lockwood"], "correct": 2},
  {"q": "'255 — I feared I should have to come down and fetch my property myself. You've brought it have you? Let us see what we can make of it.' Who says this and about whom?", "options": ["Edgar about young Cathy", "Nelly about Linton", "Heathcliff to Nelly when she brings Linton — calling Linton 'my property'", "Joseph about Hareton"], "correct": 2},
  {"q": "'God! what a beauty! what a lovely charming thing! Haven't they reared it on snails and sour milk Nelly?' Who says this?", "options": ["Edgar about Heathcliff", "Heathcliff mockingly about Linton's pale weak appearance", "Nelly about Hareton", "Young Cathy about Linton"], "correct": 1},
  {"q": "How does Heathcliff's calling Linton 'my property' reveal his moral state?", "options": ["He genuinely loves his son", "People are possessions and instruments — he applies the logic of property ownership to human beings", "It is a term of Victorian endearment", "He is joking with Nelly"], "correct": 1},
  {"q": "Linton is described as 'the worst-tempered bit of a sickly slip that ever struggled into his teens.' Who says this?", "options": ["Heathcliff", "Young Cathy", "Nelly Dean", "Edgar Linton"], "correct": 2},
  {"q": "What does 'having stared his son into an ague of confusion' suggest about Heathcliff's presence?", "options": ["He spoke calmly to Linton", "His intense stare is so frightening it physically distresses Linton — his power over people is almost primal", "Linton is simply shy", "Ague means a happy state"], "correct": 1},
  {"q": "'286 — You dropped Linton with it into a Slough of Despond. He was in earnest: in love really. As true as I live he's dying for you.' Who says this and is it honest?", "options": ["Nelly to Edgar — it is completely honest", "Heathcliff to Cathy — it is manipulative and calculated to draw Cathy into his plan", "Linton to Nelly — it is genuine", "Edgar to Cathy — it is a warning"], "correct": 1},
  {"q": "What is the 'Slough of Despond' mentioned in Quote 286?", "options": ["A swamp on the moors", "A term from John Bunyan's Pilgrim's Progress representing deep sadness and hopelessness", "A type of illness Linton has", "A name for Wuthering Heights"], "correct": 1},
  {"q": "'283 — the last bud from the multitude of bluebells that clouded those turf steps in July with a lilac mist.' What does this natural imagery contrast with?", "options": ["The wealth of Thrushcross Grange", "Natural innocence contrasting with the scheming deception that Heathcliff is engineering", "Edgar's love for Catherine", "Hareton's rough character"], "correct": 1},
  {"q": "What primary emotion drives young Cathy into Heathcliff's trap in Chapter 21?", "options": ["Romantic passion", "Social ambition", "Compassion for a seemingly suffering cousin", "Curiosity about Wuthering Heights"], "correct": 2},
  {"q": "How does Nelly discover Cathy's secret correspondence with Linton in Chapter 22?", "options": ["Edgar tells her", "Heathcliff confesses", "She finds letters hidden in Cathy's room", "Linton tells Nelly directly"], "correct": 2},
  {"q": "Nelly describes Linton as 'the worst-tempered bit of a sickly slip that ever struggled into his teens.' What does this observation function as?", "options": ["It shows Nelly's hatred of Linton", "It honestly describes Linton's difficult nature while also showing Nelly's limited sympathy for his suffering", "It is inaccurate — Linton is always pleasant", "It was said to Edgar not to Lockwood"], "correct": 1},
  {"q": "In Chapters 26-27 Heathcliff locks young Cathy and Nelly inside Wuthering Heights. What is his stated reason for this imprisonment?", "options": ["He wants Cathy to meet Hareton", "He forces a marriage between Cathy and the dying Linton to secure Thrushcross Grange", "He wants to punish Edgar for disowning Isabella", "He is simply protecting Linton from being moved"], "correct": 1},
  {"q": "'305 — He's in the last extremity was my conviction — and should he make another speech I was resolved to break into any window that offered least resistance.' Who says this and what is the context?", "options": ["Nelly — trying to escape from Wuthering Heights while Cathy is imprisoned", "Lockwood — observing Heathcliff from outside the Heights", "Isabella — during her escape from the Heights", "Edgar — trying to rescue Cathy"], "correct": 0},
  {"q": "During the imprisonment at Wuthering Heights young Cathy secretly writes letters to Edgar. What does Heathcliff intercept and destroy?", "options": ["Letters to Edgar Linton asking for help", "Letters to Hareton asking for escape", "Letters to Joseph asking for food", "Letters to Lockwood asking him to rescue her"], "correct": 0},
  {"q": "Chapter 28 — Linton Heathcliff dies shortly after the forced marriage. What does his death enable for Heathcliff?", "options": ["Freedom from guilt", "Complete legal possession of Thrushcross Grange — Linton was the heir and left everything to his wife Cathy who is now under Heathcliff's control", "Reconciliation with Edgar", "Heathcliff's departure from England"], "correct": 1},
  {"q": "Chapter 29 — Heathcliff confesses to Nelly that he had Catherine's coffin opened. What does he reveal he did?", "options": ["He stole a lock of her hair", "He bribed the sexton to remove the side of her coffin and arranged for his own coffin side to be similarly opened so they might mingle in death", "He placed flowers inside her coffin", "He moved her body to Wuthering Heights"], "correct": 1},
  {"q": "'Heathcliff's monologue Chapter 29' — He says: 'I dreamt I was sleeping the last sleep by that sleeper with my heart still and my cheek frozen against hers.' What does this reveal about his love?", "options": ["He is planning a suicide pact", "His love for Catherine is so consuming he seeks literal physical union even in death — it transcends all rational boundaries", "He is hallucinating from illness", "He is describing a Gothic novel he has read"], "correct": 1},
  {"q": "After Edgar's death young Cathy is brought back to Wuthering Heights as Heathcliff's prisoner. How does Hareton initially treat her?", "options": ["With warmth and friendship", "Roughly and dismissively — he has absorbed Heathcliff's contempt and his own rough upbringing", "With romantic passion", "With formal Victorian politeness"], "correct": 1},
  {"q": "What does young Cathy give Hareton that begins his transformation in the later chapters?", "options": ["Money to escape Heathcliff", "Books and the gift of literacy — she begins to teach him to read", "Letters of introduction to Edgar's family", "A portrait of his mother Frances"], "correct": 1},
  {"q": "What does Hareton burning the books that Catherine gave him represent in Chapter 21 and later?", "options": ["His genuine hatred of literature", "His pride wounded by Catherine's mockery — he destroys what humiliates him rather than endure the shame", "Heathcliff ordered him to burn them", "He simply did not want them anymore"], "correct": 1},
  {"q": "In the later chapters Hareton begins to show genuine feeling for young Cathy. What does Nelly observe about the resemblance between Hareton and Catherine Earnshaw?", "options": ["Hareton looks exactly like Heathcliff", "Hareton's eyes and certain expressions powerfully recall Catherine Earnshaw — he carries the old family beauty", "Hareton looks like Edgar Linton", "Hareton has no resemblance to any character"], "correct": 1},
  {"q": "Chapter 33 — Heathcliff's monologue reveals a striking change. He says he can no longer pursue his revenge. What has happened to him?", "options": ["He has been physically injured", "Hareton's resemblance to Catherine has awakened in him an exhausted longing — he no longer has the will to destroy", "He has fallen in love with young Cathy", "He has lost all his property and wealth"], "correct": 1},
  {"q": "'Heathcliff's monologue Chapter 33' — He compares himself to a man who has 'nearly attained my heaven' but cannot reach it. What is this 'heaven'?", "options": ["His financial empire", "Revenge against the Earnshaws and Lintons", "Reunion with Catherine — the only true goal he has ever had", "Peace and rest from his obsessive pain"], "correct": 2},
  {"q": "In Chapter 33 Heathcliff describes how he sees Catherine in everything around him. How does he describe this haunting?", "options": ["As a pleasant memory", "As a torture — every feature of the landscape and every face reminds him of Catherine and he cannot escape her", "As a supernatural blessing", "As simply a trick of his aging imagination"], "correct": 1},
  {"q": "What does Heathcliff say in his final monologue about his attitude to food and rest in the days before his death?", "options": ["He eats well and sleeps soundly", "He cannot eat or sleep — Catherine's presence is so overpowering that earthly life has no grip on him", "He drinks heavily like Hindley did", "He becomes intensely religious and fasts"], "correct": 1},
  {"q": "Chapter 34 — How does Heathcliff die?", "options": ["Hindley's son Hareton kills him", "He is found dead in Catherine's old bedroom — died alone with the window open and a smile on his face", "He throws himself from Penistone Crags", "He dies of a wound inflicted by Hindley's pistol years earlier"], "correct": 1},
  {"q": "What does Heathcliff's smile in death suggest?", "options": ["He died in pain and his face distorted", "He finally achieved reunion with Catherine — in death he found the peace and union that life denied him", "He died laughing at his enemies' defeat", "He was simply relaxed in his last moments"], "correct": 1},
  {"q": "After Heathcliff's death who inherits both Wuthering Heights and Thrushcross Grange?", "options": ["Young Cathy alone", "Hareton Earnshaw — the true heir restored after Heathcliff's death", "Lockwood", "Nelly Dean"], "correct": 1},
  {"q": "At the end of the novel what future do young Cathy and Hareton have?", "options": ["They separate — Cathy returns to the Grange alone", "They plan to marry and restore the legitimate order — representing hope and redemption for the second generation", "They leave England entirely", "They remain at odds with each other"], "correct": 1},
  {"q": "What do local people report seeing on the moors near Wuthering Heights after Heathcliff's death?", "options": ["Strange lights in the sky", "The ghosts of Heathcliff and Catherine walking together on the moors", "Hareton wandering alone in grief", "A strange black dog"], "correct": 1},
  {"q": "Which of the following best describes the concept of a 'Pyrrhic Victory' as applied to Heathcliff?", "options": ["He wins completely and is satisfied", "He gains everything he sought materially but it costs him everything that mattered — Catherine is dead and his victory is hollow", "He loses everything through his own mistakes", "He wins through the help of others"], "correct": 1},
  {"q": "The novel is structured as a frame narrative. Who are the two narrators and to whom does the primary narrator tell the story?", "options": ["Heathcliff narrates to Joseph; Nelly narrates to Edgar", "Nelly Dean narrates to Lockwood; Lockwood narrates to the reader", "Catherine narrates to Nelly; Nelly narrates to Heathcliff", "Lockwood narrates to Nelly; Nelly narrates to Edgar"], "correct": 1},
  {"q": "'Catherine's inability to choose between Heathcliff and Edgar has far-reaching psychological effects on her character.' Which quote best supports this theme?", "options": ["'Nelly I AM Heathcliff'", "'I'll choose between these two: either to starve at once or to recover'", "'She was a wild wicked slip'", "'He might as well plant an oak in a flower-pot'"], "correct": 1},
  {"q": "What does the motif of 'windows' throughout the novel — the window in Chapter 3, Catherine opening the window in Chapter 12, and Heathcliff's open window at his death — collectively symbolize?", "options": ["The desire for fresh air and physical health", "The boundary between worlds — the living and the dead, the contained and the free, the present and the longed-for past", "Edgar's wealth and architectural refinement", "The danger of the moors climate"], "correct": 1},
  {"q": "Which statement best captures the overall moral vision of Wuthering Heights as a Victorian Gothic novel?", "options": ["Good is always rewarded and evil always punished", "The novel resists simple moral judgments — passion love revenge and suffering are shown as deeply intertwined, and redemption comes only in the second generation after immense destruction", "Heathcliff is the clear villain and Edgar the clear hero", "The novel argues that social class is the only real determinant of happiness"], "correct": 1},
];

const DEFAULT_QUESTIONS = {
  novel: DEFAULT_NOVEL_QUESTIONS,
};


// ================================================================
//  Telegram SVG (lucide-react doesn't include one)
// ================================================================
const TelegramIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
  </svg>
);

// ================================================================
//  Storage Helpers (shared across all users)
// ================================================================
// Storage adapter — now uses Firebase under the hood
// Kept here only for the admin editor's bulk-import path (stays in localStorage for offline drafts).
// All "real" persistence (attempts, leaderboard, users) goes through Firebase directly.
const storage = {
  async get(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
};

async function loadQuestions(subjectId) {
  // Always start with built-in defaults (embedded in code, no storage needed)
  const defaults = DEFAULT_QUESTIONS[subjectId] || [];
  // Try to fetch admin-added questions from shared storage (if available)
  let stored = [];
  try {
    const fromStorage = await storage.get(KEY.questions(subjectId));
    if (Array.isArray(fromStorage)) stored = fromStorage;
  } catch {}
  return [...defaults, ...stored];
}

// Load ONLY admin-added questions (excludes built-in defaults) — used by admin editor
async function loadStoredQuestions(subjectId) {
  try {
    const fromStorage = await storage.get(KEY.questions(subjectId));
    return Array.isArray(fromStorage) ? fromStorage : [];
  } catch { return []; }
}
async function saveQuestions(subjectId, questions) {
  return await storage.set(KEY.questions(subjectId), questions);
}
// recordAttempt and leaderboard now come from firebase.js — imported above.
// Local attempt log kept only as fallback for admin diagnostics:
async function loadAttempts() { return (await storage.get(KEY.attempts)) || []; }

// ================================================================
//  📄 PDF Parser — load pdf.js dynamically and extract MCQs
// ================================================================
const PDFJS_VERSION = '3.11.174';
let pdfJsPromise = null;
function loadPdfJs() {
  if (pdfJsPromise) return pdfJsPromise;
  pdfJsPromise = new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const script = document.createElement('script');
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
    script.onload = () => {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
        resolve(window.pdfjsLib);
      } catch (e) { reject(e); }
    };
    script.onerror = () => { pdfJsPromise = null; reject(new Error('Failed to load pdf.js')); };
    document.head.appendChild(script);
  });
  return pdfJsPromise;
}

async function extractTextFromPdf(file) {
  const pdfjsLib = await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let full = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Reconstruct lines by tracking Y position
    let lastY = null;
    let lineText = '';
    const lines = [];
    for (const item of content.items) {
      const y = item.transform ? item.transform[5] : null;
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        if (lineText.trim()) lines.push(lineText.trim());
        lineText = '';
      }
      lineText += item.str + ' ';
      lastY = y;
    }
    if (lineText.trim()) lines.push(lineText.trim());
    full += lines.join('\n') + '\n';
  }
  return full;
}

// Robust MCQ parser — handles many common formats
function parseQuestionsFromText(text) {
  if (!text) return [];

  // === Stage 1: Aggressive Preprocessing ===
  let n = text
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    // Arabic-Indic digits (٠-٩) → ASCII
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30))
    // Persian digits (۰-۹) → ASCII
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 0x30))
    // Normalize quotes
    .replace(/[''‘’]/g, "'").replace(/[""“”]/g, '"')
    // Remove tatweel character (ـ) which often appears in PDFs
    .replace(/ـ/g, '')
    .replace(/[ \t]+/g, ' ');

  // Split inline option markers — PDFs often extract as one line
  // Add newline BEFORE: " A) " " A. " " A- " etc when preceded by anything
  n = n.replace(/(?:^|[^\w])\s*([A-Da-d])[\)\.\-]\s+/g, (m, l) => `\n${l}) `);
  n = n.replace(/(?:^|[^\w])\s*([أبجد])[\)\.\-]\s+/g, (m, l) => `\n${l}) `);
  // Inline question numbers (after sentence ending) — limit 1-3 digits
  n = n.replace(/([\?\.؟!])\s+(\d{1,3})[\.\)\-:]\s+/g, '$1\n$2. ');
  // Question prefixes — newline before them
  n = n.replace(/\s+(Q\.?\s*\d+)/gi, '\n$1');
  n = n.replace(/\s+(Question\s+\d+)/gi, '\n$1');
  n = n.replace(/(^|\s)(س\s*\d+|سؤال\s+\d+|السؤال\s+)/g, '$1\n$2');
  n = n.replace(/(^|\s)(الإجابة|الجواب|الحل|الصواب|الصحيحة|Answer|Ans\.?|Correct|Solution)[\s:]/gi, '$1\n$2:');

  const allLines = n.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  // === Patterns ===
  const Q_RES = [
    /^(\d+)\s*[\.\)\-:]\s*(.+)$/,                                    // 1. 1) 1-
    /^Q\.?\s*(\d+)\s*[\.\)\-:]+\s*(.+)$/i,                           // Q1. Q1) (with separator)
    /^Q\.?\s*(\d+)\s+(.+)$/i,                                        // Q1 text (NO separator, just space)
    /^Q\.?\s*(\d+)\s*$/i,                                            // Q1 alone (text on next line)
    /^Question\s+(\d+)\s*[\.\)\-:]*\s*(.+)$/i,                       // Question 1
    /^س\.?\s*(\d+)\s*[\.\)\-:]?\s*(.+)$/,                            // س1
    /^سؤال\s+(\d+)\s*[\.\)\-:]?\s*(.+)$/,                            // سؤال 1
    /^السؤال\s+(?:\d+|الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر)\s*[\.\)\-:]?\s*(.+)$/,
  ];
  const OPT_RES = [
    /^[\(\[]?([A-Da-d])[\)\.\-:\]]\s*(.+)$/,    // A) B. C- D:
    /^[\(\[]?([أبجد])[\)\.\-:\]]\s*(.+)$/,      // أ) ب. ج- د:
    /^[\(\[]?([1-4])[\)\.\-:\]]\s*(.+)$/,       // 1) 2. 3- 4:
  ];
  const ANS_RES = [
    /^([A-Da-dأبجد])\s*[✔✓☑★]\s*/,                                  // B ✔ ... (checkmark format)
    /^(?:Answer|Ans\.?|Correct|Solution|Sol\.?|Key)[\s:\-\.]+[\(\[]?([A-Da-d1-4])/i,
    /^(?:الإجابة|الجواب|الحل|الصواب|الصحيحة|الإجابة\s+الصحيحة)[\s:\-\.]+[\(\[]?([أبجدA-Da-d1-4])/,
    /^ج[ـ\/\-:]\s*[\(\[]?([أبجدA-Da-d1-4])/,
  ];

  const letterIdx = (l) => {
    if (!l) return -1;
    const u = String(l).toUpperCase();
    if ('ABCD'.includes(u)) return 'ABCD'.indexOf(u);
    if ('أبجد'.includes(u)) return 'أبجد'.indexOf(u);
    if ('1234'.includes(u)) return parseInt(u, 10) - 1;
    return -1;
  };

  // === Stage 2: Tokenize ===
  const tokens = [];
  for (const line of allLines) {
    // Skip pure page numbers, page headers/footers
    if (/^(?:Page\s+)?\d{1,3}(?:\s+of\s+\d+)?$/i.test(line)) continue;
    if (/^صفحة\s+\d+/i.test(line)) continue;
    // Skip very short lines that are likely noise (single chars/punctuation)
    if (line.length < 2 && !/^[A-Daأبجد1-4]$/.test(line)) continue;

    let matched = false;

    // Check answer markers first (most specific)
    for (const re of ANS_RES) {
      const m = line.match(re);
      if (m) { tokens.push({ type: 'ans', marker: m[1] }); matched = true; break; }
    }
    if (matched) continue;

    // Check option markers
    for (const re of OPT_RES) {
      const m = line.match(re);
      if (m) {
        const idx = letterIdx(m[1]);
        if (idx >= 0 && idx <= 3) {
          tokens.push({ type: 'opt', idx, text: m[2] });
          matched = true;
          break;
        }
      }
    }
    if (matched) continue;

    // Check question markers
    for (const re of Q_RES) {
      const m = line.match(re);
      if (m) {
        const text = (m[2] !== undefined ? m[2] : m[1]) || '';
        tokens.push({ type: 'q', text });
        matched = true;
        break;
      }
    }
    if (matched) continue;

    tokens.push({ type: 'text', text: line });
  }

  // === Stage 3: Assemble Questions ===
  const questions = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];

    if (t.type !== 'q' && t.type !== 'text') { i++; continue; }

    // Try to collect a question from here
    let qText = t.text || '';
    let j = i + 1;

    // Detect if the next 4 text tokens look like an unmarked option block (A/B/C/D + space + text)
    const looksLikeUnmarkedOptions = () => {
      if (j + 3 >= tokens.length) return false;
      const letters = ['A', 'B', 'C', 'D'];
      const arLetters = ['أ', 'ب', 'ج', 'د'];
      const useArabic = tokens[j].type === 'text' && /^أ\s+\S/.test(tokens[j].text);
      const set = useArabic ? arLetters : letters;
      for (let p = 0; p < 4; p++) {
        const tk = tokens[j + p];
        if (!tk || tk.type !== 'text') return false;
        const re = new RegExp(`^${set[p]}\\s+(.{2,})$`);
        if (!re.test(tk.text)) return false;
      }
      return true;
    };

    // Absorb continuation text until we hit options or another question
    while (j < tokens.length && tokens[j].type === 'text') {
      if (looksLikeUnmarkedOptions()) break;
      qText += ' ' + tokens[j].text;
      j++;
    }

    // Try to collect 4 options
    const options = [];
    let optStart = j;
    while (j < tokens.length && options.length < 4) {
      const tk = tokens[j];
      if (tk.type === 'opt') {
        options.push(tk.text);
        j++;
        // Allow continuation text into the option
        while (j < tokens.length && tokens[j].type === 'text') {
          options[options.length - 1] += ' ' + tokens[j].text;
          j++;
        }
      } else {
        break;
      }
    }

    // FALLBACK: no opt tokens found — try unmarked options (e.g. "A text" without separator)
    if (options.length === 0 && j < tokens.length) {
      const letters = ['A', 'B', 'C', 'D'];
      const arLetters = ['أ', 'ب', 'ج', 'د'];
      let tryJ = j;
      const tempOpts = [];
      let useArabic = false;
      // Peek to determine alphabet
      if (tryJ < tokens.length && tokens[tryJ].type === 'text') {
        if (/^أ\s+\S/.test(tokens[tryJ].text)) useArabic = true;
      }
      for (let p = 0; p < 4 && tryJ < tokens.length; p++) {
        const tk = tokens[tryJ];
        if (tk.type !== 'text') break;
        const expectedLetter = useArabic ? arLetters[p] : letters[p];
        const re = new RegExp(`^${expectedLetter}\\s+(.{2,})$`);
        const m = tk.text.match(re);
        if (!m) break;
        tempOpts.push(m[1]);
        tryJ++;
        // Allow continuation text (lines that don't start with next expected letter)
        while (tryJ < tokens.length && tokens[tryJ].type === 'text') {
          const nextExpected = useArabic ? arLetters[p + 1] : letters[p + 1];
          const nextRe = p < 3 ? new RegExp(`^${nextExpected}\\s+`) : null;
          const isAnsLine = /^[A-Daأبجد]\s*[✔✓☑★]/.test(tokens[tryJ].text);
          if ((nextRe && nextRe.test(tokens[tryJ].text)) || isAnsLine) break;
          tempOpts[tempOpts.length - 1] += ' ' + tokens[tryJ].text;
          tryJ++;
        }
      }
      if (tempOpts.length === 4) {
        options.push(...tempOpts);
        j = tryJ;
      }
    }

    if (options.length === 4 && qText.trim()) {
      // Look ahead for answer marker (within next few tokens)
      let correct = null;
      let detected = false;
      let k = 0;
      while (k < 3 && j + k < tokens.length) {
        const tk = tokens[j + k];
        if (tk.type === 'ans') {
          const idx = letterIdx(tk.marker);
          if (idx >= 0 && idx <= 3) { correct = idx; detected = true; }
          j += k + 1;
          break;
        }
        if (tk.type === 'q' || tk.type === 'opt') break;
        k++;
      }
      questions.push({
        q: qText.trim(),
        options: options.map((o) => o.trim()),
        correct: correct === null ? 0 : correct,
        _detected: detected,
      });
      i = j;
    } else {
      // No 4 options after this — skip and try next token
      i++;
    }
  }

  // === Stage 4: Look for answer key at end of document ===
  // Common in exams: "Answer Key: 1.B 2.C 3.A ..." at the bottom
  if (questions.length > 0) {
    // Search backwards through tokens for a sequence of "N. X" pairs
    const keyPattern = /(\d{1,3})\s*[\.\)\-:]\s*([A-Da-dأبجد1-4])/g;
    const allText = allLines.join(' ');
    const matches = [...allText.matchAll(keyPattern)];
    if (matches.length >= Math.min(questions.length, 3)) {
      // Build a key map
      const keyMap = {};
      for (const m of matches) {
        const num = parseInt(m[1], 10);
        const idx = letterIdx(m[2]);
        if (num >= 1 && num <= questions.length && idx >= 0) {
          keyMap[num] = idx;
        }
      }
      // Apply to questions that weren't detected
      questions.forEach((q, idx) => {
        if (!q._detected && keyMap[idx + 1] !== undefined) {
          q.correct = keyMap[idx + 1];
          q._detected = true;
        }
      });
    }
  }

  return questions;
}

// ================================================================
//  Fonts + Global CSS
// ================================================================
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Reem+Kufi:wght@400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap';
    document.head.appendChild(link);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      * { font-family: 'Tajawal', sans-serif; }
      .font-display { font-family: 'Reem Kufi', sans-serif; }
      .font-amiri { font-family: 'Amiri', serif; }
      body { background: #0a0a14; overflow-x: hidden; }

      @keyframes float-slow { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(20px,-30px) rotate(180deg)} }
      @keyframes float-medium { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-25px,25px)} }
      @keyframes draw-check { 0%{stroke-dashoffset:100} 100%{stroke-dashoffset:0} }
      @keyframes draw-circle { 0%{stroke-dashoffset:300} 100%{stroke-dashoffset:0} }
      @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }
      @keyframes glow-pulse {
        0%,100% { box-shadow: 0 0 20px rgba(251,191,36,.3), 0 0 40px rgba(251,191,36,.2); }
        50% { box-shadow: 0 0 30px rgba(251,191,36,.5), 0 0 60px rgba(251,191,36,.3); }
      }
      @keyframes shine { 0%{transform:translateX(-100%) skewX(-20deg)} 100%{transform:translateX(200%) skewX(-20deg)} }
      @keyframes slide-up-fade { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes slide-down-fade { 0%{opacity:0;transform:translateY(-30px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes scale-in { 0%{opacity:0;transform:scale(0.7)} 100%{opacity:1;transform:scale(1)} }
      @keyframes bounce-in { 0%{opacity:0;transform:scale(0.3)} 50%{transform:scale(1.1)} 70%{transform:scale(0.95)} 100%{opacity:1;transform:scale(1)} }
      @keyframes rotate-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes letter-pop { 0%{opacity:0;transform:translateY(20px) scale(0.5)} 100%{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes confetti-fall { 0%{transform:translateY(-100vh) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
      @keyframes orbit { from{transform:rotate(0deg) translateX(40px) rotate(0deg)} to{transform:rotate(360deg) translateX(40px) rotate(-360deg)} }

      .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
      .animate-float-medium { animation: float-medium 15s ease-in-out infinite; }
      .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
      .animate-glow { animation: glow-pulse 2.5s ease-in-out infinite; }
      .animate-shine { animation: shine 2.5s ease-in-out infinite; }
      .animate-slide-up { animation: slide-up-fade 0.6s ease-out forwards; }
      .animate-slide-down { animation: slide-down-fade 0.6s ease-out forwards; }
      .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
      .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68,-0.55,0.265,1.55) forwards; }
      .animate-rotate-slow { animation: rotate-slow 30s linear infinite; }

      .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
      .glass-gold { background: linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02)); backdrop-filter: blur(20px); border: 1px solid rgba(251,191,36,0.2); }

      .gold-text { background: linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
      .silver-text { background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #cbd5e1 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
      .bronze-text { background: linear-gradient(135deg, #fdba74 0%, #c2410c 50%, #ea580c 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

      .grid-pattern { background-image: linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px); background-size: 50px 50px; }

      .noise { position: absolute; inset: 0; opacity: 0.03; pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }

      .stagger > * { opacity: 0; animation: slide-up-fade 0.6s ease-out forwards; }
      .stagger > *:nth-child(1) { animation-delay: 0.05s; }
      .stagger > *:nth-child(2) { animation-delay: 0.1s; }
      .stagger > *:nth-child(3) { animation-delay: 0.15s; }
      .stagger > *:nth-child(4) { animation-delay: 0.2s; }
      .stagger > *:nth-child(5) { animation-delay: 0.25s; }
      .stagger > *:nth-child(6) { animation-delay: 0.3s; }
      .stagger > *:nth-child(7) { animation-delay: 0.35s; }
      .stagger > *:nth-child(8) { animation-delay: 0.4s; }
      .stagger > *:nth-child(9) { animation-delay: 0.45s; }
      .stagger > *:nth-child(10) { animation-delay: 0.5s; }

      input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
      input:focus, textarea:focus { outline: none; }

      .scrollbar-thin::-webkit-scrollbar { width: 6px; }
      .scrollbar-thin::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
      .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.4); border-radius: 3px; }
    `;
    document.head.appendChild(styleTag);

    return () => {
      try { document.head.removeChild(link); document.head.removeChild(styleTag); } catch {}
    };
  }, []);
  return null;
};

const Atmosphere = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-50" />
    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float-slow"
      style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }} />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-medium"
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
    <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full blur-3xl animate-float-slow"
      style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', animationDelay: '5s' }} />
    <div className="noise" />
  </div>
);

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  const bg = isSuccess ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)';
  const border = isSuccess ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)';
  const color = isSuccess ? '#34d399' : '#f87171';
  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-down" style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
        style={{ background: bg, border: `1px solid ${border}`, backdropFilter: 'blur(20px)' }}>
        <Icon className="w-5 h-5 shrink-0" style={{ color }} />
        <span className="text-white font-medium text-sm">{msg}</span>
      </div>
    </div>
  );
};

// ================================================================
//  Social Bar — Instagram + Telegram floating icons
// ================================================================
const SocialBar = () => (
  <div className="flex items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
    <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
      className="group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.15), rgba(247, 119, 55, 0.1), rgba(252, 175, 69, 0.1))',
        border: '1px solid rgba(247, 119, 55, 0.3)',
      }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', filter: 'blur(12px)' }} />
      <Instagram className="relative w-5 h-5" style={{ color: '#fd1d1d' }} />
    </a>

    <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer"
      className="group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 158, 217, 0.15), rgba(0, 136, 204, 0.1))',
        border: '1px solid rgba(34, 158, 217, 0.3)',
      }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, #229ed9, #0088cc)', filter: 'blur(12px)' }} />
      <TelegramIcon className="relative w-5 h-5" style={{ color: '#229ed9' }} />
    </a>
  </div>
);

// Floating social icons — visible on every screen except splash
const SocialFloat = () => (
  <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2.5"
    style={{ animation: 'slide-up-fade 0.6s ease-out 0.8s forwards', opacity: 0 }}>
    <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
      title="Instagram · @ham7_d"
      className="group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.25), rgba(247, 119, 55, 0.18))',
        border: '1px solid rgba(247, 119, 55, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35), 0 0 16px rgba(247,119,55,0.15)',
      }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', filter: 'blur(10px)' }} />
      <Instagram className="relative w-4 h-4" style={{ color: '#fd1d1d' }} />
    </a>
    <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer"
      title="Telegram · @m0_h0"
      className="group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 158, 217, 0.25), rgba(0, 136, 204, 0.18))',
        border: '1px solid rgba(34, 158, 217, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35), 0 0 16px rgba(34,158,217,0.15)',
      }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, #229ed9, #0088cc)', filter: 'blur(10px)' }} />
      <TelegramIcon className="relative w-4 h-4" style={{ color: '#229ed9' }} />
    </a>
  </div>
);

// ================================================================
//  Splash Screen
// ================================================================
const SplashScreen = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const letters = ['م', 'ن', 'ص', 'ة', ' ', 'ا', 'ل', 'ا', 'خ', 'ت', 'ب', 'ا', 'ر'];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 600); return 100; }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a14 70%)' }}>
      <Atmosphere />
      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-48 h-48 rounded-full border opacity-20 animate-pulse-ring" style={{ borderColor: '#fbbf24' }}></div>
            <div className="absolute w-48 h-48 rounded-full border opacity-20 animate-pulse-ring" style={{ borderColor: '#fbbf24', animationDelay: '0.5s' }}></div>
            <div className="absolute w-48 h-48 rounded-full border opacity-20 animate-pulse-ring" style={{ borderColor: '#fbbf24', animationDelay: '1s' }}></div>
          </div>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute w-full h-full animate-rotate-slow" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="90" fill="none" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="20 10" />
            </svg>
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center animate-glow"
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a4a 100%)', border: '2px solid rgba(251,191,36,0.4)' }}>
              <Sparkles className="w-12 h-12" style={{ color: '#fbbf24' }} />
            </div>
            <div className="absolute w-3 h-3 rounded-full" style={{ background: '#fbbf24', animation: 'orbit 4s linear infinite' }} />
            <div className="absolute w-2 h-2 rounded-full" style={{ background: '#fde68a', animation: 'orbit 6s linear infinite reverse' }} />
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3 font-display text-3xl md:text-4xl font-bold gold-text" style={{ direction: 'rtl' }}>
          {letters.map((letter, i) => (
            <span key={i} style={{
              animation: `letter-pop 0.5s ease-out forwards`,
              animationDelay: `${i * 0.07}s`, opacity: 0, display: 'inline-block',
              minWidth: letter === ' ' ? '0.5rem' : 'auto',
            }}>{letter}</span>
          ))}
        </div>
        <div className="text-sm text-amber-200/60 font-light tracking-widest uppercase mb-12 animate-slide-up" style={{ animationDelay: '1.2s', opacity: 0 }}>
          English Department · Stage Three
        </div>
        <div className="w-72 md:w-80 animate-slide-up" style={{ animationDelay: '1.5s', opacity: 0 }}>
          <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <div className="h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #fde68a, #f59e0b, #fbbf24)', boxShadow: '0 0 12px rgba(251,191,36,0.6)' }} />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs tracking-widest text-amber-200/40">LOADING</span>
            <span className="text-xs tracking-widest gold-text font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  ✨ User Chip — shows avatar + name in screen headers
// ================================================================
const UserChip = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const name = user?.displayName || user?.email?.split('@')[0] || 'مستخدم';
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold transition-all hover:scale-[1.03]">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', color: '#0a0a14' }}>
            {initials || '👤'}
          </div>
        )}
        <span className="text-amber-200 text-sm font-medium max-w-[120px] truncate">{name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-40 min-w-[200px] rounded-2xl overflow-hidden animate-slide-down"
            style={{ background: 'rgba(20,20,32,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
            <div className="p-4 border-b border-white/5 text-right">
              <div className="text-sm font-bold text-white truncate">{name}</div>
              {user?.email && <div className="text-xs text-white/40 truncate" style={{ direction: 'ltr', textAlign: 'right' }}>{user.email}</div>}
            </div>
            <button onClick={() => { setOpen(false); onLogout(); }}
              className="w-full px-4 py-3 text-right text-sm text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 justify-end">
              تسجيل الخروج
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ================================================================
//  📡 Activity Feed — live stream of recent test completions
// ================================================================
const ActivityFeed = ({ compact = false }) => {
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    const unsub = subscribeRecentActivity(setActivity);
    return () => unsub();
  }, []);

  const subjectName = (id) => SUBJECTS.find(s => s.id === id)?.name || id;
  const subjectColor = (id) => SUBJECTS.find(s => s.id === id)?.color || '#fbbf24';

  const fmtTime = (ts) => {
    if (!ts?.toMillis) return 'الآن';
    const diff = Date.now() - ts.toMillis();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'الآن';
    if (min < 60) return `قبل ${min} د`;
    const h = Math.floor(min / 60);
    if (h < 24) return `قبل ${h} س`;
    const d = Math.floor(h / 24);
    return `قبل ${d} يوم`;
  };

  if (activity.length === 0 && !compact) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-amber-100/40 text-sm">
        لا يوجد نشاط بعد — كن أول من يبدأ الاختبار!
      </div>
    );
  }
  if (activity.length === 0) return null;

  return (
    <div className={compact ? '' : 'glass rounded-3xl p-5 md:p-6'}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399' }} />
            <h3 className="text-base font-bold text-white font-display">النشاط المباشر</h3>
          </div>
          <Activity className="w-4 h-4 text-emerald-300/60" />
        </div>
      )}
      <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin pl-1">
        {activity.slice(0, compact ? 5 : 10).map((a, i) => {
          const col = subjectColor(a.subjectId);
          const pct = Math.round(a.percentage);
          const isHigh = pct >= 70;
          return (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-white/5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              {a.photoURL ? (
                <img src={a.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `linear-gradient(135deg, ${col}40, ${col}20)`, color: col, border: `1px solid ${col}40` }}>
                  {(a.displayName || 'م')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 text-right">
                <div className="text-sm text-white truncate">
                  <span className="font-bold">{a.displayName}</span>
                  <span className="text-white/50"> — {subjectName(a.subjectId)}</span>
                </div>
                <div className="text-[10px] text-white/30 tracking-wider mt-0.5">{fmtTime(a.completedAt)}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold" style={{ color: isHigh ? '#34d399' : '#fbbf24' }}>
                  {a.score}/{a.total}
                </div>
                <div className="text-[10px] text-white/40">{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================
//  👥 Recent Members — live stream of new sign-ups
// ================================================================
const RecentMembers = () => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const unsub = subscribeRecentMembers(setMembers);
    return () => unsub();
  }, []);

  if (members.length === 0) return null;

  return (
    <div className="glass rounded-3xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-300" />
          <h3 className="text-base font-bold text-white font-display">أحدث الأعضاء</h3>
        </div>
        <span className="text-xs text-white/30">{members.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {members.slice(0, 6).map((m) => {
          const name = m.fullName || 'مستخدم';
          const initials = name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
          return (
            <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              {m.photoURL ? (
                <img src={m.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', color: '#0a0a14' }}>
                  {initials || '👤'}
                </div>
              )}
              <span className="text-xs text-amber-100/80 max-w-[100px] truncate">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================
//  🔐 Login Screen — Firebase Auth (Google, GitHub, Email/Password)
// ================================================================
const LoginScreen = ({ onAdminClick }) => {
  const [memberCount, setMemberCount] = useState(0);
  const [mode, setMode] = useState('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const unsub = subscribeMemberCount(setMemberCount);
    return () => unsub();
  }, []);

  const handleError = (e) => {
    const msg = e?.code || e?.message || 'حدث خطأ';
    const map = {
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم مسبقاً',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل)',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/user-not-found': 'لا يوجد حساب بهذا البريد',
      'auth/invalid-credential': 'بيانات الدخول غير صحيحة',
      'auth/popup-closed-by-user': 'تم إغلاق نافذة التسجيل',
      'auth/network-request-failed': 'خطأ في الاتصال — تحقق من الإنترنت',
    };
    setError(map[msg] || `خطأ: ${msg}`);
    setLoading(false);
  };

  const tryGoogle = async () => { setError(''); setLoading(true); try { await signInWithGoogle(); } catch (e) { handleError(e); } };
  const tryGithub = async () => { setError(''); setLoading(true); try { await signInWithGithub(); } catch (e) { handleError(e); } };
  const trySubmit = async () => {
    setError('');
    if (!email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    if (mode === 'signup' && !fullName.trim()) { setError('يرجى إدخال الاسم الثلاثي'); return; }
    if (mode === 'signup' && password.length < 6) { setError('كلمة المرور 6 أحرف على الأقل'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') await signUpWithEmail(email.trim(), password, fullName.trim());
      else await signInWithEmail(email.trim(), password);
    } catch (e) { handleError(e); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 animate-slide-down">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full glass-gold">
          <Users className="w-4 h-4 text-amber-300" />
          <div className="text-right">
            <div className="text-[10px] tracking-widest text-amber-200/60 leading-none uppercase">عدد الأعضاء المسجلين</div>
            <div className="text-2xl font-bold gold-text font-display leading-none mt-1">{memberCount}</div>
          </div>
        </div>
      </div>

      <button onClick={onAdminClick}
        className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 opacity-30 hover:opacity-100"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Settings className="w-4 h-4 text-amber-300" />
      </button>

      <div className="relative z-10 w-full max-w-md mt-24 md:mt-12">
        <div className="flex flex-col items-center mb-8 animate-slide-down">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)', boxShadow: '0 8px 32px rgba(251,191,36,0.3)' }}>
            <Sparkles className="w-7 h-7" style={{ color: '#0a0a14' }} />
          </div>
          <div className="text-xs tracking-[0.3em] uppercase text-amber-200/40">welcome to</div>
          <div className="text-2xl gold-text font-display font-bold mt-1">منصة الاختبارات</div>
        </div>

        <div className="glass rounded-3xl p-7 md:p-9 relative overflow-hidden animate-scale-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="absolute top-0 left-0 w-20 h-20 rounded-tl-3xl border-t-2 border-l-2 opacity-30" style={{ borderColor: '#fbbf24' }} />
          <div className="absolute bottom-0 right-0 w-20 h-20 rounded-br-3xl border-b-2 border-r-2 opacity-30" style={{ borderColor: '#fbbf24' }} />

          {mode === 'options' && (
            <>
              <div className="text-right mb-7">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">أهلاً بك 👋</h1>
                <p className="text-amber-100/50 text-sm leading-relaxed">سجّل دخولك لتبدأ الاختبارات وتظهر في لوحة الصدارة</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button onClick={tryGoogle} disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ background: 'white', color: '#1f2937', boxShadow: '0 6px 20px rgba(255,255,255,0.15)', flexDirection: 'row-reverse' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  المتابعة بحساب Google
                </button>

                <button onClick={tryGithub} disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50 text-white"
                  style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', flexDirection: 'row-reverse' }}>
                  <Github className="w-5 h-5" />
                  المتابعة بحساب GitHub
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span className="text-xs text-white/40 uppercase tracking-widest">أو</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <button onClick={() => { setMode('signin'); setError(''); }} disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%)', color: '#0a0a14', boxShadow: '0 8px 24px rgba(251,191,36,0.25)', flexDirection: 'row-reverse' }}>
                  <Mail className="w-5 h-5" />
                  تسجيل الدخول بالبريد
                </button>

                <button onClick={() => { setMode('signup'); setError(''); }} disabled={loading}
                  className="w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', flexDirection: 'row-reverse' }}>
                  <UserPlus className="w-4 h-4" />
                  ليس لدي حساب — إنشاء حساب جديد
                </button>
              </div>
            </>
          )}

          {(mode === 'signin' || mode === 'signup') && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => { setMode('options'); setError(''); }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </button>
                <h1 className="text-2xl font-bold text-white font-display">
                  {mode === 'signup' ? 'حساب جديد' : 'تسجيل الدخول'}
                </h1>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-amber-200/50 mb-2">الاسم الثلاثي</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: محمد جاسم معاريج"
                      className="w-full px-4 py-3 rounded-2xl text-white text-base text-right"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.2)' }} />
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-amber-200/50 mb-2">البريد الإلكتروني</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-2xl text-white text-base text-left"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.2)', direction: 'ltr' }} />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-amber-200/50 mb-2">كلمة المرور</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && trySubmit()}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pl-12 rounded-2xl text-white text-base text-left"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.2)', direction: 'ltr' }} />
                    <button onClick={() => setShowPwd((s) => !s)} type="button"
                      className="absolute top-1/2 -translate-y-1/2 left-3 text-amber-200/40 hover:text-amber-200 transition-colors">
                      {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button onClick={trySubmit} disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b, #fbbf24)', color: '#0a0a14', boxShadow: '0 8px 24px rgba(251,191,36,0.3)' }}>
                  {loading ? <Loader2 className="w-5 h-5 animate-rotate-slow" style={{ animationDuration: '1s' }} /> : <ArrowLeft className="w-5 h-5" />}
                  {loading ? 'جارٍ المعالجة...' : (mode === 'signup' ? 'إنشاء حساب' : 'دخول')}
                </button>

                <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}
                  className="w-full text-center text-xs text-amber-200/60 hover:text-amber-200 transition-colors py-2">
                  {mode === 'signup' ? 'لدي حساب بالفعل — تسجيل دخول' : 'ليس لدي حساب — إنشاء جديد'}
                </button>
              </div>
            </>
          )}

          <div className="mt-7 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-amber-200/30 tracking-wider mb-3">قسم اللغة الإنجليزية · المرحلة الثالثة</p>
            <div className="flex items-center justify-center gap-3">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'linear-gradient(135deg, rgba(225,48,108,0.15), rgba(247,119,55,0.1))', border: '1px solid rgba(247,119,55,0.3)' }}>
                <Instagram className="w-4 h-4" style={{ color: '#fd1d1d' }} />
              </a>
              <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'linear-gradient(135deg, rgba(34,158,217,0.15), rgba(0,136,204,0.1))', border: '1px solid rgba(34,158,217,0.3)' }}>
                <TelegramIcon className="w-4 h-4" style={{ color: '#229ed9' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  Stage Selection Screen
// ================================================================
const StageCard = ({ stage, onClick }) => {
  const isAvailable = stage.status === 'available';
  return (
    <button onClick={onClick} disabled={!isAvailable}
      className={`relative group rounded-3xl p-7 md:p-8 text-right overflow-hidden transition-all duration-500 ${isAvailable ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1' : 'cursor-not-allowed opacity-50'}`}
      style={{
        background: isAvailable ? 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isAvailable ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.05)'}`,
        backdropFilter: 'blur(20px)',
      }}>
      {isAvailable && (<>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl group-hover:opacity-50 transition-opacity" style={{ background: '#fbbf24' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }} />
      </>)}
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: isAvailable ? '#fbbf24' : '#64748b' }}>STAGE</div>
          <h3 className={`text-2xl md:text-3xl font-display font-bold mb-3 ${isAvailable ? 'text-white' : 'text-white/40'}`}>{stage.label}</h3>
          <div className="flex items-center gap-2 justify-end">
            {isAvailable ? (<>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399' }} />
              <span className="text-sm text-emerald-400">{stage.desc}</span>
            </>) : (<>
              <Lock className="w-3 h-3 text-white/30" />
              <span className="text-sm text-white/30">{stage.desc}</span>
            </>)}
          </div>
        </div>
        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold font-amiri ${isAvailable ? 'text-amber-900' : 'text-white/30'}`}
          style={{
            background: isAvailable ? 'linear-gradient(135deg, #fde68a, #f59e0b)' : 'rgba(255,255,255,0.05)',
            boxShadow: isAvailable ? '0 8px 24px rgba(251,191,36,0.3)' : 'none',
          }}>
          {isAvailable ? stage.num.charAt(0) : <Lock className="w-5 h-5" />}
        </div>
      </div>
      {isAvailable && (
        <div className="relative mt-6 pt-5 border-t border-amber-200/10 flex items-center justify-between">
          <span className="text-xs text-amber-200/60">اضغط للمتابعة</span>
          <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-2 transition-transform duration-300" />
        </div>
      )}
    </button>
  );
};

const StageScreen = ({ user, onLogout, onSelect, onBack }) => {
  const stages = [
    { num: 'الأولى', label: 'المرحلة الأولى', status: 'unavailable', desc: 'غير متوفر' },
    { num: 'الثانية', label: 'المرحلة الثانية', status: 'unavailable', desc: 'غير متوفر حالياً' },
    { num: 'الثالثة', label: 'المرحلة الثالثة', status: 'available', desc: 'متوفر · 9 مواد' },
    { num: 'الرابعة', label: 'المرحلة الرابعة', status: 'soon', desc: 'قريباً' },
  ];
  return (
    <div className="min-h-screen px-4 py-10 md:py-14 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-slide-down">
          <button onClick={onBack} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-amber-100/70">
            <ChevronLeft className="w-4 h-4" /><span className="text-sm">السابق</span>
          </button>
          <div className="glass-gold rounded-full px-5 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#fbbf24' }} />
            <span className="text-amber-200 text-sm font-medium">{user?.displayName || 'مستخدم'}</span>
          </div>
        </div>
        <div className="text-center mb-16 animate-slide-up">
          <div className="text-xs tracking-[0.4em] uppercase text-amber-200/40 mb-3">— Stage Selection —</div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            <span className="text-white">اختر </span><span className="gold-text">المرحلة الدراسية</span>
          </h1>
          <p className="text-amber-100/40 text-sm md:text-base max-w-xl mx-auto">حدد المرحلة الدراسية التي تنتمي إليها لعرض المواد المتاحة للاختبار</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
          {stages.map((stage, i) => (
            <StageCard key={i} stage={stage} onClick={() => stage.status === 'available' && onSelect()} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  Subject Selection Screen
// ================================================================
const SubjectCard = ({ subject, count, onClick }) => {
  const Icon = subject.icon;
  const hasQuestions = count > 0;
  return (
    <button onClick={onClick} disabled={!hasQuestions}
      className={`relative group rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500 ${hasQuestions ? 'hover:scale-[1.04] hover:-translate-y-1 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}>
      {hasQuestions && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at top, ${subject.glow}, transparent 70%)` }} />
      )}
      {hasQuestions && (
        <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${subject.color}, transparent)` }} />
      )}
      <div className="relative flex flex-col items-center text-center gap-4">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 ${hasQuestions ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}
          style={{
            background: `linear-gradient(135deg, ${subject.color}20, ${subject.color}05)`,
            border: `1px solid ${subject.color}30`,
            boxShadow: hasQuestions ? `0 8px 24px ${subject.glow}` : 'none',
          }}>
          {hasQuestions ? <Icon className="w-8 h-8 md:w-9 md:h-9" style={{ color: subject.color }} />
            : <Lock className="w-7 h-7 text-white/30" />}
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-white mb-1 font-display">{subject.name}</h3>
          <div className="text-xs text-white/40 tracking-wider">
            {hasQuestions ? `${count} سؤال متاح` : 'لا توجد أسئلة بعد'}
          </div>
        </div>
        <div className="w-8 h-px transition-all duration-500 group-hover:w-16" style={{ background: hasQuestions ? subject.color : 'rgba(255,255,255,0.2)' }} />
      </div>
    </button>
  );
};

const SubjectScreen = ({ user, onLogout, onSelect, onBack }) => {
  const [counts, setCounts] = useState({});
  useEffect(() => {
    (async () => {
      const c = {};
      for (const s of SUBJECTS) c[s.id] = (await loadQuestions(s.id)).length;
      setCounts(c);
    })();
  }, []);
  return (
    <div className="min-h-screen px-4 py-10 md:py-14 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-slide-down">
          <button onClick={onBack} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-amber-100/70">
            <ChevronLeft className="w-4 h-4" /><span className="text-sm">المراحل</span>
          </button>
          <UserChip user={user} onLogout={onLogout} />
        </div>
        <div className="text-center mb-14 animate-slide-up">
          <div className="text-xs tracking-[0.4em] uppercase text-amber-200/40 mb-3">— Subject Selection —</div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            <span className="text-white">اختر </span><span className="gold-text">المادة</span>
          </h1>
          <p className="text-amber-100/40 text-sm md:text-base max-w-xl mx-auto">تسع مواد دراسية بانتظارك — اختر المادة لبدء اختبار اختيار من متعدد</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 stagger">
          {SUBJECTS.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} count={counts[subject.id] || 0}
              onClick={() => (counts[subject.id] || 0) > 0 && onSelect(subject.id)} />
          ))}
        </div>

        {/* ✨ Social touches: see what friends are doing right now */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <RecentMembers />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  Quiz Screen
// ================================================================
const QuizScreen = ({ user, subjectId, onFinish, onBack }) => {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [key, setKey] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    (async () => { setQuestions(await loadQuestions(subjectId)); })();
  }, [subjectId]);

  if (questions === null) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ direction: 'rtl' }}>
        <Atmosphere />
        <div className="relative z-10 text-amber-200/60">جارٍ تحميل الأسئلة...</div>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ direction: 'rtl' }}>
        <Atmosphere />
        <div className="relative z-10 glass rounded-3xl p-8 max-w-md text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-amber-300/50" />
          <h2 className="text-xl font-bold text-white mb-2 font-display">لا توجد أسئلة لهذه المادة بعد</h2>
          <p className="text-amber-100/40 text-sm mb-6">سيتم إضافة الأسئلة قريباً من قبل المسؤول</p>
          <button onClick={onBack}
            className="px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', color: '#0a0a14' }}>
            العودة للمواد
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const total = questions.length;
  const progress = ((current + (answered ? 1 : 0)) / total) * 100;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[current] = idx;
      return updated;
    });
    if (idx === q.correct) setScore((s) => s + 1);
  };
  const handleNext = () => {
    if (current + 1 >= total) {
      const reviewData = questions.map((item, index) => ({
        ...item,
        userAnswer: index === current ? selected : userAnswers[index],
      }));
      onFinish(score, total, reviewData);
    } else {
      setCurrent((c) => c + 1); setSelected(null); setAnswered(false); setKey((k) => k + 1);
    }
  };
  const Icon = subject.icon;

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <button onClick={onBack} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-amber-100/70">
            <ChevronLeft className="w-4 h-4" /><span className="text-sm">خروج</span>
          </button>
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-medium">{score} / {total}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8 animate-slide-up">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${subject.color}20, ${subject.color}05)`, border: `1px solid ${subject.color}40` }}>
            <Icon className="w-6 h-6" style={{ color: subject.color }} />
          </div>
          <div className="text-right">
            <div className="text-xs tracking-widest text-white/30 uppercase">مادة</div>
            <div className="text-lg font-display font-bold text-white">{subject.name}</div>
          </div>
        </div>

        <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white/40 tracking-wider">السؤال {current + 1} من {total}</span>
            <span className="font-bold gold-text">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${subject.color}, #fbbf24)`, boxShadow: `0 0 12px ${subject.glow}` }} />
          </div>
        </div>

        <div key={key} className="glass rounded-3xl p-7 md:p-10 animate-scale-in">
          <div className="text-xs tracking-[0.3em] uppercase mb-4 text-amber-200/40">— سؤال {current + 1}</div>
          <h2 className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-8 font-display">{q.q}</h2>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = idx === q.correct;
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;
              let bg = 'rgba(255,255,255,0.03)';
              let border = 'rgba(255,255,255,0.08)';
              if (showCorrect) { bg = 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))'; border = 'rgba(52,211,153,0.4)'; }
              else if (showWrong) { bg = 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(248,113,113,0.05))'; border = 'rgba(248,113,113,0.4)'; }
              else if (isSelected) { bg = `linear-gradient(135deg, ${subject.color}20, ${subject.color}05)`; border = `${subject.color}40`; }
              return (
                <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
                  className="w-full text-right p-4 md:p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] disabled:hover:scale-100 disabled:cursor-default flex items-center gap-4"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{
                      background: showCorrect ? 'rgba(52,211,153,0.25)' : showWrong ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.05)',
                      color: showCorrect ? '#34d399' : showWrong ? '#f87171' : 'rgba(255,255,255,0.7)',
                    }}>
                    {showCorrect ? <Check className="w-4 h-4" /> : showWrong ? '✕' : ['أ', 'ب', 'ج', 'د'][idx]}
                  </div>
                  <span className="flex-1 text-base md:text-lg font-medium text-white">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-8 animate-slide-up">
              <button onClick={handleNext}
                className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%)', color: '#0a0a14', boxShadow: '0 10px 40px rgba(251,191,36,0.3)' }}>
                <span className="flex items-center justify-center gap-2">
                  {current + 1 >= total ? 'عرض النتيجة' : 'السؤال التالي'}
                  <ArrowLeft className="w-5 h-5" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  Leaderboard Row + Results Screen
// ================================================================
const LeaderboardRow = ({ player, rank }) => {
  const isFirst = rank === 1, isSecond = rank === 2, isThird = rank === 3;
  const isTop3 = rank <= 3;
  let bg, border, glow, rankBg, rankColor, rankIcon, nameColor, scoreColor;

  if (isFirst) {
    bg = 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.05))';
    border = 'rgba(251,191,36,0.5)'; glow = '0 8px 32px rgba(251,191,36,0.3)';
    rankBg = 'linear-gradient(135deg, #fde68a, #f59e0b)'; rankColor = '#0a0a14';
    rankIcon = Crown; nameColor = 'text-amber-100'; scoreColor = 'gold-text';
  } else if (isSecond) {
    bg = 'linear-gradient(135deg, rgba(203,213,225,0.12), rgba(148,163,184,0.04))';
    border = 'rgba(203,213,225,0.4)'; glow = '0 8px 24px rgba(203,213,225,0.2)';
    rankBg = 'linear-gradient(135deg, #f1f5f9, #94a3b8)'; rankColor = '#0a0a14';
    rankIcon = Medal; nameColor = 'text-slate-100'; scoreColor = 'silver-text';
  } else if (isThird) {
    bg = 'linear-gradient(135deg, rgba(251,146,60,0.12), rgba(194,65,12,0.04))';
    border = 'rgba(251,146,60,0.4)'; glow = '0 8px 24px rgba(251,146,60,0.2)';
    rankBg = 'linear-gradient(135deg, #fdba74, #c2410c)'; rankColor = '#0a0a14';
    rankIcon = Award; nameColor = 'text-orange-100'; scoreColor = 'bronze-text';
  } else {
    bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.06)'; glow = 'none';
    rankBg = 'rgba(255,255,255,0.05)'; rankColor = 'rgba(255,255,255,0.6)';
    rankIcon = null; nameColor = 'text-white/80'; scoreColor = 'text-white';
  }

  const userHighlight = player.isUser
    ? { boxShadow: glow !== 'none' ? `${glow}, inset 0 0 0 1px rgba(251,191,36,0.6)` : 'inset 0 0 0 1px rgba(251,191,36,0.6)' }
    : { boxShadow: glow };

  return (
    <div className={`relative rounded-2xl p-4 md:p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] ${isTop3 ? 'overflow-hidden' : ''}`}
      style={{ background: bg, border: `1px solid ${border}`, ...userHighlight, backdropFilter: 'blur(20px)' }}>
      {isTop3 && (
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${isFirst ? '#fbbf24' : isSecond ? '#cbd5e1' : '#fb923c'}, transparent)` }} />
      )}
      <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-display relative overflow-hidden"
        style={{ background: rankBg, color: rankColor, boxShadow: isTop3 ? '0 4px 16px rgba(0,0,0,0.2)' : 'none' }}>
        {rankIcon ? React.createElement(rankIcon, { className: 'w-6 h-6' }) : rank}
      </div>
      {player.photoURL && (
        <img src={player.photoURL} alt=""
          className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full -ml-2 z-[1]"
          style={{ border: `2px solid ${isTop3 ? '#0a0a14' : 'rgba(255,255,255,0.1)'}` }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-base md:text-lg truncate ${nameColor}`}>{player.name}</span>
          {player.isUser && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase"
              style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' }}>أنت</span>
          )}
        </div>
        {isTop3 && (
          <div className="text-xs mt-0.5 tracking-widest uppercase opacity-50" style={{ color: isFirst ? '#fbbf24' : isSecond ? '#cbd5e1' : '#fb923c' }}>
            {isFirst ? '◆ المركز الأول' : isSecond ? '◆ المركز الثاني' : '◆ المركز الثالث'}
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className={`text-2xl md:text-3xl font-bold font-display ${scoreColor}`}>{player.score}</div>
        <div className="text-xs text-white/30 tracking-wider">من {player.total}</div>
      </div>
    </div>
  );
};
// ================================================================
//  📝 Quiz Review Component
// ================================================================
const QuizReview = ({ review }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'correct', 'incorrect'

  if (!review || review.length === 0) return null;

  const correctCount = review.filter(q => q.userAnswer === q.correct).length;
  const incorrectCount = review.length - correctCount;

  const filteredQuestions = review.filter(q => {
    if (filter === 'correct') return q.userAnswer === q.correct;
    if (filter === 'incorrect') return q.userAnswer !== q.correct;
    return true;
  });

  return (
    <div className="glass rounded-3xl p-6 md:p-8 mb-10 text-right animate-slide-up" style={{ animationDelay: '2.1s', opacity: 0 }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white font-display mb-1 font-sans">مراجعة الأسئلة</h3>
          <p className="text-xs text-white/40">اضغط على التبويبات لتصفية الأسئلة</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            الكل ({review.length})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 flex items-center gap-2 ${
              filter === 'incorrect'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            الأخطاء ({incorrectCount})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 flex items-center gap-2 ${
              filter === 'correct'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            الإجابات الصحيحة ({correctCount})
          </button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-10 text-white/30 text-sm">
          لا توجد أسئلة في هذا القسم
        </div>
      ) : (
        <div className="space-y-6 max-h-[550px] overflow-y-auto pl-2 pr-1 custom-scrollbar scroll-smooth">
          {filteredQuestions.map((q, idx) => {
            const isUserCorrect = q.userAnswer === q.correct;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.02]"
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRight: `4px solid ${isUserCorrect ? '#10b981' : '#ef4444'}`
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <span className="text-xs text-white/30 block mb-1">سؤال {idx + 1}</span>
                    <h4 className="text-base md:text-lg font-bold text-white leading-relaxed font-display">{q.q}</h4>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold ${
                      isUserCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {isUserCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = q.userAnswer === optIdx;
                    const isCorrect = optIdx === q.correct;
                    const showCorrect = isCorrect;
                    const showWrong = isSelected && !isCorrect;

                    let bg = 'rgba(255,255,255,0.02)';
                    let border = 'rgba(255,255,255,0.05)';
                    let textColor = 'text-white/70';

                    if (showCorrect) {
                      bg = 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(52,211,153,0.02))';
                      border = 'rgba(52,211,153,0.3)';
                      textColor = 'text-emerald-300 font-medium';
                    } else if (showWrong) {
                      bg = 'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(248,113,113,0.02))';
                      border = 'rgba(248,113,113,0.3)';
                      textColor = 'text-red-300 font-medium';
                    }

                    return (
                      <div
                        key={optIdx}
                        className="p-3.5 rounded-xl flex items-center gap-3 text-sm transition-all"
                        style={{ background: bg, border: `1px solid ${border}` }}
                      >
                        <div
                          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                          style={{
                            background: showCorrect
                              ? 'rgba(52,211,153,0.15)'
                              : showWrong
                              ? 'rgba(248,113,113,0.15)'
                              : 'rgba(255,255,255,0.04)',
                            color: showCorrect ? '#34d399' : showWrong ? '#f87171' : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {showCorrect ? <Check className="w-3.5 h-3.5" /> : showWrong ? '✕' : ['أ', 'ب', 'ج', 'د'][optIdx]}
                        </div>
                        <span className={`flex-1 ${textColor}`}>{opt}</span>
                        {isSelected && !isUserCorrect && (
                          <span className="text-[10px] text-red-400 font-bold px-2 py-0.5 rounded bg-red-400/10">إجابتك</span>
                        )}
                        {isSelected && isUserCorrect && (
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-400/10">إجابتك</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ResultsScreen = ({ user, subjectId, score, total, review = [], onRestart }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [board, setBoard] = useState([]);

  // Record attempt to Firestore once, then subscribe to live leaderboard
  useEffect(() => {
    if (!user) return;
    let unsub = () => {};
    (async () => {
      try {
        const subjectName = SUBJECTS.find(s => s.id === subjectId)?.name || subjectId;
        await recordAttempt(user, subjectId, subjectName, score, total);
      } catch (e) { console.error('Failed to record attempt:', e); }
      // Subscribe to live leaderboard — updates as others finish
      unsub = subscribeLeaderboard((top) => {
        setBoard(top.map((p) => ({
          name: p.displayName,
          photoURL: p.photoURL,
          score: p.score,
          total: p.total,
          pct: p.percentage,
          isUser: p.uid === user.uid,
        })));
      });
    })();
    return () => unsub();
  }, [user, subjectId, score, total]);

  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(score / 15));
    const interval = setInterval(() => {
      n = Math.min(n + step, score);
      setDisplayScore(n);
      if (n >= score) clearInterval(interval);
    }, 80);
    setTimeout(() => setShowLeaderboard(true), 1400);
    return () => clearInterval(interval);
  }, [score]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              background: ['#fbbf24', '#fde68a', '#f59e0b', '#34d399', '#60a5fa'][i % 5],
              animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 animate-bounce-in">
            <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3), transparent)' }} />
            <svg viewBox="0 0 100 100" className="w-full h-full relative">
              <defs>
                <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#checkGrad)" strokeWidth="2.5" strokeDasharray="283" strokeDashoffset="283" style={{ animation: 'draw-circle 1s ease-out 0.3s forwards' }} />
              <circle cx="50" cy="50" r="38" fill="url(#checkGrad)" opacity="0" style={{ animation: 'scale-in 0.5s ease-out 0.9s forwards' }} />
              <path d="M 30 50 L 45 65 L 72 35" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100" style={{ animation: 'draw-check 0.6s ease-out 1.2s forwards' }} />
            </svg>
          </div>

          <div className="text-xs tracking-[0.4em] uppercase text-emerald-300/60 mb-3 animate-slide-up" style={{ animationDelay: '1.5s', opacity: 0 }}>— Quiz Completed —</div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-center mb-3 animate-slide-up" style={{ animationDelay: '1.6s', opacity: 0 }}>
            <span className="gold-text">لقد اجتزت الاختبار بنجاح!</span>
          </h1>
          <p className="text-amber-100/40 text-center mb-8 animate-slide-up" style={{ animationDelay: '1.7s', opacity: 0 }}>أحسنت يا {user?.displayName || 'بطل'} — هذه نتيجتك</p>

          <div className="glass-gold rounded-3xl px-10 py-8 text-center animate-scale-in" style={{ animationDelay: '1.9s', opacity: 0 }}>
            <div className="text-xs tracking-[0.3em] uppercase text-amber-200/50 mb-2">YOUR SCORE</div>
            <div className="text-5xl md:text-7xl font-bold mb-2 font-display">
              <span className="gold-text">{displayScore}</span>
              <span className="text-white/30 text-3xl md:text-4xl"> / {total}</span>
            </div>
            <div className="text-amber-200/70 font-medium">حصلت على {percentage}%</div>
          </div>
        </div>

        {showLeaderboard && (
          <div className="animate-slide-up">
            <QuizReview review={review} />

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-amber-200 text-sm tracking-widest uppercase">Top 10 Leaderboard</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold gold-text">لوحة الصدارة</h2>
              <p className="text-xs text-amber-100/40 mt-2">المراكز الحقيقية للأعضاء المسجلين</p>
            </div>

            {board.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-amber-100/40">لا توجد نتائج بعد</div>
            ) : (
              <div className="space-y-3 stagger">
                {board.map((p, idx) => <LeaderboardRow key={idx} player={p} rank={idx + 1} />)}
              </div>
            )}

            <div className="mt-10 text-center animate-slide-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
              <button onClick={onRestart}
                className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%)', color: '#0a0a14', boxShadow: '0 10px 40px rgba(251,191,36,0.3)' }}>
                خوض اختبار آخر
              </button>
            </div>

            {/* ✨ Activity Feed — see what friends are doing right now */}
            <div className="mt-12 animate-slide-up" style={{ animationDelay: '1s', opacity: 0 }}>
              <ActivityFeed />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ================================================================
//  🔐 ADMIN: Login
// ================================================================
const AdminLogin = ({ onSuccess, onBack, showToast }) => {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 400); }, []);
  const handleSubmit = () => {
    if (pwd === ADMIN_PASSWORD) onSuccess();
    else showToast('كلمة المرور غير صحيحة', 'error');
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="relative z-10 w-full max-w-md">
        <button onClick={onBack} className="mb-6 glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-amber-100/70">
          <ChevronLeft className="w-4 h-4" /><span className="text-sm">عودة</span>
        </button>
        <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden animate-scale-in">
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }} />
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))', border: '1px solid rgba(251,191,36,0.4)' }}>
              <Lock className="w-7 h-7 text-amber-300" />
            </div>
            <div className="text-xs tracking-[0.3em] uppercase text-amber-200/40">— Admin Area —</div>
            <h1 className="text-2xl md:text-3xl font-display font-bold gold-text mt-2">لوحة المسؤول</h1>
            <p className="text-amber-100/40 text-sm mt-2 text-center">أدخل كلمة المرور للوصول إلى إدارة الأسئلة</p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-amber-200/50 mb-3 font-medium">— كلمة المرور</label>
              <div className="relative">
                <input ref={ref} type={show ? 'text' : 'password'} value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 pl-12 rounded-2xl text-white text-lg text-right transition-all duration-300"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.2)' }} />
                <button onClick={() => setShow((s) => !s)} className="absolute top-1/2 -translate-y-1/2 left-4 text-amber-200/40 hover:text-amber-200 transition-colors">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%)', color: '#0a0a14', boxShadow: '0 10px 40px rgba(251,191,36,0.3)' }}>
              <span className="flex items-center justify-center gap-2">دخول <ArrowLeft className="w-5 h-5" /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)`, border: `1px solid ${color}40` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <div className="text-xs tracking-wider text-white/40 uppercase mb-1">{label}</div>
      <div className="text-2xl font-bold font-display" style={{ color }}>{value}</div>
    </div>
  </div>
);

// ================================================================
//  🔐 ADMIN: Question List Item
// ================================================================
const QuestionListItem = ({ q, idx, onDelete, subjectColor }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl p-4 transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ background: `${subjectColor}20`, color: subjectColor, border: `1px solid ${subjectColor}40` }}>
          {idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <button onClick={() => setExpanded((e) => !e)} className="text-right w-full">
            <p className="text-white font-medium text-sm md:text-base leading-relaxed">{q.q}</p>
          </button>
          {expanded && (
            <div className="mt-3 space-y-1.5">
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: i === q.correct ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)',
                      color: i === q.correct ? '#34d399' : 'rgba(255,255,255,0.4)',
                    }}>
                    {i === q.correct ? <Check className="w-3 h-3" /> : ['أ', 'ب', 'ج', 'د'][i]}
                  </span>
                  <span className={i === q.correct ? 'text-emerald-300' : 'text-white/60'}>{opt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={onDelete}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
};

// ================================================================
//  🔐 ADMIN: Subject Question Editor
// ================================================================
const AdminSubjectEditor = ({ subjectId, onBack, showToast }) => {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQ, setNewQ] = useState('');
  const [newOpts, setNewOpts] = useState(['', '', '', '']);
  const [newCorrect, setNewCorrect] = useState(0);
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const fileRef = useRef(null);
  const pdfRef = useRef(null);
  // PDF parsing state
  const [parsed, setParsed] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [pdfName, setPdfName] = useState('');
  // Raw text fallback when parsing fails
  const [rawText, setRawText] = useState('');
  const [rawTextEdit, setRawTextEdit] = useState('');

  useEffect(() => {
    (async () => { setQuestions(await loadStoredQuestions(subjectId)); setLoading(false); })();
  }, [subjectId]);

  const persist = async (next) => {
    setQuestions(next);
    const ok = await saveQuestions(subjectId, next);
    if (!ok) {
      // Storage failed — but questions are still in local state for this session
      showToast('⚠️ تعذّر الحفظ الدائم — التغييرات لهذه الجلسة فقط', 'error');
      return false;
    }
    // Verify by reading back from shared storage
    const verifyArr = await loadStoredQuestions(subjectId);
    if (verifyArr.length !== next.length) {
      showToast(`⚠️ مشكلة بالتزامن: ${verifyArr.length} من ${next.length}`, 'error');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!newQ.trim() || newOpts.some((o) => !o.trim())) {
      showToast('يرجى ملء السؤال وجميع الخيارات', 'error');
      return;
    }
    const next = [...questions, { q: newQ.trim(), options: newOpts.map((o) => o.trim()), correct: newCorrect }];
    persist(next);
    setNewQ(''); setNewOpts(['', '', '', '']); setNewCorrect(0);
    showToast('تم إضافة السؤال', 'success');
  };

  const handleDelete = (idx) => {
    if (!window.confirm('هل تريد حذف هذا السؤال؟')) return;
    persist(questions.filter((_, i) => i !== idx));
    showToast('تم الحذف', 'success');
  };

  const handleClearAll = () => {
    if (!window.confirm(`هل تريد حذف جميع أسئلة ${subject.name}؟ لا يمكن التراجع.`)) return;
    persist([]);
    showToast('تم حذف جميع الأسئلة', 'success');
  };

  const handleBulkImport = () => {
    try {
      const parsed = JSON.parse(bulkText);
      const arr = Array.isArray(parsed) ? parsed : null;
      if (!arr) { showToast('يجب أن يكون JSON مصفوفة [...]', 'error'); return; }
      const valid = arr.every((x) =>
        typeof x.q === 'string' && Array.isArray(x.options) && x.options.length === 4 &&
        typeof x.correct === 'number' && x.correct >= 0 && x.correct <= 3
      );
      if (!valid) { showToast('صيغة الأسئلة غير صحيحة', 'error'); return; }
      const next = [...questions, ...arr];
      persist(next);
      setBulkText(''); setShowBulk(false);
      showToast(`تم استيراد ${arr.length} سؤال`, 'success');
    } catch { showToast('JSON غير صالح', 'error'); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target.result;
      // Try to auto-import directly — no extra button click needed
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          const valid = parsed.every((x) =>
            typeof x.q === 'string' && Array.isArray(x.options) && x.options.length === 4 &&
            typeof x.correct === 'number' && x.correct >= 0 && x.correct <= 3
          );
          if (valid) {
            const next = [...questions, ...parsed];
            const ok = await persist(next);
            if (ok) {
              showToast(`✅ تم حفظ ${parsed.length} سؤال — مرئي للطلاب الآن!`, 'success');
            }
            // If !ok, persist already showed an error
            if (fileRef.current) fileRef.current.value = '';
            return;
          }
        }
        // Validation failed — fall back to manual review
        setBulkText(text);
        setShowBulk(true);
        showToast('صيغة JSON غير صحيحة — راجع المحتوى', 'error');
      } catch {
        setBulkText(text);
        setShowBulk(true);
        showToast('JSON غير صالح — راجعه يدوياً', 'error');
      }
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfName(file.name);
    setParsing(true);
    setParsed(null);
    setRawText('');
    try {
      const text = await extractTextFromPdf(file);
      const extracted = parseQuestionsFromText(text);
      if (extracted.length === 0) {
        // FALLBACK: show raw text so user can edit/copy/send
        setRawText(text);
        setRawTextEdit(text);
        showToast('لم يُكتشف أي سؤال — راجع النص المستخرج بالأسفل', 'error');
        setParsing(false);
        if (pdfRef.current) pdfRef.current.value = '';
        return;
      }
      setParsed(extracted);
      const detected = extracted.filter((q) => q._detected).length;
      showToast(`تم استخراج ${extracted.length} سؤال (${detected} مع إجابات مُكتشَفة)`, 'success');
    } catch (err) {
      showToast('فشل قراءة PDF — تحقق من الملف', 'error');
    } finally {
      setParsing(false);
      if (pdfRef.current) pdfRef.current.value = '';
    }
  };

  const retryParseRawText = () => {
    const ex = parseQuestionsFromText(rawTextEdit);
    if (ex.length === 0) {
      showToast('لا يزال التعرف يفشل — حاول ضبط الصيغة أو أرسل النص لي', 'error');
      return;
    }
    setParsed(ex);
    setRawText('');
    setRawTextEdit('');
    const detected = ex.filter((q) => q._detected).length;
    showToast(`تم استخراج ${ex.length} سؤال (${detected} مع إجابات مُكتشَفة)`, 'success');
  };

  const copyRawText = async () => {
    try {
      await navigator.clipboard.writeText(rawTextEdit);
      showToast('تم النسخ — ألصقه في المحادثة معي', 'success');
    } catch {
      showToast('فشل النسخ، حدد النص يدوياً', 'error');
    }
  };

  const updateParsedCorrect = (qIdx, optIdx) => {
    setParsed((arr) => arr.map((q, i) => i === qIdx ? { ...q, correct: optIdx, _detected: true } : q));
  };
  const deleteParsedQ = (qIdx) => {
    setParsed((arr) => arr.filter((_, i) => i !== qIdx));
  };
  const updateParsedText = (qIdx, field, value, optIdx = null) => {
    setParsed((arr) => arr.map((q, i) => {
      if (i !== qIdx) return q;
      if (field === 'q') return { ...q, q: value };
      if (field === 'opt') {
        const newOpts2 = [...q.options];
        newOpts2[optIdx] = value;
        return { ...q, options: newOpts2 };
      }
      return q;
    }));
  };
  const commitParsed = () => {
    if (!parsed || parsed.length === 0) return;
    // Validate all questions have non-empty text and options
    const valid = parsed.every((q) => q.q.trim() && q.options.every((o) => o.trim()));
    if (!valid) { showToast('بعض الأسئلة فارغة — يرجى ملؤها أو حذفها', 'error'); return; }
    const cleaned = parsed.map(({ q, options, correct }) => ({ q: q.trim(), options: options.map(o => o.trim()), correct }));
    const next = [...questions, ...cleaned];
    persist(next);
    showToast(`تم إضافة ${cleaned.length} سؤال`, 'success');
    setParsed(null);
    setPdfName('');
  };

  const handleExport = () => {
    const data = JSON.stringify(questions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${subjectId}_questions.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم التصدير', 'success');
  };

  const Icon = subject.icon;

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <button onClick={onBack} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-amber-100/70">
            <ChevronLeft className="w-4 h-4" /><span className="text-sm">لوحة التحكم</span>
          </button>
          {questions.length > 0 && (
            <div className="flex gap-2">
              <button onClick={handleExport}
                className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-emerald-300/80 text-sm">
                <Download className="w-4 h-4" />تصدير
              </button>
              <button onClick={handleClearAll}
                className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-red-500/10 transition-all text-red-300/80 text-sm">
                <Trash2 className="w-4 h-4" />حذف الكل
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${subject.color}20, ${subject.color}05)`, border: `1px solid ${subject.color}40`, boxShadow: `0 8px 24px ${subject.glow}` }}>
            <Icon className="w-8 h-8" style={{ color: subject.color }} />
          </div>
          <div className="flex-1">
            <div className="text-xs tracking-widest text-white/40 uppercase">إدارة مادة</div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{subject.name}</h1>
            <div className="text-sm mt-1 flex flex-wrap gap-2 items-center">
              {(DEFAULT_QUESTIONS[subjectId] || []).length > 0 && (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold"
                  style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                  ✓ {(DEFAULT_QUESTIONS[subjectId] || []).length} مدمج
                </span>
              )}
              <span style={{ color: subject.color }}>{questions.length} مضاف</span>
              <span className="text-white/40">·</span>
              <span className="text-white/60 font-bold">المجموع: {(DEFAULT_QUESTIONS[subjectId] || []).length + questions.length}</span>
            </div>
          </div>
        </div>

        {(DEFAULT_QUESTIONS[subjectId] || []).length > 0 && (
          <div className="rounded-2xl p-4 mb-6 text-sm"
            style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
              <div className="text-emerald-100/80 leading-relaxed">
                <strong className="text-emerald-200">يوجد {(DEFAULT_QUESTIONS[subjectId] || []).length} سؤال مدمج مسبقاً في هذه المادة</strong> — متاحة تلقائياً لجميع الطلاب دون أي إعداد. أي أسئلة تضيفها هنا ستُضاف فوقها.
              </div>
            </div>
          </div>
        )}

        {/* Add Question Form */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-6 animate-scale-in">
          <h2 className="text-lg font-bold text-white font-display mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-300" />إضافة سؤال جديد
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest text-amber-200/50 uppercase mb-2">— نص السؤال</label>
              <textarea value={newQ} onChange={(e) => setNewQ(e.target.value)} rows={2} placeholder="اكتب السؤال هنا..."
                className="w-full px-4 py-3 rounded-2xl text-white text-base text-right resize-none"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.2)' }} />
            </div>
            <div>
              <label className="block text-xs tracking-widest text-amber-200/50 uppercase mb-2">— الخيارات (انقر على الدائرة لتحديد الإجابة الصحيحة)</label>
              <div className="space-y-2">
                {newOpts.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button onClick={() => setNewCorrect(i)}
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        background: newCorrect === i ? 'linear-gradient(135deg, rgba(52,211,153,0.25), rgba(52,211,153,0.1))' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${newCorrect === i ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      {newCorrect === i ? <Check className="w-5 h-5 text-emerald-300" /> : (
                        <span className="text-white/60 font-bold">{['أ', 'ب', 'ج', 'د'][i]}</span>
                      )}
                    </button>
                    <input value={opt} onChange={(e) => { const c = [...newOpts]; c[i] = e.target.value; setNewOpts(c); }}
                      placeholder={`الخيار ${['الأول', 'الثاني', 'الثالث', 'الرابع'][i]}`}
                      className="flex-1 px-4 py-3 rounded-xl text-white text-right"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }} />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleAdd}
              className="w-full py-3 rounded-2xl font-bold text-base transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', color: '#0a0a14', boxShadow: '0 8px 24px rgba(251,191,36,0.25)' }}>
              <span className="flex items-center justify-center gap-2"><Plus className="w-5 h-5" />إضافة السؤال</span>
            </button>
          </div>
        </div>

        {/* PDF Import — NEW */}
        <div className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(248,113,113,0.08), rgba(248,113,113,0.02))',
            border: '1px solid rgba(248,113,113,0.25)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(248,113,113,0.6), transparent)' }} />

          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(248,113,113,0.05))', border: '1px solid rgba(248,113,113,0.4)' }}>
                <FileText className="w-6 h-6 text-red-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">استيراد من ملف PDF</h2>
                <p className="text-xs text-red-200/50">يستخرج الأسئلة تلقائياً من الملف</p>
              </div>
            </div>
            <span className="text-[10px] tracking-widest px-2 py-1 rounded-full font-bold"
              style={{ background: 'rgba(248,113,113,0.15)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.3)' }}>
              ✨ ذكي
            </span>
          </div>

          {!parsed && !parsing && (
            <>
              <button onClick={() => pdfRef.current?.click()}
                className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] group"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(248,113,113,0.05))',
                  border: '2px dashed rgba(248,113,113,0.4)',
                }}>
                <Upload className="w-5 h-5 text-red-300 group-hover:-translate-y-1 transition-transform" />
                <div className="text-right">
                  <div className="text-white font-bold text-base">اختر ملف PDF</div>
                  <div className="text-xs text-red-200/50 mt-0.5">انقر هنا لتحديد الملف من جهازك</div>
                </div>
              </button>
              <input ref={pdfRef} type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} className="hidden" />

              <div className="mt-4 rounded-xl p-3 text-xs leading-relaxed"
                style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <strong className="text-red-200/80">صيغ مدعومة:</strong>
                <span className="text-red-100/50"> الأسئلة المرقمة (1. 2. أو Q1)، الخيارات بصيغة A/B/C/D أو أ/ب/ج/د، الإجابات بصيغة "Answer: B" أو "الإجابة: ب".</span>
              </div>
            </>
          )}

          {parsing && (
            <div className="py-8 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-red-300 animate-rotate-slow" style={{ animationDuration: '1.5s' }} />
              <div className="text-white font-medium">جارٍ تحليل الملف...</div>
              <div className="text-xs text-red-200/50">{pdfName}</div>
            </div>
          )}
        </div>

        {/* PDF Review Panel — NEW */}
        {parsed && parsed.length > 0 && (
          <div className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden animate-scale-in"
            style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.02))',
              border: '1px solid rgba(52,211,153,0.3)',
              backdropFilter: 'blur(20px)',
            }}>
            <div className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)' }} />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))', border: '1px solid rgba(52,211,153,0.4)' }}>
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">مراجعة الأسئلة المُستخرجة</h2>
                  <p className="text-xs text-emerald-200/60">{parsed.length} سؤال — تحقق من الإجابات الصحيحة</p>
                </div>
              </div>
              <button onClick={() => { setParsed(null); setPdfName(''); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <div className="rounded-xl p-3 mb-5 text-xs text-emerald-100/60 leading-relaxed"
              style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <strong className="text-emerald-200/80">💡 ملاحظة:</strong> راجع كل سؤال وتأكد من الإجابة الصحيحة (الخضراء). الأسئلة التي لم يُكتشف فيها الجواب موسومة بـ <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>يحتاج مراجعة</span>.
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin pl-2">
              {parsed.map((q, qIdx) => (
                <div key={qIdx} className="rounded-2xl p-4 transition-all"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                      {qIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <textarea value={q.q} onChange={(e) => updateParsedText(qIdx, 'q', e.target.value)} rows={2}
                        className="w-full px-3 py-2 rounded-xl text-white text-sm md:text-base text-right resize-none font-medium"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {!q._detected && (
                        <span className="px-2 py-1 rounded-md text-[9px] font-bold tracking-wider whitespace-nowrap"
                          style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                          يحتاج مراجعة
                        </span>
                      )}
                      <button onClick={() => deleteParsedQ(qIdx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correct;
                      return (
                        <div key={oIdx} className="flex items-center gap-2">
                          <button onClick={() => updateParsedCorrect(qIdx, oIdx)}
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                            style={{
                              background: isCorrect ? 'linear-gradient(135deg, rgba(52,211,153,0.3), rgba(52,211,153,0.1))' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            }}>
                            {isCorrect ? <Check className="w-4 h-4 text-emerald-300" />
                              : <span className="text-white/40 font-bold text-xs">{['أ', 'ب', 'ج', 'د'][oIdx]}</span>}
                          </button>
                          <input value={opt} onChange={(e) => updateParsedText(qIdx, 'opt', e.target.value, oIdx)}
                            className="flex-1 px-3 py-2 rounded-lg text-white text-sm text-right transition-all"
                            style={{
                              background: isCorrect ? 'rgba(52,211,153,0.08)' : 'rgba(0,0,0,0.3)',
                              border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.06)'}`,
                              color: isCorrect ? '#86efac' : 'white',
                            }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={commitParsed}
                className="flex-1 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  color: '#022c22',
                  boxShadow: '0 10px 32px rgba(52,211,153,0.3)',
                }}>
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة {parsed.length} سؤال إلى البنك
                </span>
              </button>
              <button onClick={() => { setParsed(null); setPdfName(''); }}
                className="px-6 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.01]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Raw Text Fallback — shown when PDF parsing fails */}
        {rawText && !parsed && !parsing && (
          <div className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden animate-scale-in"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))',
              border: '1px solid rgba(251,191,36,0.3)',
              backdropFilter: 'blur(20px)',
            }}>
            <div className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }} />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))', border: '1px solid rgba(251,191,36,0.4)' }}>
                  <AlertCircle className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">النص المستخرج من الملف</h2>
                  <p className="text-xs text-amber-200/60">{pdfName}</p>
                </div>
              </div>
              <button onClick={() => { setRawText(''); setRawTextEdit(''); setPdfName(''); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <div className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
              style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <strong className="text-amber-200/90">⚠️ لم أتعرف على صيغة الأسئلة تلقائياً.</strong>
              <div className="text-amber-100/60 mt-1.5 leading-loose">
                لديك ثلاثة خيارات:
                <br />
                • <strong className="text-amber-200/80">عدّل النص أدناه</strong> ليتبع الصيغة (1. سؤال؟ ثم A) B) C) D)) واضغط "محاولة التحليل"
                <br />
                • <strong className="text-amber-200/80">انسخ النص وأرسله لي</strong> في المحادثة وسأحوّله لك يدوياً إلى JSON
                <br />
                • <strong className="text-amber-200/80">أضف الأسئلة يدوياً</strong> عبر النموذج بالأعلى
              </div>
            </div>

            <textarea value={rawTextEdit} onChange={(e) => setRawTextEdit(e.target.value)} rows={14}
              dir="auto"
              className="w-full px-4 py-3 rounded-2xl text-white text-sm resize-none scrollbar-thin font-mono"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }} />

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <button onClick={retryParseRawText}
                className="flex-1 py-3 rounded-2xl font-bold text-base transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', color: '#0a0a14', boxShadow: '0 8px 24px rgba(251,191,36,0.25)' }}>
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  محاولة التحليل مجدداً
                </span>
              </button>
              <button onClick={copyRawText}
                className="md:flex-none md:px-6 py-3 rounded-2xl font-bold text-base transition-all hover:scale-[1.01]"
                style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#bfdbfe' }}>
                <span className="flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  نسخ النص لإرساله
                </span>
              </button>
            </div>
          </div>
        )}

        {/* JSON Import — always visible and prominent */}
        <div className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(96,165,250,0.02))',
            border: '1px solid rgba(96,165,250,0.25)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent)' }} />

          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.05))', border: '1px solid rgba(96,165,250,0.4)' }}>
                <FileJson className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">استيراد من ملف JSON</h2>
                <p className="text-xs text-blue-200/50">يُحفظ تلقائياً عند الرفع</p>
              </div>
            </div>
            <span className="text-[10px] tracking-widest px-2 py-1 rounded-full font-bold"
              style={{ background: 'rgba(96,165,250,0.15)', color: '#bfdbfe', border: '1px solid rgba(96,165,250,0.3)' }}>
              ⚡ سريع
            </span>
          </div>

          <button onClick={() => fileRef.current?.click()}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] group mb-3"
            style={{
              background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.05))',
              border: '2px dashed rgba(96,165,250,0.4)',
            }}>
            <Upload className="w-5 h-5 text-blue-300 group-hover:-translate-y-1 transition-transform" />
            <div className="text-right">
              <div className="text-white font-bold text-base">اختر ملف JSON</div>
              <div className="text-xs text-blue-200/50 mt-0.5">يُستورد ويحفظ تلقائياً</div>
            </div>
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />

          {/* Optional: paste JSON manually */}
          <button onClick={() => setShowBulk((s) => !s)}
            className="w-full text-xs text-blue-200/50 hover:text-blue-200 transition-colors py-2">
            {showBulk ? '✕ إخفاء اللصق اليدوي' : '📋 أو الصق نص JSON يدوياً'}
          </button>

          {showBulk && (
            <div className="space-y-4 mt-3 pt-4 border-t border-blue-200/10">
              <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={6}
                placeholder={`[\n  {\n    "q": "نص السؤال",\n    "options": ["أ","ب","ج","د"],\n    "correct": 0\n  }\n]`}
                className="w-full px-4 py-3 rounded-2xl text-white text-sm text-left resize-none scrollbar-thin font-mono"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', direction: 'ltr' }} />
              <button onClick={handleBulkImport} disabled={!bulkText.trim()}
                className="w-full py-3 rounded-2xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: 'white', boxShadow: '0 8px 24px rgba(96,165,250,0.3)' }}>
                <span className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  استيراد الآن
                </span>
              </button>
            </div>
          )}

          <div className="mt-4 rounded-xl p-3 text-xs leading-relaxed"
            style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)' }}>
            <strong className="text-blue-200/80">صيغة JSON:</strong>
            <span className="text-blue-100/50"> مصفوفة من الكائنات. كل كائن يحتوي: <span className="font-mono text-blue-200/60">q</span> (نص السؤال) — <span className="font-mono text-blue-200/60">options</span> (4 خيارات) — <span className="font-mono text-blue-200/60">correct</span> (رقم 0-3 لموقع الإجابة الصحيحة).</span>
          </div>
        </div>

        {/* Old Bulk Import section (now consolidated above) */}
        {false && (
          <div className="glass rounded-3xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-300" />استيراد من ملف JSON
            </h2>
            <button onClick={() => setShowBulk((s) => !s)} className="text-xs text-amber-200/60 hover:text-amber-200 transition-colors">
              {showBulk ? 'إخفاء' : 'إظهار'}
            </button>
          </div>
          {!showBulk && (
            <p className="text-xs text-white/40 leading-relaxed">يمكنك إضافة عدة أسئلة دفعة واحدة عن طريق رفع ملف JSON أو لصق نص JSON مباشرة.</p>
          )}
          {showBulk && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa' }}>
                  <Upload className="w-4 h-4" /><span className="text-sm font-medium">رفع ملف JSON</span>
                </button>
                <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
              </div>
              <div>
                <label className="block text-xs tracking-widest text-amber-200/50 uppercase mb-2">— أو الصق JSON هنا</label>
                <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8}
                  placeholder={`[\n  {\n    "q": "نص السؤال",\n    "options": ["أ","ب","ج","د"],\n    "correct": 0\n  }\n]`}
                  className="w-full px-4 py-3 rounded-2xl text-white text-sm text-left resize-none scrollbar-thin font-mono"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', direction: 'ltr' }} />
              </div>
              <button onClick={handleBulkImport} disabled={!bulkText.trim()}
                className="w-full py-3 rounded-2xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(96,165,250,0.15))', border: '1px solid rgba(96,165,250,0.4)', color: '#bfdbfe' }}>
                <span className="flex items-center justify-center gap-2"><Upload className="w-4 h-4" />استيراد الآن</span>
              </button>
              <div className="rounded-xl p-3 text-xs text-amber-100/40 leading-relaxed" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <strong className="text-amber-200/70">صيغة JSON:</strong> مصفوفة من الكائنات. كل كائن يحتوي: <span className="font-mono text-amber-200/60">q</span> (نص السؤال) — <span className="font-mono text-amber-200/60">options</span> (مصفوفة من 4 خيارات) — <span className="font-mono text-amber-200/60">correct</span> (رقم 0-3 لموقع الإجابة الصحيحة).
              </div>
            </div>
          )}
        </div>
        )}

        {/* Existing questions list */}
        <div className="glass rounded-3xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white font-display mb-5 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-300" />الأسئلة الحالية
            <span className="text-sm text-white/40 font-normal mr-2">({questions.length})</span>
          </h2>
          {loading ? (
            <div className="text-center text-white/40 py-8">جارٍ التحميل...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <FileJson className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p className="text-white/40 text-sm">لا توجد أسئلة بعد. ابدأ بإضافة سؤال أو استيراد ملف.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <QuestionListItem key={idx} q={q} idx={idx} onDelete={() => handleDelete(idx)} subjectColor={subject.color} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  🔐 ADMIN: Main Dashboard
// ================================================================
const AdminPanel = ({ onLogout, onExit, showToast }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [counts, setCounts] = useState({});
  const [memberCount, setMemberCount] = useState(0);

  const refresh = async () => {
    const c = {};
    for (const s of SUBJECTS) {
      const total = (await loadQuestions(s.id)).length;
      c[s.id] = total;
    }
    setCounts(c);
    const attempts = await loadAttempts();
    const uniqueNames = new Set(attempts.map((a) => a.name));
    setMemberCount(uniqueNames.size);
  };
  useEffect(() => { refresh(); }, []);

  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);

  if (selectedSubject) {
    return <AdminSubjectEditor subjectId={selectedSubject}
      onBack={() => { setSelectedSubject(null); refresh(); }} showToast={showToast} />;
  }

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 relative" style={{ direction: 'rtl' }}>
      <Atmosphere />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-slide-down">
          <button onClick={onExit} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-all text-amber-100/70">
            <ChevronLeft className="w-4 h-4" /><span className="text-sm">خروج للموقع</span>
          </button>
          <button onClick={onLogout} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-red-500/10 transition-all text-red-300/70">
            <LogOut className="w-4 h-4" /><span className="text-sm">تسجيل خروج</span>
          </button>
        </div>
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-4">
            <Lock className="w-4 h-4 text-amber-300" />
            <span className="text-amber-200 text-xs tracking-widest uppercase">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            <span className="text-white">لوحة </span><span className="gold-text">التحكم</span>
          </h1>
          <p className="text-amber-100/40 text-sm md:text-base">اختر مادة لإدارة أسئلتها · إضافة · تعديل · حذف</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 stagger">
          <StatCard icon={Users} label="عدد الأعضاء" value={memberCount} color="#fbbf24" />
          <StatCard icon={FileJson} label="إجمالي الأسئلة" value={totalQuestions} color="#34d399" />
          <StatCard icon={BookMarked} label="عدد المواد" value={SUBJECTS.length} color="#60a5fa" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 stagger">
          {SUBJECTS.map((subject) => {
            const Icon = subject.icon;
            const count = counts[subject.id] || 0;
            return (
              <button key={subject.id} onClick={() => setSelectedSubject(subject.id)}
                className="relative group rounded-3xl p-5 md:p-6 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer text-right overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
                }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top, ${subject.glow}, transparent 70%)` }} />
                <div className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${subject.color}, transparent)` }} />
                <div className="relative flex items-start justify-between">
                  <div className="flex-1 text-right">
                    <h3 className="text-lg md:text-xl font-bold text-white font-display mb-1">{subject.name}</h3>
                    <div className="text-xs tracking-wider" style={{ color: subject.color }}>
                      {count} {count === 1 ? 'سؤال' : 'سؤالاً'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${subject.color}20, ${subject.color}05)`, border: `1px solid ${subject.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: subject.color }} />
                  </div>
                </div>
                <div className="relative mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">إدارة الأسئلة</span>
                  <Edit3 className="w-4 h-4 text-white/40 group-hover:text-amber-300 group-hover:-translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ================================================================
//  Main App
// ================================================================
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });
  const [quizReview, setQuizReview] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  // Listen to Firebase auth state — auto-login if user is already signed in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
      // If user signed in successfully and we're on login screen, advance
      if (u && (screen === 'login' || screen === 'splash')) {
        setTimeout(() => setScreen('stage'), 300);
      }
      // If signed out from anywhere, go back to login
      if (!u && screen !== 'splash' && screen !== 'login'
        && screen !== 'admin-login' && screen !== 'admin-panel') {
        setScreen('login');
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try { await logout(); setScreen('login'); }
    catch (e) { showToast('فشل تسجيل الخروج', 'error'); }
  };

  const handleStageSelect = () => setScreen('subject');
  const handleSubjectSelect = (subjectId) => { setSelectedSubject(subjectId); setScreen('quiz'); };
  const handleQuizFinish = (score, total, reviewData) => { setFinalScore({ score, total }); setQuizReview(reviewData || []); setScreen('results'); };
  const handleRestart = () => { setSelectedSubject(null); setFinalScore({ score: 0, total: 0 }); setQuizReview([]); setScreen('subject'); };

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a14' }}>
      <FontLoader />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Floating social icons — appear on all screens except splash */}
      {screen !== 'splash' && <SocialFloat />}

      {screen === 'splash' && <SplashScreen onDone={() => setScreen(user ? 'stage' : 'login')} />}
      {screen === 'login' && (
        <LoginScreen onAdminClick={() => setScreen('admin-login')} />
      )}
      {screen === 'stage' && user && <StageScreen user={user} onLogout={handleLogout} onSelect={handleStageSelect} onBack={handleLogout} />}
      {screen === 'subject' && user && <SubjectScreen user={user} onLogout={handleLogout} onSelect={handleSubjectSelect} onBack={() => setScreen('stage')} />}
      {screen === 'quiz' && user && (
        <QuizScreen user={user} subjectId={selectedSubject} onFinish={handleQuizFinish} onBack={() => setScreen('subject')} />
      )}
      {screen === 'results' && user && (
        <ResultsScreen user={user} subjectId={selectedSubject}
          score={finalScore.score} total={finalScore.total} review={quizReview} onRestart={handleRestart} />
      )}
      {screen === 'admin-login' && (
        <AdminLogin onSuccess={() => setScreen('admin-panel')}
          onBack={() => setScreen('login')} showToast={showToast} />
      )}
      {screen === 'admin-panel' && (
        <AdminPanel onLogout={() => setScreen('admin-login')}
          onExit={() => setScreen('login')} showToast={showToast} />
      )}
    </div>
  );
}
