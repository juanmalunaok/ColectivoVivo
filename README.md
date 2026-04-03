# ColectivoVivo

Plataforma comunitaria para seguir colectivos de la Ciudad de Buenos Aires en tiempo real. Los propios pasajeros comparten su ubicación GPS (de forma anónima) para que otros puedan ver dónde está el colectivo antes de tomarlo.

## Stack

- **Frontend:** Next.js 14 (App Router) — PWA
- **Mapa:** Google Maps API (`@vis.gl/react-google-maps`)
- **Ubicaciones en tiempo real:** Firebase Realtime Database
- **Auth:** Firebase Auth (email + Google)
- **Base de datos principal:** Firestore
- **Hosting:** Vercel + Firebase

## Primeros pasos

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/ColectivoVivo.git
cd ColectivoVivo
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Completar en `.env.local`:

| Variable | Dónde obtenerla |
|----------|----------------|
| `NEXT_PUBLIC_FIREBASE_*` | Consola de Firebase → Configuración del proyecto |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud Console → APIs & Services → Credenciales |
| `NEXT_PUBLIC_REPORT_THRESHOLD` | Número de reportes para ocultar un marcador (default: 3) |

### 3. Configurar Firebase

#### Realtime Database
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Realtime Database** (modo de producción)
3. Pegar las reglas de `firebase.rules.json` en la pestaña "Reglas"

#### Firestore
1. Habilitar **Cloud Firestore**
2. Pegar las reglas de `firestore.rules` en la pestaña "Reglas"

#### Authentication
1. Habilitar **Email/Contraseña** y **Google** como proveedores

### 4. Configurar Google Maps API

En [Google Cloud Console](https://console.cloud.google.com):
1. Habilitar: **Maps JavaScript API**
2. Crear una clave API restringida al dominio de tu app
3. Crear un **Map ID** (Maps → Map management) para usar `AdvancedMarker`

### 5. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 6. Deploy

```bash
# Vercel (recomendado)
npx vercel --prod
```

Agregar las variables de entorno en el dashboard de Vercel.

## Iconos PWA

Colocar en `public/icons/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Generarlos en [realfavicongenerator.net](https://realfavicongenerator.net) con el logo de ColectivoVivo.

## Estructura del proyecto

```
src/
├── app/                  # Páginas (Next.js App Router)
│   ├── page.tsx          # Home — mapa principal
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   ├── Map/              # MapView + BusMarker
│   ├── Trip/             # LineSelector, ConsentModal, ActiveTripPanel
│   └── UI/               # Header, ProtectedRoute
├── context/
│   └── AuthContext.tsx   # Auth global con Firebase
├── hooks/
│   ├── useAuth.ts
│   ├── useGeolocation.ts # watchPosition con callbacks
│   ├── useActiveTrips.ts # Suscripción a Realtime DB
│   └── useTrip.ts        # Lógica de viaje activo
├── lib/
│   ├── firebase.ts       # Inicialización Firebase
│   ├── realtimeDb.ts     # CRUD de viajes activos
│   └── busLines.ts       # Dataset de líneas CABA
└── types/index.ts        # Tipos TypeScript globales
```

## Estructura Firebase Realtime Database

```
/activeTrips/{tripId}
  userId:     string
  lineNumber: string   // "109"
  branchId:   string
  branchName: string
  lat:        number
  lng:        number
  heading:    number | null
  speed:      number | null  // km/h
  timestamp:  number         // epoch ms
  reports:    number
  isVisible:  boolean
```

## Roadmap

- [x] MVP — mapa en tiempo real con sistema de honor
- [ ] Validación por velocidad y traza (Fase 2)
- [ ] Integración con trazas oficiales de BA Data
- [ ] Notificaciones push cuando el colectivo se acerca
- [ ] Historial de líneas favoritas
- [ ] Modo oscuro

## Privacidad

- La ubicación es 100% anónima: solo se muestra el número de línea en el mapa
- Los datos de posición se eliminan al terminar el viaje
- Ver [Política de Privacidad](/privacy) para más detalles
