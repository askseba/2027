# Database Setup Guide

## Prerequisites
- PostgreSQL database (local or cloud: Supabase, Neon, Railway, etc.)
- Node.js 18+

## Step 1: Configure Environment

Create a `.env` file in the project root with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### Examples:

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/askseba?schema=public"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

**Neon:**
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

## Step 3: Run Migrations

```bash
npx prisma migrate dev --name init
```

## Step 4: Seed Database (Optional)

```bash
npx prisma db seed
```

## Schema Overview

### Perfume Model
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (cuid) |
| name | String | Perfume name |
| brand | String | Brand name |
| image | String | Image URL |
| description | String? | Description text |
| price | Float? | Price in SAR |
| baseScore | Int | Base match score (0-100) |
| scentPyramid | Json? | { top: [], heart: [], base: [] } |
| families | String[] | ["floral", "woody", ...] |
| ingredients | String[] | ["jasmine", "rose", ...] |
| symptomTriggers | String[] | ["sneeze", "headache", ...] |
| isSafe | Boolean | Safety flag |
| status | String | "safe" / "warning" / "danger" |
| variant | String? | "on-sale" / "just-arrived" |

### UserPreference Model
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (cuid) |
| sessionId | String | Unique session ID |
| likedPerfumes | Json | Array of perfume IDs |
| dislikedPerfumes | Json | Array of perfume IDs |
| allergyProfile | Json | { symptoms, families, ingredients } |
| scentDNA | Json? | Calculated taste profile |
| isComplete | Boolean | Quiz completion flag |

## Useful Commands

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```
