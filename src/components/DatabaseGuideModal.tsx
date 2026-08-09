import React, { useState } from 'react';
import {
  Database,
  X,
  Server,
  Terminal,
  Code2,
  CheckCircle2,
  Copy,
  Layers,
  Table,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCode2,
  HardDrive
} from 'lucide-react';

interface DatabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseGuideModal: React.FC<DatabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, tag: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tag);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const schemaSnippet = `-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
);

-- 2. APARTMENTS TABLE (Bangalore Gated Communities)
CREATE TABLE IF NOT EXISTS apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    area VARCHAR(100) NOT NULL,
    total_blocks INT DEFAULT 1
);

-- 3. BOOKINGS TABLE (Prices in INR ₹)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(20) PRIMARY KEY, -- e.g. 'WASH-9821'
    customer_name VARCHAR(150) NOT NULL,
    apartment_id UUID REFERENCES apartments(id),
    vehicle_type VARCHAR(20) NOT NULL,
    price NUMERIC(10, 2) NOT NULL, -- in INR ₹
    payment_method VARCHAR(20) DEFAULT 'upi',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const dockerCommand = `# Run PostgreSQL in Docker Container
docker run --name carwash-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=carwash -p 5432:5432 -d postgres:alpine

# Load Schema & Bangalore Seed Data into PostgreSQL
docker exec -i carwash-db psql -U postgres -d carwash < schema.sql

# Query Bookings in Terminal
docker exec -it carwash-db psql -U postgres -d carwash -c "SELECT id, customer_name, price, status FROM bookings;"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 border-b border-slate-800 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-cyan-400">Database Architecture & Schema Guide</span>
          </div>

          <h2 className="text-xl font-bold text-white">How AquaDoor Uses the PostgreSQL Database</h2>
          <p className="text-xs text-slate-300 mt-1">
            Understanding the real SQL schema (`schema.sql`), Express Node REST API backend (`server.ts`), and database connection flow.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Architecture Flow Diagram Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <Table className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">1. Relational Schema</h3>
              </div>
              <p className="text-xs text-slate-300">
                `schema.sql` defines 4 normalized SQL tables: <strong className="text-white">users</strong>, <strong className="text-white">apartments</strong>, <strong className="text-white">services</strong>, and <strong className="text-white">bookings</strong> with foreign keys and index lookups.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Server className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">2. Express REST API</h3>
              </div>
              <p className="text-xs text-slate-300">
                `server.ts` exposes live endpoints (`/api/apartments`, `/api/bookings`, `/api/auth`) running on port <strong className="text-white">3000</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <HardDrive className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">3. DB Engine / Container</h3>
              </div>
              <p className="text-xs text-slate-300">
                Compatible with <strong className="text-white">PostgreSQL</strong>, Cloud SQL, Supabase, or local Docker containers (`carwash-db`).
              </p>
            </div>
          </div>

          {/* Docker & SQL Command Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Running Database via Docker / Terminal</span>
              </h3>
              <button
                onClick={() => copyCode(dockerCommand, 'docker')}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg"
              >
                {copiedTab === 'docker' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'docker' ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
              {dockerCommand}
            </pre>
          </div>

          {/* SQL Schema Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>SQL Schema Structure (`schema.sql`)</span>
              </h3>
              <button
                onClick={() => copyCode(schemaSnippet, 'schema')}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg"
              >
                {copiedTab === 'schema' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'schema' ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-cyan-300 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
              {schemaSnippet}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            Got it, close guide
          </button>
        </div>

      </div>
    </div>
  );
};
