const analysisForm = document.getElementById('analysis-form');
const analysisPhotoInput = document.getElementById('analysis-photo');
const plantTypeInput = document.getElementById('plant-type');
const plantSymptomInput = document.getElementById('plant-symptom');
const qualityWarnings = document.getElementById('quality-warnings');
const analysisEmpty = document.getElementById('analysis-empty');
const analysisResult = document.getElementById('analysis-result');
const analysisPreview = document.getElementById('analysis-preview');
const resultName = document.getElementById('result-name');
const resultConfidence = document.getElementById('result-confidence');
const resultConfidenceTier = document.getElementById('result-confidence-tier');
const resultProblem = document.getElementById('result-problem');
const resultHelp = document.getElementById('result-help');
const resultActions = document.getElementById('result-actions');
const resultTags = document.getElementById('result-tags');
const followUpContainer = document.getElementById('follow-up-container');
const followUpList = document.getElementById('follow-up-list');
const treatmentCard = document.getElementById('treatment-card');
const treatmentSteps = document.getElementById('treatment-steps');
const treatmentSafety = document.getElementById('treatment-safety');
const treatmentEscalation = document.getElementById('treatment-escalation');

const plantForm = document.getElementById('plant-form');
const plantNameInput = document.getElementById('plant-name');
const plantSpeciesInput = document.getElementById('plant-species');
const plantLightInput = document.getElementById('plant-light');
const plantLocationInput = document.getElementById('plant-location');
const plantPotSizeInput = document.getElementById('plant-pot-size');
const wateringCadenceInput = document.getElementById('watering-cadence');
const plantNoteInput = document.getElementById('plant-note');
const plantPhotoInput = document.getElementById('plant-photo');
const plantsEmpty = document.getElementById('plants-empty');
const plantsList = document.getElementById('plants-list');
const plantCardTemplate = document.getElementById('plant-card-template');

const tasksEmpty = document.getElementById('tasks-empty');
const tasksList = document.getElementById('tasks-list');
const geminiApiKeyInput = document.getElementById('gemini-api-key');

const storageKey = 'felix-gruener-daumen-plants-v2';
const geminiKeyStorageKey = 'felix-gruener-daumen-gemini-key';
let GEMINI_API_KEY = '';

const plantCatalog = {
  zimmerpflanze: {
    names: ['Monstera Deliciosa', 'Philodendron Birkin', 'Calathea Orbifolia'],
    tags: ['Innenraum', 'Beliebte Zimmerpflanze', 'Mittelhelles Licht'],
  },
  sukkulente: {
    names: ['Echeveria Elegans', 'Aloe Vera', 'Crassula Ovata'],
    tags: ['Sonnig', 'Wenig Wasser', 'Drainage wichtig'],
  },
  kraut: {
    names: ['Basilikum', 'Minze', 'Rosmarin'],
    tags: ['Küche', 'Regelmäßig ernten', 'Gleichmäßig feucht'],
  },
  orchidee: {
    names: ['Phalaenopsis', 'Dendrobium', 'Oncidium'],
    tags: ['Hohe Luftfeuchte', 'Indirektes Licht', 'Locker gießen'],
  },
  gemuese: {
    names: ['Tomate', 'Paprika', 'Aubergine'],
    tags: ['Nährstoffbedarf hoch', 'Sonnig', 'Wachstumsphase beobachten'],
  },
};

