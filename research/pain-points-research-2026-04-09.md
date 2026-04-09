# Tour Manager / Production Manager Pain Points Research Report
# Date: April 9, 2026
# Sources: r/TouringMusicians, r/livesound, industry educational content, Daysync discussions, Showvella, TecSpec, Green Room Report, StageCart

## CRITICAL PAIN POINTS (Daily/Every Show)

### 1. Manual Data Entry & Document Chaos
- TMs manually enter contract, rider, and itinerary data into tools — their most time-consuming task
- Documents scattered across emails, PDFs, spreadsheets — no single source of truth
- One TM built custom Google Apps Script because nothing on the market does this
- Source: u/Roffy_brewgeek on r/TouringMusicians

### 2. Master Tour is Broken / Overpriced
- Industry standard but widely criticized as "a grift"
- "Premium pricing for functionality that was ok 15 years ago" (u/Optimal-Leg182)
- "Auto-sync refreshes every 30-60 seconds — can't even input a guest list name before it refreshes"
- "I can't believe they decided it was ready to ship" (u/HiddenTrampoline re: new update)
- Source: r/TouringMusicians threads

### 3. Mobile-First is Missing
- Existing tools require laptops for editing
- TMs need to update schedules, contacts, and details from phone on show days
- "We've all lived the nightmare of clunky spreadsheets, endless PDFs, and apps you can't even edit from your phone" (Daysync developer)
- Source: Daysync beta launch discussions on r/TouringMusicians

### 4. Documentation Version Control (Stage Plots, Tech Specs, Riders)
- "Gets emailed, printed out, passed around, and pretty soon nobody knows if they're looking at the current version or not" (Showvella creator)
- "Every software was desktop only & built for windowsXP OR just doesn't exist" (TecSpec creator)
- Band updates setup but promoter sends old file to venue
- Source: r/livesound (Showvella post), r/TouringMusicians (TecSpec post)

### 5. Communication Over-Communication Failures
- Information scattered across email, WhatsApp, texts — no single source of truth
- "One guy's failure to mention baggage allowance details cost us a grand in fines" (u/RefusedTitleFight, 160 upvotes)
- "Let people know where you're headed. It's a basic courtesy and a safety measure"
- Source: r/TouringMusicians

### 6. Merch Inventory & Sales Tracking
- Spreadsheet-based tracking falls apart on tour
- Multi-state sales tax is a nightmare
- European payment processing issues (SumUp, Stripe, PayPal all have problems)
- "Cash obviously is easy and not having to deal with each state's sales tax situation is a plus"
- Source: r/TouringMusicians

## HIGH PAIN POINTS (Per-Show Impact)

### 7. Advancing Shows is Repetitive & Error-Prone
- Two-stage advance process: contract signing + day-of confirming
- Venues flooded with hundreds of emails daily
- Getting response from talent buyers is "nearly impossible"
- No systematic way to track advance status (sent → confirmed → responded)
- Source: r/TouringMusicians educational guides, booking agent failure threads

### 8. Settlement Complexity
- Complex deal structures (Guarantee, Door Deal, Versus Deal, Split Point Deal)
- TMs calculate settlement splits manually
- Source: r/TouringMusicians educational posts

### 9. Venue Information Opacity (Walking in Blind)
- "We were left totally in the dark before walking into a venue"
- "Why isn't there a way for musicians to quietly share this stuff with each other?"
- FOH quality, green room conditions, load-in situation unknown before arrival
- Source: Green Room Report creator on r/TouringMusicians

### 10. Tour Routing & Drive Planning
- "The planning part was pretty brutal for us"
- "How do you decide which cities are worth the drive?"
- No free tools for routing with fan data integration
- Google Maps only tool, no itinerary integration
- Source: r/TouringMusicians routing/bookings threads

### 11. Guest List Management
- Managing guest lists across venues with different limits and pass types
- Manual or via email chains — tedious
- Source: Daysync built dedicated feature citing this as top TM pain point

### 12. Hospitality Rider Fulfillment
- Ensuring venues actually provide what's on the rider
- No systematic way to communicate or verify rider items
- Source: StageCart creator on r/TouringMusicians

## MEDIUM PAIN POINTS (Per-Tour Impact)

### 13. Van/Trailer Security & Driving Fatigue
- Nightly unloading gear into hotel rooms
- Being only driver on multi-show runs (4.5-6.5 hour drives daily)
- "I'm the only driver... do you think this will be too exhausting over a week?"
- Source: r/TouringMusicians first tour planning thread

### 14. Tour Stress, Burnout & Mental Health
- "I am beyond scared and stressed. I want for everything to go right and terrified of making a huge mistake" (u/EstablishmentOne6471, first tour)
- "There's far too many of us in the industry that are suffering silently" (u/wormcats)
- Crew exploitation: deposits not secured, crew loses 8 weeks of work
- Source: r/TouringMusicians, r/livesound

### 15. Tour Management Software Cost Barrier
- "I definitely wasn't up to spending 60€ a month on an overpriced app"
- Many independent acts can't afford Master Tour pricing
- Source: r/TouringMusicians

### 16. Market History Report Maintenance
- Detailed reports required by booking agents
- Maintained manually in Google Sheets/Excel
- Source: Interview with Erwin Schemankewitz (Ever Upward Entertainment)

## TOOLS CURRENTLY USED

| Tool | Purpose | Pros | Cons |
|------|---------|------|------|
| Master Tour | Tour management | Industry standard, 15+ years | "A grift", broken updates, can't edit on mobile, $60+/mo |
| Google Sheets/Excel | Everything | Flexible, free | Manual, no automation, not mobile-friendly |
| Shopify POS | Merch sales | Integrates with online store | Not tour-specific, no per-show tracking |
| WhatsApp/Group Chats | Crew communication | Everyone has it, instant | Messages get buried, no structure |
| Google Drive | Document storage | Free, accessible | Files get lost, no workflow integration |
| Daysync (beta) | Tour management | Mobile-first, $3/user/mo, real-time sync | Still in early beta |
| Showvella | Stage plots | Revision control, QR codes | Limited to stage plots only |
| AtVenu | Merch POS | Used for US transactions | Credit card declines in Europe |
| Square+Davo | POS + sales tax | Designed for stationary POS | Untested for multi-state touring |
| TecSpec | Tech specs from phone | Built specifically for mobile | New, unproven |
| Green Room Report | Anonymous venue reviews | Free, no ads | New, needs adoption |
| StageCart | Hospitality riders | Built by touring TM | Limited scope |

## UNMET NEEDS (Ranked)

### CRITICAL
1. Automated data extraction from PDFs/emails
2. Mobile-first tour management
3. Unified communication hub
4. Merch inventory tracking integrated with shows

### HIGH
5. Automated day-of-show itinerary generation
6. Settlement calculator/tracker
7. Advance tracking/checklist
8. Crew coordination/task assignment
9. Stage plot / tech spec version control

### MEDIUM
10. Tour routing optimization
11. Rider/contract template management
12. Market History Report auto-population
13. Hospitality rider verification
14. Guest list management

## MARKET OPPORTUNITY

The tour management space has a clear gap between:
- Master Tour (expensive, broken, laptop-only, no mobile editing)
- DIY solutions (Google Sheets, email, WhatsApp — chaotic, manual, no automation)

The new competitor Daysync ($3/user/mo) validates the gap but is still in beta.

The biggest opportunity is in: mobile-first, AI-assisted tour management that automates data extraction from PDFs, provides unified communication, and integrates merch/inventory/settlement tracking.
