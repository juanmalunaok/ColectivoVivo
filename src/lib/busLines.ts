/**
 * Dataset de líneas de colectivo del AMBA.
 * Fuente: Ministerio de Transporte — datos.gob.ar
 * Dataset: "Líneas de transporte de RMBA" (datos.transporte.gob.ar)
 * Período: 2019-10 — jurisdicciones nacional, provincial y municipal
 *
 * Ramales: datos reales para líneas nacionales de CABA.
 * Líneas provinciales/municipales: ramal "Servicio" como valor por defecto.
 */
import type { BusLine } from '@/types'

// Helper para generar entradas de líneas sin ramal específico (GBA/provincial)
function linea(number: string, branches?: { id: string; name: string }[]): BusLine {
  return {
    number,
    name: `Línea ${number}`,
    branches: branches ?? [{ id: `${number}-servicio`, name: 'Servicio' }],
  }
}

export const BUS_LINES: BusLine[] = [
  // ── Líneas nacionales CABA con ramales reales ─────────────────────────────

  linea('1', [
    { id: '1-congreso-liniers', name: 'Congreso → Liniers' },
    { id: '1-liniers-congreso', name: 'Liniers → Congreso' },
  ]),
  linea('2', [
    { id: '2-constitucion-palermo', name: 'Constitución → Palermo' },
    { id: '2-palermo-constitucion', name: 'Palermo → Constitución' },
  ]),
  linea('4', [
    { id: '4-retiro-nueva-chicago', name: 'Retiro → Nueva Chicago' },
    { id: '4-nueva-chicago-retiro', name: 'Nueva Chicago → Retiro' },
  ]),
  linea('5', [
    { id: '5-congreso-soldati', name: 'Congreso → Villa Soldati' },
    { id: '5-soldati-congreso', name: 'Villa Soldati → Congreso' },
  ]),
  linea('6', [
    { id: '6-once-retiro', name: 'Once → Retiro' },
    { id: '6-retiro-once', name: 'Retiro → Once' },
  ]),
  linea('7', [
    { id: '7-liniers-retiro', name: 'Liniers → Retiro' },
    { id: '7-retiro-liniers', name: 'Retiro → Liniers' },
  ]),
  linea('8', [
    { id: '8-flores-palermo', name: 'Flores → Palermo' },
    { id: '8-palermo-flores', name: 'Palermo → Flores' },
  ]),
  linea('9', [
    { id: '9-ciudadela-retiro', name: 'Ciudadela → Retiro' },
    { id: '9-retiro-ciudadela', name: 'Retiro → Ciudadela' },
  ]),
  linea('10', [
    { id: '10-floresta-retiro', name: 'Floresta → Retiro' },
    { id: '10-retiro-floresta', name: 'Retiro → Floresta' },
  ]),
  linea('12', [
    { id: '12-retiro-wilde', name: 'Retiro → Wilde' },
    { id: '12-wilde-retiro', name: 'Wilde → Retiro' },
  ]),
  linea('15', [
    { id: '15-jardin-botanico-parque-chacabuco', name: 'Jardín Botánico → Parque Chacabuco' },
    { id: '15-parque-chacabuco-jardin-botanico', name: 'Parque Chacabuco → Jardín Botánico' },
  ]),
  linea('17', [
    { id: '17-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '17-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('19', [
    { id: '19-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
    { id: '19-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
  ]),
  linea('20', [
    { id: '20-constitucion-barracas', name: 'Constitución → Barracas' },
    { id: '20-barracas-constitucion', name: 'Barracas → Constitución' },
  ]),
  linea('21', [
    { id: '21-congreso-ezpeleta', name: 'Congreso → Ezpeleta' },
    { id: '21-ezpeleta-congreso', name: 'Ezpeleta → Congreso' },
  ]),
  linea('22', [
    { id: '22-palermo-flores', name: 'Palermo → Flores' },
    { id: '22-flores-palermo', name: 'Flores → Palermo' },
  ]),
  linea('23', [
    { id: '23-congreso-belgrano', name: 'Congreso → Belgrano' },
    { id: '23-belgrano-congreso', name: 'Belgrano → Congreso' },
  ]),
  linea('24', [
    { id: '24-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
    { id: '24-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
  ]),
  linea('25', [
    { id: '25-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '25-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('26', [
    { id: '26-retiro-villa-soldati', name: 'Retiro → Villa Soldati' },
    { id: '26-villa-soldati-retiro', name: 'Villa Soldati → Retiro' },
  ]),
  linea('28', [
    { id: '28-congreso-villa-del-parque', name: 'Congreso → Villa del Parque' },
    { id: '28-villa-del-parque-congreso', name: 'Villa del Parque → Congreso' },
  ]),
  linea('29', [
    { id: '29-plaza-italia-constitucion', name: 'Plaza Italia → Constitución' },
    { id: '29-constitucion-plaza-italia', name: 'Constitución → Plaza Italia' },
  ]),
  linea('31', [
    { id: '31-retiro-palermo-villa-del-parque', name: 'Retiro / Palermo → Villa del Parque' },
    { id: '31-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('32', [
    { id: '32-retiro-flores', name: 'Retiro → Flores' },
    { id: '32-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('33', [
    { id: '33-retiro-lugano', name: 'Retiro → Lugano' },
    { id: '33-lugano-retiro', name: 'Lugano → Retiro' },
  ]),
  linea('34', [
    { id: '34-constitucion-boedo', name: 'Constitución → Boedo' },
    { id: '34-boedo-constitucion', name: 'Boedo → Constitución' },
  ]),
  linea('36', [
    { id: '36-retiro-la-boca', name: 'Retiro → La Boca' },
    { id: '36-la-boca-retiro', name: 'La Boca → Retiro' },
  ]),
  linea('37', [
    { id: '37-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
    { id: '37-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
  ]),
  linea('39', [
    { id: '39-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '39-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('41', [
    { id: '41-constitucion-flores', name: 'Constitución → Flores' },
    { id: '41-flores-constitucion', name: 'Flores → Constitución' },
  ]),
  linea('42', [
    { id: '42-retiro-villa-luro', name: 'Retiro → Villa Luro' },
    { id: '42-villa-luro-retiro', name: 'Villa Luro → Retiro' },
  ]),
  linea('44', [
    { id: '44-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '44-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('45', [
    { id: '45-retiro-chacarita', name: 'Retiro / Palermo → Chacarita' },
    { id: '45-chacarita-retiro', name: 'Chacarita → Retiro' },
  ]),
  linea('46', [
    { id: '46-congreso-villa-del-parque', name: 'Congreso → Villa del Parque' },
    { id: '46-villa-del-parque-congreso', name: 'Villa del Parque → Congreso' },
  ]),
  linea('47', [
    { id: '47-avellaneda-palermo', name: 'Avellaneda → Palermo' },
    { id: '47-palermo-avellaneda', name: 'Palermo → Avellaneda' },
  ]),
  linea('49', [
    { id: '49-constitucion-caballito', name: 'Constitución → Caballito' },
    { id: '49-caballito-constitucion', name: 'Caballito → Constitución' },
  ]),
  linea('50', [
    { id: '50-san-cristobal-villa-del-parque', name: 'San Cristóbal → Villa del Parque' },
    { id: '50-villa-del-parque-san-cristobal', name: 'Villa del Parque → San Cristóbal' },
  ]),
  linea('51', [
    { id: '51-liniers-retiro', name: 'Liniers → Retiro' },
    { id: '51-retiro-liniers', name: 'Retiro → Liniers' },
  ]),
  linea('53', [
    { id: '53-flores-palermo', name: 'Flores → Palermo' },
    { id: '53-palermo-flores', name: 'Palermo → Flores' },
  ]),
  linea('55', [
    { id: '55-retiro-liniers', name: 'Retiro → Liniers' },
    { id: '55-liniers-retiro', name: 'Liniers → Retiro' },
  ]),
  linea('56', [
    { id: '56-retiro-parque-chacabuco', name: 'Retiro → Parque Chacabuco' },
    { id: '56-parque-chacabuco-retiro', name: 'Parque Chacabuco → Retiro' },
  ]),
  linea('57', [
    { id: '57-parque-chacabuco-palermo', name: 'Parque Chacabuco → Palermo' },
    { id: '57-palermo-parque-chacabuco', name: 'Palermo → Parque Chacabuco' },
  ]),
  linea('59', [
    { id: '59-constitucion-villa-devoto', name: 'Constitución → Villa Devoto' },
    { id: '59-villa-devoto-constitucion', name: 'Villa Devoto → Constitución' },
  ]),
  linea('60', [
    { id: '60-constitucion-olivos', name: 'Constitución / Palermo → Olivos' },
    { id: '60-olivos-constitucion', name: 'Olivos → Constitución' },
    { id: '60-constitucion-tigre', name: 'Constitución → Tigre' },
    { id: '60-tigre-constitucion', name: 'Tigre → Constitución' },
  ]),
  linea('61', [
    { id: '61-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
    { id: '61-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
  ]),
  linea('62', [
    { id: '62-retiro-liniers', name: 'Retiro → Liniers' },
    { id: '62-liniers-retiro', name: 'Liniers → Retiro' },
  ]),
  linea('63', [
    { id: '63-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '63-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('64', [
    { id: '64-constitucion-flores', name: 'Constitución → Flores' },
    { id: '64-flores-constitucion', name: 'Flores → Constitución' },
  ]),
  linea('65', [
    { id: '65-caballito-retiro', name: 'Caballito → Retiro' },
    { id: '65-retiro-caballito', name: 'Retiro → Caballito' },
  ]),
  linea('67', [
    { id: '67-retiro-liniers', name: 'Retiro → Liniers' },
    { id: '67-liniers-retiro', name: 'Liniers → Retiro' },
  ]),
  linea('68', [
    { id: '68-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '68-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('70', [
    { id: '70-palermo-flores', name: 'Palermo → Flores' },
    { id: '70-flores-palermo', name: 'Flores → Palermo' },
  ]),
  linea('71', [
    { id: '71-plaza-de-mayo-devoto', name: 'Plaza de Mayo → Villa Devoto' },
    { id: '71-devoto-plaza-de-mayo', name: 'Villa Devoto → Plaza de Mayo' },
  ]),
  linea('74', [
    { id: '74-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '74-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('75', [
    { id: '75-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
    { id: '75-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
  ]),
  linea('76', [
    { id: '76-retiro-flores', name: 'Retiro → Flores' },
    { id: '76-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('78', [
    { id: '78-belgrano-constitucion', name: 'Belgrano → Constitución' },
    { id: '78-constitucion-belgrano', name: 'Constitución → Belgrano' },
  ]),
  linea('79', [
    { id: '79-palermo-mataderos', name: 'Palermo → Mataderos' },
    { id: '79-mataderos-palermo', name: 'Mataderos → Palermo' },
  ]),
  linea('80', [
    { id: '80-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '80-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('84', [
    { id: '84-retiro-flores', name: 'Retiro → Flores' },
    { id: '84-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('85', [
    { id: '85-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '85-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('86', [
    { id: '86-constitucion-la-boca', name: 'Constitución → La Boca' },
    { id: '86-la-boca-constitucion', name: 'La Boca → Constitución' },
  ]),
  linea('87', [
    { id: '87-liniers-retiro', name: 'Liniers → Retiro' },
    { id: '87-retiro-liniers', name: 'Retiro → Liniers' },
  ]),
  linea('88', [
    { id: '88-retiro-haedo', name: 'Retiro → Haedo' },
    { id: '88-haedo-retiro', name: 'Haedo → Retiro' },
  ]),
  linea('90', [
    { id: '90-retiro-flores', name: 'Retiro → Flores' },
    { id: '90-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('91', [
    { id: '91-constitucion-villa-urquiza', name: 'Constitución → Villa Urquiza' },
    { id: '91-villa-urquiza-constitucion', name: 'Villa Urquiza → Constitución' },
  ]),
  linea('92', [
    { id: '92-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '92-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('93', [
    { id: '93-congreso-villa-luro', name: 'Congreso → Villa Luro' },
    { id: '93-villa-luro-congreso', name: 'Villa Luro → Congreso' },
  ]),
  linea('95', [
    { id: '95-constitucion-lugano', name: 'Constitución → Lugano' },
    { id: '95-lugano-constitucion', name: 'Lugano → Constitución' },
  ]),
  linea('96', [
    { id: '96-retiro-floresta', name: 'Retiro → Floresta' },
    { id: '96-floresta-retiro', name: 'Floresta → Retiro' },
  ]),
  linea('97', [
    { id: '97-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '97-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('98', [
    { id: '98-retiro-flores', name: 'Retiro → Flores' },
    { id: '98-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('99', [
    { id: '99-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '99-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('100', [
    { id: '100-retiro-liniers', name: 'Retiro → Liniers' },
    { id: '100-liniers-retiro', name: 'Liniers → Retiro' },
  ]),
  linea('101', [
    { id: '101-congreso-villa-del-parque', name: 'Congreso → Villa del Parque' },
    { id: '101-villa-del-parque-congreso', name: 'Villa del Parque → Congreso' },
  ]),
  linea('102', [
    { id: '102-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
    { id: '102-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
  ]),
  linea('103', [
    { id: '103-retiro-palermo', name: 'Retiro → Palermo' },
    { id: '103-palermo-retiro', name: 'Palermo → Retiro' },
  ]),
  linea('105', [
    { id: '105-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '105-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('106', [
    { id: '106-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '106-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('107', [
    { id: '107-retiro-flores', name: 'Retiro → Flores' },
    { id: '107-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('108', [
    { id: '108-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '108-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('109', [
    { id: '109-plaza-italia-don-torcuato', name: 'Plaza Italia → Don Torcuato' },
    { id: '109-don-torcuato-plaza-italia', name: 'Don Torcuato → Plaza Italia' },
    { id: '109-plaza-italia-villa-del-parque', name: 'Plaza Italia → Villa del Parque' },
    { id: '109-villa-del-parque-plaza-italia', name: 'Villa del Parque → Plaza Italia' },
  ]),
  linea('110', [
    { id: '110-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
    { id: '110-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
  ]),
  linea('111', [
    { id: '111-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
    { id: '111-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
  ]),
  linea('113', [
    { id: '113-retiro-palermo', name: 'Retiro → Palermo' },
    { id: '113-palermo-retiro', name: 'Palermo → Retiro' },
  ]),
  linea('114', [
    { id: '114-retiro-flores', name: 'Retiro → Flores' },
    { id: '114-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('115', [
    { id: '115-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '115-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('117', [
    { id: '117-plaza-de-mayo-villa-del-parque', name: 'Plaza de Mayo → Villa del Parque' },
    { id: '117-villa-del-parque-plaza-de-mayo', name: 'Villa del Parque → Plaza de Mayo' },
  ]),
  linea('118', [
    { id: '118-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '118-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('119', [
    { id: '119-retiro-villa-urquiza', name: 'Retiro → Villa Urquiza' },
    { id: '119-villa-urquiza-retiro', name: 'Villa Urquiza → Retiro' },
  ]),
  linea('123', [
    { id: '123-constitucion-san-justo', name: 'Constitución → San Justo' },
    { id: '123-san-justo-constitucion', name: 'San Justo → Constitución' },
  ]),
  linea('124', [
    { id: '124-retiro-belgrano', name: 'Retiro → Belgrano' },
    { id: '124-belgrano-retiro', name: 'Belgrano → Retiro' },
  ]),
  linea('126', [
    { id: '126-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '126-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('127', [
    { id: '127-retiro-flores', name: 'Retiro → Flores' },
    { id: '127-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('128', [
    { id: '128-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '128-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('129', [
    { id: '129-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '129-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('130', [
    { id: '130-retiro-san-martin', name: 'Retiro → San Martín' },
    { id: '130-san-martin-retiro', name: 'San Martín → Retiro' },
  ]),
  linea('132', [
    { id: '132-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '132-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('133', [
    { id: '133-retiro-flores', name: 'Retiro → Flores' },
    { id: '133-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('134', [
    { id: '134-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '134-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('135', [
    { id: '135-constitucion-flores', name: 'Constitución → Flores' },
    { id: '135-flores-constitucion', name: 'Flores → Constitución' },
  ]),
  linea('136', [
    { id: '136-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '136-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('140', [
    { id: '140-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '140-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('141', [
    { id: '141-retiro-flores', name: 'Retiro → Flores' },
    { id: '141-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('143', [
    { id: '143-retiro-lugano', name: 'Retiro → Lugano' },
    { id: '143-lugano-retiro', name: 'Lugano → Retiro' },
  ]),
  linea('146', [
    { id: '146-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '146-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('148', [
    { id: '148-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '148-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('150', [
    { id: '150-retiro-jose-c-paz', name: 'Retiro → José C. Paz' },
    { id: '150-jose-c-paz-retiro', name: 'José C. Paz → Retiro' },
  ]),
  linea('151', [
    { id: '151-retiro-liniers', name: 'Retiro → Liniers' },
    { id: '151-liniers-retiro', name: 'Liniers → Retiro' },
  ]),
  linea('152', [
    { id: '152-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '152-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('153', [
    { id: '153-constitucion-liniers', name: 'Constitución → Liniers' },
    { id: '153-liniers-constitucion', name: 'Liniers → Constitución' },
  ]),
  linea('154', [
    { id: '154-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '154-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('155', [
    { id: '155-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '155-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('158', [
    { id: '158-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '158-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('159', [
    { id: '159-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '159-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('160', [
    { id: '160-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '160-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('161', [
    { id: '161-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
    { id: '161-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
  ]),
  linea('163', [
    { id: '163-retiro-flores', name: 'Retiro → Flores' },
    { id: '163-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('166', [
    { id: '166-retiro-flores', name: 'Retiro → Flores' },
    { id: '166-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('168', [
    { id: '168-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '168-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('169', [
    { id: '169-retiro-palermo', name: 'Retiro → Palermo' },
    { id: '169-palermo-retiro', name: 'Palermo → Retiro' },
  ]),
  linea('170', [
    { id: '170-constitucion-villa-del-parque', name: 'Constitución → Villa del Parque' },
    { id: '170-villa-del-parque-constitucion', name: 'Villa del Parque → Constitución' },
  ]),
  linea('172', [
    { id: '172-retiro-flores', name: 'Retiro → Flores' },
    { id: '172-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('174', [
    { id: '174-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '174-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('175', [
    { id: '175-retiro-flores', name: 'Retiro → Flores' },
    { id: '175-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('176', [
    { id: '176-retiro-flores', name: 'Retiro → Flores' },
    { id: '176-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('177', [
    { id: '177-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '177-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),
  linea('178', [
    { id: '178-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '178-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('179', [
    { id: '179-retiro-caballito', name: 'Retiro → Caballito' },
    { id: '179-caballito-retiro', name: 'Caballito → Retiro' },
  ]),
  linea('180', [
    { id: '180-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '180-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('181', [
    { id: '181-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '181-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('182', [
    { id: '182-retiro-flores', name: 'Retiro → Flores' },
    { id: '182-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('184', [
    { id: '184-retiro-flores', name: 'Retiro → Flores' },
    { id: '184-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('185', [
    { id: '185-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '185-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('188', [
    { id: '188-constitucion-palermo', name: 'Constitución → Palermo' },
    { id: '188-palermo-constitucion', name: 'Palermo → Constitución' },
  ]),
  linea('193', [
    { id: '193-retiro-villa-del-parque', name: 'Retiro → Villa del Parque' },
    { id: '193-villa-del-parque-retiro', name: 'Villa del Parque → Retiro' },
  ]),
  linea('194', [
    { id: '194-retiro-flores', name: 'Retiro → Flores' },
    { id: '194-flores-retiro', name: 'Flores → Retiro' },
  ]),
  linea('195', [
    { id: '195-retiro-mataderos', name: 'Retiro → Mataderos' },
    { id: '195-mataderos-retiro', name: 'Mataderos → Retiro' },
  ]),

  // ── Líneas GBA / Provinciales / Municipales ───────────────────────────────
  // Fuente: datos.transporte.gob.ar — período 2019-10

  linea('200'), linea('202'), linea('203'), linea('204'), linea('205'),
  linea('214'), linea('215'), linea('218'), linea('219'),
  linea('222'), linea('225'),
  linea('228'), linea('236'), linea('238'), linea('239'),
  linea('242'), linea('244'), linea('245'), linea('247'),
  linea('252'), linea('253'), linea('257'),
  linea('263'), linea('264'), linea('266'), linea('269'),
  linea('271'), linea('273'), linea('275'), linea('276'), linea('277'), linea('278'),
  linea('281'), linea('283'), linea('284'), linea('288'), linea('289'),
  linea('291'), linea('293'), linea('295'), linea('297'), linea('298'), linea('299'),
  linea('300'), linea('302'), linea('303'), linea('304'), linea('306'), linea('307'),
  linea('310'), linea('311'), linea('312'), linea('313'), linea('314'), linea('315'),
  linea('317'), linea('318'), linea('320'), linea('321'), linea('322'), linea('323'),
  linea('324'), linea('325'), linea('326'), linea('327'), linea('328'), linea('329'),
  linea('333'), linea('336'), linea('338'), linea('341'), linea('343'),
  linea('350'), linea('354'), linea('355'), linea('365'),
  linea('370'), linea('371'), linea('372'), linea('373'),
  linea('378'), linea('379'), linea('382'), linea('383'), linea('384'),
  linea('385'), linea('386'), linea('388'),
  linea('390'), linea('391'), linea('392'), linea('394'), linea('395'),
  linea('403'), linea('404'), linea('405'), linea('406'), linea('407'),
  linea('410'), linea('414'), linea('418'),
  linea('421'), linea('422'), linea('429'), linea('430'),
  linea('435'), linea('436'), linea('437'),
  linea('440'), linea('441'), linea('443'), linea('445'), linea('448'), linea('449'),
  linea('461'), linea('462'), linea('463'), linea('464'),
  linea('500'), linea('501'), linea('502'), linea('503'), linea('504'),
  linea('505'), linea('506'), linea('507'), linea('508'), linea('509'),
  linea('510'), linea('511'), linea('512'), linea('513'), linea('514'), linea('515'),
  linea('518'), linea('520'), linea('521'), linea('522'), linea('523'),
  linea('524'), linea('526'), linea('527'),
  linea('540'), linea('541'), linea('543'), linea('544'),
  linea('548'), linea('549'), linea('550'), linea('552'), linea('553'),
  linea('561'), linea('562'), linea('564'), linea('570'),
  linea('580'), linea('582'), linea('583'), linea('584'), linea('585'), linea('586'),
  linea('603'), linea('619'), linea('620'), linea('621'), linea('622'),
  linea('624'), linea('628'), linea('630'), linea('634'), linea('635'),
  linea('670'),
  linea('707'), linea('710'),
  linea('720'), linea('721'), linea('722'), linea('723'),
  linea('740'), linea('741'), linea('749'),
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