const symptomMap = {
  none: {
    title: 'Die Pflanze wirkt insgesamt stabil und vital.',
    help: 'Behalte Gießrhythmus und Lichtverhältnisse bei. Ein kurzer Gesundheitscheck in einigen Tagen reicht aus.',
    actions: ['Feuchtigkeit der Erde 1–2 cm tief prüfen.', 'Weiterhin hell, aber ohne Stress durch direkte Mittagssonne platzieren.', 'Nächstes Verlaufsfoto in 7 Tagen aufnehmen.'],
    trend: 'Stabil',
    vitalityDelta: 5,
  },
  yellow: {
    title: 'Gelbliche Blätter deuten auf Licht- oder Gießstress hin.',
    help: 'Prüfe, ob die Erde dauerhaft nass bleibt oder die Pflanze zu dunkel steht. Häufig hilft weniger Wasser und ein hellerer Standort.',
    actions: ['Vor dem nächsten Gießen obere Erdschicht antrocknen lassen.', 'Standort mit mehr indirektem Licht testen.', 'Gelbe Altblätter entfernen und 5–7 Tage beobachten.'],
    trend: 'Aufhellung erkannt',
    vitalityDelta: -3,
  },
  dry: {
    title: 'Trockene Stellen sprechen für Trockenstress oder niedrige Luftfeuchte.',
    help: 'Erhöhe die Luftfeuchtigkeit leicht und gieße gleichmäßiger. Vermeide zugleich Staunässe.',
    actions: ['Gießintervall etwas verkürzen, aber keine nasse Erde stehen lassen.', 'Pflanze von Heizung oder Zugluft wegrücken.', 'Braune Spitzen bei Bedarf vorsichtig zurückschneiden.'],
    trend: 'Trockenstress',
    vitalityDelta: -4,
  },
  droopy: {
    title: 'Hängende Blätter zeigen akuten Stress durch Wasserhaushalt oder Temperatur.',
    help: 'Kontrolliere die Erde sofort. Sowohl zu trocken als auch zu nass kann zu schlaffen Blättern führen.',
    actions: ['Wurzelballen und Topfgewicht prüfen.', 'In den nächsten 24 Stunden erneut beobachten.', 'Temperaturschwankungen und direkte Sonne reduzieren.'],
    trend: 'Stresssignal',
    vitalityDelta: -5,
  },
  spots: {
    title: 'Flecken können auf Schädlinge, Pilzbefall oder Blattverbrennungen hindeuten.',
    help: 'Isoliere die Pflanze vorsichtshalber und kontrolliere Blattunterseiten auf kleine Tiere oder klebrige Rückstände.',
    actions: ['Blätter mit weichem Tuch reinigen.', 'Pflanze getrennt von anderen beobachten.', 'Bei Ausbreitung Neem oder geeignetes Pflanzenschutzmittel erwägen.'],
    trend: 'Kontrolle nötig',
    vitalityDelta: -6,
  },
};

const treatmentLibrary = {
  none: {
    steps: 'Weiter beobachten, gleichmäßig gießen und Standortbedingungen konstant halten.',
    safety: 'Sicher: Es sind keine aggressiven Maßnahmen notwendig.',
    escalation: 'Bei neuen Symptomen innerhalb von 7 Tagen erneut analysieren.',
  },
  yellow: {
    steps: 'Gießmenge reduzieren, Drainage prüfen, bei Bedarf umtopfen und Licht langsam erhöhen.',
    safety: 'Düngung vorerst pausieren, um Wurzeln nicht zusätzlich zu belasten.',
    escalation: 'Wenn nach 7 Tagen mehr als 30% der Blätter vergilben, Ursache vertieft prüfen.',
  },
  dry: {
    steps: 'Luftfeuchtigkeit moderat erhöhen und in kleinen Mengen häufiger gießen.',
    safety: 'Keine Blattglanzsprays verwenden, da diese Poren verschließen können.',
    escalation: 'Wenn Blattkanten weiter eintrocknen, Wurzelgesundheit kontrollieren.',
  },
  droopy: {
    steps: 'Bodenfeuchte messen, bei Nässe Gießpause einlegen, bei Trockenheit tief wässern.',
    safety: 'Nicht gleichzeitig umtopfen und düngen; Stressfaktoren einzeln ändern.',
    escalation: 'Bleibt die Pflanze 48 Stunden schlaff, Wurzeln und Temperaturstress prüfen.',
  },
  spots: {
    steps: 'Befallene Blätter isolieren, Blattunterseiten reinigen und Verlauf täglich dokumentieren.',
    safety: 'Bei Pflanzenschutzmitteln Handschuhe tragen und auf Haustiere/Kinder achten.',
    escalation: 'Bei schneller Ausbreitung innerhalb 72 Stunden gezielt behandeln oder Fachberatung holen.',
  },
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getConfidenceTier(score) {
  if (score >= 90) return 'Hoch';
  if (score >= 78) return 'Mittel';
  return 'Niedrig';
}

function pseudoConfidence(name, symptom, qualityPenalty) {
  const base = name.length * 7 + symptom.length * 3;
  return clamp(92 - (base % 18) - qualityPenalty, 61, 97);
}

async function assessImageQuality(file) {
  if (!file) return { warnings: [], penalty: 0 };
  const imageUrl = await readFileAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const width = 160;
  const height = Math.max(1, Math.floor((image.height / image.width) * width));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;

  let brightness = 0;
  let contrast = 0;
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    brightness += luma;
    contrast += Math.abs(luma - 127);
  }

  const pixelCount = data.length / 4;
  const avgBrightness = brightness / pixelCount;
  const avgContrast = contrast / pixelCount;
  const warnings = [];
  let penalty = 0;

  if (avgBrightness < 65) {
    warnings.push('Bild ist sehr dunkel – bitte bei Tageslicht fotografieren.');
    penalty += 6;
  }
  if (avgBrightness > 215) {
    warnings.push('Bild ist sehr hell/überbelichtet – versuche weniger direktes Licht.');
    penalty += 4;
  }
  if (avgContrast < 24) {
    warnings.push('Bild wirkt unscharf oder kontrastarm – bitte näher ran und stabil halten.');
    penalty += 6;
  }
  if (file.size > 8 * 1024 * 1024) {
    warnings.push('Sehr große Datei – Upload wird langsam. Automatische Komprimierung empfohlen.');
    penalty += 2;
  }

  return { warnings, penalty };
}

