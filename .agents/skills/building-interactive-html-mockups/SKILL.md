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
2. **Define the comparison contract.** Write a compact matrix of entry points, user-visible phases, input states, failure states, and follow-up actions. Include only states needed to answer the user's design questions.
3. **Inspect references visually.** Open the actual images rather than inferring from filenames. Record the inherited typography, spacing, media treatment, action hierarchy, persistent chrome, and one intentional signature element.
4. **Build one interactive HTML artifact.** Reuse the established presentation shell and local assets. Add an out-of-product state panel so each required state is reachable. Use real labels, realistic content, keyboard focus, reduced-motion handling, and responsive layouts.
5. **Preserve transition invariants.** For a multi-phase drawer, keep one mounted shell, one close-button position, and one header policy. Change only phase content. When heights differ, animate measured pixel heights; CSS cannot interpolate directly between `auto` heights. Match media aspect ratios to the intended product output.
6. **Render, inspect, revise.** Capture desktop and mobile browser screenshots for every structurally different state, then inspect them as images. Check clipping, hierarchy, scroll reachability, control position, and transition continuity. Run Prettier and JavaScript syntax checks.
7. **Hand off safely.** Provide the local file link and state-navigation instructions. Confirm the artifact remains absent from normal `git status` output.

## Review and Compound

After each user review, test whether the feedback reveals a reusable design principle. Read [design-lessons.md](references/design-lessons.md), deduplicate, and add a lesson only when:

- the revised mockup has been rendered and inspected;
- the user has confirmed the result or the failure mechanism is objectively verified;
- the rule applies beyond the current screen.

Capture product-specific preferences in project instructions instead. Keep unverified ideas in the mockup, not in the lessons file.

## Quick Reference

| Question | Required evidence |
| --- | --- |
| Does it match the product? | Reference images and accepted mockup compared side by side |
| Do states feel connected? | Persistent chrome and rendered transition inspection |
| Is the layout usable? | Mobile and desktop captures with long-content states |
| Is it safe to discard? | `git check-ignore` before writing and `git status` after |

## Common Mistakes

- Producing generic cards before inspecting the supplied references.
- Adding every imaginable state instead of the states needed for the decision.
- Swapping entire drawers between phases, which makes height and controls jump.
- Stacking a navigation title, divider, and content title that repeat one idea.
- Declaring visual success from source code without inspecting rendered screenshots.
- Compounding a one-off pixel adjustment or an unconfirmed preference.
