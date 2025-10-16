// Al-Hilal Squad API - Updated 2025/2026 Season
// Based on current squad with actual player images organized by position

export const alHilalSquad = {
  // Goalkeepers
  goalkeepers: [
    {
      id: 1,
      name: 'ياسين بونو',
      nameEn: 'Yassine Bounou',
      number: 37,
      position: 'GK',
      alternativePositions: [],
      nationality: 'MA',
      age: 33,
      height: '1.92m',
      foot: 'Right',
      image: '/players_images/GoalKeepers/Bono_GK.png',
      marketValue: '€8.0M',
      contract: '2026-06-30'
    },
    {
      id: 2,
      name: 'عبدالإله الغامدي',
      nameEn: 'Abdulelah Al-Ghamdi',
      number: 1,
      position: 'GK',
      alternativePositions: [],
      nationality: 'SA',
      age: 29,
      height: '1.88m',
      foot: 'Right',
      image: '/players_images/GoalKeepers/Abdulelah_Alghamdi_GK.png',
      marketValue: '€2.0M',
      contract: '2025-06-30'
    },
    {
      id: 3,
      name: 'محمد اليامي',
      nameEn: 'Mohammed Al-Yami',
      number: 17,
      position: 'GK',
      alternativePositions: [],
      nationality: 'SA',
      age: 28,
      height: '1.85m',
      foot: 'Right',
      image: '/players_images/GoalKeepers/Mohammed_Alyami_GK.png',
      marketValue: '€1.5M',
      contract: '2025-06-30'
    }
  ],

  // Defenders
  defenders: [
    {
      id: 4,
      name: 'كاليدو كوليبالي',
      nameEn: 'Kalidou Koulibaly',
      number: 3,
      position: 'CB',
      nationality: 'SN',
      age: 33,
      height: '1.87m',
      foot: 'Right',
      image: '/players_images/Defenders/Koulibaly_CB.png',
      marketValue: '€75.0M',
      contract: '2026-06-30'
    },
    {
      id: 5,
      name: 'علي البليهي',
      nameEn: 'Ali Al-Bulaihi',
      number: 5,
      position: 'CB',
      alternativePositions: ['RB'],
      nationality: 'SA',
      age: 34,
      height: '1.88m',
      foot: 'Right',
      image: '/players_images/Defenders/Ali_Albulaihy_CB.png',
      marketValue: '€3.0M',
      contract: '2025-06-30'
    },
    {
      id: 6,
      name: 'يوسف',
      nameEn: 'Yusuf',
      number: 4,
      position: 'CB',
      alternativePositions: ['RB'],
      nationality: 'TR',
      age: 19,
      height: '1.85m',
      foot: 'Right',
      image: '/players_images/Defenders/YUSUF_CB.png',
      marketValue: '€12.0M',
      contract: '2029-06-30'
    },
    {
      id: 7,
      name: 'حسان',
      nameEn: 'Hassan',
      number: 15,
      position: 'CB',
      alternativePositions: ['RB'],
      nationality: 'SA',
      age: 26,
      height: '1.86m',
      foot: 'Right',
      image: '/players_images/Defenders/TAMBAKTI.png',
      marketValue: '€4.0M',
      contract: '2026-06-30'
    },
    {
      id: 8,
      name: 'ثيو',
      nameEn: 'Theo',
      number: 19,
      position: 'LB',
      alternativePositions: ['LWB', 'LM'],
      nationality: 'FR',
      age: 27,
      height: '1.84m',
      foot: 'Left',
      image: '/players_images/Defenders/Theo_LB.png',
      marketValue: '€60.0M',
      contract: '2028-06-30'
    },
    {
      id: 9,
      name: 'رينان لودي',
      nameEn: 'Renan Lodi',
      number: 6,
      position: 'LB',
      alternativePositions: ['LWB', 'LM'],
      nationality: 'BR',
      age: 26,
      height: '1.75m',
      foot: 'Left',
      image: '/players_images/Defenders/Renan_Lodi_LB.png',
      marketValue: '€25.0M',
      contract: '2027-06-30'
    },
    {
      id: 10,
      name: 'مطيب الحربي',
      nameEn: 'Moteb Al-Harbi',
      number: 12,
      position: 'LB',
      alternativePositions: ['LWB'],
      nationality: 'SA',
      age: 26,
      height: '1.78m',
      foot: 'Left',
      image: '/players_images/Defenders/Moteb_Alharbi_LB.png',
      marketValue: '€2.5M',
      contract: '2026-06-30'
    },
    {
      id: 11,
      name: 'جواو كانسيلو',
      nameEn: 'João Cancelo',
      number: 20,
      position: 'RB',
      alternativePositions: ['LB', 'RW', 'LWB'],
      nationality: 'PT',
      age: 30,
      height: '1.82m',
      foot: 'Right',
      image: '/players_images/Defenders/Cancelo.png',
      marketValue: '€35.0M',
      contract: '2027-06-30'
    },
    {
      id: 12,
      name: 'لاجامي',
      nameEn: 'Ali Lajami',
      number: 13,
      position: 'CB',
      alternativePositions: ['RB'],
      nationality: 'SA',
      age: 24,
      height: '1.83m',
      foot: 'Right',
      image: '/players_images/Defenders/Ali-lajami.png',
      marketValue: '€2.0M',
      contract: '2026-06-30'
    },
    {
      id: 13,
      name: 'حمد اليامي',
      nameEn: 'Hamad Al-Yami',
      number: 23,
      position: 'CB',
      alternativePositions: ['RB'],
      nationality: 'SA',
      age: 22,
      height: '1.85m',
      foot: 'Right',
      image: '/players_images/Defenders/hamad-alyami.png',
      marketValue: '€1.5M',
      contract: '2027-06-30'
    }
  ],

  // Midfielders
  midfielders: [
    {
      id: 14,
      name: 'روبين نيفيز',
      nameEn: 'Rúben Neves',
      number: 8,
      position: 'CDM',
      alternativePositions: ['CM'],
      nationality: 'PT',
      age: 27,
      height: '1.80m',
      foot: 'Right',
      image: '/players_images/Midfielders/Neves.png',
      marketValue: '€55.0M',
      contract: '2026-06-30'
    },
    {
      id: 15,
      name: 'سيرجي ميلينكوفيتش سافيتش',
      nameEn: 'Sergej Milinković-Savić',
      number: 22,
      position: 'CM',
      alternativePositions: ['CAM', 'CDM'],
      nationality: 'RS',
      age: 29,
      height: '1.91m',
      foot: 'Right',
      image: '/players_images/Midfielders/savic.png',
      marketValue: '€50.0M',
      contract: '2026-06-30'
    },
    {
      id: 16,
      name: 'عبدالإله المالكي',
      nameEn: 'Abdulelah Al-Malki',
      number: 16,
      position: 'CM',
      alternativePositions: ['CDM'],
      nationality: 'SA',
      age: 24,
      height: '1.79m',
      foot: 'Right',
      image: '/players_images/Midfielders/Abdulelah-almalki.png',
      marketValue: '€3.0M',
      contract: '2025-06-30'
    },
    {
      id: 17,
      name: 'ناصر الدوسري',
      nameEn: 'Nasser Al-Dawsari',
      number: 29,
      position: 'CAM',
      alternativePositions: ['LM', 'CM'],
      nationality: 'SA',
      age: 25,
      height: '1.71m',
      foot: 'Right',
      image: '/players_images/Midfielders/Nasser-Dawsari.png',
      marketValue: '€8.0M',
      contract: '2025-06-30'
    }
  ],

  // Forwards/Strikers
  forwards: [
    {
      id: 18,
      name: 'داروين نونيز',
      nameEn: 'Darwin Núñez',
      number: 27,
      position: 'ST',
      alternativePositions: ['LW', 'CF'],
      nationality: 'UY',
      age: 25,
      height: '1.87m',
      foot: 'Right',
      image: '/players_images/Strikers/Nunez.png',
      marketValue: '€70.0M',
      contract: '2029-06-30'
    },
    {
      id: 19,
      name: 'ماركوس ليوناردو',
      nameEn: 'Marcos Leonardo',
      number: 7,
      position: 'ST',
      alternativePositions: ['CF', 'RW'],
      nationality: 'BR',
      age: 21,
      height: '1.82m',
      foot: 'Right',
      image: '/players_images/Strikers/Leonardo.png',
      marketValue: '€35.0M',
      contract: '2028-06-30'
    },
    {
      id: 20,
      name: 'مالكوم',
      nameEn: 'Malcom',
      number: 77,
      position: 'RW',
      alternativePositions: ['LW', 'CAM'],
      nationality: 'BR',
      age: 27,
      height: '1.71m',
      foot: 'Left',
      image: '/players_images/Strikers/Malcom.png',
      marketValue: '€25.0M',
      contract: '2026-06-30'
    },
    {
      id: 21,
      name: 'عبدالله الحمدان',
      nameEn: 'Abdullah Al-Hamdan',
      number: 9,
      position: 'ST',
      alternativePositions: ['CF'],
      nationality: 'SA',
      age: 25,
      height: '1.83m',
      foot: 'Right',
      image: '/players_images/Strikers/Alhamdan.png',
      marketValue: '€4.0M',
      contract: '2026-06-30'
    },
    {
      id: 22,
      name: 'الغميل',
      nameEn: 'Al-Hgumayl',
      number: 11,
      position: 'ST',
      alternativePositions: ['RW'],
      nationality: 'SA',
      age: 23,
      height: '1.80m',
      foot: 'Right',
      image: '/players_images/Strikers/Alhgumayl.png',
      marketValue: '€3.0M',
      contract: '2025-06-30'
    },
    {
      id: 23,
      name: 'القحطاني',
      nameEn: 'Al-Qahtani',
      number: 21,
      position: 'RW',
      alternativePositions: ['ST'],
      nationality: 'SA',
      age: 24,
      height: '1.78m',
      foot: 'Right',
      image: '/players_images/Strikers/Alqahtani.png',
      marketValue: '€2.5M',
      contract: '2026-06-30'
    },
    {
      id: 24,
      name: 'كايو سيزار',
      nameEn: 'Kaio Cesar',
      number: 18,
      position: 'ST',
      alternativePositions: ['RW', 'CF'],
      nationality: 'BR',
      age: 22,
      height: '1.81m',
      foot: 'Right',
      image: '/players_images/Strikers/Kaio-Cesar.png',
      marketValue: '€8.0M',
      contract: '2027-06-30'
    },
    {
      id: 25,
      name: 'سالم',
      nameEn: 'Salem',
      number: 14,
      position: 'LW',
      alternativePositions: ['LM'],
      nationality: 'SA',
      age: 26,
      height: '1.76m',
      foot: 'Right',
      image: '/players_images/Strikers/Salem.png',
      marketValue: '€3.5M',
      contract: '2025-06-30'
    }
  ]
};

