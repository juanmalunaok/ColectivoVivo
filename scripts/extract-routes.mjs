/**
 * Descarga el GeoJSON de recorridos de colectivos de BA Data
 * y genera un archivo por línea en public/routes/{lineNumber}.json
 *
 * Uso: node scripts/extract-routes.mjs
 */

import { createWriteStream, mkdirSync, writeFileSync, existsSync } from 'fs'
import { get } from 'https'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ROUTES_DIR = join(ROOT, 'public', 'routes')
const GEOJSON_URL = 'https://cdn.buenosaires.gob.ar/datosabiertos/datasets/transporte-y-obras-publicas/colectivos-recorridos/recorrido-colectivos.geojson'

// Simplificación: toma 1 de cada N puntos para reducir tamaño del archivo
const SIMPLIFY_FACTOR = 3

function simplify(coords) {
  return coords.filter((_, i) => i % SIMPLIFY_FACTOR === 0)
}

function downloadJSON(url) {
  return new Promise((resolve, reject) => {
    console.log('Descargando GeoJSON desde BA Data...')
    let raw = ''
    const req = get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Seguir redirect
        return downloadJSON(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      const total = parseInt(res.headers['content-length'] || '0', 10)
      let received = 0
      res.on('data', (chunk) => {
        raw += chunk
        received += chunk.length
        if (total) {
          process.stdout.write(`\r  ${(received / 1024 / 1024).toFixed(1)} MB / ${(total / 1024 / 1024).toFixed(1)} MB`)
        } else {
          process.stdout.write(`\r  ${(received / 1024 / 1024).toFixed(1)} MB descargados`)
        }
      })
      res.on('end', () => {
        console.log('\nDescarga completa.')
        try {
          resolve(JSON.parse(raw))
        } catch (e) {
          reject(new Error('El archivo no es JSON válido: ' + e.message))
        }
      })
      res.on('error', reject)
    })
    req.on('error', reject)
  })
}

async function main() {
  // Crear carpeta de salida
  mkdirSync(ROUTES_DIR, { recursive: true })

  const geojson = await downloadJSON(GEOJSON_URL)

  if (!geojson.features || !Array.isArray(geojson.features)) {
    console.error('GeoJSON inesperado — no tiene .features')
    process.exit(1)
  }

  console.log(`Total features: ${geojson.features.length}`)

  // Agrupar por número de línea
  // Inspeccionamos los campos disponibles en el primer feature
  const sample = geojson.features[0]?.properties
  console.log('Campos del primer feature:', Object.keys(sample || {}))

  // Detectar el campo de número de línea
  const lineField = ['LINEA', 'linea', 'LINE', 'line', 'NUMERO', 'numero', 'NRO_LINEA']
    .find((f) => sample && f in sample)

  if (!lineField) {
    console.error('No se encontró campo de número de línea. Campos disponibles:', Object.keys(sample || {}))
    console.log('Primer feature completo:', JSON.stringify(geojson.features[0], null, 2))
    process.exit(1)
  }

  console.log(`Campo de línea detectado: "${lineField}"`)

  // Agrupar coordenadas por línea
  const byLine = {}

  for (const feature of geojson.features) {
    const lineNumber = String(feature.properties[lineField] ?? '').trim()
    if (!lineNumber) continue

    const geom = feature.geometry
    if (!geom) continue

    let coordArrays = []
    if (geom.type === 'LineString') {
      coordArrays = [geom.coordinates]
    } else if (geom.type === 'MultiLineString') {
      coordArrays = geom.coordinates
    } else {
      continue
    }

    if (!byLine[lineNumber]) byLine[lineNumber] = []

    for (const coords of coordArrays) {
      // GeoJSON es [lng, lat], lo convertimos a {lat, lng} y simplificamos
      const simplified = simplify(coords).map(([lng, lat]) => ({ lat, lng }))
      if (simplified.length >= 2) {
        byLine[lineNumber].push(simplified)
      }
    }
  }

  const lines = Object.keys(byLine)
  console.log(`Líneas únicas encontradas: ${lines.length}`)

  // Escribir un archivo por línea
  let written = 0
  for (const lineNumber of lines) {
    const segments = byLine[lineNumber]
    // Aplanar todos los segmentos en uno solo (concatenar)
    const flat = segments.flat()
    if (flat.length < 2) continue

    const outPath = join(ROUTES_DIR, `${lineNumber}.json`)
    writeFileSync(outPath, JSON.stringify(flat))
    written++
  }

  console.log(`✓ Archivos generados: ${written} en public/routes/`)
  console.log(`  Ejemplo: public/routes/109.json`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
