const analysisForm = document.getElementById('analysis-form');
const analysisPhotoInput = document.getElementById('analysis-photo');
const plantTypeInput = document.getElementById('plant-type');
const plantSymptomInput = document.getElementById('plant-symptom');
const analysisEmpty = document.getElementById('analysis-empty');
const analysisResult = document.getElementById('analysis-result');
const analysisPreview = document.getElementById('analysis-preview');
const resultName = document.getElementById('result-name');
const resultConfidence = document.getElementById('result-confidence');
const resultProblem = document.getElementById('result-problem');
const resultHelp = document.getElementById('result-help');
const resultActions = document.getElementById('result-actions');
const resultTags = document.getElementById('result-tags');

const plantForm = document.getElementById('plant-form');
const plantNameInput = document.getElementById('plant-name');
const plantSpeciesInput = document.getElementById('plant-species');
const plantNoteInput = document.getElementById('plant-note');
const plantPhotoInput = document.getElementById('plant-photo');
const plantsEmpty = document.getElementById('plants-empty');
const plantsList = document.getElementById('plants-list');
const plantCardTemplate = document.getElementById('plant-card-template');

const storageKey = 'felix-gruener-daumen-plants';

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
  },
  yellow: {
    title: 'Gelbliche Blätter deuten auf Licht- oder Gießstress hin.',
    help: 'Prüfe, ob die Erde dauerhaft nass bleibt oder die Pflanze zu dunkel steht. Häufig hilft weniger Wasser und ein hellerer Standort.',
    actions: ['Vor dem nächsten Gießen obere Erdschicht antrocknen lassen.', 'Standort mit mehr indirektem Licht testen.', 'Gelbe Altblätter entfernen und 5–7 Tage beobachten.'],
    trend: 'Aufhellung erkannt',
  },
  dry: {
    title: 'Trockene Stellen sprechen für Trockenstress oder niedrige Luftfeuchte.',
    help: 'Erhöhe die Luftfeuchtigkeit leicht und gieße gleichmäßiger. Vermeide zugleich Staunässe.',
    actions: ['Gießintervall etwas verkürzen, aber keine nasse Erde stehen lassen.', 'Pflanze von Heizung oder Zugluft wegrücken.', 'Braune Spitzen bei Bedarf vorsichtig zurückschneiden.'],
    trend: 'Trockenstress',
  },
  droopy: {
    title: 'Hängende Blätter zeigen akuten Stress durch Wasserhaushalt oder Temperatur.',
    help: 'Kontrolliere die Erde sofort. Sowohl zu trocken als auch zu nass kann zu schlaffen Blättern führen.',
    actions: ['Wurzelballen und Topfgewicht prüfen.', 'In den nächsten 24 Stunden erneut beobachten.', 'Temperaturschwankungen und direkte Sonne reduzieren.'],
    trend: 'Stresssignal',
  },
  spots: {
    title: 'Flecken können auf Schädlinge, Pilzbefall oder Blattverbrennungen hindeuten.',
    help: 'Isoliere die Pflanze vorsichtshalber und kontrolliere Blattunterseiten auf kleine Tiere oder klebrige Rückstände.',
    actions: ['Blätter mit weichem Tuch reinigen.', 'Pflanze getrennt von anderen beobachten.', 'Bei Ausbreitung Neem oder geeignetes Pflanzenschutzmittel erwägen.'],
    trend: 'Kontrolle nötig',
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

function pseudoConfidence(name, symptom) {
  const base = name.length * 7 + symptom.length * 3;
  return 84 + (base % 13);
}

function analyzePlant(type, symptom) {
  const catalog = plantCatalog[type] || plantCatalog.zimmerpflanze;
  const index = symptom.length % catalog.names.length;
  const name = catalog.names[index];
  const symptomInfo = symptomMap[symptom] || symptomMap.none;

  return {
    name,
    confidence: `${pseudoConfidence(name, symptom)}% Übereinstimmung`,
    problem: symptomInfo.title,
    help: symptomInfo.help,
    actions: symptomInfo.actions,
    tags: [...catalog.tags, symptomInfo.trend],
  };
}

function renderAnalysis(result, imageSrc) {
  analysisPreview.src = imageSrc;
  resultName.textContent = result.name;
  resultConfidence.textContent = result.confidence;
  resultProblem.textContent = result.problem;
  resultHelp.textContent = result.help;
  resultActions.innerHTML = result.actions.map((action) => `<li>${action}</li>`).join('');
  resultTags.innerHTML = result.tags.map((tag) => `<span>${tag}</span>`).join('');
  analysisEmpty.classList.add('hidden');
  analysisResult.classList.remove('hidden');
}

function loadPlants() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    return [];
  }
}

function savePlants(plants) {
  localStorage.setItem(storageKey, JSON.stringify(plants));
}

function summarizeTimeline(entries) {
  const latest = entries[0];
  if (!latest) {
    return 'Noch keine Einträge vorhanden.';
  }

  if (/blatt|wachstum|neu/i.test(latest.note)) {
    return 'Positive Entwicklung: Das letzte Update beschreibt frisches Wachstum.';
  }

  if (/gelb|trocken|schädling|flecken/i.test(latest.note)) {
    return 'Auffälligkeit im Verlauf: Bitte die nächsten Tage besonders genau beobachten.';
  }

  return 'Ruhiger Verlauf: Die Pflanze wird regelmäßig dokumentiert und zeigt einen stabilen Pflegezyklus.';
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
    fragment.querySelector('.plant-card__species').textContent = plant.species;
    fragment.querySelector('.plant-card__name').textContent = plant.name;
    fragment.querySelector('.plant-card__trend').textContent = plant.entries[0]?.title || 'Neu';
    fragment.querySelector('.plant-card__summary').textContent = summarizeTimeline(plant.entries);
    fragment.querySelector('.timeline').innerHTML = plant.entries.map(createTimelineItem).join('');
    plantsList.appendChild(fragment);
  });
}

analysisForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = analysisPhotoInput.files?.[0];

  if (!file) {
    analysisEmpty.textContent = 'Bitte zuerst ein Pflanzenfoto auswählen.';
    return;
  }

  const imageSrc = await readFileAsDataUrl(file);
  const result = analyzePlant(plantTypeInput.value, plantSymptomInput.value);
  renderAnalysis(result, imageSrc);
});

plantForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const plants = loadPlants();
  const photo = await readFileAsDataUrl(plantPhotoInput.files?.[0]);
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(now);

  const entry = {
    title: plantNoteInput.value ? 'Neues Update' : 'Erster Eintrag',
    note: plantNoteInput.value.trim(),
    photo,
    date: dateLabel,
    isoDate: now.toISOString(),
  };

  const existingPlant = plants.find((plant) => plant.name.toLowerCase() === plantNameInput.value.trim().toLowerCase());

  if (existingPlant) {
    existingPlant.entries.unshift(entry);
    existingPlant.species = plantSpeciesInput.value.trim();
  } else {
    plants.unshift({
      name: plantNameInput.value.trim(),
      species: plantSpeciesInput.value.trim(),
      entries: [entry],
    });
  }

  savePlants(plants);
  plantForm.reset();
  renderPlants();
});

renderPlants();
