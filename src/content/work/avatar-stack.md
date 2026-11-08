---
title: Dynamic Avatar Stack
headline: An intranet that feels as alive as the live events it hosts.
summary: Designing a live avatar stack for Knowledge Coop's Next Gen top navigation, so people can sense who is online and who is in the same space with them.
intro: Knowledge Coop hosts live continuing education events where people connect and can sense each other's presence. The legacy intranet felt nothing like that. Its header was static and still. For the Next Gen platform, I designed a dynamic avatar stack for the top navigation that shows who is online, highlights who is on the same page as you, and updates live with clear motion, so the whole intranet feels more connected to the people using the same spaces.
blurb: A live avatar stack in the top navigation that shows who's online, who's on your page, and moves to explain every change.
role: Senior Product Designer
company: Knowledge Coop
timeline: Nov 2026
audience: B2B
lenses: [enterprise]
tags: [Intranet, Motion, Real-time]
cover: /images/work/avatar-stack/avatar-stack-banner.webp
coverAlt: Pieces of the avatar stack on a purple background, showing On this page with ringed avatars, a profile preview card and the 17 more online list
coverWidth: 1800
coverHeight: 618
thumb: /images/work/avatar-stack/avatar-stack-thumbnail.webp
showCover: false
video:
  src: /images/work/avatar-stack/stack-pagechange.mp4
  poster: /images/work/avatar-stack/stack-pagechange-poster.webp
  alt: Moving to a page others are on switches the avatar stack from 24 online to On this page, with focus rings. Moving to a page nobody else is on switches it back. Then the first change replays slowed four times, labeled by phase.
  caption: Page change, at real speed and then slowed 4× so each phase is visible.
order: -2
---

## Presence should feel live

Our mission is to bridge connection between team members, and our live events already do that: people see each other, react and connect in the moment. The legacy intranet's header didn't reflect any of that. I wanted the whole intranet to feel connected to the people sharing it. The avatar stack is where that starts: a dynamic view that moves between the people sharing your space and the people online elsewhere.

Three user stories shaped the design:

- **As a user, I want to see who else is online** in the header, so I know the platform is active and can connect with peers.
- **As a user, I want to see which online users are on the same page as me,** so I can engage with them in context.
- **As a user, I want clear, live feedback when the avatar stack changes,** so I understand why it changed.

---

## Two views from one stack

When others are on your page, the stack leads with them: the label reads "On this page" and each of those avatars gets a focus ring. When nobody else is on your page, it falls back to everyone online, with no rings, and the label shows the total, such as "24 online."

Hovering any avatar opens a profile preview card. It shows profile info only, never the page or area the person is on. Online people who don't fit in the stack roll into a count: with 24 online and 7 shown, that's +17. Hovering the count opens "17 more online."

<figure><video src="/images/work/avatar-stack/stack-hover.mp4" poster="/images/work/avatar-stack/stack-hover-poster.webp" width="1920" height="1080" autoplay muted loop playsinline controls aria-label="Hovering an avatar darkens the photo and opens a profile preview card for Maya Chen. Then hovering +17 opens a list of 17 more people online."></video><figcaption>Hover an avatar for a profile preview. Hover the count to see everyone else online.</figcaption></figure>

---

## Presence rules

- **You never appear** in your own stack or in any count.
- **A person counts as online while their session is active.** After 15 minutes idle, the industry norm in NIST and healthcare session guidance, they're removed.
- **Everything updates live,** with no refresh: the stack, the counts and the highlights.
- **One person shows once,** even across several tabs or devices.

People come and go without anyone touching the page. Someone coming online is added on the far left while the others glide right, and the count bumps. Someone going offline fades and shrinks in place, the stack closes the gap, and the next person fills the end.

<figure><video src="/images/work/avatar-stack/stack-joinleave.mp4" poster="/images/work/avatar-stack/stack-joinleave-poster.webp" width="1920" height="1080" autoplay muted loop playsinline controls aria-label="Someone comes online: a new avatar scales in on the far left, the others glide right, the seventh slides into the count and it bumps from +17 to +18. Then someone goes offline: their avatar fades and shrinks, the rest glide left and a new person fills the end."></video><figcaption>Join and leave, live.</figcaption></figure>

---

## Motion that explains every change

A page change, or a switch between everyone online and the page-first view, runs from one render:

- **0ms.** The label and count crossfade, fading up out in 120ms and up in over 200ms. Rings fade and scale in or out, from 0.85 to 1 over 280ms with a spring.
- **Out, 0–140ms.** Avatars that won't stay fade over 110ms and shrink to 70% over 140ms in place. They leave the layout, so nothing gets pushed.
- **Glide, 110–530ms.** Staying avatars and the count slide to their new spots. Spacing (8 to 12px) and stack width ease together over 420ms, so the label slides with them.
- **In, 200ms+.** New avatars pop in, scaling from 0.6 to 1 over 420ms with a spring, 45ms apart.

Avatars that don't change aren't re-rendered, so an open profile preview stays put. The page content fades up over 260ms. With reduced motion turned on, the stack swaps instantly.
