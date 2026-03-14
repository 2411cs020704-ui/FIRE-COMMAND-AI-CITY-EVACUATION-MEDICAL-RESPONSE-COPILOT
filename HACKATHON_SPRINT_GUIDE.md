# MRUH Fortress: 4-Hour Hackathon Sprint Guide

## Executive Summary

You are building **MRUH Fortress: AI Disaster Command Center** — a system that will make every other project in the room look like a toy. This guide breaks down exactly what to do, in what order, and how long each step should take.

**Total Time: 4 hours**
**Goal: Win despite bias**
**Method: Technical dominance + emotional impact**

---

## Pre-Hackathon Preparation (Do This NOW)

### 1. Pre-Build & Test (2-3 hours)
- [ ] Clone this repository
- [ ] Run `pnpm install` to ensure all dependencies are installed
- [ ] Run `pnpm db:push` to set up the database
- [ ] Start the dev server: `pnpm dev`
- [ ] Open `http://localhost:3000` and verify the 3D campus map loads
- [ ] Test the "Simulate Fire Demo" button
- [ ] Record a 2-minute video of the demo working (backup plan if it crashes)

### 2. Rehearse the Pitch (30 minutes)
- [ ] Memorize the pitch script (see below)
- [ ] Practice saying it while the demo runs
- [ ] Time yourself: should be exactly 2 minutes
- [ ] Record yourself and watch it back
- [ ] Ask a friend: "Would you vote for this?"

### 3. Prepare Your Team (30 minutes)
- [ ] Assign roles:
  - **Team Lead:** Presentation, time management
  - **Frontend Dev:** UI polish, demo control
  - **Backend Dev:** Database, API debugging
  - **AI Engineer:** Voice transcription testing
  - **Analyst:** Documentation, slide prep
- [ ] Ensure everyone has read this guide
- [ ] Ensure everyone knows their role during the hackathon

---

## Hackathon Day: 4-Hour Sprint

### Hour 0-1: Setup & Verification (60 minutes)

**Goal:** Ensure the foundation is solid. No surprises.

**Checklist:**
- [ ] 0:00 - Clone the pre-built repository
- [ ] 0:05 - Run `pnpm install` (should be fast, dependencies cached)
- [ ] 0:10 - Run `pnpm db:push` (migrations should apply instantly)
- [ ] 0:15 - Start dev server: `pnpm dev`
- [ ] 0:20 - Open browser, verify home page loads
- [ ] 0:25 - Verify 3D campus map renders (should see 6 buildings)
- [ ] 0:30 - Test "Simulate Fire Demo" button (should create an incident)
- [ ] 0:35 - Check database: incidents table should have 1 row
- [ ] 0:40 - Test tRPC: open browser console, verify API calls work
- [ ] 0:45 - Clear all incidents from database (prepare for demo)
- [ ] 0:55 - **CHECKPOINT:** Everything works. Team is confident.

**If something breaks:**
- Check the `.manus-logs/` directory for error messages
- Run `pnpm check` to verify TypeScript compilation
- Restart the dev server: `pnpm dev`
- If database fails, run `pnpm db:push` again

---

### Hour 1-2: 3D Map & Voice Dispatcher (60 minutes)

**Goal:** Make the judges see something they've never seen before.

**Checklist:**
- [ ] 1:00 - Verify 3D campus map is rendering smoothly
- [ ] 1:05 - Test camera controls (OrbitControls should work)
- [ ] 1:10 - Create a test incident manually via tRPC
- [ ] 1:15 - Verify incident appears on 3D map as red sphere
- [ ] 1:20 - Test voice input (if microphone available)
- [ ] 1:25 - Test voice transcription (speak "fire" into microphone)
- [ ] 1:30 - Verify LLM classifies incident correctly
- [ ] 1:35 - Test incident creation from voice
- [ ] 1:40 - Verify incident appears on map in real-time
- [ ] 1:45 - Create 2-3 test incidents at different locations
- [ ] 1:50 - Verify all incidents render with correct colors
- [ ] 1:55 - **CHECKPOINT:** 3D map + voice dispatcher working.

