/**
 * WTF LivePulse — Seed Script (Final Data & Scenario Alignment)
 */

const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { gyms, members, checkins, payments } = require('../schema');
const { sql } = require('drizzle-orm');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://wtf:wtf_secret@db:5432/wtf_livepulse',
});
const db = drizzle(pool);

const randInt   = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Math.random() * (max - min) + min;
const pick      = (arr)      => arr[Math.floor(Math.random() * arr.length)];

function addMinutes(date, m) { return new Date(date.getTime() + m * 60_000); }
function addDays(date, d) { return new Date(date.getTime() + d * 86_400_000); }
function subDays(date, d) { return new Date(date.getTime() - d * 86_400_000); }

const FIRST_NAMES = ['Rahul','Priya','Ankit','Neha','Arjun','Sneha','Vikram','Pooja','Rohit','Anjali','Amit','Divya','Suresh','Meena','Rajesh','Kavita','Arun','Sunita','Vivek','Rekha','Sanjay','Geeta','Manish','Nisha','Deepak','Shweta','Ramesh','Sonia','Vinod','Lata'];
const LAST_NAMES = ['Sharma','Mehta','Verma','Gupta','Patel','Singh','Kumar','Joshi','Mishra','Yadav','Shah','Nair','Pillai','Reddy','Rao','Iyer','Menon','Naidu','Desai','Patil','Kulkarni','Deshpande','Bhosale','Kadam','Shinde'];

