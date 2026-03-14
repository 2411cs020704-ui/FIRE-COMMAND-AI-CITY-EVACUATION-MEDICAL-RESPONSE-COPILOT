import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Vulnerable people tracking (SDG 03)
 */
export const vulnerablePeople = mysqlTable("vulnerable_people", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["elderly", "mobility_impaired", "pregnant", "respiratory"]).notNull(),
  locationBuilding: varchar("location_building", { length: 255 }).notNull(),
  locationX: int("location_x").notNull(),
  locationY: int("location_y").notNull(),
  vitalSigns: text("vital_signs"), // JSON string
  status: mysqlEnum("status", ["safe", "at_risk", "evacuating", "evacuated"]).default("safe").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VulnerablePerson = typeof vulnerablePeople.$inferSelect;
export type InsertVulnerablePerson = typeof vulnerablePeople.$inferInsert;

/**
 * Resource tracking (SDG 11)
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["ambulance", "fire_truck", "medical_kit", "security"]).notNull(),
  status: mysqlEnum("status", ["available", "deployed", "maintenance"]).default("available").notNull(),
  locationX: int("location_x").notNull(),
  locationY: int("location_y").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Incidents table - tracks emergency events on campus
 */
export const incidents = mysqlTable("incidents", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["fire", "flood", "earthquake", "medical", "other"]).notNull(),
  severity: mysqlEnum("severity", ["critical", "warning", "info"]).notNull(),
  locationX: int("location_x").notNull(),
  locationY: int("location_y").notNull(),
  locationZ: int("location_z").notNull(),
  buildingName: varchar("building_name", { length: 255 }),
  description: text("description"),
  windDirection: varchar("wind_direction", { length: 10 }), // SDG 13
  windSpeed: int("wind_speed"), // SDG 13
  predictedSpread: text("predicted_spread"), // JSON string - SDG 13
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;

/**
 * Campus zones table - defines grid for heatmap
 */
export const campusZones = mysqlTable("campus_zones", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  zoneX: int("zone_x").notNull(),
  zoneY: int("zone_y").notNull(),
  zoneRadius: int("zone_radius").notNull(),
  buildingName: varchar("building_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CampusZone = typeof campusZones.$inferSelect;
export type InsertCampusZone = typeof campusZones.$inferInsert;

/**
 * Evacuation routes table - pre-calculated safe paths
 */
export const evacuationRoutes = mysqlTable("evacuation_routes", {
  id: int("id").autoincrement().primaryKey(),
  fromBuilding: varchar("from_building", { length: 255 }).notNull(),
  toExit: varchar("to_exit", { length: 255 }).notNull(),
  waypoints: text("waypoints").notNull(), // JSON array of {x, y, z} points
  distance: int("distance").notNull(),
  estimatedTimeSeconds: int("estimated_time_seconds").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EvacuationRoute = typeof evacuationRoutes.$inferSelect;
export type InsertEvacuationRoute = typeof evacuationRoutes.$inferInsert;

/**
 * User notifications table - tracks alerts sent to users
 */
export const userNotifications = mysqlTable("user_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  incidentId: int("incident_id"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["incident_alert", "evacuation_update", "all_clear"]).notNull(),
  read: int("read").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserNotification = typeof userNotifications.$inferSelect;
export type InsertUserNotification = typeof userNotifications.$inferInsert;