/**
 * Dataset de líneas de colectivo de CABA.
 * Fuente: BA Data / TransBA — datos.gob.ar
 * En producción, esto puede reemplazarse por un fetch al API oficial.
 */
import type { BusLine } from '@/types'

export const BUS_LINES: BusLine[] = [
  {
    number: '2',
    name: 'Línea 2',
    branches: [
      { id: '2-constitucion-palermo', name: 'Constitución → Palermo' },
      { id: '2-palermo-constitucion', name: 'Palermo → Constitución' },
    ],
  },
  {
    number: '7',
    name: 'Línea 7',
    branches: [
      { id: '7-liniers-retiro', name: 'Liniers → Retiro' },
      { id: '7-retiro-liniers', name: 'Retiro → Liniers' },
    ],
  },
  {
    number: '9',
    name: 'Línea 9',
    branches: [
      { id: '9-ciudadela-retiro', name: 'Ciudadela → Retiro' },
      { id: '9-retiro-ciudadela', name: 'Retiro → Ciudadela' },
    ],
  },
  {
    number: '10',
    name: 'Línea 10',
    branches: [
      { id: '10-floresta-retiro', name: 'Floresta → Retiro' },
      { id: '10-retiro-floresta', name: 'Retiro → Floresta' },
    ],
  },
  {
    number: '12',
    name: 'Línea 12',
    branches: [
      { id: '12-retiro-congreso-wilde', name: 'Retiro / Congreso → Wilde' },
      { id: '12-wilde-retiro', name: 'Wilde → Retiro' },
    ],
  },
  {
    number: '15',
    name: 'Línea 15',
    branches: [
      { id: '15-jardin-botanico-parque-chacabuco', name: 'Jardín Botánico → Parque Chacabuco' },
      { id: '15-parque-chacabuco-jardin-botanico', name: 'Parque Chacabuco → Jardín Botánico' },
    ],
  },
  {
    number: '17',
    name: 'Línea 17',
    branches: [
      { id: '17-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '17-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '19',
    name: 'Línea 19',
    branches: [
      { id: '19-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
      { id: '19-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
    ],
  },
  {
    number: '21',
    name: 'Línea 21',
    branches: [
      { id: '21-congreso-ezpeleta', name: 'Congreso → Ezpeleta' },
      { id: '21-ezpeleta-congreso', name: 'Ezpeleta → Congreso' },
    ],
  },
  {
    number: '24',
    name: 'Línea 24',
    branches: [
      { id: '24-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
      { id: '24-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
    ],
  },
  {
    number: '26',
    name: 'Línea 26',
    branches: [
      { id: '26-retiro-villa-soldati', name: 'Retiro → Villa Soldati' },
      { id: '26-villa-soldati-retiro', name: 'Villa Soldati → Retiro' },
    ],
  },
  {
    number: '28',
    name: 'Línea 28',
    branches: [
      { id: '28-congreso-villa-del-parque', name: 'Congreso → Villa del Parque' },
      { id: '28-villa-del-parque-congreso', name: 'Villa del Parque → Congreso' },
    ],
  },
  {
    number: '29',
    name: 'Línea 29',
    branches: [
      { id: '29-plaza-italia-constitucion', name: 'Plaza Italia → Constitución' },
      { id: '29-constitucion-plaza-italia', name: 'Constitución → Plaza Italia' },
    ],
  },
  {
    number: '36',
    name: 'Línea 36',
    branches: [
      { id: '36-retiro-la-boca', name: 'Retiro → La Boca' },
      { id: '36-la-boca-retiro', name: 'La Boca → Retiro' },
    ],
  },
  {
    number: '37',
    name: 'Línea 37',
    branches: [
      { id: '37-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
      { id: '37-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
    ],
  },
  {
    number: '39',
    name: 'Línea 39',
    branches: [
      { id: '39-retiro-mataderos', name: 'Retiro → Mataderos' },
      { id: '39-mataderos-retiro', name: 'Mataderos → Retiro' },
    ],
  },
  {
    number: '41',
    name: 'Línea 41',
    branches: [
      { id: '41-constitucion-flores', name: 'Constitución → Flores' },
      { id: '41-flores-constitucion', name: 'Flores → Constitución' },
    ],
  },
  {
    number: '42',
    name: 'Línea 42',
    branches: [
      { id: '42-retiro-villa-luro', name: 'Retiro → Villa Luro' },
      { id: '42-villa-luro-retiro', name: 'Villa Luro → Retiro' },
    ],
  },
  {
    number: '45',
    name: 'Línea 45',
    branches: [
      { id: '45-retiro-palermo-chacarita', name: 'Retiro / Palermo → Chacarita' },
      { id: '45-chacarita-retiro', name: 'Chacarita → Retiro' },
    ],
  },
  {
    number: '47',
    name: 'Línea 47',
    branches: [
      { id: '47-avellaneda-palermo', name: 'Avellaneda → Palermo' },
      { id: '47-palermo-avellaneda', name: 'Palermo → Avellaneda' },
    ],
  },
  {
    number: '50',
    name: 'Línea 50',
    branches: [
      { id: '50-san-cristobal-villa-del-parque', name: 'San Cristóbal → Villa del Parque' },
      { id: '50-villa-del-parque-san-cristobal', name: 'Villa del Parque → San Cristóbal' },
    ],
  },
  {
    number: '55',
    name: 'Línea 55',
    branches: [
      { id: '55-retiro-liniers', name: 'Retiro → Liniers' },
      { id: '55-liniers-retiro', name: 'Liniers → Retiro' },
    ],
  },
  {
    number: '56',
    name: 'Línea 56',
    branches: [
      { id: '56-retiro-parque-chacabuco', name: 'Retiro → Parque Chacabuco' },
      { id: '56-parque-chacabuco-retiro', name: 'Parque Chacabuco → Retiro' },
    ],
  },
  {
    number: '59',
    name: 'Línea 59',
    branches: [
      { id: '59-constitucion-villa-devoto', name: 'Constitución → Villa Devoto' },
      { id: '59-villa-devoto-constitucion', name: 'Villa Devoto → Constitución' },
    ],
  },
  {
    number: '60',
    name: 'Línea 60',
    branches: [
      { id: '60-constitucion-palermo-olivos', name: 'Constitución / Palermo → Olivos' },
      { id: '60-olivos-constitucion', name: 'Olivos → Constitución' },
    ],
  },
  {
    number: '61',
    name: 'Línea 61',
    branches: [
      { id: '61-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
      { id: '61-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
    ],
  },
  {
    number: '62',
    name: 'Línea 62',
    branches: [
      { id: '62-retiro-liniers', name: 'Retiro → Liniers' },
      { id: '62-liniers-retiro', name: 'Liniers → Retiro' },
    ],
  },
  {
    number: '63',
    name: 'Línea 63',
    branches: [
      { id: '63-retiro-caballito', name: 'Retiro → Caballito' },
      { id: '63-caballito-retiro', name: 'Caballito → Retiro' },
    ],
  },
  {
    number: '64',
    name: 'Línea 64',
    branches: [
      { id: '64-constitucion-flores', name: 'Constitución → Flores' },
      { id: '64-flores-constitucion', name: 'Flores → Constitución' },
    ],
  },
  {
    number: '67',
    name: 'Línea 67',
    branches: [
      { id: '67-retiro-liniers', name: 'Retiro → Liniers' },
      { id: '67-liniers-retiro', name: 'Liniers → Retiro' },
    ],
  },
  {
    number: '68',
    name: 'Línea 68',
    branches: [
      { id: '68-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '68-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '71',
    name: 'Línea 71',
    branches: [
      { id: '71-plaza-de-mayo-devoto', name: 'Plaza de Mayo → Villa Devoto' },
      { id: '71-devoto-plaza-de-mayo', name: 'Villa Devoto → Plaza de Mayo' },
    ],
  },
  {
    number: '74',
    name: 'Línea 74',
    branches: [
      { id: '74-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '74-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '75',
    name: 'Línea 75',
    branches: [
      { id: '75-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
      { id: '75-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
    ],
  },
  {
    number: '76',
    name: 'Línea 76',
    branches: [
      { id: '76-retiro-flores', name: 'Retiro → Flores' },
      { id: '76-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '86',
    name: 'Línea 86',
    branches: [
      { id: '86-constitucion-la-boca', name: 'Constitución → La Boca' },
      { id: '86-la-boca-constitucion', name: 'La Boca → Constitución' },
    ],
  },
  {
    number: '88',
    name: 'Línea 88',
    branches: [
      { id: '88-retiro-haedo', name: 'Retiro → Haedo' },
      { id: '88-haedo-retiro', name: 'Haedo → Retiro' },
    ],
  },
  {
    number: '92',
    name: 'Línea 92',
    branches: [
      { id: '92-retiro-mataderos', name: 'Retiro → Mataderos' },
      { id: '92-mataderos-retiro', name: 'Mataderos → Retiro' },
    ],
  },
  {
    number: '95',
    name: 'Línea 95',
    branches: [
      { id: '95-constitucion-lugano', name: 'Constitución → Lugano' },
      { id: '95-lugano-constitucion', name: 'Lugano → Constitución' },
    ],
  },
  {
    number: '99',
    name: 'Línea 99',
    branches: [
      { id: '99-retiro-caballito', name: 'Retiro → Caballito' },
      { id: '99-caballito-retiro', name: 'Caballito → Retiro' },
    ],
  },
  {
    number: '100',
    name: 'Línea 100',
    branches: [
      { id: '100-retiro-liniers', name: 'Retiro → Liniers' },
      { id: '100-liniers-retiro', name: 'Liniers → Retiro' },
    ],
  },
  {
    number: '101',
    name: 'Línea 101',
    branches: [
      { id: '101-congreso-villa-del-parque', name: 'Congreso → Villa del Parque' },
      { id: '101-villa-del-parque-congreso', name: 'Villa del Parque → Congreso' },
    ],
  },
  {
    number: '102',
    name: 'Línea 102',
    branches: [
      { id: '102-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
      { id: '102-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
    ],
  },
  {
    number: '103',
    name: 'Línea 103',
    branches: [
      { id: '103-retiro-palermo', name: 'Retiro → Palermo' },
      { id: '103-palermo-retiro', name: 'Palermo → Retiro' },
    ],
  },
  {
    number: '105',
    name: 'Línea 105',
    branches: [
      { id: '105-retiro-mataderos', name: 'Retiro → Mataderos' },
      { id: '105-mataderos-retiro', name: 'Mataderos → Retiro' },
    ],
  },
  {
    number: '106',
    name: 'Línea 106',
    branches: [
      { id: '106-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '106-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '107',
    name: 'Línea 107',
    branches: [
      { id: '107-retiro-flores', name: 'Retiro → Flores' },
      { id: '107-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '109',
    name: 'Línea 109',
    branches: [
      { id: '109-plaza-italia-don-torcuato', name: 'Plaza Italia → Don Torcuato' },
      { id: '109-don-torcuato-plaza-italia', name: 'Don Torcuato → Plaza Italia' },
      { id: '109-plaza-italia-villa-del-parque', name: 'Plaza Italia → Villa del Parque' },
      { id: '109-villa-del-parque-plaza-italia', name: 'Villa del Parque → Plaza Italia' },
    ],
  },
  {
    number: '110',
    name: 'Línea 110',
    branches: [
      { id: '110-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
      { id: '110-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
    ],
  },
  {
    number: '111',
    name: 'Línea 111',
    branches: [
      { id: '111-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
      { id: '111-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
    ],
  },
  {
    number: '114',
    name: 'Línea 114',
    branches: [
      { id: '114-retiro-flores', name: 'Retiro → Flores' },
      { id: '114-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '115',
    name: 'Línea 115',
    branches: [
      { id: '115-retiro-mataderos', name: 'Retiro → Mataderos' },
      { id: '115-mataderos-retiro', name: 'Mataderos → Retiro' },
    ],
  },
  {
    number: '117',
    name: 'Línea 117',
    branches: [
      { id: '117-plaza-de-mayo-villa-del-parque', name: 'Plaza de Mayo → Villa del Parque' },
      { id: '117-villa-del-parque-plaza-de-mayo', name: 'Villa del Parque → Plaza de Mayo' },
    ],
  },
  {
    number: '118',
    name: 'Línea 118',
    branches: [
      { id: '118-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '118-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '119',
    name: 'Línea 119',
    branches: [
      { id: '119-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
      { id: '119-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
    ],
  },
  {
    number: '123',
    name: 'Línea 123',
    branches: [
      { id: '123-constitucion-san-justo', name: 'Constitución → San Justo' },
      { id: '123-san-justo-constitucion', name: 'San Justo → Constitución' },
    ],
  },
  {
    number: '126',
    name: 'Línea 126',
    branches: [
      { id: '126-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '126-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '127',
    name: 'Línea 127',
    branches: [
      { id: '127-retiro-flores', name: 'Retiro → Flores' },
      { id: '127-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '128',
    name: 'Línea 128',
    branches: [
      { id: '128-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '128-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '130',
    name: 'Línea 130',
    branches: [
      { id: '130-retiro-san-martin', name: 'Retiro → San Martín' },
      { id: '130-san-martin-retiro', name: 'San Martín → Retiro' },
    ],
  },
  {
    number: '132',
    name: 'Línea 132',
    branches: [
      { id: '132-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '132-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '133',
    name: 'Línea 133',
    branches: [
      { id: '133-retiro-flores', name: 'Retiro → Flores' },
      { id: '133-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '136',
    name: 'Línea 136',
    branches: [
      { id: '136-retiro-caballito', name: 'Retiro → Caballito' },
      { id: '136-caballito-retiro', name: 'Caballito → Retiro' },
    ],
  },
  {
    number: '140',
    name: 'Línea 140',
    branches: [
      { id: '140-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '140-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '141',
    name: 'Línea 141',
    branches: [
      { id: '141-retiro-flores', name: 'Retiro → Flores' },
      { id: '141-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '143',
    name: 'Línea 143',
    branches: [
      { id: '143-retiro-lugano', name: 'Retiro → Lugano' },
      { id: '143-lugano-retiro', name: 'Lugano → Retiro' },
    ],
  },
  {
    number: '146',
    name: 'Línea 146',
    branches: [
      { id: '146-retiro-mataderos', name: 'Retiro → Mataderos' },
      { id: '146-mataderos-retiro', name: 'Mataderos → Retiro' },
    ],
  },
  {
    number: '150',
    name: 'Línea 150',
    branches: [
      { id: '150-retiro-jose-c-paz', name: 'Retiro → José C. Paz' },
      { id: '150-jose-c-paz-retiro', name: 'José C. Paz → Retiro' },
    ],
  },
  {
    number: '151',
    name: 'Línea 151',
    branches: [
      { id: '151-retiro-liniers', name: 'Retiro → Liniers' },
      { id: '151-liniers-retiro', name: 'Liniers → Retiro' },
    ],
  },
  {
    number: '152',
    name: 'Línea 152',
    branches: [
      { id: '152-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '152-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '153',
    name: 'Línea 153',
    branches: [
      { id: '153-constitucion-liniers', name: 'Constitución → Liniers' },
      { id: '153-liniers-constitucion', name: 'Liniers → Constitución' },
    ],
  },
  {
    number: '155',
    name: 'Línea 155',
    branches: [
      { id: '155-retiro-mataderos', name: 'Retiro → Mataderos' },
      { id: '155-mataderos-retiro', name: 'Mataderos → Retiro' },
    ],
  },
  {
    number: '160',
    name: 'Línea 160',
    branches: [
      { id: '160-retiro-caballito', name: 'Retiro → Caballito' },
      { id: '160-caballito-retiro', name: 'Caballito → Retiro' },
    ],
  },
  {
    number: '161',
    name: 'Línea 161',
    branches: [
      { id: '161-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
      { id: '161-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
    ],
  },
  {
    number: '166',
    name: 'Línea 166',
    branches: [
      { id: '166-retiro-flores', name: 'Retiro → Flores' },
      { id: '166-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '168',
    name: 'Línea 168',
    branches: [
      { id: '168-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '168-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '170',
    name: 'Línea 170',
    branches: [
      { id: '170-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
      { id: '170-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
    ],
  },
  {
    number: '176',
    name: 'Línea 176',
    branches: [
      { id: '176-retiro-flores', name: 'Retiro → Flores' },
      { id: '176-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
  {
    number: '180',
    name: 'Línea 180',
    branches: [
      { id: '180-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
      { id: '180-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
    ],
  },
  {
    number: '184',
    name: 'Línea 184',
    branches: [
      { id: '184-retiro-flores', name: 'Retiro → Flores' },
      { id: '184-flores-retiro', name: 'Flores → Retiro' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function searchLines(query: string): BusLine[] {
  const q = query.trim().toLowerCase()
  if (!q) return BUS_LINES
  return BUS_LINES.filter(
    (l) =>
      l.number.startsWith(q) ||
      l.name.toLowerCase().includes(q) ||
      l.branches.some((b) => b.name.toLowerCase().includes(q)),
  )
}

export function getLineByNumber(number: string): BusLine | undefined {
  return BUS_LINES.find((l) => l.number === number)
}
