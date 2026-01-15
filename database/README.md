# Database Setup

## PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Windows - Download from postgresql.org
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE barangay_info;
   \c barangay_info;
   ```

3. **Run the Schema**:
   ```bash
   psql -d barangay_info -f database/schema.sql
   ```

## Environment Variables

Add to your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/barangay_info"
```

## Production Database

For production, use a managed PostgreSQL service like:
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL
- Supabase
- PlanetScale

Update the `DATABASE_URL` accordingly.