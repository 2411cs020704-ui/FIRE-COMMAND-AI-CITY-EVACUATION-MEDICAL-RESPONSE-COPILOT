CREATE TABLE `campus_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`zone_x` int NOT NULL,
	`zone_y` int NOT NULL,
	`zone_radius` int NOT NULL,
	`building_name` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campus_zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evacuation_routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`from_building` varchar(255) NOT NULL,
	`to_exit` varchar(255) NOT NULL,
	`waypoints` text NOT NULL,
	`distance` int NOT NULL,
	`estimated_time_seconds` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evacuation_routes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('fire','flood','earthquake','medical','other') NOT NULL,
	`severity` enum('critical','warning','info') NOT NULL,
	`location_x` int NOT NULL,
	`location_y` int NOT NULL,
	`location_z` int NOT NULL,
	`building_name` varchar(255),
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`resolved_at` timestamp,
	CONSTRAINT `incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`incident_id` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('incident_alert','evacuation_update','all_clear') NOT NULL,
	`read` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_notifications_id` PRIMARY KEY(`id`)
);