// Helper function to get players organized by categories
export const getPlayersByCategory = () => {
  return {
    goalkeepers: alHilalSquad.goalkeepers,
    defenders: alHilalSquad.defenders,
    midfielders: alHilalSquad.midfielders,
    strikers: alHilalSquad.forwards
  };
};

// Helper function to get all players in a flat array
export const getAllPlayers = () => {
  return [
    ...alHilalSquad.goalkeepers,
    ...alHilalSquad.defenders,
    ...alHilalSquad.midfielders,
    ...alHilalSquad.forwards
  ];
};

// Helper function to get players by position
export const getPlayersByPosition = (position) => {
  const allPlayers = getAllPlayers();
  return allPlayers.filter(player => 
    player.position === position || 
    player.alternativePositions.includes(position)
  );
};

// Helper function to get player by ID
export const getPlayerById = (id) => {
  const allPlayers = getAllPlayers();
  return allPlayers.find(player => player.id === id);
};

// Helper function to search players by name
export const searchPlayersByName = (searchTerm) => {
  const allPlayers = getAllPlayers();
  const term = searchTerm.toLowerCase();
  return allPlayers.filter(player => 
    player.name.toLowerCase().includes(term) ||
    player.nameEn.toLowerCase().includes(term)
  );
};

// Squad statistics
export const getSquadStats = () => {
  const allPlayers = getAllPlayers();
  const totalPlayers = allPlayers.length;
  const avgAge = Math.round(allPlayers.reduce((sum, player) => sum + player.age, 0) / totalPlayers);
  const nationalities = [...new Set(allPlayers.map(player => player.nationality))].length;
  const totalMarketValue = allPlayers.reduce((sum, player) => {
    const value = parseFloat(player.marketValue.replace('€', '').replace('M', ''));
    return sum + value;
  }, 0);

  return {
    totalPlayers,
    avgAge,
    nationalities,
    totalMarketValue: `€${totalMarketValue.toFixed(1)}M`,
    goalkeepers: alHilalSquad.goalkeepers.length,
    defenders: alHilalSquad.defenders.length,
    midfielders: alHilalSquad.midfielders.length,
    forwards: alHilalSquad.forwards.length
  };
};