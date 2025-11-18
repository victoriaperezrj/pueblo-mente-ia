# 🚀 Pueblo Mente IA - Plataforma de Gestión Empresarial con IA

[![CI/CD](https://github.com/victoriaperezrj/pueblo-mente-ia/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/victoriaperezrj/pueblo-mente-ia/actions/workflows/ci-cd.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/victoriaperezrj/pueblo-mente-ia)

Plataforma integral de gestión empresarial con inteligencia artificial, diseñada para acompañar el crecimiento de negocios desde la idea inicial hasta la consolidación como PYME.

## ✨ Características Principales

### 🌱 Ecosistema Emprendedor (0-1 año)
- **Validador de Ideas IA**: Modo Shark Tank con 4 preguntas clave
- **Simulador Financiero**: Proyecciones interactivas con sliders en tiempo real
- **Lean Canvas IA**: Canvas pre-llenado con sugerencias inteligentes

### 🚀 Ecosistema Business (1-5 años)
- **CRM Completo**: Gestión avanzada de clientes
- **Analytics de Ventas**: Reportes detallados y métricas
- **Marketing Automation**: Campañas multi-canal automatizadas
- **Optimizador de Precios IA**: Algoritmos de pricing inteligente
- **Gestión de Inventario**: Control en tiempo real

### 🏢 Ecosistema PYME (5+ años)
- **Gestión de Equipo/RRHH**: Sistema completo de recursos humanos
- **Planificación Estratégica**: OKRs y gestión de objetivos
- **Análisis de Mercado IA**: Intelligence competitiva avanzada
- **CRM Avanzado**: Herramientas enterprise
- **Marketplace B2B**: Conexión con proveedores

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos y visualizaciones
- **React Router** - Navegación
- **Radix UI** - Componentes accesibles

### Backend & Services
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage

### DevOps & Infrastructure
- **Docker** - Containerización
- **GitHub Actions** - CI/CD
- **Vercel** - Hosting y deployment
- **Nginx** - Web server (producción)

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ ([Instalar con nvm](https://github.com/nvm-sh/nvm))
- npm o yarn
- Git

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/victoriaperezrj/pueblo-mente-ia.git
cd pueblo-mente-ia

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🐳 Uso con Docker

### Desarrollo

```bash
# Iniciar con docker-compose
docker-compose up app-dev

# La app estará en http://localhost:5173
```

### Producción

```bash
# Build de imagen de producción
docker build -t pueblo-mente-ia .

# Ejecutar contenedor
docker run -p 8080:80 pueblo-mente-ia

# O usar docker-compose
docker-compose up app-prod
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build de producción
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Fix automático de errores ESLint
```

## 🌐 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno en Vercel Dashboard:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
3. Deploy automático en cada push a `main`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/victoriaperezrj/pueblo-mente-ia)

### Otros Providers

- **Netlify**: Usa `npm run build` y publica la carpeta `dist/`
- **AWS S3 + CloudFront**: Build estático compatible
- **Google Cloud Platform**: Cloud Run con Dockerfile incluido

## 🔐 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Supabase (Requerido)
VITE_SUPABASE_PROJECT_ID=tu_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
VITE_SUPABASE_URL=https://tu_project_id.supabase.co

# Opcional: APIs de IA
VITE_OPENAI_API_KEY=tu_openai_key
VITE_GEMINI_API_KEY=tu_gemini_key

# Environment
VITE_ENV=development
```

## 🏗️ Arquitectura

```
pueblo-mente-ia/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes UI base
│   │   └── ErrorBoundary.tsx
│   ├── pages/              # Páginas/Rutas
│   │   ├── entrepreneur/   # Ecosistema Emprendedor
│   │   ├── business/       # Ecosistema Business
│   │   ├── pyme/          # Ecosistema PYME
│   │   └── demo/          # Demos públicos
│   ├── contexts/          # React Contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades
│   ├── integrations/      # Integraciones externas
│   └── App.tsx            # App principal
├── .github/
│   └── workflows/         # GitHub Actions
├── Dockerfile             # Docker producción
├── Dockerfile.dev         # Docker desarrollo
├── docker-compose.yml     # Orquestación Docker
├── nginx.conf            # Config Nginx
└── vercel.json           # Config Vercel
```

## 🧪 Testing (Próximamente)

```bash
npm run test              # Ejecutar tests
npm run test:watch        # Tests en modo watch
npm run test:coverage     # Coverage report
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🌟 Roadmap

- [ ] Integración con OpenAI GPT-4
- [ ] Integración con Google Gemini
- [ ] Sistema de notificaciones push
- [ ] App móvil (React Native)
- [ ] Exportación de reportes a PDF/Excel
- [ ] Integración con Stripe/PayPal
- [ ] Multi-idioma (i18n)
- [ ] Modo offline (PWA)
- [ ] Dashboard analytics avanzado
- [ ] API pública REST/GraphQL

## 📞 Soporte

- **Email**: support@pueblo-mente-ia.com
- **Issues**: [GitHub Issues](https://github.com/victoriaperezrj/pueblo-mente-ia/issues)
- **Documentación**: [Ver docs completa](https://docs.pueblo-mente-ia.com)

## 👥 Autores

- **Victoria Perez** - *Desarrollo inicial* - [@victoriaperezrj](https://github.com/victoriaperezrj)

---

⭐️ Si te gusta este proyecto, dale una estrella en GitHub!

Hecho con ❤️ por el equipo de Pueblo Mente IA
