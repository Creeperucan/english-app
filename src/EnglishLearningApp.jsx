import React, { useState, useEffect, useRef } from 'react';
import { Clock, Trophy, Settings, Play, X, Check, AlertCircle } from 'lucide-react';

// Full Dark Mode - optimized, fixed logic for scoring, focus, shuffle and reset
// Replace your existing EnglishLearningApp.jsx with this file.

// Fallback for window.storage (so it works in browser without special API)
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    async get(key) {
      try {
        const val = localStorage.getItem(key);
        return { value: val };
      } catch (e) {
        return { value: null };
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // ignore
      }
    }
  };
}

const EnglishLearningApp = () => {
  // --- state ---
  const [screen, setScreen] = useState('menu');
  const [category, setCategory] = useState('');
  const [direction, setDirection] = useState('');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('') ;
  const [results, setResults] = useState({ correct: 0, wrong: 0, empty: 0, mistakes: [] });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [customWords, setCustomWords] = useState([]);
  const [newWord, setNewWord] = useState({ en: '', tr: '' });

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // --- data --- (kept as in your file)
  const seasons = [
    { en: 'spring', tr: 'ilkbahar' },
    { en: 'summer', tr: 'yaz' },
    { en: 'autumn', tr: 'sonbahar' },
    { en: 'winter', tr: 'kış' }
  ];

  const days = [
    { en: 'monday', tr: 'pazartesi' },
    { en: 'tuesday', tr: 'salı' },
    { en: 'wednesday', tr: 'çarşamba' },
    { en: 'thursday', tr: 'perşembe' },
    { en: 'friday', tr: 'cuma' },
    { en: 'saturday', tr: 'cumartesi' },
    { en: 'sunday', tr: 'pazar' }
  ];

  const top1000Words = [
    {"en": "a", "tr": "bir"}, {"en": "ability", "tr": "kabiliyet"}, {"en": "able", "tr": "yapabilmek"}, {"en": "about", "tr": "hakkında"}, {"en": "above", "tr": "yukarıda"}, {"en": "accept", "tr": "kabul etmek"},
    {"en": "according", "tr": "göre"}, {"en": "account", "tr": "hesap"}, {"en": "across", "tr": "karşısında"}, {"en": "act", "tr": "eylem"}, {"en": "action", "tr": "eylem"}, {"en": "activity", "tr": "faaliyet"},
    {"en": "actually", "tr": "aslında"}, {"en": "add", "tr": "eklemek"}, {"en": "address", "tr": "adres"}, {"en": "administration", "tr": "yönetim"}, {"en": "admit", "tr": "kabul etmek"}, {"en": "adult", "tr": "yetişkin"},
    {"en": "affect", "tr": "etkilemek"}, {"en": "after", "tr": "sonra"}, {"en": "afternoon", "tr": "öğleden sonra"}, {"en": "afterwards", "tr": "ondan sonra"}, {"en": "again", "tr": "tekrar"}, {"en": "against", "tr": "karşı"},
    {"en": "age", "tr": "yaş"}, {"en": "agency", "tr": "ajans"}, {"en": "agent", "tr": "ajan"}, {"en": "ago", "tr": "önce"}, {"en": "agree", "tr": "katılmak"}, {"en": "agreement", "tr": "anlaşma"}, {"en": "ahead", "tr": "önde"},
    {"en": "air", "tr": "hava"}, {"en": "all", "tr": "her şey"}, {"en": "all right", "tr": "peki"}, {"en": "allow", "tr": "izin vermek"}, {"en": "almost", "tr": "neredeyse"}, {"en": "alone", "tr": "yalnız"},
    {"en": "along", "tr": "boyunca"}, {"en": "already", "tr": "zaten"}, {"en": "also", "tr": "ayrıca"}, {"en": "although", "tr": "rağmen"}, {"en": "always", "tr": "her zaman"}, {"en": "american", "tr": "amerikan"},
    {"en": "among", "tr": "arasında"}, {"en": "amount", "tr": "miktar"}, {"en": "analysis", "tr": "analiz"}, {"en": "and", "tr": "ve"}, {"en": "animal", "tr": "hayvan"}, {"en": "another", "tr": "diğeri"}, {"en": "answer", "tr": "cevap"},
    {"en": "any", "tr": "herhangi"}, {"en": "anyone", "tr": "kimse"}, {"en": "anything", "tr": "bir şeyi"}, {"en": "anyway", "tr": "her halükârda"}, {"en": "anywhere", "tr": "herhangi bir yere"}, {"en": "appear", "tr": "görünmek"},
    {"en": "apple", "tr": "elma"}, {"en": "apply", "tr": "uygulamak"}, {"en": "approach", "tr": "yaklaşım"}, {"en": "april", "tr": "nisan"}, {"en": "area", "tr": "alan"}, {"en": "argue", "tr": "tartışmak"}, {"en": "arm", "tr": "kol"},
    {"en": "around", "tr": "etrafında"}, {"en": "arrive", "tr": "varmak"}, {"en": "art", "tr": "sanat"}, {"en": "article", "tr": "makale"}, {"en": "artist", "tr": "sanatçı"}, {"en": "as", "tr": "gibi"}, {"en": "ask", "tr": "sormak"},
    {"en": "assume", "tr": "varsaymak"}, {"en": "attack", "tr": "saldırı"}, {"en": "attention", "tr": "dikkat"}, {"en": "attorney", "tr": "avukat"}, {"en": "audience", "tr": "seyirci"}, {"en": "authority", "tr": "yetki"},
    {"en": "available", "tr": "müsait"},
    {"en": "avoid", "tr": "önlemek"},
    {"en": "away", "tr": "uzak"},
    {"en": "baby", "tr": "bebek"},
    {"en": "back", "tr": "geri"},
    {"en": "bad", "tr": "kötü"},
    {"en": "bag", "tr": "sırt çantası"},
    {"en": "ball", "tr": "top"},
    {"en": "bank", "tr": "banka"},
    {"en": "bar", "tr": "bar"},
    {"en": "base", "tr": "üs"},
    {"en": "be", "tr": "olmak"},
    {"en": "beat", "tr": "dövmek"},
    {"en": "beautiful", "tr": "güzel"},
    {"en": "because", "tr": "çünkü"},
    {"en": "become", "tr": "olmak"},
    {"en": "bed", "tr": "yatak"},
    {"en": "before", "tr": "önce"},
    {"en": "begin", "tr": "başlamak"},
    {"en": "behavior", "tr": "davranış"},
    {"en": "behind", "tr": "arkasında"},
    {"en": "believe", "tr": "inanmak"},
    {"en": "benefit", "tr": "yarar"},
    {"en": "best", "tr": "en iyi"},
    {"en": "better", "tr": "daha iyi"},
    {"en": "between", "tr": "arasında"},
    {"en": "beyond", "tr": "ötesinde"},
    {"en": "big", "tr": "büyük"},
    {"en": "bill", "tr": "fatura"},
    {"en": "billion", "tr": "milyar"},
    {"en": "black", "tr": "siyah"},
    {"en": "blood", "tr": "kan"},
    {"en": "blue", "tr": "mavi"},
    {"en": "board", "tr": "yazı tahtası"},
    {"en": "body", "tr": "vücut"},
    {"en": "book", "tr": "kitap"},
    {"en": "born", "tr": "doğmuş"},
    {"en": "both", "tr": "her ikisi de"},
    {"en": "box", "tr": "kutu"},
    {"en": "boy", "tr": "erkek çocuk"},
    {"en": "break", "tr": "kırmak"},
    {"en": "bring", "tr": "getirmek"},
    {"en": "brother", "tr": "erkek kardeş"},
    {"en": "budget", "tr": "bütçe"},
    {"en": "build", "tr": "inşa etmek"},
    {"en": "building", "tr": "bina"},
    {"en": "business", "tr": "iş"},
    {"en": "but", "tr": "fakat"},
    {"en": "buy", "tr": "satın almak"},
    {"en": "by", "tr": "tarafından"},
    {"en": "call", "tr": "aramak"},
    {"en": "camera", "tr": "kamera"},
    {"en": "campaign", "tr": "kampanya"},
    {"en": "can", "tr": "yapabilmek"},
    {"en": "cancer", "tr": "kanser"},
    {"en": "candidate", "tr": "aday"},
    {"en": "capital", "tr": "başkent"},
    {"en": "car", "tr": "araba"},
    {"en": "card", "tr": "kart"},
    {"en": "care", "tr": "bakım"},
    {"en": "career", "tr": "kariyer"},
    {"en": "carry", "tr": "taşımak"},
    {"en": "case", "tr": "dava"},
    {"en": "catch", "tr": "yakalamak"},
    {"en": "cause", "tr": "sebep olmak"},
    {"en": "cell", "tr": "hücre"},
    {"en": "center", "tr": "merkez"},
    {"en": "central", "tr": "merkezi"},
    {"en": "century", "tr": "yüzyıl"},
    {"en": "certain", "tr": "belirli"},
    {"en": "certainly", "tr": "kesinlikle"},
    {"en": "chair", "tr": "sandalye"},
    {"en": "challenge", "tr": "meydan okuma"},
    {"en": "chance", "tr": "şans"},
    {"en": "change", "tr": "değişiklik"},
    {"en": "character", "tr": "karakter"},
    {"en": "charge", "tr": "şarj etmek"},
    {"en": "check", "tr": "kontrol etmek"},
    {"en": "child", "tr": "çocuk"},
    {"en": "choice", "tr": "seçim"},
    {"en": "choose", "tr": "seçmek"},
    {"en": "church", "tr": "kilise"},
    {"en": "citizen", "tr": "vatandaş"},
    {"en": "city", "tr": "şehir"},
    {"en": "civil", "tr": "sivil"},
    {"en": "claim", "tr": "iddia etmek"},
    {"en": "class", "tr": "sınıf"},
    {"en": "clear", "tr": "temiz"},
    {"en": "clearly", "tr": "açıkça"},
    {"en": "close", "tr": "kapatmak"},
    {"en": "coach", "tr": "koç"},
    {"en": "cold", "tr": "soğuk"},
    {"en": "collection", "tr": "toplamak"},
    {"en": "college", "tr": "kolej"},
    {"en": "color", "tr": "renk"},
    {"en": "come", "tr": "gelmek"},
    {"en": "commercial", "tr": "ticari"},
    {"en": "common", "tr": "ortak"},
    {"en": "community", "tr": "topluluk"},
    {"en": "company", "tr": "şirket"},
    {"en": "compare", "tr": "karşılaştırmak"},
    {"en": "computer", "tr": "bilgisayar"},
    {"en": "concern", "tr": "ilişkisi olmak"},
    {"en": "condition", "tr": "şart"},
    {"en": "conference", "tr": "konferans"},
    {"en": "congress", "tr": "kongre"},
    {"en": "consider", "tr": "dikkate almak"},
    {"en": "consumer", "tr": "tüketici"},
    {"en": "contain", "tr": "içermek"},
    {"en": "continue", "tr": "devam etmek"},
    {"en": "control", "tr": "kontrol"},
    {"en": "cost", "tr": "maliyet"},
    {"en": "country", "tr": "ülke"},
    {"en": "couple", "tr": "çift"},
    {"en": "course", "tr": "ders"},
    {"en": "court", "tr": "mahkeme"},
    {"en": "cover", "tr": "örtmek"},
    {"en": "create", "tr": "yaratmak"},
    {"en": "crime", "tr": "suç"},
    {"en": "cultural", "tr": "kültürel"},
    {"en": "culture", "tr": "kültür"},
    {"en": "cup", "tr": "fincan"},
    {"en": "current", "tr": "şu andaki"},
    {"en": "customer", "tr": "müşteri"},
    {"en": "cut", "tr": "kesmek"},
    {"en": "dark", "tr": "karanlık"},
    {"en": "data", "tr": "veri"},
    {"en": "daughter", "tr": "kız evlat"},
    {"en": "day", "tr": "gün"},
    {"en": "dead", "tr": "ölü"},
    {"en": "deal", "tr": "anlaşma"},
    {"en": "death", "tr": "ölüm"},
    {"en": "debate", "tr": "tartışma"},
    {"en": "decade", "tr": "on yıl"},
    {"en": "december", "tr": "aralık"},
    {"en": "decide", "tr": "karar vermek"},
    {"en": "decision", "tr": "karar"},
    {"en": "deep", "tr": "derin"},
    {"en": "defense", "tr": "savunma"},
    {"en": "degree", "tr": "derece"},
    {"en": "democrat", "tr": "demokrat"},
    {"en": "democratic", "tr": "demokratik"},
    {"en": "describe", "tr": "tanımlamak"},
    {"en": "design", "tr": "tasarım"},
    {"en": "despite", "tr": "rağmen"},
    {"en": "detail", "tr": "detay"},
    {"en": "determine", "tr": "belirlemek"},
    {"en": "develop", "tr": "geliştirmek"},
    {"en": "development", "tr": "gelişim"},
    {"en": "die", "tr": "ölmek"},
    {"en": "difference", "tr": "fark"},
    {"en": "different", "tr": "farklı"},
    {"en": "difficult", "tr": "zor"},
    {"en": "dinner", "tr": "akşam yemeği"},
    {"en": "direction", "tr": "yön"},
    {"en": "director", "tr": "yönetmen"},
    {"en": "discover", "tr": "keşfetmek"},
    {"en": "discuss", "tr": "tartışmak"},
    {"en": "discussion", "tr": "tartışma"},
    {"en": "disease", "tr": "hastalık"},
    {"en": "do", "tr": "yapmak"},
    {"en": "doctor", "tr": "doktor"},
    {"en": "dog", "tr": "köpek"},
    {"en": "door", "tr": "kapı"},
    {"en": "down", "tr": "aşağı"},
    {"en": "draw", "tr": "çizmek"},
    {"en": "dream", "tr": "rüya"},
    {"en": "drive", "tr": "sürmek"},
    {"en": "drop", "tr": "düşürmek"},
    {"en": "drug", "tr": "ilaç"},
    {"en": "during", "tr": "sırasında"},
    {"en": "each", "tr": "her"},
    {"en": "early", "tr": "erken"},
    {"en": "east", "tr": "doğu"},
    {"en": "easy", "tr": "kolay"},
    {"en": "eat", "tr": "yemek"},
    {"en": "economic", "tr": "ekonomik"},
    {"en": "economy", "tr": "ekonomi"},
    {"en": "edge", "tr": "kenar"},
    {"en": "education", "tr": "eğitim"},
    {"en": "effect", "tr": "etki"},
    {"en": "effort", "tr": "çaba"},
    {"en": "eight", "tr": "sekiz"},
    {"en": "either", "tr": "ya"},
    {"en": "election", "tr": "seçim"},
    {"en": "else", "tr": "başka"},
    {"en": "employee", "tr": "çalışan"},
    {"en": "end", "tr": "son"},
    {"en": "energy", "tr": "enerji"},
    {"en": "enjoy", "tr": "keyfini çıkarmak"},
    {"en": "enough", "tr": "yeter"},
    {"en": "enter", "tr": "girmek"},
    {"en": "entire", "tr": "bütün"},
    {"en": "environment", "tr": "çevre"},
    {"en": "environmental", "tr": "çevresel"},
    {"en": "especially", "tr": "özellikle"},
    {"en": "establish", "tr": "kurmak"},
    {"en": "even", "tr": "hatta"},
    {"en": "evening", "tr": "akşam"},
    {"en": "event", "tr": "etkinlik"},
    {"en": "ever", "tr": "hiç"},
    {"en": "every", "tr": "her"},
    {"en": "everybody", "tr": "herkes"},
    {"en": "everyone", "tr": "herkes"},
    {"en": "everything", "tr": "her şey"},
    {"en": "evidence", "tr": "kanıt"},
    {"en": "exactly", "tr": "tam olarak"},
    {"en": "example", "tr": "örnek"},
    {"en": "executive", "tr": "yönetici"},
    {"en": "exist", "tr": "var olmak"},
    {"en": "expect", "tr": "beklemek"},
    {"en": "experience", "tr": "deneyim"},
    {"en": "expert", "tr": "uzman"},
    {"en": "explain", "tr": "açıklamak"},
    {"en": "eye", "tr": "göz"},
    {"en": "face", "tr": "yüz"},
    {"en": "fact", "tr": "gerçek"},
    {"en": "factor", "tr": "faktör"},
    {"en": "fail", "tr": "başarısız olmak"},
    {"en": "fall", "tr": "düşmek"},
    {"en": "family", "tr": "aile"},
    {"en": "far", "tr": "uzak"},
    {"en": "fast", "tr": "hızlı"},
    {"en": "father", "tr": "baba"},
    {"en": "fear", "tr": "korku"},
    {"en": "february", "tr": "şubat"},
    {"en": "federal", "tr": "federal"},
    {"en": "feel", "tr": "hissetmek"},
    {"en": "feeling", "tr": "duygu"},
    {"en": "few", "tr": "az"},
    {"en": "field", "tr": "alan"},
    {"en": "fight", "tr": "dövüş"},
    {"en": "figure", "tr": "şekil"},
    {"en": "fill", "tr": "doldurmak"},
    {"en": "film", "tr": "film"},
    {"en": "final", "tr": "final"},
    {"en": "finally", "tr": "sonunda"},
    {"en": "financial", "tr": "finansal"},
    {"en": "find", "tr": "bulmak"},
    {"en": "fine", "tr": "iyi"},
    {"en": "finger", "tr": "parmak"},
    {"en": "finish", "tr": "bitirmek"},
    {"en": "fire", "tr": "ateş"},
    {"en": "firm", "tr": "firma"},
    {"en": "first", "tr": "ilk"},
    {"en": "fish", "tr": "balık"},
    {"en": "five", "tr": "beş"},
    {"en": "floor", "tr": "zemin"},
    {"en": "fly", "tr": "uçmak"},
    {"en": "focus", "tr": "odak"},
    {"en": "follow", "tr": "takip etmek"},
    {"en": "food", "tr": "yemek"},
    {"en": "foot", "tr": "ayak"},
    {"en": "for", "tr": "için"},
    {"en": "force", "tr": "güç"},
    {"en": "foreign", "tr": "yabancı"},
    {"en": "forget", "tr": "unutmak"},
    {"en": "form", "tr": "form"},
    {"en": "former", "tr": "eski"},
    {"en": "forward", "tr": "ileri"},
    {"en": "four", "tr": "dört"},
    {"en": "free", "tr": "ücretsiz"},
    {"en": "friend", "tr": "arkadaş"},
    {"en": "from", "tr": "dan"},
    {"en": "front", "tr": "ön"},
    {"en": "full", "tr": "tam"},
    {"en": "fund", "tr": "fon"},
    {"en": "future", "tr": "gelecek"},
    {"en": "game", "tr": "oyun"},
    {"en": "garden", "tr": "bahçe"},
    {"en": "gas", "tr": "gaz"},
    {"en": "general", "tr": "genel"},
    {"en": "generation", "tr": "nesil"},
    {"en": "get", "tr": "almak"},
    {"en": "girl", "tr": "kız"},
    {"en": "give", "tr": "vermek"},
    {"en": "glass", "tr": "bardak"},
    {"en": "go", "tr": "gitmek"},
    {"en": "goal", "tr": "hedef"},
    {"en": "good", "tr": "iyi"},
    {"en": "government", "tr": "hükümet"},
    {"en": "great", "tr": "harika"},
    {"en": "green", "tr": "yeşil"},
    {"en": "ground", "tr": "yer"},
    {"en": "group", "tr": "grup"},
    {"en": "grow", "tr": "büyümek"},
    {"en": "growth", "tr": "büyüme"},
    {"en": "guess", "tr": "tahmin etmek"},
    {"en": "gun", "tr": "silah"},
    {"en": "guy", "tr": "adam"},
    {"en": "hair", "tr": "saç"},
    {"en": "half", "tr": "yarım"},
    {"en": "hand", "tr": "el"},
    {"en": "hang", "tr": "asmak"},
    {"en": "happen", "tr": "olmak"},
    {"en": "happy", "tr": "mutlu"},
    {"en": "hard", "tr": "zor"},
    {"en": "have", "tr": "sahip olmak"},
    {"en": "he", "tr": "o"},
    {"en": "head", "tr": "kafa"},
    {"en": "health", "tr": "sağlık"},
    {"en": "hear", "tr": "duymak"},
    {"en": "heart", "tr": "kalp"},
    {"en": "heat", "tr": "ısı"},
    {"en": "heavy", "tr": "ağır"},
    {"en": "help", "tr": "yardım"},
    {"en": "her", "tr": "onun"},
    {"en": "here", "tr": "burada"},
    {"en": "herself", "tr": "kendisi"},
    {"en": "high", "tr": "yüksek"},
    {"en": "him", "tr": "onu"},
    {"en": "himself", "tr": "kendisi"},
    {"en": "his", "tr": "onun"},
    {"en": "history", "tr": "tarih"},
    {"en": "hit", "tr": "vurmak"},
    {"en": "hold", "tr": "tutmak"},
    {"en": "home", "tr": "ev"},
    {"en": "hope", "tr": "umut"},
    {"en": "hospital", "tr": "hastane"},
    {"en": "hot", "tr": "sıcak"},
    {"en": "hotel", "tr": "otel"},
    {"en": "hour", "tr": "saat"},
    {"en": "house", "tr": "ev"},
    {"en": "how", "tr": "nasıl"},
    {"en": "however", "tr": "ancak"},
    {"en": "huge", "tr": "devasa"},
    {"en": "human", "tr": "insan"},
    {"en": "hundred", "tr": "yüz"},
    {"en": "husband", "tr": "koca"},
    {"en": "i", "tr": "ben"},
    {"en": "idea", "tr": "fikir"},
    {"en": "identify", "tr": "tanımlamak"},
    {"en": "if", "tr": "eğer"},
    {"en": "image", "tr": "görüntü"},
    {"en": "imagine", "tr": "hayal etmek"},
    {"en": "impact", "tr": "etki"},
    {"en": "important", "tr": "önemli"},
    {"en": "improve", "tr": "iyileştirmek"},
    {"en": "in", "tr": "içinde"},
    {"en": "include", "tr": "dahil etmek"},
    {"en": "including", "tr": "dahil"},
    {"en": "increase", "tr": "artırmak"},
    {"en": "indeed", "tr": "gerçekten"},
    {"en": "indicate", "tr": "belirtmek"},
    {"en": "individual", "tr": "bireysel"},
    {"en": "industry", "tr": "endüstri"},
    {"en": "information", "tr": "bilgi"},
    {"en": "inside", "tr": "içinde"},
    {"en": "instead", "tr": "yerine"},
    {"en": "institution", "tr": "kurum"},
    {"en": "interest", "tr": "faiz"},
    {"en": "interesting", "tr": "ilginç"},
    {"en": "international", "tr": "uluslararası"},
    {"en": "interview", "tr": "röportaj"},
    {"en": "into", "tr": "içine"},
    {"en": "investment", "tr": "yatırım"},
    {"en": "involve", "tr": "dahil etmek"},
    {"en": "issue", "tr": "sorun"},
    {"en": "it", "tr": "o"},
    {"en": "item", "tr": "madde"},
    {"en": "its", "tr": "onun"},
    {"en": "itself", "tr": "kendisi"},
    {"en": "january", "tr": "ocak"},
    {"en": "job", "tr": "iş"},
    {"en": "join", "tr": "katılmak"},
    {"en": "july", "tr": "temmuz"},
    {"en": "june", "tr": "haziran"},
    {"en": "just", "tr": "sadece"},
    {"en": "keep", "tr": "tutmak"},
    {"en": "key", "tr": "anahtar"},
    {"en": "kid", "tr": "çocuk"},
    {"en": "kill", "tr": "öldürmek"},
    {"en": "kind", "tr": "tür"},
    {"en": "kitchen", "tr": "mutfak"},
    {"en": "know", "tr": "bilmek"},
    {"en": "knowledge", "tr": "bilgi"},
    {"en": "land", "tr": "arazi"},
    {"en": "language", "tr": "dil"},
    {"en": "large", "tr": "büyük"},
    {"en": "last", "tr": "son"},
    {"en": "late", "tr": "geç"},
    {"en": "later", "tr": "daha sonra"},
    {"en": "laugh", "tr": "gülmek"},
    {"en": "law", "tr": "kanun"},
    {"en": "lawyer", "tr": "avukat"},
    {"en": "lay", "tr": "yatırmak"},
    {"en": "lead", "tr": "liderlik etmek"},
    {"en": "leader", "tr": "lider"},
    {"en": "learn", "tr": "öğrenmek"},
    {"en": "least", "tr": "en az"},
    {"en": "leave", "tr": "terk etmek"},
    {"en": "left", "tr": "sol"},
    {"en": "leg", "tr": "bacak"},
    {"en": "legal", "tr": "yasal"},
    {"en": "less", "tr": "daha az"},
    {"en": "let", "tr": "izin vermek"},
    {"en": "letter", "tr": "mektup"},
    {"en": "level", "tr": "seviye"},
    {"en": "lie", "tr": "yalan söylemek"},
    {"en": "life", "tr": "hayat"},
    {"en": "light", "tr": "ışık"},
    {"en": "like", "tr": "beğenmek"},
    {"en": "likely", "tr": "muhtemel"},
    {"en": "line", "tr": "satır"},
    {"en": "list", "tr": "liste"},
    {"en": "listen", "tr": "dinlemek"},
    {"en": "little", "tr": "küçük"},
    {"en": "live", "tr": "yaşamak"},
    {"en": "local", "tr": "yerel"},
    {"en": "long", "tr": "uzun"},
    {"en": "look", "tr": "bakmak"},
    {"en": "lose", "tr": "kaybetmek"},
    {"en": "loss", "tr": "kayıp"},
    {"en": "lot", "tr": "çok"},
    {"en": "love", "tr": "aşk"},
    {"en": "low", "tr": "düşük"},
    {"en": "machine", "tr": "makine"},
    {"en": "magazine", "tr": "dergi"},
    {"en": "main", "tr": "ana"},
    {"en": "maintain", "tr": "sürdürmek"},
    {"en": "major", "tr": "majör"},
    {"en": "majority", "tr": "çoğunluk"},
    {"en": "make", "tr": "yapmak"},
    {"en": "man", "tr": "adam"},
    {"en": "manage", "tr": "yönetmek"},
    {"en": "management", "tr": "yönetim"},
    {"en": "manager", "tr": "yönetici"},
    {"en": "many", "tr": "çok"},
    {"en": "march", "tr": "mart"},
    {"en": "market", "tr": "pazar"},
    {"en": "marriage", "tr": "evlilik"},
    {"en": "material", "tr": "malzeme"},
    {"en": "matter", "tr": "mesele"},
    {"en": "may", "tr": "mayıs"},
    {"en": "maybe", "tr": "belki"},
    {"en": "me", "tr": "beni"},
    {"en": "mean", "tr": "anlamına gelmek"},
    {"en": "measure", "tr": "ölçmek"},
    {"en": "media", "tr": "medya"},
    {"en": "medical", "tr": "tıbbi"},
    {"en": "meet", "tr": "karşılaşmak"},
    {"en": "meeting", "tr": "toplantı"},
    {"en": "member", "tr": "üye"},
    {"en": "memory", "tr": "hafıza"},
    {"en": "mention", "tr": "bahsetmek"},
    {"en": "message", "tr": "mesaj"},
    {"en": "method", "tr": "yöntem"},
    {"en": "middle", "tr": "orta"},
    {"en": "might", "tr": "güç"},
    {"en": "military", "tr": "askeri"},
    {"en": "million", "tr": "milyon"},
    {"en": "mind", "tr": "zihin"},
    {"en": "minute", "tr": "dakika"},
    {"en": "miss", "tr": "özlemek"},
    {"en": "mission", "tr": "görev"},
    {"en": "model", "tr": "model"},
    {"en": "modern", "tr": "modern"},
    {"en": "moment", "tr": "an"},
    {"en": "money", "tr": "para"},
    {"en": "month", "tr": "ay"},
    {"en": "more", "tr": "daha fazla"},
    {"en": "morning", "tr": "sabah"},
    {"en": "most", "tr": "çoğu"},
    {"en": "mother", "tr": "anne"},
    {"en": "mouth", "tr": "ağız"},
    {"en": "move", "tr": "taşınmak"},
    {"en": "movement", "tr": "hareket"},
    {"en": "movie", "tr": "film"},
    {"en": "mr", "tr": "bay"},
    {"en": "mrs", "tr": "bayan"},
    {"en": "much", "tr": "çok"},
    {"en": "music", "tr": "müzik"},
    {"en": "must", "tr": "gereklilik"},
    {"en": "my", "tr": "benim"},
    {"en": "myself", "tr": "kendim"},
    {"en": "name", "tr": "isim"},
    {"en": "nation", "tr": "ulus"},
    {"en": "national", "tr": "ulusal"},
    {"en": "natural", "tr": "doğal"},
    {"en": "nature", "tr": "doğa"},
    {"en": "near", "tr": "yakın"},
    {"en": "nearly", "tr": "neredeyse"},
    {"en": "necessary", "tr": "gerekli"},
    {"en": "need", "tr": "ihtiyaç"},
    {"en": "network", "tr": "ağ"},
    {"en": "never", "tr": "asla"},
    {"en": "new", "tr": "yeni"},
    {"en": "news", "tr": "haber"},
    {"en": "newspaper", "tr": "gazete"},
    {"en": "next", "tr": "sonraki"},
    {"en": "nice", "tr": "güzel"},
    {"en": "night", "tr": "gece"},
    {"en": "no", "tr": "hayır"},
    {"en": "none", "tr": "hiçbiri"},
    {"en": "nor", "tr": "ne de"},
    {"en": "north", "tr": "kuzey"},
    {"en": "not", "tr": "değil"},
    {"en": "note", "tr": "not"},
    {"en": "nothing", "tr": "hiçbir şey"},
    {"en": "notice", "tr": "farkına varmak"},
    {"en": "november", "tr": "kasım"},
    {"en": "now", "tr": "şimdi"},
    {"en": "number", "tr": "sayı"},
    {"en": "occur", "tr": "meydana gelmek"},
    {"en": "october", "tr": "ekim"},
    {"en": "of", "tr": "nin"},
    {"en": "off", "tr": "kapalı"},
    {"en": "offer", "tr": "teklif etmek"},
    {"en": "office", "tr": "ofis"},
    {"en": "officer", "tr": "memur"},
    {"en": "official", "tr": "resmi"},
    {"en": "often", "tr": "sık sık"},
    {"en": "oh", "tr": "ah"},
    {"en": "oil", "tr": "yağ"},
    {"en": "ok", "tr": "tamam"},
    {"en": "old", "tr": "eski"},
    {"en": "on", "tr": "üzerinde"},
    {"en": "once", "tr": "bir kere"},
    {"en": "one", "tr": "bir"},
    {"en": "only", "tr": "sadece"},
    {"en": "onto", "tr": "üzerine"},
    {"en": "open", "tr": "açık"},
    {"en": "operation", "tr": "operasyon"},
    {"en": "opportunity", "tr": "fırsat"},
    {"en": "option", "tr": "seçenek"},
    {"en": "or", "tr": "veya"},
    {"en": "order", "tr": "sipariş"},
    {"en": "organization", "tr": "organizasyon"},
    {"en": "other", "tr": "diğer"},
    {"en": "others", "tr": "diğerleri"},
    {"en": "our", "tr": "bizim"},
    {"en": "out", "tr": "dışarı"},
    {"en": "outside", "tr": "dışarıda"},
    {"en": "over", "tr": "üzerinde"},
    {"en": "own", "tr": "kendi"},
    {"en": "owner", "tr": "sahip"},
    {"en": "page", "tr": "sayfa"},
    {"en": "pain", "tr": "ağrı"},
    {"en": "painting", "tr": "resim"},
    {"en": "paper", "tr": "kağıt"},
    {"en": "parent", "tr": "ebeveyn"},
    {"en": "part", "tr": "bölüm"},
    {"en": "participant", "tr": "katılımcı"},
    {"en": "particular", "tr": "özel"},
    {"en": "particularly", "tr": "özellikle"},
    {"en": "partner", "tr": "ortak"},
    {"en": "party", "tr": "parti"},
    {"en": "pass", "tr": "geçmek"},
    {"en": "past", "tr": "geçmiş"},
    {"en": "patient", "tr": "hasta"},
    {"en": "pattern", "tr": "desen"},
    {"en": "pay", "tr": "ödemek"},
    {"en": "peace", "tr": "barış"},
    {"en": "people", "tr": "insanlar"},
    {"en": "per", "tr": "başına"},
    {"en": "perform", "tr": "gerçekleştirmek"},
    {"en": "performance", "tr": "performans"},
    {"en": "perhaps", "tr": "belki"},
    {"en": "period", "tr": "dönem"},
    {"en": "person", "tr": "kişi"},
    {"en": "personal", "tr": "kişisel"},
    {"en": "phone", "tr": "telefon"},
    {"en": "physical", "tr": "fiziksel"},
    {"en": "pick", "tr": "seçmek"},
    {"en": "picture", "tr": "resim"},
    {"en": "piece", "tr": "parça"},
    {"en": "place", "tr": "yer"},
    {"en": "plan", "tr": "plan"},
    {"en": "plant", "tr": "bitki"},
    {"en": "play", "tr": "oynamak"},
    {"en": "player", "tr": "oyuncu"},
    {"en": "pm", "tr": "pm"},
    {"en": "point", "tr": "nokta"},
    {"en": "police", "tr": "polis"},
    {"en": "policy", "tr": "politika"},
    {"en": "political", "tr": "siyasi"},
    {"en": "politics", "tr": "siyaset"},
    {"en": "poor", "tr": "fakir"},
    {"en": "popular", "tr": "popüler"},
    {"en": "population", "tr": "nüfus"},
    {"en": "position", "tr": "pozisyon"},
    {"en": "positive", "tr": "pozitif"},
    {"en": "possible", "tr": "mümkün"},
    {"en": "power", "tr": "güç"},
    {"en": "practice", "tr": "uygulama"},
    {"en": "prepare", "tr": "hazırlamak"},
    {"en": "present", "tr": "mevcut"},
    {"en": "president", "tr": "başkan"},
    {"en": "pressure", "tr": "basınç"},
    {"en": "pretty", "tr": "güzel"},
    {"en": "prevent", "tr": "önlemek"},
    {"en": "price", "tr": "fiyat"},
    {"en": "private", "tr": "özel"},
    {"en": "probably", "tr": "muhtemelen"},
    {"en": "problem", "tr": "sorun"},
    {"en": "process", "tr": "süreç"},
    {"en": "produce", "tr": "üretmek"},
    {"en": "product", "tr": "ürün"},
    {"en": "production", "tr": "üretim"},
    {"en": "professional", "tr": "profesyonel"},
    {"en": "professor", "tr": "profesör"},
    {"en": "program", "tr": "program"},
    {"en": "project", "tr": "proje"},
    {"en": "property", "tr": "mülk"},
    {"en": "protect", "tr": "korumak"},
    {"en": "prove", "tr": "kanıtlamak"},
    {"en": "provide", "tr": "sağlamak"},
    {"en": "public", "tr": "kamu"},
    {"en": "pull", "tr": "çekmek"},
    {"en": "purpose", "tr": "amaç"},
    {"en": "push", "tr": "itmek"},
    {"en": "put", "tr": "koymak"},
    {"en": "quality", "tr": "kalite"},
    {"en": "question", "tr": "soru"},
    {"en": "quickly", "tr": "hızlıca"},
    {"en": "quite", "tr": "oldukça"},
    {"en": "race", "tr": "yarış"},
    {"en": "radio", "tr": "radyo"},
    {"en": "raise", "tr": "yükseltmek"},
    {"en": "range", "tr": "aralık"},
    {"en": "rate", "tr": "oran"},
    {"en": "rather", "tr": "daha ziyade"},
    {"en": "reach", "tr": "ulaşmak"},
    {"en": "read", "tr": "okumak"},
    {"en": "ready", "tr": "hazır"},
    {"en": "real", "tr": "gerçek"},
    {"en": "reality", "tr": "gerçeklik"},
    {"en": "realize", "tr": "farkına varmak"},
    {"en": "really", "tr": "gerçekten"},
    {"en": "reason", "tr": "neden"},
    {"en": "receive", "tr": "almak"},
    {"en": "recent", "tr": "son"},
    {"en": "recently", "tr": "son zamanlarda"},
    {"en": "recognize", "tr": "tanımak"},
    {"en": "record", "tr": "kayıt"},
    {"en": "red", "tr": "kırmızı"},
    {"en": "reduce", "tr": "azaltmak"},
    {"en": "reflect", "tr": "yansıtmak"},
    {"en": "region", "tr": "bölge"},
    {"en": "relate", "tr": "ilişki kurmak"},
    {"en": "relationship", "tr": "ilişki"},
    {"en": "religious", "tr": "dini"},
    {"en": "remain", "tr": "kalmak"},
    {"en": "remember", "tr": "hatırlamak"},
    {"en": "remove", "tr": "kaldırmak"},
    {"en": "report", "tr": "rapor"},
    {"en": "represent", "tr": "temsil etmek"},
    {"en": "republican", "tr": "cumhuriyetçi"},
    {"en": "require", "tr": "gerektirmek"},
    {"en": "research", "tr": "araştırma"},
    {"en": "resource", "tr": "kaynak"},
    {"en": "respond", "tr": "cevap vermek"},
    {"en": "response", "tr": "cevap"},
    {"en": "responsibility", "tr": "sorumluluk"},
    {"en": "rest", "tr": "dinlenme"},
    {"en": "result", "tr": "sonuç"},
    {"en": "return", "tr": "dönmek"},
    {"en": "reveal", "tr": "ortaya çıkarmak"},
    {"en": "rich", "tr": "zengin"},
    {"en": "right", "tr": "sağ"},
    {"en": "rise", "tr": "yükselmek"},
    {"en": "risk", "tr": "risk"},
    {"en": "road", "tr": "yol"},
    {"en": "rock", "tr": "kaya"},
    {"en": "role", "tr": "rol"},
    {"en": "room", "tr": "oda"},
    {"en": "rule", "tr": "kural"},
    {"en": "run", "tr": "koşmak"},
    {"en": "safe", "tr": "güvenli"},
    {"en": "same", "tr": "aynı"},
    {"en": "save", "tr": "kurtarmak"},
    {"en": "say", "tr": "söylemek"},
    {"en": "scene", "tr": "sahne"},
    {"en": "school", "tr": "okul"},
    {"en": "science", "tr": "bilim"},
    {"en": "scientist", "tr": "bilim insanı"},
    {"en": "score", "tr": "skor"},
    {"en": "sea", "tr": "deniz"},
    {"en": "season", "tr": "sezon"},
    {"en": "seat", "tr": "koltuk"},
    {"en": "second", "tr": "ikinci"},
    {"en": "section", "tr": "bölüm"},
    {"en": "security", "tr": "güvenlik"},
    {"en": "see", "tr": "görmek"},
    {"en": "seek", "tr": "aramak"},
    {"en": "seem", "tr": "görünmek"},
    {"en": "sell", "tr": "satmak"},
    {"en": "send", "tr": "göndermek"},
    {"en": "senior", "tr": "kıdemli"},
    {"en": "sense", "tr": "duyu"},
    {"en": "series", "tr": "seri"},
    {"en": "serious", "tr": "ciddi"},
    {"en": "serve", "tr": "servis etmek"},
    {"en": "service", "tr": "hizmet"},
    {"en": "set", "tr": "ayarlamak"},
    {"en": "seven", "tr": "yedi"},
    {"en": "several", "tr": "birkaç"},
    {"en": "sex", "tr": "cinsiyet"},
    {"en": "sexual", "tr": "cinsel"},
    {"en": "shake", "tr": "sallamak"},
    {"en": "share", "tr": "paylaşmak"},
    {"en": "she", "tr": "o"},
    {"en": "shoot", "tr": "ateş etmek"},
    {"en": "short", "tr": "kısa"},
    {"en": "shot", "tr": "atış"},
    {"en": "should", "tr": "meli"},
    {"en": "shoulder", "tr": "omuz"},
    {"en": "show", "tr": "göstermek"},
    {"en": "side", "tr": "yan"},
    {"en": "sign", "tr": "işaret"},
    {"en": "significant", "tr": "önemli"},
    {"en": "similar", "tr": "benzer"},
    {"en": "simple", "tr": "basit"},
    {"en": "simply", "tr": "basitçe"},
    {"en": "since", "tr": "den beri"},
    {"en": "sing", "tr": "şarkı söylemek"},
    {"en": "single", "tr": "tek"},
    {"en": "sister", "tr": "kız kardeş"},
    {"en": "sit", "tr": "oturmak"},
    {"en": "site", "tr": "site"},
    {"en": "situation", "tr": "durum"},
    {"en": "six", "tr": "altı"},
    {"en": "size", "tr": "boyut"},
    {"en": "skill", "tr": "beceri"},
    {"en": "skin", "tr": "cilt"},
    {"en": "small", "tr": "küçük"},
    {"en": "smile", "tr": "gülümsemek"},
    {"en": "so", "tr": "öyleyse"},
    {"en": "social", "tr": "sosyal"},
    {"en": "society", "tr": "toplum"},
    {"en": "soldier", "tr": "asker"},
    {"en": "some", "tr": "bazı"},
    {"en": "somebody", "tr": "biri"},
    {"en": "someone", "tr": "biri"},
    {"en": "something", "tr": "bir şey"},
    {"en": "sometimes", "tr": "bazen"},
    {"en": "son", "tr": "oğul"},
    {"en": "song", "tr": "şarkı"},
    {"en": "soon", "tr": "yakında"},
    {"en": "sort", "tr": "sıralamak"},
    {"en": "sound", "tr": "ses"},
    {"en": "source", "tr": "kaynak"},
    {"en": "south", "tr": "güney"},
    {"en": "southern", "tr": "güney"},
    {"en": "space", "tr": "uzay"},
    {"en": "speak", "tr": "konuşmak"},
    {"en": "special", "tr": "özel"},
    {"en": "specific", "tr": "özel"},
    {"en": "speech", "tr": "konuşma"},
    {"en": "spend", "tr": "harcamak"},
    {"en": "sport", "tr": "spor"},
    {"en": "spring", "tr": "ilkbahar"},
    {"en": "staff", "tr": "personel"},
    {"en": "stage", "tr": "sahne"},
    {"en": "stand", "tr": "durmak"},
    {"en": "standard", "tr": "standart"},
    {"en": "star", "tr": "yıldız"},
    {"en": "start", "tr": "başlamak"},
    {"en": "state", "tr": "durum"},
    {"en": "statement", "tr": "ifade"},
    {"en": "station", "tr": "istasyon"},
    {"en": "stay", "tr": "kalmak"},
    {"en": "step", "tr": "adım"},
    {"en": "still", "tr": "hala"},
    {"en": "stock", "tr": "stok"},
    {"en": "stop", "tr": "durmak"},
    {"en": "store", "tr": "mağaza"},
    {"en": "story", "tr": "hikaye"},
    {"en": "strategy", "tr": "strateji"},
    {"en": "street", "tr": "sokak"},
    {"en": "strong", "tr": "güçlü"},
    {"en": "structure", "tr": "yapı"},
    {"en": "student", "tr": "öğrenci"},
    {"en": "study", "tr": "çalışma"},
    {"en": "stuff", "tr": "şey"},
    {"en": "style", "tr": "stil"},
    {"en": "subject", "tr": "konu"},
    {"en": "success", "tr": "başarı"},
    {"en": "successful", "tr": "başarılı"},
    {"en": "such", "tr": "böyle"},
    {"en": "suddenly", "tr": "aniden"},
    {"en": "suffer", "tr": "acı çekmek"},
    {"en": "suggest", "tr": "önermek"},
    {"en": "summer", "tr": "yaz"},
    {"en": "sun", "tr": "güneş"},
    {"en": "support", "tr": "destek"},
    {"en": "sure", "tr": "emin"},
    {"en": "surface", "tr": "yüzey"},
    {"en": "system", "tr": "sistem"},
    {"en": "table", "tr": "masa"},
    {"en": "take", "tr": "almak"},
    {"en": "talk", "tr": "konuşmak"},
    {"en": "task", "tr": "görev"},
    {"en": "tax", "tr": "vergi"},
    {"en": "teach", "tr": "öğretmek"},
    {"en": "teacher", "tr": "öğretmen"},
    {"en": "team", "tr": "takım"},
    {"en": "technology", "tr": "teknoloji"},
    {"en": "television", "tr": "televizyon"},
    {"en": "tell", "tr": "söylemek"},
    {"en": "ten", "tr": "on"},
    {"en": "tend", "tr": "eğilimli olmak"},
    {"en": "term", "tr": "terim"},
    {"en": "test", "tr": "test"},
    {"en": "than", "tr": "daha"},
    {"en": "thank", "tr": "teşekkür etmek"},
    {"en": "that", "tr": "ki"},
    {"en": "the", "tr": "the"},
    {"en": "their", "tr": "onların"},
    {"en": "them", "tr": "onları"},
    {"en": "themselves", "tr": "kendileri"},
    {"en": "then", "tr": "sonra"},
    {"en": "theory", "tr": "teori"},
    {"en": "there", "tr": "orada"},
    {"en": "these", "tr": "bunlar"},
    {"en": "they", "tr": "onlar"},
    {"en": "thing", "tr": "şey"},
    {"en": "think", "tr": "düşünmek"},
    {"en": "third", "tr": "üçüncü"},
    {"en": "this", "tr": "bu"},
    {"en": "those", "tr": "o"},
    {"en": "though", "tr": "rağmen"},
    {"en": "thought", "tr": "düşünce"},
    {"en": "thousand", "tr": "bin"},
    {"en": "threat", "tr": "tehdit"},
    {"en": "three", "tr": "üç"},
    {"en": "through", "tr": "vasıtasıyla"},
    {"en": "throughout", "tr": "boyunca"},
    {"en": "throw", "tr": "atmak"},
    {"en": "thus", "tr": "böylece"},
    {"en": "time", "tr": "zaman"},
    {"en": "to", "tr": "e"},
    {"en": "today", "tr": "bugün"},
    {"en": "together", "tr": "birlikte"},
    {"en": "tonight", "tr": "bu gece"},
    {"en": "too", "tr": "de"},
    {"en": "top", "tr": "üst"},
    {"en": "total", "tr": "toplam"},
    {"en": "tough", "tr": "zor"},
    {"en": "toward", "tr": "yönünde"},
    {"en": "town", "tr": "kasaba"},
    {"en": "trade", "tr": "ticaret"},
    {"en": "traditional", "tr": "geleneksel"},
    {"en": "training", "tr": "eğitim"},
    {"en": "travel", "tr": "seyahat"},
    {"en": "treat", "tr": "tedavi etmek"},
    {"en": "treatment", "tr": "tedavi"},
    {"en": "tree", "tr": "ağaç"},
    {"en": "trial", "tr": "deneme"},
    {"en": "trip", "tr": "yolculuk"},
    {"en": "trouble", "tr": "sorun"},
    {"en": "true", "tr": "doğru"},
    {"en": "truth", "tr": "gerçek"},
    {"en": "try", "tr": "denemek"},
    {"en": "turn", "tr": "dönmek"},
    {"en": "tv", "tr": "tv"},
    {"en": "two", "tr": "iki"},
    {"en": "type", "tr": "tip"},
    {"en": "under", "tr": "altında"},
    {"en": "understand", "tr": "anlamak"},
    {"en": "unit", "tr": "birim"},
    {"en": "until", "tr": "kadar"},
    {"en": "up", "tr": "yukarı"},
    {"en": "upon", "tr": "üzerine"},
    {"en": "us", "tr": "biz"},
    {"en": "use", "tr": "kullanmak"},
    {"en": "usually", "tr": "genellikle"},
    {"en": "value", "tr": "değer"},
    {"en": "various", "tr": "çeşitli"},
    {"en": "very", "tr": "çok"},
    {"en": "victim", "tr": "kurban"},
    {"en": "view", "tr": "görünüm"},
    {"en": "violence", "tr": "şiddet"},
    {"en": "visit", "tr": "ziyaret"},
    {"en": "voice", "tr": "ses"},
    {"en": "vote", "tr": "oy"},
    {"en": "wait", "tr": "beklemek"},
    {"en": "walk", "tr": "yürümek"},
    {"en": "wall", "tr": "duvar"},
    {"en": "want", "tr": "istemek"},
    {"en": "war", "tr": "savaş"},
    {"en": "watch", "tr": "izlemek"},
    {"en": "water", "tr": "su"},
    {"en": "way", "tr": "yol"},
    {"en": "we", "tr": "biz"},
    {"en": "weapon", "tr": "silah"},
    {"en": "wear", "tr": "giymek"},
    {"en": "week", "tr": "hafta"},
    {"en": "weight", "tr": "ağırlık"},
    {"en": "well", "tr": "iyi"},
    {"en": "west", "tr": "batı"},
    {"en": "western", "tr": "batı"},
    {"en": "what", "tr": "ne"},
    {"en": "whatever", "tr": "her neyse"},
    {"en": "when", "tr": "ne zaman"},
    {"en": "where", "tr": "nerede"},
    {"en": "whether", "tr": "olsun"},
    {"en": "which", "tr": "hangi"},
    {"en": "while", "tr": "iken"},
    {"en": "white", "tr": "beyaz"},
    {"en": "who", "tr": "kim"},
    {"en": "whole", "tr": "bütün"},
    {"en": "whom", "tr": "kim"},
    {"en": "whose", "tr": "kimin"},
    {"en": "why", "tr": "neden"},
    {"en": "wide", "tr": "geniş"},
    {"en": "wife", "tr": "eş"},
    {"en": "will", "tr": "niyetinde olmak"},
    {"en": "win", "tr": "kazanmak"},
    {"en": "wind", "tr": "rüzgar"},
    {"en": "window", "tr": "pencere"},
    {"en": "wish", "tr": "dilek"},
    {"en": "with", "tr": "ile"},
    {"en": "within", "tr": "içinde"},
    {"en": "without", "tr": "olmadan"},
    {"en": "woman", "tr": "kadın"},
    {"en": "wonder", "tr": "merak etmek"},
    {"en": "word", "tr": "kelime"},
    {"en": "work", "tr": "çalışmak"},
    {"en": "worker", "tr": "işçi"},
    {"en": "world", "tr": "dünya"},
    {"en": "worry", "tr": "endişelenmek"},
    {"en": "would", "tr": "niyetinde olmak"},
    {"en": "write", "tr": "yazmak"},
    {"en": "writer", "tr": "yazar"},
    {"en": "wrong", "tr": "yanlış"},
    {"en": "yard", "tr": "avlu"},
    {"en": "yeah", "tr": "evet"},
    {"en": "year", "tr": "yıl"},
    {"en": "yes", "tr": "evet"},
    {"en": "yet", "tr": "henüz"},
    {"en": "you", "tr": "sen"},
    {"en": "young", "tr": "genç"},
    {"en": "your", "tr": "senin"},
    {"en": "yourself", "tr": "kendin"},
    {"en": "youth", "tr": "gençlik"},
    {"en": "zebra", "tr": "zebra"},
    {"en": "zeppelin", "tr": "zeplin"},
    {"en": "zipper", "tr": "fermuar"},
    {"en": "zodiac", "tr": "burçlar kuşağı"},
    {"en": "zombie", "tr": "zombi"},
    {"en": "zoo", "tr": "hayvanat bahçesi"},
    {"en": "zoology", "tr": "hayvan bilimi"},
    {"en": "zoom", "tr": "yakınlaşmak"}
  ];

  const generateNumbers = () => {
    const numbersEn = [
      'zero', 'one' || "1", 'two' || "2", 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
      'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
      'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'forty',
      'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine', 'fifty',
      'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty',
      'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine', 'seventy',
      'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five', 'seventy-six', 'seventy-seven', 'seventy-eight', 'seventy-nine', 'eighty',
      'eighty-one', 'eighty-two', 'eighty-three', 'eighty-four', 'eighty-five', 'eighty-six', 'eighty-seven', 'eighty-eight', 'eighty-nine', 'ninety',
      'ninety-one', 'ninety-two', 'ninety-three', 'ninety-four', 'ninety-five', 'ninety-six', 'ninety-seven', 'ninety-eight', 'ninety-nine', 'one hundred'
    ];

    const numbersTr = [
      'sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on',
      'on bir', 'on iki', 'on üç', 'on dört', 'on beş', 'on altı', 'on yedi', 'on sekiz', 'on dokuz', 'yirmi',
      'yirmi bir', 'yirmi iki', 'yirmi üç', 'yirmi dört', 'yirmi beş', 'yirmi altı', 'yirmi yedi', 'yirmi sekiz', 'yirmi dokuz', 'otuz',
      'otuz bir', 'otuz iki', 'otuz üç', 'otuz dört', 'otuz beş', 'otuz altı', 'otuz yedi', 'otuz sekiz', 'otuz dokuz', 'kırk',
      'kırk bir', 'kırk iki', 'kırk üç', 'kırk dört', 'kırk beş', 'kırk altı', 'kırk yedi', 'kırk sekiz', 'kırk dokuz', 'elli',
      'elli bir', 'elli iki', 'elli üç', 'elli dört', 'elli beş', 'elli altı', 'elli yedi', 'elli sekiz', 'elli dokuz', 'altmış',
      'altmış bir', 'altmış iki', 'altmış üç', 'altmış dört', 'altmış beş', 'altmış altı', 'altmış yedi', 'altmış sekiz', 'altmış dokuz', 'yetmiş',
      'yetmiş bir', 'yetmiş iki', 'yetmiş üç', 'yetmiş dört', 'yetmiş beş', 'yetmiş altı', 'yetmiş yedi', 'yetmiş sekiz', 'yetmiş dokuz', 'seksen',
      'seksen bir', 'seksen iki', 'seksen üç', 'seksen dört', 'seksen beş', 'seksen altı', 'seksen yedi', 'seksen sekiz', 'seksen dokuz', 'doksan',
      'doksan bir', 'doksan iki', 'doksan üç', 'doksan dört', 'doksan beş', 'doksan altı', 'doksan yedi', 'doksan sekiz', 'doksan dokuz', 'yüz'
    ];

    const nums = [];
    for (let i = 0; i <= 100; i++) {
      nums.push({ en: numbersEn[i], tr: numbersTr[i] });
    }
    return nums;
  };

  // --- helpers ---
  const shuffle = (array) => {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // load custom words & scores (if any)
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get('custom_words');
        if (result && result.value) setCustomWords(JSON.parse(result.value));
      } catch (e) {
        // ignore
      }
    })();
    // force full dark mode (option A)
    if (typeof document !== 'undefined') document.documentElement.classList.add('dark');
  }, []);

  // timer effect - incremental so it doesn't steal focus
  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  // focus input when screen becomes test or index changes
  useEffect(() => {
    if (screen === 'test' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [screen, currentIndex]);

  // load scores helper
  const loadScores = async () => {
    try {
      const result = await window.storage.get('high_scores');
      return result && result.value ? JSON.parse(result.value) : [];
    } catch (e) {
      return [];
    }
  };

  const categoryTranslations = {
    seasons: 'Mevsimler',
    days: 'Günler',
    numbers: 'Sayılar',
    top1000: 'En Çok Kullanılan Kelimeler'
  };

  const saveScore = async (score) => {
    try {
      if (score.percentage > 0) {
        const scores = await loadScores();
        scores.push(score);
        scores.sort((a, b) => b.percentage - a.percentage);
        await window.storage.set('high_scores', JSON.stringify(scores.slice(0, 20)));
      }
    } catch (e) {
      // ignore
    }
  };

  // start test - always resets and shuffles
  const startTest = (cat, dir) => {
    let wordList = [];
    if (cat === 'seasons') wordList = [...seasons];
    else if (cat === 'days') wordList = [...days];
    else if (cat === 'numbers') wordList = generateNumbers();
    else if (cat === 'top1000') wordList = customWords.length > 0 ? [...customWords] : [...top1000Words];

    const shuffled = shuffle(wordList);
    setWords(shuffled);
    setCategory(cat);
    setDirection(dir);
    setCurrentIndex(0);
    setUserAnswer('');
    setResults({ correct: 0, wrong: 0, empty: 0, mistakes: [] });
    setElapsedTime(0);
    setTimerRunning(true);
    setScreen('test');
    setShowConfirmExit(false); // Explicit reset for confirm modal
  };

  // checkAnswer - compute new results synchronously and pass to finish if last
  const checkAnswer = () => {
    if (!words || words.length === 0) return;
    const currentWord = words[currentIndex];
    const correctAnswer = direction === 'en-tr' ? currentWord.tr : currentWord.en;
    const userAns = (userAnswer || '').trim().toLowerCase();
    const correct = (correctAnswer || '').toLowerCase();

    // compute new results based on previous
    setResults(prev => {
      const newRes = { ...prev };
      if (userAns === '') {
        newRes.empty += 1;
        newRes.mistakes = [...newRes.mistakes, { word: currentWord, userAnswer: '' }];
      } else if (userAns === correct) {
        newRes.correct += 1;
      } else {
        newRes.wrong += 1;
        newRes.mistakes = [...newRes.mistakes, { word: currentWord, userAnswer: userAns }];
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= words.length) {
        finishTest(newRes); // Pass the updated results directly
      } else {
        setCurrentIndex(nextIndex);
        setUserAnswer('');
      }

      return newRes;
    });
  };

  // finishTest now accepts optional computedResults to avoid state async issues
  const finishTest = (computedResults = null) => {
    setTimerRunning(false); // Stop timer here

    const resToUse = computedResults || results;
    const unanswered = words.length - (currentIndex + (computedResults ? 1 : 0)); // If from checkAnswer, current processed; else include current as unanswered

    const finalResults = {
      correct: resToUse.correct,
      wrong: resToUse.wrong,
      empty: resToUse.empty + unanswered,
      mistakes: [
        ...resToUse.mistakes,
        ...words.slice(currentIndex + (computedResults ? 1 : 0)).map(w => ({
          word: w,
          userAnswer: ''
        }))
      ]
    };

    const total = words.length;
    const percentage = total > 0 ? Math.round((finalResults.correct / total) * 100) : 0;

    const score = {
      category,
      direction,
      correct: finalResults.correct,
      wrong: finalResults.wrong,
      empty: finalResults.empty,
      total,
      percentage,
      time: elapsedTime,
      date: new Date().toLocaleDateString('tr-TR'),
    };

    saveScore(score);
    setResults(finalResults);
    setScreen('results');

    // ✅ Test state reset
    setWords([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setElapsedTime(0);
    setShowConfirmExit(false);
  };

  const resetTest = () => {
    setUserAnswer('');
    setWords([]);
    setCurrentIndex(0);
    setResults({ correct: 0, wrong: 0, empty: 0, mistakes: [] });
    setElapsedTime(0);
    setTimerRunning(false);
    setShowConfirmExit(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') checkAnswer();
  };

  // Editor helpers
  const saveCustomWords = async (wordsToSave) => {
    try {
      await window.storage.set('custom_words', JSON.stringify(wordsToSave));
      setCustomWords(wordsToSave);
    } catch (e) {
      // ignore
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        if (Array.isArray(jsonData) && jsonData.every(i => i.en && i.tr)) {
          setCustomWords(jsonData);
          alert(`${jsonData.length} kelime yüklendi`);
        } else alert('Geçersiz format');
      } catch (err) { alert('JSON okunamadı'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // --- UI components ---
  const MenuScreen = () => (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">İngilizce Öğrenme Programı</h1>
          <p className="text-xl text-gray-300">Kategori seçin ve teste başlayın</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CategoryCard title="Mevsimler" icon="🌸" count={4} onSelect={(dir) => startTest('seasons', dir)} />
          <CategoryCard title="Günler" icon="📅" count={7} onSelect={(dir) => startTest('days', dir)} />
          <CategoryCard title="Sayılar" icon="🔢" count={100} onSelect={(dir) => startTest('numbers', dir)} />
          <CategoryCard title="En Çok Kullanılan Kelimeler" icon="📚" count={customWords.length > 0 ? customWords.length : top1000Words.length} onSelect={(dir) => startTest('top1000', dir)} />
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => setScreen('scores')} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg">
            <Trophy className="w-6 h-6" /> En Yüksek Skorlar
          </button>
          <button onClick={() => setScreen('editor')} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg">
            <Settings className="w-6 h-6" /> Kelime Düzenle
          </button>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ title, icon, count, onSelect }) => {
    const [showDirections, setShowDirections] = useState(false);
    return (
      <div className="rounded-2xl shadow-xl p-8 transition-all bg-gray-800">
        <div className="text-6xl mb-4 text-center">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2 text-center">{title}</h3>
        <p className="text-gray-300 mb-6 text-center">{count} kelime</p>
        {!showDirections ? (
          <button onClick={() => setShowDirections(true)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all">
            <Play className="w-5 h-5" /> Başla
          </button>
        ) : (
          <div className="space-y-3">
            <button onClick={() => onSelect('en-tr')} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">İngilizce → Türkçe</button>
            <button onClick={() => onSelect('tr-en')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">Türkçe → İngilizce</button>
            <button onClick={() => setShowDirections(false)} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold">İptal</button>
          </div>
        )}
      </div>
    );
  };

  const TestScreen = () => {
    const currentWord = words[currentIndex] || { en: '', tr: '' };
    const question = direction === 'en-tr' ? currentWord.en : currentWord.tr;

    return (
      <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="px-6 py-3 rounded-lg shadow-lg bg-gray-800">
              <span className="text-2xl font-bold">{currentIndex + 1} / {words.length}</span>
            </div>
            <div className="px-6 py-3 rounded-lg shadow-lg bg-gray-800">
              <div className="flex items-center gap-2"><Clock className="w-6 h-6 text-white" /><span className="text-2xl font-bold">{String(Math.floor(elapsedTime/60)).padStart(2,'0')}:{String(elapsedTime%60).padStart(2,'0')}</span></div>
            </div>
          </div>

          <div className="rounded-3xl shadow-2xl p-12 mb-6 bg-gray-800">
            <div className="text-center mb-8">
              <p className="text-gray-300 mb-4 text-lg">{direction === 'en-tr' ? 'Türkçe karşılığını yazın:' : 'İngilizce karşılığını yazın:'}</p>
              <h2 className="text-6xl font-bold mb-8">{question}</h2>
            </div>

            <input ref={inputRef} type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} onKeyPress={handleKeyPress}
              className="w-full text-3xl p-6 border-4 border-gray-700 rounded-xl focus:outline-none focus:border-indigo-600 text-center font-semibold bg-gray-900 text-gray-100" placeholder="Cevabınızı yazın..." autoFocus />

            <button onClick={checkAnswer} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-xl font-bold text-2xl">Sonraki →</button>
          </div>

          <button onClick={() => setShowConfirmExit(true)} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-xl">Testi Bitir</button>

          {showConfirmExit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-gray-100">
                <div className="flex items-center gap-3 mb-4"><AlertCircle className="w-8 h-8 text-red-500" /><h3 className="text-2xl font-bold">Testi Bitir?</h3></div>
                <p className="text-gray-300 mb-6 text-lg">Cevaplanmayan sorular boş olarak işaretlenecek. Emin misiniz?</p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowConfirmExit(false); finishTest(); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold">Evet, Bitir</button>
                  <button onClick={() => setShowConfirmExit(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold">İptal</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const total = (results.correct || 0) + (results.wrong || 0) + (results.empty || 0);
    const percentage = total > 0 ? Math.round((results.correct / total) * 100) : 0;

    return (
      <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Test Tamamlandı!</h1>
            <div className="text-8xl font-bold mb-2">{percentage}%</div>
            <p className="text-2xl">Süre: {String(Math.floor(elapsedTime/60)).padStart(2,'0')}:{String(elapsedTime%60).padStart(2,'0')}</p>
          </div>

          <div className="rounded-2xl shadow-2xl p-8 mb-8 bg-gray-800 text-gray-100">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-700 rounded-xl">
                <div className="flex items-center justify-center mb-2"><Check className="w-8 h-8 text-green-400" /></div>
                <div className="text-4xl font-bold text-green-400 mb-1">{results.correct}</div>
                <div className="font-semibold text-gray-300">Doğru</div>
              </div>
              <div className="text-center p-6 bg-gray-700 rounded-xl">
                <div className="flex items-center justify-center mb-2"><X className="w-8 h-8 text-red-400" /></div>
                <div className="text-4xl font-bold text-red-400 mb-1">{results.wrong}</div>
                <div className="font-semibold text-gray-300">Yanlış</div>
              </div>
              <div className="text-center p-6 bg-gray-700 rounded-xl">
                <div className="flex items-center justify-center mb-2"><AlertCircle className="w-8 h-8 text-gray-300" /></div>
                <div className="text-4xl font-bold text-gray-300 mb-1">{results.empty}</div>
                <div className="font-semibold text-gray-300">Boş</div>
              </div>
            </div>

            {results.mistakes && results.mistakes.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Yanlış / Boş Cevaplar</h3>
                <div className="max-h-96 overflow-y-auto bg-gray-900 rounded-xl p-6">
                  {results.mistakes.map((m, i) => (
                    <div key={i} className="mb-4 pb-4 border-b border-gray-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white text-lg">{m.word.en}</span>
                          <span className="text-white mx-3">→</span>
                          <span className="font-bold text-green-400 text-lg">{m.word.tr}</span>
                        </div>
                        {m.userAnswer ? (
                          <span className="text-red-400 font-semibold">Sizin: {m.userAnswer}</span>
                        ) : (
                          <span className="text-gray-300 italic">Boş bırakıldı</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={() => { resetTest(); setScreen('menu'); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-xl font-bold text-2xl">Ana Menü</button>
            <button onClick={() => { resetTest(); startTest(category || 'top1000', direction || 'en-tr'); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-5 rounded-xl font-bold text-2xl">Tekrar Başlat</button>
          </div>
        </div>
      </div>
    );
  };

  const ScoresScreen = () => {
    const [scores, setScores] = useState([]);
    useEffect(() => { (async () => setScores(await loadScores()))(); }, []);

    return (
      <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8"><Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" /><h1 className="text-5xl font-bold mb-4">En Yüksek Skorlar</h1></div>
          <div className="space-y-6 mb-8">
            {scores.length === 0 ? (
              <div className="bg-gray-800 rounded-2xl p-12 text-center">Henüz skor yok.</div>
            ) : scores.map((s, idx) => (
              <div key={idx} className="bg-gray-800 rounded-2xl p-6"> <div className="flex justify-between"> <div><div className="font-bold text-lg">{categoryTranslations[s.category] || s.category}</div><div className="text-sm text-gray-300">{s.direction} • {s.date}</div></div><div className="text-right"><div className="text-2xl font-bold text-green-400">{s.percentage}%</div><div className="text-sm text-gray-300">{s.correct}/{s.total}</div></div></div></div>
            ))}
          </div>
          <button onClick={() => setScreen('menu')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-xl font-bold text-2xl">Ana Menüye Dön</button>
        </div>
      </div>
    );
  };

  const EditorScreen = () => {
    const [localWords, setLocalWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
      (async () => {
        try {
          //const r = await window.storage.get('custom_words');
          if (r && r.value) setLocalWords(JSON.parse(r.value));
          else setLocalWords([...top1000Words]);
        } catch (e) { setLocalWords([...top1000Words]); }
        setLoading(false);
      })();
    }, []);

    const handleDownload = () => {
      const dataStr = JSON.stringify(localWords, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'kelimeler.json'; a.click(); URL.revokeObjectURL(url);
    };

    const handleSave = async () => {
      await saveCustomWords(localWords);
      alert('Kaydedildi');
    };

    return (
      <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8"><Settings className="w-16 h-16 text-white mx-auto mb-4" /><h1 className="text-5xl font-bold mb-4">Kelime Düzenleyici</h1><p className="text-gray-300">En çok kullanılan 1000 kelimeyi düzenleyin</p></div>

          <div className="rounded-2xl shadow-xl p-8 mb-6 bg-gray-800">
            <h3 className="text-2xl font-bold mb-4">JSON Dosyası İle İşlemler</h3>
            <div className="flex gap-4"><input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" /><button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-indigo-600 py-3 rounded text-white">📁 Yükle</button><button onClick={handleDownload} className="flex-1 bg-green-600 py-3 rounded text-white">💾 İndir</button></div>
            <p className="text-sm text-gray-400 mt-3">JSON formatı: [{`{"en":"hello","tr":"merhaba"}`}, ...]</p>
          </div>

          <div className="rounded-2xl shadow-xl p-8 mb-6 bg-gray-800">
            <h3 className="text-2xl font-bold mb-4">Yeni Kelime Ekle</h3>
            <div className="flex gap-4"><input type="text" placeholder="İngilizce" value={newWord.en} onChange={(e) => setNewWord({ ...newWord, en: e.target.value })} className="flex-1 p-3 rounded bg-gray-900 text-gray-100" /><input type="text" placeholder="Türkçe" value={newWord.tr} onChange={(e) => setNewWord({ ...newWord, tr: e.target.value })} className="flex-1 p-3 rounded bg-gray-900 text-gray-100" /><button onClick={() => { if (newWord.en.trim() && newWord.tr.trim()) { setCustomWords(prev => { const next = [...prev, { en: newWord.en.trim(), tr: newWord.tr.trim() }]; saveCustomWords(next); return next; }); setNewWord({ en: '', tr: '' }); } }} className="bg-green-600 py-3 px-6 rounded text-white">Ekle</button></div>
          </div>

          <div className="rounded-2xl shadow-xl p-8 mb-6 bg-gray-800">
            <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold">Kelime Listesi ({localWords.length})</h3><button onClick={handleSave} className="bg-purple-600 py-2 px-4 rounded text-white">Kaydet</button></div>
            {loading ? <div className="py-12 text-center">Yükleniyor...</div> : (<div className="max-h-96 overflow-y-auto space-y-3">{localWords.map((w,i) => (<div key={i} className="flex gap-3 items-center p-3 bg-gray-900 rounded"><input value={w.en} onChange={(e)=>{ const copy=[...localWords]; copy[i].en=e.target.value; setLocalWords(copy);} } className="flex-1 p-2 rounded bg-gray-800 text-gray-100"/><span className="text-gray-400">→</span><input value={w.tr} onChange={(e)=>{ const copy=[...localWords]; copy[i].tr=e.target.value; setLocalWords(copy);} } className="flex-1 p-2 rounded bg-gray-800 text-gray-100"/><button onClick={()=>{ setLocalWords(prev=>prev.filter((_,idx)=>idx!==i));}} className="bg-red-600 text-white px-3 py-1 rounded">Sil</button></div>))}</div>)}
          </div>

          <button onClick={() => setScreen('menu')} className="w-full bg-indigo-600 py-4 rounded text-white">Ana Menüye Dön</button>
        </div>
      </div>
    );
  };

  // main return - includes optional fixed dark-mode indicator (app is full-dark)
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-all">
      {/* small corner indicator that app is in full dark mode */}
      <div className="fixed left-4 bottom-4 text-xs text-gray-400">Full Dark Mode</div>

      {screen === 'menu' && <MenuScreen />}
      {screen === 'test' && <TestScreen />}
      {screen === 'results' && <ResultsScreen />}
      {screen === 'scores' && <ScoresScreen />}
      {screen === 'editor' && <EditorScreen />}
    </div>
  );
};

export default EnglishLearningApp;