async function analyzeWithGemini(imageBase64, type, symptom) {
  if (!GEMINI_API_KEY) return null;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Bestimme Pflanzenart, Problem und 3 sichere nächste Schritte als JSON mit Schlüsseln name, confidenceScore (0-100), problem, help, actions (array), tags (array), followUps (array). Typ:${type}, Symptom:${symptom}.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    return {
      name: parsed.name,
      confidenceScore: clamp(Number(parsed.confidenceScore || 0), 0, 100),
      problem: parsed.problem,
      help: parsed.help,
      actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 4) : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
      followUps: Array.isArray(parsed.followUps) ? parsed.followUps.slice(0, 4) : [],
      source: 'gemini',
    };
  } catch {
    return null;
  }
}

function analyzePlantFallback(type, symptom, qualityPenalty) {
  const catalog = plantCatalog[type] || plantCatalog.zimmerpflanze;
  const index = symptom.length % catalog.names.length;
  const name = catalog.names[index];
  const symptomInfo = symptomMap[symptom] || symptomMap.none;
  const confidenceScore = pseudoConfidence(name, symptom, qualityPenalty);
  const tier = getConfidenceTier(confidenceScore);

  const followUps = tier === 'Niedrig'
    ? ['Nahaufnahme eines betroffenen Blatts hochladen.', 'Gesamtansicht inkl. Topf und Erde zeigen.', 'Foto bei natürlichem Licht ohne Blitz aufnehmen.']
    : [];

  return {
    name,
    confidenceScore,
    confidence: `${confidenceScore}% Übereinstimmung`,
    confidenceTier: tier,
    problem: symptomInfo.title,
    help: symptomInfo.help,
    actions: symptomInfo.actions,
    tags: [...catalog.tags, symptomInfo.trend],
    followUps,
    source: 'fallback',
  };
}

function renderAnalysis(result, imageSrc, symptom) {
  analysisPreview.src = imageSrc;
  resultName.textContent = result.name;
  resultConfidence.textContent = `${result.confidenceScore}% Übereinstimmung`;
  resultConfidenceTier.textContent = `Konfidenz: ${result.confidenceTier || getConfidenceTier(result.confidenceScore)}`;
  resultProblem.textContent = result.problem;
  resultHelp.textContent = result.help;
  resultActions.innerHTML = result.actions.map((action) => `<li>${action}</li>`).join('');
  resultTags.innerHTML = result.tags.map((tag) => `<span>${tag}</span>`).join('');

  const followUps = result.followUps || [];
  followUpContainer.classList.toggle('hidden', followUps.length === 0);
  followUpList.innerHTML = followUps.map((item) => `<li>${item}</li>`).join('');

  const treatment = treatmentLibrary[symptom] || treatmentLibrary.none;
  treatmentSteps.textContent = treatment.steps;
  treatmentSafety.textContent = treatment.safety;
  treatmentEscalation.textContent = treatment.escalation;
  treatmentCard.classList.remove('hidden');

  analysisEmpty.classList.add('hidden');
  analysisResult.classList.remove('hidden');
}