function randomName() { return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`; }
function nameToEmail(name, idx) { return `${name.toLowerCase().replace(/\s+/g, '.')}${idx}@gmail.com`; }
function randomPhone() { return '9' + Array.from({length:9}, () => randInt(0,9)).join(''); }

const GYMS_DATA = [
  { name: 'WTF Gyms — Lajpat Nagar',    city: 'New Delhi',  capacity: 220, opens_at: '05:30', closes_at: '22:30' },
  { name: 'WTF Gyms — Connaught Place',  city: 'New Delhi',  capacity: 180, opens_at: '06:00', closes_at: '22:00' },
  { name: 'WTF Gyms — Bandra West',      city: 'Mumbai',     capacity: 300, opens_at: '05:00', closes_at: '23:00' },
  { name: 'WTF Gyms — Powai',            city: 'Mumbai',     capacity: 250, opens_at: '05:30', closes_at: '22:30' },
  { name: 'WTF Gyms — Indiranagar',      city: 'Bengaluru',  capacity: 200, opens_at: '05:30', closes_at: '22:00' },
  { name: 'WTF Gyms — Koramangala',      city: 'Bengaluru',  capacity: 180, opens_at: '06:00', closes_at: '22:00' },
  { name: 'WTF Gyms — Banjara Hills',    city: 'Hyderabad',  capacity: 160, opens_at: '06:00', closes_at: '22:00' },
  { name: 'WTF Gyms — Sector 18 Noida', city: 'Noida',      capacity: 140, opens_at: '06:00', closes_at: '21:30' },
  { name: 'WTF Gyms — Salt Lake',        city: 'Kolkata',    capacity: 120, opens_at: '06:00', closes_at: '21:00' },
  { name: 'WTF Gyms — Velachery',        city: 'Chennai',    capacity: 110, opens_at: '06:00', closes_at: '21:00' },
];

const GYM_DIST = [
  { pct: 0.13, monthly: 0.50, quarterly: 0.30, annual: 0.20, active: 0.88 },
  { pct: 0.11, monthly: 0.40, quarterly: 0.40, annual: 0.20, active: 0.85 },
  { pct: 0.15, monthly: 0.40, quarterly: 0.40, annual: 0.20, active: 0.90 },
  { pct: 0.12, monthly: 0.40, quarterly: 0.40, annual: 0.20, active: 0.87 },
  { pct: 0.11, monthly: 0.40, quarterly: 0.40, annual: 0.20, active: 0.89 },
  { pct: 0.10, monthly: 0.40, quarterly: 0.40, annual: 0.20, active: 0.86 },
  { pct: 0.09, monthly: 0.50, quarterly: 0.30, annual: 0.20, active: 0.84 },
  { pct: 0.08, monthly: 0.60, quarterly: 0.25, annual: 0.15, active: 0.82 },
  { pct: 0.06, monthly: 0.60, quarterly: 0.30, annual: 0.10, active: 0.80 },
  { pct: 0.05, monthly: 0.60, quarterly: 0.30, annual: 0.10, active: 0.78 },
];

function gaussian(x, mu, sigma) { return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2))); }
function hourMultiplier(hour) {
  const morningPeak = gaussian(hour, 7.5, 1.2);
  const eveningPeak = gaussian(hour, 18.0, 1.8) * 0.95;
  const result = Math.max(morningPeak, eveningPeak, 0.02);
  if (hour < 5 || hour > 23) return 0;
  return result;
}

const HOURLY_SUM = Array.from({length:24}, (_,i) => i).reduce((s, h) => s + hourMultiplier(h), 0);
const DOW_MULT = [0.45, 1.15, 1.10, 0.95, 0.90, 0.85, 0.60];
const PLAN_PRICE = { monthly: 1499, quarterly: 3999, annual: 11999 };
const PLAN_DAYS  = { monthly: 30, quarterly: 90, annual: 365 };

async function seed() {
  const NOW = new Date();
  try {
    const existing = await db.execute(sql`SELECT COUNT(*) FROM gyms`);
    if (parseInt(existing.rows[0].count) >= 10) { console.log('✅ Seed skipped.'); return; }

    console.log('Seeding gyms...');
    const insertedGyms = await db.insert(gyms).values(GYMS_DATA.map(g => ({
      name: g.name, city: g.city, capacity: g.capacity, opensAt: g.opens_at, closesAt: g.closes_at
    }))).returning();
    const gymIds = insertedGyms.map(g => g.id);

    console.log('Seeding 5000 members...');
    let emailIdx = 0;
    const allMembers = [];
    
    for (let gi = 0; gi < 10; gi++) {
      const d = GYM_DIST[gi], gid = gymIds[gi], cnt = Math.round(5000 * d.pct);
      let critRem = 12, highRem = 25; // Evenly distributed risk per gym

      for (let mi = 0; mi < cnt; mi++) {
        const name = randomName(), email = nameToEmail(name, ++emailIdx), status = mi < cnt * d.active ? 'active' : 'inactive';
        const pType = Math.random() < d.monthly ? 'monthly' : (Math.random() < d.quarterly / (1 - d.monthly) ? 'quarterly' : 'annual');
        const joinedAt = subDays(NOW, status === 'active' ? randInt(1, 89) : randInt(91, 180));
        let lastCI = null, churnTier = null;

        if (status === 'active') {
          if (critRem > 0 && Math.random() < 0.25) { lastCI = subDays(NOW, randInt(61, 85)); critRem--; churnTier = 'critical'; }
          else if (highRem > 0 && Math.random() < 0.35) { lastCI = subDays(NOW, randInt(45, 60)); highRem--; churnTier = 'high'; }
          else { lastCI = subDays(NOW, randInt(1, 40)); }
        }
        allMembers.push({ gymId: gid, name, email, phone: randomPhone(), planType: pType, status, joinedAt, planExpiresAt: addDays(joinedAt, PLAN_DAYS[pType]), lastCheckinAt: lastCI, churnTier });
      }
    }

    const insertedMembers = [];
    const BATCH = 500;
    for (let i = 0; i < allMembers.length; i += BATCH) {
       const chunk = await db.insert(members).values(allMembers.slice(i, i+BATCH)).returning();
       insertedMembers.push(...chunk);
    }
    const seededMembers = insertedMembers.map((m, i) => ({ ...m, churnTier: allMembers[i].churnTier }));

    console.log('Seeding historical events...');
    const pRows = [], cRows = [];
    for (const m of seededMembers) {
      const isBandra = m.gymId === gymIds[2];
      let pType = m.planType;
      if (isBandra && Math.random() < 0.8) pType = 'monthly';
      pRows.push({ memberId: m.id, gymId: m.gymId, amount: PLAN_PRICE[pType].toString(), planType: pType, paidAt: m.joinedAt });
      
      // Churn history
      if (m.churnTier) {
        cRows.push({ memberId: m.id, gymId: m.gymId, checkedIn: m.lastCheckinAt, checkedOut: addMinutes(m.lastCheckinAt, 60) });
      }
    }

    const DAILY_TARGET = 370;
    for (let gi = 0; gi < 10; gi++) {
      const gid = gymIds[gi], gymFudge = randFloat(0.85, 1.25);
      const candidates = seededMembers.filter(m => m.gymId === gid && m.status === 'active' && !m.churnTier);
      if (candidates.length === 0) continue;
      
      // Seed up to yesterday
      for (let dOff = 89; dOff >= 1; dOff--) {
        const dStart = subDays(NOW, dOff); dStart.setHours(0,0,0,0);
        const target = DAILY_TARGET * DOW_MULT[dStart.getDay()] * gymFudge * randFloat(0.9, 1.1);
        for (let h = 6; h <= 22; h++) {
          const count = Math.round((target / HOURLY_SUM) * hourMultiplier(h) * randFloat(0.8, 1.2));
          for (let k = 0; k < count; k++) {
            const mem = pick(candidates), ci = new Date(dStart); ci.setHours(h, randInt(0, 59));
            cRows.push({ memberId: mem.id, gymId: gid, checkedIn: ci, checkedOut: addMinutes(ci, randInt(45, 90)) });
          }
        }
      }
    }

    console.log('Finalizing Scenarios...');
    // Scenario B: Bandra West - 280 open sessions (USE NON-CHURN MEMBERS)
    const bandraSafeMems = seededMembers.filter(m => m.gymId === gymIds[2] && m.status === 'active' && !m.churnTier);
    for (let i=0; i<280 && i<bandraSafeMems.length; i++) {
      cRows.push({ memberId: bandraSafeMems[i].id, gymId: gymIds[2], checkedIn: addMinutes(NOW, -randInt(10,80)), checkedOut: null });
    }

    // Section 4.4: Pre-seeded open check-ins for other gyms
    for (let gi = 0; gi < 10; gi++) {
      if (gi === 2 || gi === 9) continue; // Bandra and Velachery handled separately
      const gid = gymIds[gi], cap = GYMS_DATA[gi].capacity;
      const mems = seededMembers.filter(m => m.gymId === gid && m.status === 'active' && !m.churnTier);
      let count = cap >= 250 ? randInt(25, 35) : (cap >= 160 ? randInt(15, 25) : randInt(8, 15));
      for (let i=0; i < count && i < mems.length; i++) {
        cRows.push({ memberId: mems[i].id, gymId: gid, checkedIn: addMinutes(NOW, -randInt(5, 60)), checkedOut: null });
      }
    }
    
    const BATCH_SIZE = 1000;
    for (let i = 0; i < pRows.length; i += BATCH_SIZE) await db.insert(payments).values(pRows.slice(i, i+BATCH_SIZE));
    for (let i = 0; i < cRows.length; i += BATCH_SIZE) await db.insert(checkins).values(cRows.slice(i, i+BATCH_SIZE));

    await db.execute(sql`UPDATE members m SET last_checkin_at = sub.latest FROM (SELECT member_id, MAX(checked_in) AS latest FROM checkins GROUP BY member_id) sub WHERE m.id = sub.member_id`);
    await db.execute(sql`REFRESH MATERIALIZED VIEW gym_hourly_stats`);
    console.log('✅ Seed complete.');
  } catch (err) { console.error('❌ Seed failed:', err); } finally { await pool.end(); }
}
seed();
