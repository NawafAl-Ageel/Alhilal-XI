// Simplified prizes data model (seasonal) - 5 prizes max, 600 points max
// Based on realistic fan engagement (max ~700 points per season)

export const SEASON_ID = '2025-2026';

export const prizeTiers = [
  {
    id: 'season',
    name: 'Season Rewards',
    nameAr: 'جوائز الموسم',
    levels: [
      {
        level: 1,
        pointsRequired: 100,
        rewards: [
          {
            id: 'badge_fan',
            type: 'digital_badge',
            name: 'Al-Hilal Fan Badge',
            nameAr: 'شارة مشجع الهلال',
            description: 'Digital badge for reaching 100 points.',
            descAr: 'شارة رقمية للوصول إلى 100 نقطة.',
            imageUrl: '/images/prizes/badges/fan_badge.png'
          }
        ]
      },
      {
        level: 2,
        pointsRequired: 200,
        rewards: [
          {
            id: 'restaurant_coupon',
            type: 'partner_service',
            name: 'Restaurant Coupon',
            nameAr: 'كوبون جاهز',
            description: 'Discount coupon for partner restaurants.',
            descAr: 'قسيمة خصم للمطاعم الشريكة.',
            imageUrl: '/images/prizes/partners/restaurant_coupon.png'
          }
        ]
      },
      {
        level: 3,
        pointsRequired: 350,
        rewards: [
          {
            id: 'scarf_or_hat',
            type: 'physical',
            name: 'Al-Hilal Scarf or Hat',
            nameAr: 'وشاح أو قبعة الهلال',
            description: 'Official Al-Hilal scarf or hat (your choice).',
            descAr: 'وشاح أو قبعة الهلال الرسمية (حسب اختيارك).',
            imageUrl: '/images/prizes/physical/scarf_hat.png'
          }
        ]
      },
      {
        level: 4,
        pointsRequired: 480,
        rewards: [
          {
            id: 'match_ticket',
            type: 'physical',
            name: 'Match Ticket',
            nameAr: 'تذكرة مباراة',
            description: 'Free ticket to an Al-Hilal home match.',
            descAr: 'تذكرة مجانية لمباراة الهلال على أرضه.',
            imageUrl: '/images/prizes/physical/match_ticket.png'
          }
        ]
      },
      {
        level: 5,
        pointsRequired: 600,
        rewards: [
          {
            id: 'signed_tshirt',
            type: 'physical',
            name: 'Signed T-Shirt',
            nameAr: 'تيشيرت موقّع',
            description: 'Official Al-Hilal t-shirt signed by a player.',
            descAr: 'تيشيرت الهلال الرسمي موقّع من أحد اللاعبين.',
            imageUrl: '/images/prizes/physical/signed_tshirt.png'
          }
        ]
      }
    ]
  }
];

export const initialSeasonPoints = {
  seasonId: SEASON_ID,
  totalPoints: 0,
  lastUpdated: null
};