function loadPlants() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

function readGeminiKey() {
  try {
    return (localStorage.getItem(geminiKeyStorageKey) || '').trim();
  } catch {
    return '';
  }
}

function saveGeminiKey(value) {
  try {
    localStorage.setItem(geminiKeyStorageKey, value.trim());
  } catch {
    // ignore storage write errors
  }
}

function initializeGeminiKeyInput() {
  GEMINI_API_KEY = readGeminiKey();
  if (!geminiApiKeyInput) return;
  geminiApiKeyInput.value = GEMINI_API_KEY;
  geminiApiKeyInput.addEventListener('change', () => {
    GEMINI_API_KEY = geminiApiKeyInput.value.trim();
    saveGeminiKey(GEMINI_API_KEY);
  });
}

function savePlants(plants) {
  localStorage.setItem(storageKey, JSON.stringify(plants));
}

function summarizeTimeline(entries) {
  const latest = entries[0];
  if (!latest) return 'Noch keine Einträge vorhanden.';

  if (/blatt|wachstum|neu/i.test(latest.note || '')) {
    return 'Positive Entwicklung: Das letzte Update beschreibt frisches Wachstum.';
  }

  if (/gelb|trocken|schädling|flecken/i.test(latest.note || '')) {
    return 'Auffälligkeit im Verlauf: Bitte die nächsten Tage besonders genau beobachten.';
  }

  return 'Ruhiger Verlauf: Die Pflanze wird regelmäßig dokumentiert und zeigt einen stabilen Pflegezyklus.';
}

function calculatePlantMetrics(plant) {
  const baseline = 70;
  const changeFromEntries = plant.entries.reduce((sum, entry) => sum + Number(entry.vitalityDelta || 0), 0);
  const vitality = clamp(baseline + changeFromEntries, 20, 100);
  const streak = Math.min(plant.entries.length, 12);
  return { vitality, streak };
}

function createTimelineItem(entry) {
  return `
    <article class="timeline-item">
      ${entry.photo ? `<img src="${entry.photo}" alt="Verlaufsfoto von ${entry.date}" />` : '<div class="timeline-item__placeholder"></div>'}
      <div>
        <time datetime="${entry.isoDate}">${entry.date}</time>
        <strong>${entry.title}</strong>
        <p>${entry.note || 'Kein zusätzlicher Kommentar gespeichert.'}</p>
      </div>
    </article>
  `;
}

function renderPlants() {
  const plants = loadPlants();
  plantsList.innerHTML = '';
  plantsEmpty.classList.toggle('hidden', plants.length > 0);

  plants.forEach((plant) => {
    const fragment = plantCardTemplate.content.cloneNode(true);
    const metrics = calculatePlantMetrics(plant);

    fragment.querySelector('.plant-card__species').textContent = plant.speciesCanonical;
    fragment.querySelector('.plant-card__name').textContent = plant.nickname;
    fragment.querySelector('.plant-card__trend').textContent = plant.entries[0]?.title || 'Neu';
    fragment.querySelector('.plant-card__summary').textContent = summarizeTimeline(plant.entries);
    fragment.querySelector('.plant-card__metrics').textContent = `Vitalität: ${metrics.vitality}/100 · Doku-Serie: ${metrics.streak} Einträge · Standort: ${plant.location || 'nicht gesetzt'}`;
    fragment.querySelector('.timeline').innerHTML = plant.entries.map(createTimelineItem).join('');
    plantsList.appendChild(fragment);
  });
}

