---
title: Coop AI
headline: Time saved for Loan Officers and Underwriters with A.I.
summary: Time saved for Loan Officers and Underwriters with A.I.
intro: Coop AI is a subscription-based AI tool that searches through the latest mortgage compliance guidelines and helps loan officers with their loan scenarios without relying on their underwriters.
blurb: Coop AI is a subscription-based AI tool that searches through the latest mortgage compliance guidelines and helps loan officers with their loan scenarios without relying on their underwriters.
role: Product Owner & Designer
company: Knowledge Coop
timeline: Q1 2025
audience: B2B
lenses: [ai, enterprise]
tags: [AI, B2B]
cover: /images/work/coopai/coop-ai-banner.webp
coverAlt: Coop AI banner
coverWidth: 3144
coverHeight: 1080
metrics:
  - value: 92%
    label: positive feedback from Coop+ and Enterprise users
    tags: [Customer feedback]
  - value: 45–53%
    label: feature adoption
    tags: [Adoption]
thumb: /images/work/coopai/coop-ai-thumbnail.webp
video:
  src: /images/work/coopai/coop-ai-chat-walkthrough.mp4
  poster: /images/work/coopai/coop-ai-chat-walkthrough-poster.webp
  alt: Walkthrough of Coop AI. On the start screen, Learn how to use Coop AI opens a guided walkthrough. A conversation builds up with answers citing their source documents, then the chat window narrows from desktop to mobile and both layouts sit side by side.
  caption: Using Coop AI, with a guided walkthrough for users new to AI, from desktop to mobile.
order: 1
---

## Guidelines change constantly, and the AI has to keep up

Mortgage guidelines are updated on a regular basis, and admins at every level needed a better way to keep the files Coop AI references current. I designed the admin experience for uploading new files so the AI stays up to date in real time. On the end-user side, that meant showing what matters when guidelines change:

- **When each collection was last updated.** "Last updated" dates carry far more weight than descriptions: descriptions lose meaning once users know their collections, and update dates were what B2B end-users valued most, as reported in 2024.
- **Nested collections, to ease decision paralysis.** As the list of collections grows, the UI has to adapt.
- **Knowledge Coop's public collections, separated from a company's private ones.** That clarity helps users pick the right guidelines before they ask a question.

---

## From a long scroll of cards to a menu

Before the rework, the start screen showed every collection as a card with its description. It was a lot of information, and reaching the bottom took a lot of scrolling. Users weren't reading the descriptions either, so that space wasn't serving them. I moved collection choice into a menu in the question box instead.

<figure><video src="/images/work/coopai/collections-grid-to-menu.mp4" poster="/images/work/coopai/collections-grid-to-menu-poster.webp" width="1920" height="1080" autoplay muted loop playsinline controls aria-label="The old start screen, a grid of collection cards with descriptions, scrolls and its descriptions fade back; the new start screen opens an Internal Collections menu, shows a collection's nested list and pins one"></video><figcaption>From a scrolling grid of collection cards to picking a collection from a menu.</figcaption></figure>

---

## Launched once, then redesigned to scale

My first version of the menu launched to production as a single list of collections. As we added more options for custom collections, that list didn't scale, so I designed a nested menu and launched it as well. Collections group their files one level down, you can pin the ones you use most, and an info icon shows when each one was last updated. The new UI increased subscriptions right away, since it became a strong selling point for potential clients.

<figure><video src="/images/work/coopai/collections-v1-to-v2.mp4" poster="/images/work/coopai/collections-v1-to-v2-poster.webp" width="1920" height="1080" autoplay muted loop playsinline controls aria-label="Version 1 of the collection picker, a radio list, steps aside for version 2: hovering a collection opens its nested list, a collection is pinned, and an info tooltip shows when it was last updated"></video><figcaption>From the launched radio list to the launched nested menu, with pinned collections and update dates.</figcaption></figure>

<figure><img src="/images/work/coopai/custom-collections_-before-and-after.webp" alt="Previous and current Coop AI start screens, annotated. Previous: a credit limit that created a scarcity mindset, a long scroll to view all guidelines, and no clear sign that the input was disabled. Current: a more minimal UI, a clear input field status, a nested list for public and private collections, and Last updated dates that add trust." width="3144" height="1723"><figcaption>What changed between the previous and current start screens.</figcaption></figure>

---

## Buttons that tell you what's happening

The previous design had a static send icon with no visual states, which left users unsure what was happening and wore down their patience when they had to figure out what was needed on their own. With query limits for free members and speech-to-text on the way, every button needed clear states:

- **Send** is active once there's a question, inactive until then, and switches to a timeout state when the query limit is hit.
- **Speech-to-text** shows whether the mic is available, active or unavailable, based on the user's permissions.
- **Rate limits.** To prevent rapid-fire querying, the backend tracks queries in the current time window. If the burst threshold is exceeded, further queries are temporarily throttled, the buttons are disabled, and users are told their access is paused.

The new states also improve the buttons' metadata, so people using assistive technologies get the same context, and they give the AI tool a more mature, robust UI.

<figure><img src="/images/work/coopai/new-components.webp" alt="New components and their states: send is active, inactive or timed out; the mic is active, available or unavailable" width="3144" height="1723"></figure>

---

## A logo to match

I also used my graphic design background to redesign the Coop AI logo, so the tool is recognizable wherever it's marketed across our other products.
