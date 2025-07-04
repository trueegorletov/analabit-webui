# WebUI - University Admission Dashboard

A modern Next.js application for university admission tracking and analytics, built with TypeScript, Tailwind CSS, and a clean hexagonal architecture.

## 🏗️ Architecture Overview

This project implements a **hexagonal architecture** (ports and adapters pattern) for clean separation of concerns:

```
src/
├── domain/          # Pure business logic and models
├── application/     # Repository interfaces and dependency injection
├── data/           # Data access implementations
│   ├── rest/       # REST API implementations  
│   └── mock/       # Mock data for development
└── presentation/   # React hooks and UI components
```

### Key Benefits
- **Provider Agnostic**: Easy to swap between REST API, GraphQL, or local mocks
- **Type Safe**: End-to-end TypeScript coverage with runtime validation
- **Testable**: Pure domain logic with dependency injection
- **Future Proof**: Ready for OpenAPI code generation and incremental migrations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation & Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd webui
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Main page: [http://localhost:3000](http://localhost:3000)
   - Demo dashboard: [http://localhost:3000/directions/demo](http://localhost:3000/directions/demo)

### Build & Deploy

```bash
# Type checking
npm run type-check

# Production build
npm run build

# Start production server
npm start
```

## 🔧 Environment Configuration

The application supports flexible data source configuration via environment variables:

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL for REST mode | `undefined` (uses mocks) |
| `NEXT_PUBLIC_USE_MOCK_API` | Force mock mode even with API URL set | `false` |

### Configuration Examples

**Development with Mocks (Default):**
```env
# .env.local
# No API_BASE_URL set - uses mock data
```

**Production with Real API:**
```env
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

**Force Mock Mode:**
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_USE_MOCK_API=true
```

### Data Source Selection Logic

1. If `NEXT_PUBLIC_USE_MOCK_API=true` → **Mock repositories**
2. If `NEXT_PUBLIC_API_BASE_URL` is set → **REST repositories** (with fallback to mocks on error)
3. Otherwise → **Mock repositories**

## 📊 Features & Routes

### Main Application
- **`/`** - University search and direction browsing
- **`/directions/demo`** - Admission dashboard (demo with mock data)
- **`/help`** - Help and documentation page
- **`/popup`** - Admission status popup demo

### Dashboard Features
- 📈 **Statistics Overview** - Total applications by competition type
- 📊 **Admission Info** - Passing scores and rank thresholds  
- 📉 **Drained Results** - Statistical analysis with Monte Carlo simulations
- 📋 **Applications List** - Interactive table with student data
- 🎯 **Interactive Elements** - Click rows for detailed admission status

## 🏛️ API Integration

### Repository Pattern

The application uses a repository pattern with clean interfaces:

```typescript
// Domain contract
interface IApplicationRepository {
  getApplications(options: GetApplicationsOptions): Promise<Application[]>;
  getStudentApplications(studentId: string): Promise<Application[]>;
}

// Implementation selection at runtime
const repositories = useRepositories(); // REST or Mock based on environment
```

### Supported API Endpoints

Based on the [Public API Reference](PUBLIC_API_REFERENCE.md):

| Endpoint | Purpose |
|----------|---------|
| `GET /api/varsities` | List universities/campuses |
| `GET /api/headings` | List program headings (majors) |
| `GET /api/applications` | List student applications |
| `GET /api/results` | Get admission results and statistics |

### Data Flow

```
UI Components → Presentation Hooks → Repository Interfaces → Data Adapters → HTTP Client/Mocks
```

## 🛠️ Development Workflow

### Project Structure

```
app/                    # Next.js app router pages
├── components/         # Shared UI components
├── directions/         # Direction-specific pages
│   ├── _dashboard/     # Dashboard components
│   └── [direction_id]/ # Dynamic direction pages
└── globals.css         # Global styles

application/            # Dependency injection layer
├── DataProvider.tsx    # Repository context provider
├── repositories.ts     # Repository interfaces
└── RepositoryProvider.tsx # Implementation selection

data/                   # Data access layer
├── mock/              # Mock implementations
│   └── repositories.ts
└── rest/              # REST API implementations
    ├── adapters.ts    # DTO → Domain model conversion
    ├── dtos.ts        # API response types
    ├── httpClient.ts  # HTTP wrapper
    └── repositories.ts

domain/                 # Pure business logic
├── models.ts          # Core business entities
└── services/          # Domain services and calculations

presentation/           # UI interaction layer
└── hooks/             # Custom React hooks
    ├── useApplications.ts
    ├── useDashboardStats.ts
    └── useResults.ts
```

### Key Development Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing (when available)
npm test

# Storybook (when available)  
npm run storybook
```

### Adding New Features

1. **Define domain models** in `domain/models.ts`
2. **Create repository interfaces** in `application/repositories.ts`
3. **Implement data adapters** in `data/rest/` and `data/mock/`
4. **Build presentation hooks** in `presentation/hooks/`
5. **Create UI components** consuming the hooks

## 🎨 Styling

- **Framework**: Tailwind CSS with custom configuration
- **Responsive**: Mobile-first design with breakpoints
- **Theming**: University-specific color palettes
- **Animations**: GSAP for smooth interactions
- **Components**: Custom UI components with consistent design system

## 📚 Additional Documentation

- [API Reference](PUBLIC_API_REFERENCE.md) - Backend API specification
- [Architecture Progress](ARCHITECTURE_PROGRESS.md) - Implementation status
- [Performance Optimizations](PERFORMANCE_OPTIMIZATIONS.md) - Performance improvements

## 🤝 Contributing

1. Follow the hexagonal architecture patterns
2. Add types for all new data structures
3. Write presentation hooks for UI interactions
4. Keep domain logic pure and testable
5. Update documentation for new features

## 📄 License

See [LICENSE](LICENSE) file for details.