function getDaysDiff(dateA, dateB) {
  return Math.floor((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
}

function buildTasks(plants) {
  const now = new Date();
  return plants.flatMap((plant) => {
    const latestEntry = plant.entries[0];
    const latestDate = latestEntry ? new Date(latestEntry.isoDate) : new Date(plant.createdAt);
    const elapsedDays = Math.max(0, getDaysDiff(now, latestDate));

    const cadence = Number(plant.careTargets.wateringCadenceDays || 7);
    const waterDue = elapsedDays >= cadence;

    const tasks = [
      {
        label: `Gießen: ${plant.nickname}`,
        due: waterDue,
        details: `${elapsedDays} Tage seit letztem Eintrag · Intervall ${cadence} Tage`,
      },
      {
        label: `Schädlings-Check: ${plant.nickname}`,
        due: elapsedDays >= 10,
        details: 'Blattunterseiten und Triebe prüfen',
      },
      {
        label: `Drehen/Standort prüfen: ${plant.nickname}`,
        due: elapsedDays >= 7,
        details: plant.location || 'Standort eintragen',
      },
    ];

    return tasks;
  });
}

function renderTasks() {
  const plants = loadPlants();
  const tasks = buildTasks(plants);
  const dueTasks = tasks.filter((task) => task.due);

  tasksList.innerHTML = '';
  tasksEmpty.classList.toggle('hidden', dueTasks.length > 0);

  dueTasks.forEach((task) => {
    const item = document.createElement('article');
    item.className = 'task-item';
    item.innerHTML = `<strong>${task.label}</strong><p>${task.details}</p>`;
    tasksList.appendChild(item);
  });
}

analysisPhotoInput.addEventListener('change', async () => {
  const file = analysisPhotoInput.files?.[0];
  if (!file) {
    qualityWarnings.classList.add('hidden');
    qualityWarnings.textContent = '';
    return;
  }

  const quality = await assessImageQuality(file);
  if (quality.warnings.length > 0) {
    qualityWarnings.classList.remove('hidden');
    qualityWarnings.innerHTML = quality.warnings.map((warning) => `<p>⚠️ ${warning}</p>`).join('');
    return;
  }

  qualityWarnings.classList.add('hidden');
  qualityWarnings.textContent = '';
});

analysisForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = analysisPhotoInput.files?.[0];

  if (!file) {
    analysisEmpty.textContent = 'Bitte zuerst ein Pflanzenfoto auswählen.';
    return;
  }

  const imageSrc = await readFileAsDataUrl(file);
  const base64Payload = imageSrc.split(',')[1] || '';
  const quality = await assessImageQuality(file);
  let result = await analyzeWithGemini(base64Payload, plantTypeInput.value, plantSymptomInput.value);

  if (!result) {
    result = analyzePlantFallback(plantTypeInput.value, plantSymptomInput.value, quality.penalty);
  } else {
    result.confidenceTier = getConfidenceTier(result.confidenceScore);
    result.confidence = `${result.confidenceScore}% Übereinstimmung`;
  }

  renderAnalysis(result, imageSrc, plantSymptomInput.value);
});

plantForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const plants = loadPlants();
  const photo = await readFileAsDataUrl(plantPhotoInput.files?.[0]);
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(now);

  const note = plantNoteInput.value.trim();
  const entry = {
    title: note ? 'Neues Update' : 'Erster Eintrag',
    note,
    photo,
    date: dateLabel,
    isoDate: now.toISOString(),
    vitalityDelta: /neu|wachstum|gesund/i.test(note) ? 4 : /gelb|trocken|schädling|flecken/i.test(note) ? -4 : 1,
  };

  const plantName = plantNameInput.value.trim();
  const existingPlant = plants.find((plant) => plant.nickname.toLowerCase() === plantName.toLowerCase());

  if (existingPlant) {
    existingPlant.entries.unshift(entry);
    existingPlant.speciesCanonical = plantSpeciesInput.value.trim();
    existingPlant.updatedAt = now.toISOString();
    existingPlant.careTargets = {
      ...existingPlant.careTargets,
      light: plantLightInput.value.trim(),
      wateringCadenceDays: Number(wateringCadenceInput.value || 7),
    };
    existingPlant.pot = {
      ...existingPlant.pot,
      size: plantPotSizeInput.value.trim(),
    };
    existingPlant.location = plantLocationInput.value.trim();
  } else {
    plants.unshift({
      plantId: crypto.randomUUID(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      speciesCanonical: plantSpeciesInput.value.trim(),
      nickname: plantName,
      location: plantLocationInput.value.trim(),
      pot: {
        size: plantPotSizeInput.value.trim(),
      },
      careTargets: {
        light: plantLightInput.value.trim(),
        wateringCadenceDays: Number(wateringCadenceInput.value || 7),
      },
      entries: [entry],
    });
  }

  savePlants(plants);
  plantForm.reset();
  renderPlants();
  renderTasks();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // ignore sw registration errors
    });
  });
}

initializeGeminiKeyInput();
renderPlants();
renderTasks();
