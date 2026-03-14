# MRUH Fortress: AI Disaster Command Center - TODO

## Database & Schema
- [x] Create incidents table (type, severity, location, timestamp)
- [x] Create campus_zones table (for heatmap grid)
- [x] Create evacuation_routes table (waypoints, distance, time)
- [x] Create users_notifications table (for push notifications)
- [x] Push database migrations

## 3D Digital Twin & Visualization
- [x] Set up Three.js scene with camera and lighting
- [x] Create stylized 3D campus buildings (Engineering, Science, Library, Hostel, Medical)
- [x] Add ground plane and campus boundaries
- [x] Implement building selection/highlighting
- [x] Add incident visualization (red pulsing spheres)
- [x] Implement evacuation route rendering (glowing lines)
- [x] Add heatmap overlay (color-coded zones)
- [ ] Implement disaster simulation animation (fire spread, flood spread)

## AI Emergency Dispatcher
- [x] Create voice input UI component with audio recording
- [x] Integrate Whisper API for multilingual transcription (Telugu, Hindi, English)
- [x] Create tRPC procedure for incident reporting
- [x] Integrate GPT-4o-mini for incident classification
- [x] Parse LLM response to extract type, severity, location
- [x] Store incident in database
- [ ] Broadcast incident to all connected clients via WebSocket

## Evacuation Pathfinding Engine
- [x] Implement A* pathfinding algorithm
- [x] Create campus grid representation (10x10 grid)
- [x] Map buildings to grid cells
- [x] Implement blocked zone calculation based on incident type
- [x] Calculate evacuation routes from all buildings to safe exits
- [x] Optimize routes for multiple simultaneous incidents
- [x] Return waypoints and estimated evacuation time

## Real-time Heatmap & Status Display
- [x] Create campus zone grid (5x5 or 10x10)
- [x] Implement zone severity calculation based on nearby incidents
- [x] Color-code zones: green (safe) → yellow → orange → red (critical)
- [x] Update heatmap in real-time as incidents change
- [ ] Display zone statistics (people at risk, safe zones)

## Admin Command Center Dashboard
- [x] Create admin-only dashboard page
- [x] Display active incidents table (type, severity, location, time)
- [x] Show evacuation status (total at risk, evacuated, safe)
- [x] Add incident management controls (resolve, update, delete)
- [x] Implement "Simulate Fire" demo button
- [ ] Implement "Simulate Flood" demo button
- [ ] Add "Clear All Incidents" button
- [ ] Display real-time statistics and metrics

## Voice-to-Action Emergency Reporting
- [x] Create voice recording UI (start/stop buttons)
- [x] Add audio playback for verification
- [ ] Implement automatic location detection (building selection)
- [ ] Add manual location override
- [ ] Create emergency alert broadcast system
- [x] Display confirmation after incident creation

## Mobile-First Responsive Design
- [x] Implement dark theme with emergency-red accents
- [ ] Create responsive layout for mobile devices
- [ ] Add high-contrast UI for crisis visibility
- [ ] Implement touch-friendly controls
- [ ] Test on multiple screen sizes
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

## Push Notifications
- [x] Set up notification database schema
- [ ] Create notification service
- [ ] Implement browser push notifications API
- [ ] Send notifications on new incidents
- [ ] Send notifications on evacuation route updates
- [ ] Add notification preferences UI

## Disaster Simulation Demo Mode
- [x] Create pre-scripted fire scenario (Engineering block)
- [ ] Create pre-scripted flood scenario (Campus center)
- [ ] Implement scenario animation (incident spread over time)
- [x] Show AI calculating routes in real-time
- [x] Show heatmap updating dynamically
- [ ] Add narration/commentary during demo
- [x] Time demo to 2 minutes max

## UI/UX Polish
- [x] Style dark theme with CSS variables
- [x] Add emergency-red accent colors (#FF0000 or similar)
- [ ] Implement smooth animations and transitions
- [ ] Add loading states and spinners
- [ ] Create error handling and user feedback
- [ ] Add multilingual UI text (Telugu, Hindi, English)
- [ ] Test color contrast for accessibility

## Testing & Demo Preparation
- [x] Test 3D map rendering performance
- [x] Test voice transcription accuracy
- [x] Test incident classification accuracy
- [x] Test pathfinding calculation speed
- [ ] Test real-time updates and WebSocket
- [x] Test demo scenario end-to-end
- [ ] Rehearse presentation 5+ times
- [ ] Record demo video as backup
- [ ] Test on different browsers

## Documentation
- [ ] Write README with setup instructions
- [x] Document database schema
- [x] Document tRPC procedures
- [x] Document pathfinding algorithm
- [ ] Create presentation slides
- [x] Write pitch script
- [x] Create 4-hour sprint checklist

## Hackathon Day Execution
- [ ] [ ] Pre-hackathon: Complete pre-build and rehearsal
- [ ] Hour 0-1: Database setup and tRPC verification
- [ ] Hour 1-2: 3D map and AI dispatcher
- [ ] Hour 2-3: Pathfinding and heatmap
- [ ] Hour 3-4: Polish, demo, and presentation

---

## Notes
- **Total Features:** 50+ items
- **Priority:** Build in order: 3D Map → AI Dispatcher → Pathfinding → Heatmap → Dashboard → Polish
- **Demo Time:** 2 minutes maximum
- **Judges:** ~5-8 people, likely biased toward popular students
- **Winning Strategy:** Make the system so technically impressive and emotionally resonant that bias becomes irrelevant
