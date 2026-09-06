---
name: building-interactive-html-mockups
description: Use when creating or revising an interactive HTML UI mockup from screenshots, design references, an existing product, or a prior mockup, especially for multi-state mobile drawers, forms, responsive comparisons, and user review before React implementation.
---

# Building Interactive HTML Mockups

## Overview

Build a browser-reviewable design artifact that answers unresolved UI questions before production code. Treat supplied references and accepted product patterns as constraints; use original design judgment only where they leave room.

**REQUIRED SUB-SKILLS:** Use `brainstorming` before changing the design and `frontend-design` for visual critique.

## Workflow

1. **Protect the workspace.** Read `AGENTS.md`, the project design guide, the nearest existing mockup, and the relevant reference images. Run `git check-ignore -v --no-index -- <output>` before creating a file. Keep ignored design artifacts ignored.
2. **Audit the current experience.** Before proposing a replacement, identify user-visible friction in the existing screen with code or rendered-screen evidence. Separate usability problems from personal taste. Every proposed direction must later explain which verified friction it removes, and what new cost it introduces.
3. **Reverse-engineer references before styling.** Open the actual images rather than inferring from filenames. For each relevant pattern, record all five fields: `observed fact → user problem → design response and likely intent → transferable rule → product-specific surface that must not be copied`. Typography, spacing, media treatment, action hierarchy, persistent chrome, and interaction state are observations, not explanations by themselves.
4. **Use generic UI intelligence only as a guardrail.** Accessibility, touch size, validation timing, responsive behavior, and similar ergonomic rules may come from a UI/UX database or skill. Do not use its generated palette, product archetype, or visual style as evidence of reference fidelity. Supplied and verified product references remain the source of truth for brand and interaction character.
5. **Map genuine design conflicts.** Write a compact matrix of entry points, user-visible phases, input states, failure states, and follow-up actions. When two valid UX goals conflict, produce two or three alternatives named by the goal each prioritizes. For every alternative, state the intended user, benefit over the current screen, and accepted downside. Do not present arbitrary visual variations as UX alternatives.
6. **Resolve ambiguous spatial language.** Explicitly distinguish a single continuous page from content forced into one viewport, and a single artifact from a single design direction. Never compress typography or touch targets merely to make every field visible in one screenshot.
7. **Pass a calibration gate.** Reconstruct one high-signal reference interaction or component before adapting the full product screen. Compare it with the source for information order, action placement, selection feedback, and commit/cancel behavior. If the reference lineage is not recognizable or explainable, stop and revise the analysis rather than expanding the mockup.
8. **Build one interactive HTML artifact.** Reuse the established presentation shell and local assets. Put reference reasoning and alternative trade-offs outside the product UI, and add an out-of-product state panel so each required state is reachable. Use real labels, realistic content, keyboard focus, reduced-motion handling, and responsive layouts.
9. **Preserve transition invariants.** For a multi-phase drawer, keep one mounted shell, one close-button position, and one header policy. Change only phase content. When heights differ, animate measured pixel heights; CSS cannot interpolate directly between `auto` heights. Match media aspect ratios to the intended product output.
10. **Render, inspect, revise.** Capture desktop and mobile browser screenshots for every structurally different state, then inspect them as images. Check clipping, hierarchy, scroll reachability, control position, and transition continuity. Verify that error copy matches the rendered invalid value. Run Prettier and JavaScript syntax checks.
11. **Hand off safely.** Provide the local file link, state-navigation instructions, and a concise reference-to-decision trace. Confirm the artifact remains absent from normal `git status` output.

## Review and Compound

After each user review, test whether the feedback reveals a reusable design principle. Read [design-lessons.md](references/design-lessons.md), deduplicate, and add a lesson only when:

- the revised mockup has been rendered and inspected;
- the user has confirmed the result or the failure mechanism is objectively verified;
- the rule applies beyond the current screen.

Capture product-specific preferences in project instructions instead. Keep unverified ideas in the mockup, not in the lessons file.

## Quick Reference

| Question | Required evidence |
| --- | --- |
| Does it match the product? | Five-field reference reasoning ledger plus source and mockup compared side by side |
| Is it better than the current screen? | Verified current friction, observable improvement, and accepted downside for each direction |
| Are multiple directions meaningful? | Each direction prioritizes a different conflicting UX goal and names its intended user |
| Do states feel connected? | Persistent chrome and rendered transition inspection |
| Is the layout usable? | Mobile and desktop captures with long-content states |
| Is it safe to discard? | `git check-ignore` before writing and `git status` after |

## Common Mistakes

- Producing generic cards before inspecting the supplied references.
- Treating colors, rounded corners, or typography as the reference's UX intent instead of asking what user problem they solve.
- Averaging multiple products into a vague hybrid instead of assigning each reference a specific responsibility.
- Removing a rejected accent color and falling back to an unbranded monochrome component-library default.
- Calling cosmetic variants alternatives when they do not represent different UX priorities or trade-offs.
- Claiming a redesign is better without naming the current user cost it removes and the new cost it accepts.
- Adding every imaginable state instead of the states needed for the decision.
- Swapping entire drawers between phases, which makes height and controls jump.
- Stacking a navigation title, divider, and content title that repeat one idea.
- Declaring visual success from source code without inspecting rendered screenshots.
- Compounding a one-off pixel adjustment or an unconfirmed preference.
