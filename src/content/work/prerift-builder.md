---
title: Prerift Builder
headline: The deck-building guide I needed before my first Riftbound event.
summary: A personal project. A mobile tool that turns the cards a first-time player opens at a Riftbound Pre-Rift event into a graded 25-card deck, with a guided tour for people who've never played a trading card game.
intro: Riftbound is Riot Games' League of Legends trading card game. Players build a deck around a champion and battle over battlefields, scoring points for taking and holding them until someone reaches 8. I'd never played a trading card game. Going into my first Pre-Rift event, I didn't know what a mana curve was or how to build a deck. Hours of research and advice from experienced players still left me lost and nervous, because the barrier to entry was the information itself. So I built the tool I wished I'd had.
blurb: A guided deck builder that turns the cards you open into a graded 25-card deck, for players who've never touched a TCG.
role: Designer & builder
company: Personal project
audience: First-time TCG players
lenses: [consumer, ai]
tags: [Personal project, Mobile, AI]
cover: /images/work/prerift-builder/prerift-builder-banner.webp
coverAlt: Pieces of the Prerift Builder on a purple background, showing the champion pack picker, the energy curve chart against the ideal curve, and an A- deck grade
coverWidth: 1800
coverHeight: 618
thumb: /images/work/prerift-builder/prerift-builder-thumbnail.webp
showCover: false
video:
  src: /images/work/prerift-builder/prerift-builder-walkthrough.mp4
  poster: /images/work/prerift-builder/prerift-builder-walkthrough-poster.webp
  alt: The Prerift Builder on a phone. A guided tour introduces the tool, the player logs cards from their pool, then the deck tab shows the energy curve against the ideal, the 25-card decklist and an A- grade with weak spots.
  caption: From the cards you opened to a graded deck, with a guided tour for first-timers.
metrics:
  - value: 80%
    label: win rate for first-time players who used the tool
    tags: [Player outcomes]
order: -3
---

## The barrier to entry was the information

At a Pre-Rift event, you open packs on the spot and build a 25-card deck from whatever you pull. For a first-time player, that means learning a whole vocabulary under a time limit: domains, runes, battlefields, and the idea of a mana curve, a deck balanced across cheap and expensive cards. I spent hours reading guides and asking experienced players, and I still showed up unsure what I was doing.

I wasn't alone. Plenty of people come to Riftbound from League of Legends, not from other card games, and they hit the same wall.

---

## Design for someone who's never played

I designed every screen for the person I was before that first event:

- **A guided tour first.** The first time you open the tool, a short tour walks through each part, and the Symbols guide explains any icon or keyword in plain words.
- **Log what you opened, however is easiest.** Tap your Legend to add its whole champion pack, type each card's three-digit number, scan cards live with the camera, or photograph a whole pack laid out and let Claude read the cards. You confirm before anything is added.
- **The deck builds itself.** The tool picks a legend, champion and colors from your pool, then shows your energy curve against the ideal one, so "mana curve" becomes something you can see.
- **A grade you can act on.** Every deck gets a letter grade, its weakest areas, and upgrades from cards already in your pool.

<div class="gallery tall"><figure><img src="/images/work/prerift-builder/prerift-curve.webp" alt="The Curve tab: an energy curve bar chart with the ideal curve dashed over it and an 88% match" width="860" height="1864"><figcaption>Your curve against the ideal.</figcaption></figure><figure><img src="/images/work/prerift-builder/prerift-grade.webp" alt="The Grade tab: an A- grade at 85 out of 100, weakest areas with scores, and the strongest cards in the deck" width="860" height="1864"><figcaption>A grade, weak spots and upgrades.</figcaption></figure></div>

---

## Shared with players like me

I shared the tool with other people who'd never played a trading card game and felt overwhelmed by building a deck. One of them told me:

> "this legit saved me yesterday - i was so clueless otherwise"

First-time players who used the tool have gone on to an 80% win rate.

<p><a class="button" href="https://claude.ai/artifact/2W7V5nsvzWAt3RtWEdMZnx" target="_blank" rel="noopener noreferrer">Try the Prerift Builder</a></p>
