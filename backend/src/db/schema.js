const { pgTable, uuid, text, integer, timestamp, numeric, boolean, bigserial } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

const gyms = pgTable('gyms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address'),
  capacity: integer('capacity').notNull(),
  status: text('status').notNull().default('active'),
  opensAt: text('opens_at').notNull().default('06:00'),
  closesAt: text('closes_at').notNull().default('22:00'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  gymId: uuid('gym_id').notNull().references(() => gyms.id),
  name: text('name').notNull(),
  email: text('email').unique(),
  phone: text('phone'),
  planType: text('plan_type').notNull(),
  memberType: text('member_type').notNull().default('new'),
  status: text('status').notNull().default('active'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  planExpiresAt: timestamp('plan_expires_at', { withTimezone: true }).notNull(),
  lastCheckinAt: timestamp('last_checkin_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

const checkins = pgTable('checkins', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  memberId: uuid('member_id').notNull().references(() => members.id),
  gymId: uuid('gym_id').notNull().references(() => gyms.id),
  checkedIn: timestamp('checked_in', { withTimezone: true }).notNull().defaultNow(),
  checkedOut: timestamp('checked_out', { withTimezone: true }),
  durationMin: integer('duration_min').generatedAlwaysAs(
    sql`CASE WHEN checked_out IS NOT NULL THEN EXTRACT(EPOCH FROM (checked_out - checked_in))/60 ELSE NULL END`
  ),
});

const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').notNull().references(() => members.id),
  gymId: uuid('gym_id').notNull().references(() => gyms.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  planType: text('plan_type').notNull(),
  paymentType: text('payment_type').notNull().default('new'),
  paidAt: timestamp('paid_at', { withTimezone: true }).notNull().defaultNow(),
  notes: text('notes'),
});

const anomalies = pgTable('anomalies', {
  id: uuid('id').primaryKey().defaultRandom(),
  gymId: uuid('gym_id').notNull().references(() => gyms.id),
  type: text('type').notNull(),
  severity: text('severity').notNull(),
  message: text('message'),
  resolved: boolean('resolved').notNull().default(false),
  dismissed: boolean('dismissed').notNull().default(false),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

module.exports = {
  gyms,
  members,
  checkins,
  payments,
  anomalies,
};
