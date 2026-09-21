# 💪 Minha Academia

Aplicativo completo para acompanhar sua frequência na academia: marca os dias
que você treinou, calcula a **porcentagem da meta semanal** e permite marcar o
**início e o fim** de um período no calendário.

Projeto em **stack completa**, dividido em camadas:

| Camada        | Tecnologia                                   | Pasta       |
|---------------|----------------------------------------------|-------------|
| Front-end     | **React** + **JavaScript (JSX)** + HTML/CSS  | `frontend/` |
| Build/runtime | **Node.js** (Vite: dev server e build)       | `frontend/` |
| Back-end/API  | **C#** — ASP.NET Core Web API                | `backend/`  |
| Banco de dados| **SQL** — SQLite via Entity Framework Core   | `backend/`  |

O React fala com a API em C#, que por sua vez lê e grava no banco SQL. Assim seus
dados ficam no servidor (e não só num aparelho) — dá pra abrir do celular e do
computador vendo os mesmos treinos.

---

## Pré-requisitos

- **.NET 8 SDK** — https://dotnet.microsoft.com/download
- **Node.js 18 ou superior** — https://nodejs.org

Confira com:

```bash
dotnet --version   # deve mostrar 8.x
node --version      # deve mostrar 18.x ou maior
```

---

## Como rodar

Abra **dois terminais** — um para o back-end e outro para o front-end.

### 1) Back-end (C# + banco SQL)

```bash
cd backend
dotnet run
```

- Sobe em **http://localhost:5000**
- Na primeira execução o banco `academia.db` (SQLite) é criado automaticamente.
- Documentação interativa da API (Swagger): **http://localhost:5000/swagger**

### 2) Front-end (React)

```bash
cd frontend
npm install     # só na primeira vez
npm run dev
```

- Abra **http://localhost:5173** no navegador.
- O Vite redireciona as chamadas `/api` para o back-end automaticamente.

Pronto! Marque os dias, ajuste a meta e defina o período de treino.

---

## Endpoints da API

| Método | Rota                         | O que faz                                  |
|--------|------------------------------|--------------------------------------------|
| GET    | `/api/workouts`              | Lista os dias treinados                    |
| POST   | `/api/workouts/toggle`       | Marca/desmarca um dia `{ "date": "..." }`  |
| DELETE | `/api/workouts/{date}`       | Remove um dia específico                   |
| GET    | `/api/settings`              | Lê a meta semanal e o período              |
| PUT    | `/api/settings`              | Salva meta semanal, início e fim           |

Datas sempre no formato `YYYY-MM-DD`.

---

## Estrutura

```
minha-academia/
├─ backend/                 # API em C# (ASP.NET Core)
│  ├─ Program.cs            # inicialização, EF Core, CORS
│  ├─ Models/               # WorkoutDay, Setting
│  ├─ Data/AppDbContext.cs  # mapeamento EF Core
│  ├─ Controllers/          # WorkoutsController, SettingsController
│  └─ sql/schema.sql        # esquema SQL (referência)
└─ frontend/                # SPA em React (Vite)
   ├─ index.html
   └─ src/
      ├─ App.jsx            # tela principal e cálculo das estatísticas
      ├─ api.js             # chamadas HTTP à API
      ├─ components/        # ProgressRing, Calendar, Stats, etc.
      └─ utils/dates.js     # utilidades de data
```

---

## Trocar o SQLite por SQL Server (opcional)

O banco é SQLite só para não precisar instalar nada. Para usar **SQL Server**:

1. No `backend/MinhaAcademia.Api.csproj`, troque o pacote
   `Microsoft.EntityFrameworkCore.Sqlite` por
   `Microsoft.EntityFrameworkCore.SqlServer`.
2. Em `Program.cs`, troque `opt.UseSqlite(...)` por `opt.UseSqlServer(...)`.
3. Em `appsettings.json`, ajuste a `ConnectionStrings:Default`, por exemplo:
   `"Server=localhost;Database=Academia;Trusted_Connection=True;TrustServerCertificate=True"`

O arquivo `backend/sql/schema.sql` traz a versão das tabelas para SQL Server.

---

## Como a porcentagem é calculada

- **Anel da semana**: `dias treinados na semana ÷ meta semanal`, limitado a 100%.
  (Ex.: meta 4, foi 3 vezes → 75%.)
- **Aderência total**: treinos feitos ÷ (meta × nº de semanas desde o início).
- **Semanas na meta**: sequência de semanas seguidas em que você bateu a meta.

A semana começa no **domingo** (padrão do calendário brasileiro).
