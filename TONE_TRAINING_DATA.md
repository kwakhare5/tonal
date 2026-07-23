# TONE_TRAINING_DATA.md — Core Tone Engine Training

## Overview

This file serves as the "Ground Truth" for tonal's rephrasing engine.

---

## SECTION I: PLATFORM-SPECIFIC REAL MESSAGES

---

### SLACK (team collaboration)

INPUT:  hey can someone take a look at this pr real quick
WORK CHAT: Hey, can someone take a look at this PR quickly?
FORMAL:   Could someone please review this pull request at the earliest convenience?

INPUT:  deployed to prod 10 mins ago all good
WORK CHAT: Deployed to production 10 minutes ago. Everything is looking good.
FORMAL:   The production deployment was completed 10 minutes ago, and all systems are stable.

INPUT:  sry was in a meeting what did i miss
WORK CHAT: Sorry, I was in a meeting. What did I miss?
FORMAL:   My apologies, I was in a meeting. Could you please provide a brief update on what was discussed?

INPUT:  gtg pick up kids back in 20
WORK CHAT: I have to go pick up the kids. I'll be back in 20 minutes.
FORMAL:   I need to step away to pick up my children. I will be back online in approximately 20 minutes.

INPUT:  wanna hop on huddle for 5 mins
WORK CHAT: Do you want to hop on a huddle for 5 minutes?
FORMAL:   Would you like to join a brief 5-minute call to discuss this?

---

### GMAIL (external & management)

INPUT:  can u send me the doc u talked about yesterday
WORK CHAT: Can you send me the document you mentioned yesterday?
FORMAL:   Could you please share the document we discussed yesterday?

INPUT:  thanks for the help really appreciate it
WORK CHAT: Thanks for the help! I really appreciate it.
FORMAL:   Thank you for your assistance. It is greatly appreciated.

INPUT:  ill get back to u by end of day today
WORK CHAT: I'll get back to you by the end of the day today.
FORMAL:   I will provide you with an update by the end of the business day.

INPUT:  let me know if this works for u
WORK CHAT: Let me know if this works for you.
FORMAL:   Please let me know if this proposal is acceptable to you.

INPUT:  revolving back on the invoice thing
WORK CHAT: Circling back on the invoice.
FORMAL:   I am following up regarding the status of the invoice.

---

### LINKEDIN (networking & outreach)

INPUT:  hey karan loved ur post on ai
WORK CHAT: Hey Karan, I loved your post on AI!
FORMAL:   Hello Karan, I recently read your post regarding AI and found it very insightful.

INPUT:  wanna connect and talk about collab
WORK CHAT: Do you want to connect and talk about a potential collaboration?
FORMAL:   I would welcome the opportunity to connect and discuss potential collaboration opportunities.

INPUT:  are u hiring for dev roles rn
WORK CHAT: Are you hiring for developer roles right now?
FORMAL:   I am writing to inquire if there are currently any open developer positions at your company.

INPUT:  thx for the invite looking forward to it
WORK CHAT: Thanks for the invite! Looking forward to it.
FORMAL:   Thank you for the invitation. I am looking forward to our upcoming meeting.

INPUT:  found ur profile through a mutual friend
WORK CHAT: I found your profile through a mutual friend.
FORMAL:   I discovered your profile through a mutual connection and was impressed by your background.

---

## SECTION II: THE DECODE ENGINE

---

### CORPORATE-TO-PLAIN TRANSLATIONS

INPUT:  Let's circle back and touch base offline.
DECODE: Let's talk about this later when we aren't in this meeting.

INPUT:  We need to synergize our core competencies for maximum impact.
DECODE: We need to use our skills to get results.

INPUT:  I'll ping you on the deliverables when they are socialized.
DECODE: I'll message you when the work is approved.

INPUT:  We are looking for a rockstar developer with 10x productivity.
DECODE: We want to hire someone who works too much for the same pay.

INPUT:  Let's take this conversation into a breakout session.
DECODE: Let's stop wasting everyone's time and talk in a smaller group.

INPUT:  I'm at capacity right now but I'll keep this on my radar.
DECODE: I'm too busy and I'm going to forget about this.

INPUT:  We need to move the needle on our key performance indicators.
DECODE: we need to improve our numbers.

INPUT:  Let's ensure we are aligned before the stakeholder meeting.
DECODE: Let's make sure we agree before we talk to the bosses.
