const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lsk5czic',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
});

async function seed() {
  console.log('Seeding Sanity with current site content...');

  // === HERO ===
  await client.createOrReplace({
    _id: 'hero',
    _type: 'hero',
    title: 'Huiselijke<br><span>hondenopvang</span><br>met liefde',
    subtitle: 'Geen kennels, wel een omheinde tuin van 3.000m\u00B2 en een warme thuisomgeving met heel veel knuffels.',
    stats: [
      { _key: 'stat1', value: '3.000m\u00B2', label: 'Omheinde tuin', isReviewScore: false },
      { _key: 'stat2', value: '24/7', label: 'Toezicht', isReviewScore: false },
      { _key: 'stat3', value: '100%', label: 'Huiselijk', isReviewScore: false },
      { _key: 'stat4', value: '\u2733 5.0', label: 'Google Reviews', isReviewScore: true },
    ],
  });
  console.log('  \u2713 Hero');

  // === TRUST ITEMS ===
  const trustItems = [
    { icon: '&#127968;', text: 'Geen kennels' },
    { icon: '&#127807;', text: '3.000m\u00B2 tuin' },
    { icon: '&#128247;', text: 'Foto-updates via WhatsApp' },
    { icon: '&#128153;', text: 'Gediplomeerd dierverzorger' },
    { icon: '&#128663;', text: 'Haal- & brengservice' },
  ];
  for (let i = 0; i < trustItems.length; i++) {
    await client.createOrReplace({
      _id: `trust-${i}`,
      _type: 'trustItem',
      icon: trustItems[i].icon,
      text: trustItems[i].text,
      order: i,
    });
  }
  console.log('  \u2713 Trust items');

  // === REVIEWS ===
  const reviews = [
    { name: 'Celine Vermote', text: 'Mel is gewoon weg top, het is gewoon een 6* hotel voor de honden.', source: 'Google Review' },
    { name: 'Patrik Beelen', text: 'Super verzorging, mooi concept en een gelukkige hond als we hem gingen terug halen. Zeker en vast een aanrader.', source: 'Google Review' },
    { name: 'Annelies Baert', text: 'Ik heb Beau bruine labrador naar deze nieuwe oppas gedaan voor 6 zaterdagen, maar wat een plezier om telkens Beau zo enthousiast te zien als we aankomen. Ik zie dat ze er graag gaat. Maar ook telkens uitgeteld opweg naar huis. Een aanrader!!!!', source: 'Google Review' },
    { name: 'Steve Cobbaert', text: 'Zonder twijfel een geweldige ervaring met Melanie van Dierenoppas Mel! Tijdens Pukkelpop hebben we onze Maine Coon kittens aan haar toevertrouwd en ze heeft uitstekend voor ze gezorgd. Melanie straalt professionaliteit uit en nam de tijd om alles tot in de puntjes te regelen.', source: 'Google Review' },
    { name: 'Clotaire de Vuyst', text: 'Wij en Viktor (onze ruwharige teckel) waren uiterst tevreden over de manier waarop Mel voor onze hond heeft gezorgd. Ze is zeer betrouwbaar en doet het met hart en ziel. Wij zullen zeker verder blijven samenwerken.', source: 'Google Review' },
    { name: 'Fran\u00E7ois De Kock', text: '100% vertrouwen, dat kom ik eerlijk gezegd niet dagelijks tegen. Een blijver. Mel is lang op voorhand geboekt, maar dat heeft wel een reden h\u00E9.', source: 'Google Review' },
    { name: 'Bernard Struelens', text: 'Onze honden zijn met veel plezier gaan logeren bij Mel.', source: 'Google Review' },
    { name: 'Veerle Plasman', text: 'Mel is een fantastische dogsitter met veel zorg en rust alsof het haar eigen kinderen zijn en weet perfect hoe een hond in elkaar zit. Mijn 2 Aussie Shepherds als mezelf zijn alvast fan!', source: 'Google Review' },
    { name: 'Leen Brees', text: 'Voor het eerst ons cavaliertje van 2 jaar naar haar gebracht. Super ervaring en de 2de keer liep hij al kwispelend naar haar toe!', source: 'Google Review' },
    { name: 'Ingrid de Vos', text: 'Heel tevreden over deze oppas. Elke keer foto\'s van onze poezenkindjes en alles was heel netjes. Professionele aanpak. Een absolute aanrader.', source: 'Google Review' },
    { name: 'Matthias Slembrouck', text: 'Zeer betrouwbaar en goed verzorgd! Zeer tevreden. Veel dank van Ellypoes & Odettiepoes.', source: 'Google Review' },
    { name: 'Rooms Delacauw', text: 'Wat een liefde voor de dieren!!! Heel zeker een aanrader, niet twijfelen, telefoon nemen en afspraak maken.', source: 'Google Review' },
    { name: 'Serge Hollevoet', text: 'Super pension. Echte dierenvrienden.', source: 'Google Review \u00B7 Local Guide' },
  ];
  for (let i = 0; i < reviews.length; i++) {
    await client.createOrReplace({
      _id: `review-${i}`,
      _type: 'review',
      name: reviews[i].name,
      text: reviews[i].text,
      rating: 5,
      source: reviews[i].source,
      order: i,
    });
  }
  console.log('  \u2713 Reviews');

  // === ABOUT ===
  await client.createOrReplace({
    _id: 'about',
    _type: 'about',
    paragraphs: [
      'Ik ben Melanie en woon in Houtem. Al heel mijn leven ligt mijn hart bij dieren. Ik verzorg ze met super veel liefde en plezier de kwispelende staarten, likjes spinnende pootjes, ... dit maakt mij gelukkig. De liefde dat je krijgt van een dier die geef ik terug aan hen.',
      'Ik heb zelf 4 honden ze zijn allemaal super lief en hebben hun eigen karaktertje. Ik heb dierenverzorging gestudeerd in thuisstudie en mijn diploma als dierenartsassistente behaald. Daarmee wil ik graag mijn liefde voor dieren delen met jullie!',
      'Bent u op zoek naar een liefdevolle dierenoppas aan huis wanneer u met vakantie gaat of in het ziekenhuis ligt of gewoon gaan werken bent? Of breng je liever uw hond in de opvang bij Mel? Dan kunt u gerust contact met mij opnemen!',
    ],
    credentials: [
      'Gediplomeerd dierverzorger',
      'Veterinair assistent',
      'Ervaring met alle huisdieren',
      'Persoonlijk & betrokken',
    ],
  });
  console.log('  \u2713 About');

  // === SERVICES ===
  await client.createOrReplace({
    _id: 'services',
    _type: 'services',
    items: [
      'Dieren eten en drinken geven',
      'Opkuisen van uitwerpselen en eventuele ongelukjes',
      'Wandelen',
      'Brievenbus legen',
      'Optrekken en neerlaten van rolluiken',
      'Planten water geven',
      'Borstelen en kammen',
      'Kattenbakken proper maken',
      'Eventueel medicatie geven',
      'Kippen, cavia en konijn verzorgen',
      'Taxi vervoer naar dierenarts',
      'Luxe opvang bij Mel thuis \u2014 uw hond wordt opgevangen in huis',
    ],
  });
  console.log('  \u2713 Services');

  // === FEATURES ===
  const features = [
    { icon: '&#127968;', title: 'Echt huiselijk', description: 'Geen koude hokken, maar een warme woonkamer, zachte manden en een gezellige sfeer. Jouw hond leeft gewoon mee in huis.' },
    { icon: '&#127793;', title: 'Enorme omheinde tuin', description: '3.000m\u00B2 omheinde tuin waar honden vrij kunnen rennen, spelen en snuffelen. Veilig en avontuurlijk tegelijk.' },
    { icon: '&#128247;', title: 'Dagelijkse updates', description: 'Via WhatsApp of Messenger ontvang je foto\'s en updates van je hond. Zo weet je altijd dat het goed gaat!' },
    { icon: '&#128153;', title: 'Persoonlijke aandacht', description: 'Elke hond is uniek. Mel neemt de tijd om elk dier te leren kennen en de verzorging aan te passen aan zijn of haar behoeften.' },
    { icon: '&#127891;', title: 'Gediplomeerd & ervaren', description: 'Opgeleid als dierverzorger en veterinair assistent. Medicatie toedienen of bijzondere zorg? Geen probleem.' },
    { icon: '&#127946;', title: 'Eigen zwembad', description: 'Een zwembad van 10 bij 5 meter waar de honden heerlijk kunnen zwemmen en afkoelen.' },
  ];
  for (let i = 0; i < features.length; i++) {
    await client.createOrReplace({
      _id: `feature-${i}`,
      _type: 'feature',
      icon: features[i].icon,
      title: features[i].title,
      description: features[i].description,
      order: i,
    });
  }
  console.log('  \u2713 Features');

  // === PRICING ===
  const pricingCards = [
    {
      _id: 'pricing-0',
      title: 'Oppas aan huis',
      subtitle: 'Bezoekjes bij jou thuis',
      icon: '&#127968;',
      featured: false,
      buttonText: 'Meer info',
      order: 0,
      items: [
        { _key: 'p0', label: '1 bezoek / 30 min', price: '\u20AC15' },
        { _key: 'p1', label: '1 bezoek / 45 min', price: '\u20AC18' },
        { _key: 'p2', label: '1 bezoek / 1 uur', price: '\u20AC20' },
        { _key: 'p3', label: '2 bezoeken / 30 min', price: '\u20AC30' },
        { _key: 'p4', label: '2 bezoeken / 45 min', price: '\u20AC36' },
      ],
    },
    {
      _id: 'pricing-1',
      title: 'Logeren bij Mel',
      subtitle: 'Vakantie- & dagopvang',
      icon: '&#128564;',
      featured: true,
      badge: 'Populair',
      buttonText: 'Reserveer nu',
      order: 1,
      items: [
        { _key: 'p0', label: 'Dagopvang (5:30 \u2013 19:00)', price: '\u20AC25' },
        { _key: 'p1', label: 'Dag & nachtopvang', price: '\u20AC35' },
        { _key: 'p2', label: 'Hoeve-dieren (per uur)', price: '\u20AC35' },
        { _key: 'p3', label: '3+ huisdieren', price: 'Op maat' },
      ],
    },
    {
      _id: 'pricing-2',
      title: "Extra's",
      subtitle: 'Bijkomende diensten',
      icon: '&#128663;',
      featured: false,
      buttonText: 'Vraag offerte',
      order: 2,
      items: [
        { _key: 'p0', label: 'Kilometervergoeding', price: '\u20AC0,45/km' },
        { _key: 'p1', label: 'Heen- & terugrit', price: 'Inbegrepen' },
        { _key: 'p2', label: '3 bezoeken / dag', price: 'Op maat' },
        { _key: 'p3', label: 'Transport dierenarts', price: 'Op aanvraag' },
      ],
    },
  ];
  for (const card of pricingCards) {
    await client.createOrReplace({ ...card, _type: 'pricingCard' });
  }
  console.log('  \u2713 Pricing');

  // === GALLERY ===
  const galleryImages = [
    { filename: 'wandeling.png', alt: 'Wandelen met de honden' },
    { filename: 'chowchow.png', alt: 'Chow Chow in de zon' },
    { filename: 'aussie.png', alt: 'Blije Australian Shepherd' },
    { filename: 'herder.png', alt: 'Duitse Herder thuis' },
    { filename: 'duinen.png', alt: 'Hond in de duinen' },
    { filename: 'mel.png', alt: 'Mel met haar hond' },
    { filename: 'zwembad1.jpeg', alt: 'Hond in het zwembad' },
    { filename: 'zwembad2.jpeg', alt: 'Mel en honden bij het zwembad' },
  ];
  for (let i = 0; i < galleryImages.length; i++) {
    await client.createOrReplace({
      _id: `gallery-${i}`,
      _type: 'galleryImage',
      filename: galleryImages[i].filename,
      alt: galleryImages[i].alt,
      order: i,
    });
  }
  console.log('  \u2713 Gallery');

  // === REGIONS ===
  const regionNames = ['Alveringem', 'Veurne', 'Lo-Reninge', 'Diksmuide', 'Ieper', 'De Panne', 'Koksijde', 'Oostduinkerke', 'Nieuwpoort'];
  for (let i = 0; i < regionNames.length; i++) {
    await client.createOrReplace({
      _id: `region-${i}`,
      _type: 'region',
      name: regionNames[i],
      order: i,
    });
  }
  console.log('  \u2713 Regions');

  // === CONTACT ===
  await client.createOrReplace({
    _id: 'contact',
    _type: 'contact',
    phone: '0496 15 75 94',
    email: 'dierenoppasmel@gmail.com',
    address: 'Elzentapstraat 4, 8630 Veurne',
    addressStreet: 'Elzentapstraat 4',
    addressCity: '8630 Veurne, Belgi\u00EB',
  });
  console.log('  \u2713 Contact');

  console.log('\nDone! All content has been seeded to Sanity.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