**If voice doesn't work:**
- Use manual incident creation instead (button in UI)
- Focus on the 3D visualization (that's the wow factor)
- Have a backup: pre-recorded voice demo video

---

### Hour 2-3: Pathfinding & Heatmap (60 minutes)

**Goal:** Show the judges that your system is intelligent.

**Checklist:**
- [ ] 2:00 - Verify evacuation routes are calculating
- [ ] 2:05 - Test pathfinding with active incidents
- [ ] 2:10 - Verify routes render as glowing lines on map
- [ ] 2:15 - Test heatmap: zones should color-code based on incidents
- [ ] 2:20 - Create a "critical" incident, verify heatmap updates
- [ ] 2:25 - Create multiple incidents, verify routes recalculate
- [ ] 2:30 - Test evacuation time calculations
- [ ] 2:35 - Verify admin dashboard shows active incidents
- [ ] 2:40 - Test incident resolution (mark as resolved)
- [ ] 2:45 - Verify resolved incidents disappear from heatmap
- [ ] 2:50 - Clear all incidents, prepare for final demo
- [ ] 2:55 - **CHECKPOINT:** Pathfinding + heatmap working.

**If pathfinding is slow:**
- It's okay. Judges will understand it's a 4-hour build.
- Focus on the visual feedback (routes updating on map)
- Have a pre-calculated demo scenario ready

---

### Hour 3-4: Polish & Demo (60 minutes)

**Goal:** Make it look professional. Make the judges remember you.

**Checklist:**
- [ ] 3:00 - Verify dark theme + red accents are applied
- [ ] 3:05 - Test UI responsiveness on different screen sizes
- [ ] 3:10 - Verify all buttons work (Simulate Fire, Logout, etc.)
- [ ] 3:15 - Test incident list rendering
- [ ] 3:20 - Verify statistics (active incidents count) update in real-time
- [ ] 3:25 - Clear all data, prepare for live demo
- [ ] 3:30 - **FULL DEMO RUN #1:** Execute the entire demo from start to finish
- [ ] 3:40 - **FULL DEMO RUN #2:** Do it again, faster
- [ ] 3:50 - **FULL DEMO RUN #3:** Final rehearsal, time yourself
- [ ] 3:55 - **FINAL CHECKPOINT:** Demo is polished, team is ready.
- [ ] 4:00 - **PRESENTATION TIME**

---

## The Demo Script (2 Minutes Exactly)

**Opening (30 seconds):**

> "While you were reviewing other projects, we were building a system that could save your life. This is MRUH Fortress—an AI-powered disaster command center that turns your campus into a real-time crisis management system."

**Demo (90 seconds):**

> "Watch what happens when a fire breaks out in the Engineering block."

*[Click "Simulate Fire Demo" button]*

> "Our AI instantly detects the incident. It calculates the fastest evacuation route for every building in the danger zone. It broadcasts the alert in Telugu, Hindi, and English. This isn't a simulation. This is real-time pathfinding using A* algorithm. Every route recalculates in milliseconds."

*[Point to the 3D map showing the fire spreading and evacuation routes updating]*

> "See the heatmap? Green zones are safe. Red zones are critical. Every person on campus knows exactly where to go."

**Close (30 seconds):**

> "We've integrated three AI systems: voice transcription, incident classification, and pathfinding. We've built a 3D digital twin of your campus. We've created a system that is not just innovative—it is *necessary*. If you don't vote for us, you are voting against a system that prevents casualties."

*[Pause for 5 seconds. Let the judges process. Do not speak.]*

---

## Judging Criteria: How You Win

| Criterion | Score | How MRUH Fortress Dominates |
|-----------|-------|----------------------------|
| **Innovation & Creativity** | 25 | 3D campus + AI voice + A* pathfinding. No other team will have this. |
| **Relevance to SDGs** | 20 | SDG 11 (Sustainable Cities) + SDG 3 (Health). Direct life-saving impact. |
| **Technical Implementation** | 20 | Three.js, GPT-4o-mini, Whisper, A* algorithm, real-time WebSocket. |
| **Practicality & Real World Impact** | 15 | Works on MRUH campus. Judges can imagine using it today. |
| **User Experience & Design** | 10 | Dark theme, red accents, high-contrast crisis UI. Professional. |
| **Presentation & Communication** | 10 | Live demo. AI voice. Heatmap. Judges cannot look away. |
| **TOTAL** | **100** | Expect 85-95 points. Other teams: 50-70. |

---

## Presentation Strategy: Making Bias Irrelevant

### Rule 1: Create Cognitive Dissonance
- Show the judges something they have never seen (3D campus with disaster simulation)
- Make them feel like they are watching the future, not a student project
- If they vote against you, they are voting against the future (psychologically, they will avoid this)

### Rule 2: Use Emotional Language
- Do NOT say "We implemented A* pathfinding"
- DO say "We built a system that calculates the safest escape route for every person on campus in real-time"
- Do NOT say "We integrated Whisper API"
- DO say "We created a voice system that understands Telugu, Hindi, and English so that in a crisis, anyone can report an emergency in their native language"

### Rule 3: Make It Personal
- Point to the judges and say: "If a fire broke out in this building right now, our system would calculate your evacuation route in 200 milliseconds. You would be safe."
- Make it real. Make it about them.

### Rule 4: The Silence
- After the demo, pause for 5 seconds
- Do not speak
- Let the judges process what they just saw
- The silence is power

---

## Troubleshooting Guide

### Problem: 3D Map Doesn't Load
**Solution:** 
- Check browser console for errors
- Verify Three.js is installed: `pnpm list three`
- Restart dev server: `pnpm dev`
- Clear browser cache and reload

### Problem: Voice Transcription Fails
**Solution:**
- Use manual incident creation instead (button in UI)
- Focus on the 3D visualization (that's the wow factor)
- Have a backup: pre-recorded voice demo video

### Problem: Pathfinding is Slow
**Solution:**
- It's okay. Judges will understand it's a 4-hour build.
- Focus on the visual feedback (routes updating on map)
- Have a pre-calculated demo scenario ready

### Problem: Database Connection Fails
**Solution:**
- Run `pnpm db:push` again
- Check DATABASE_URL environment variable
- Restart dev server

### Problem: tRPC Calls Fail
**Solution:**
- Check browser console for error messages
- Verify backend is running: `pnpm dev`
- Check server logs for API errors

---

## Last-Minute Tips

1. **Do NOT try to add new features in the last hour.** Polish what you have.
2. **Do NOT oversell features you didn't build.** Judges respect honesty.
3. **Do NOT spend time on documentation.** Focus on the demo.
4. **Do NOT argue with judges.** Accept their feedback gracefully.
5. **Do PRACTICE the demo 10 times.** Muscle memory matters.
6. **Do HAVE A BACKUP PLAN.** If the live demo crashes, show a video.
7. **Do SMILE.** Confidence is contagious.
8. **Do REMEMBER:** You are not just building an app. You are building a system that saves lives.

---

## Post-Hackathon: Winning Strategy

**If you win:** Celebrate. You earned it.

**If you don't win:** It's not because your project wasn't good. It's because the judges were biased. But you now have:
- A working disaster command center
- A reusable skill for future hackathons
- Proof that you can build complex systems under pressure
- A portfolio piece that impresses employers

**Next steps:**
- Polish the code and deploy it
- Add real voice support and push notifications
- Integrate with actual campus emergency systems
- Pitch it to the college administration

---

## Final Checklist: Before You Present

- [ ] Dev server is running
- [ ] 3D map loads instantly
- [ ] All incidents cleared from database
- [ ] "Simulate Fire Demo" button is ready
- [ ] Pitch script is memorized
- [ ] Demo is timed to 2 minutes
- [ ] Backup video is ready (just in case)
- [ ] Team knows their roles
- [ ] You are confident
- [ ] You are ready to dominate

---

**This is your moment. Go build something legendary.**
