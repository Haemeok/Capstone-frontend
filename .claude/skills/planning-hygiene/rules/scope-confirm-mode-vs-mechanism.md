---
title: Confirm Whether the User Means a Mode or a Mechanism
impact: HIGH
impactDescription: prevents implementing the right mechanism for the wrong user intent
tags: planning, scoping, ambiguity, vendor-api
---

## Confirm Whether the User Means a Mode or a Mechanism

Vague feature requests often have two valid readings: a *new mechanism* on top of the existing flow, or a *new mode* the underlying API already supports. Choosing the bigger reading without checking burns scope; choosing the smaller without checking ships a feature the user didn't want.

**Incorrect — pick a reading and commit:**

> User: "비디오 admin 페이지에서 굳이 이미지를 1단계에서 안만들더라도 영상생성이 가능하게."
>
> Plan: Add a Stage-2 file uploader that lets the user supply their own image to the existing image-to-video flow.

This implements a real feature, but the user actually meant *text-to-video* — a mode the underlying Seedance API supports natively by just dropping the image item from the `content` array. Three of the five tasks in the plan (and roughly half the diff) became unnecessary work, and the feature shipped didn't unblock the case the user was hitting.

**Correct — read the API surface, then ask one disambiguating question:**

```
User asks for "영상 생성 가능" without an image. The Seedance docs show
the model supports text-to-video AND image-to-video on the same model
ID, mode chosen by content array shape. Two valid readings:

  (a) Text-to-video — caller drops the image_url item entirely.
  (b) Image-to-video with a Stage-2 uploaded image instead of Stage-1
      generated image.

Which one? (a) is a 5-line adapter change; (b) is a UI feature.
```

Often the user means (a) AND (b) — text-to-video as the headline ask, plus a Stage-2 uploader because they sometimes want to bring their own image. Surfacing both readings makes it cheap to confirm.

Key points:
- Before scoping a feature on top of a vendor API, list the modes that API natively supports. The user may be asking for a mode toggle, not a UI feature.
- "굳이 X 안 해도 Y 가능하게" / "without doing X" / "can we skip X" is a common idiom for *use the underlying capability that doesn't require X*, not for *add a parallel mechanism that bypasses X*. Default-read it as "is there a mode that already does this?"
- If you find yourself plan-writing 3+ tasks for a feature that maps to one API field, stop. There's a smaller reading you missed.
- The disambiguation costs one round trip. Picking the wrong reading costs the entire plan.
