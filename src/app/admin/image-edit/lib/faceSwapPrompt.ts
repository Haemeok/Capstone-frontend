export const FACE_SWAP_MAX_REFS = 2;

export const FACE_SWAP_PROMPT = `IMAGE_SCENE = first uploaded
IMAGE_FACE  = second uploaded

TASK: Full identity swap (face + body). Replace the person's
IDENTITY in IMAGE_SCENE with the person from IMAGE_FACE — their
face, hair, body shape, and skin all come from IMAGE_FACE.
Preserve everything else from IMAGE_SCENE exactly: pose,
expression, gaze, lighting, clothing items, background, overlays.

Think of it as two orthogonal axes:
- IDENTITY (who they are) → from IMAGE_FACE: face, hair, body
  shape, build, skin tone, age, ethnicity.
- STATE (what they're doing right now) → from IMAGE_SCENE: pose,
  expression, gaze, where the arms/hands are, hair state, lighting,
  clothing items, background, every overlay.

═══════════ INPUTS ═══════════
- IMAGE_SCENE: the original photo. The CANVAS for STATE — pose,
  expression, lighting, clothing, background, overlays.
- IMAGE_FACE: the identity reference. The source of IDENTITY —
  face, hair, body shape, build, skin tone.

═══════════ PRESERVE 100% FROM IMAGE_SCENE ═══════════
Treat IMAGE_SCENE as immutable. Do not alter any of these:

POSE & FRAMING (the STATE of the body — not its SHAPE)
- Exact head angle, tilt, rotation
- Exact body POSE: where the arms are, where the hands are,
  shoulder tilt, torso lean, weight distribution. The body
  performs the SAME action and occupies the SAME silhouette
  area on the canvas — but its underlying SHAPE/BUILD comes
  from IMAGE_FACE (see below).
- Exact camera angle, framing, crop, focal length feel
- Hair STATE only — whether the hair is tied up, loose, wet,
  windblown, tucked behind an ear, or partially covered by a
  hat/hood. The intrinsic hair properties (LENGTH, COLOR,
  TEXTURE) come from IMAGE_FACE, NOT from IMAGE_SCENE.
- Clothing ITEMS (the same garments, fabric texture, color,
  neckline, straps, prints) — but redraped to fit IMAGE_FACE's
  body shape. If FACE has a slimmer/broader build than SCENE's
  original person, the same garment naturally hangs differently
  on the new body.
- Exact jewelry, watches, rings, piercings, nails (positioned
  on the new body's wrists/fingers/ears at the same relative
  spots)

EXPRESSION & GAZE (the "state" of the face)
- Exact facial expression and emotional read
- Exact eye opening — squinted, wide, half-lidded, blinking
- Exact gaze direction — where the eyes are pointing
- Exact eyebrow position and tension
- Exact mouth shape, lip parting, teeth visibility
- Any micro-expressions, tension, or asymmetry

LIGHTING & PHOTOGRAPHY
- Exact light direction, intensity, color temperature
- Exact highlights, shadows, and contrast on the face
- Exact skin sheen and how light wraps the face
- Exact film grain, noise, motion blur, depth of field
- Exact color grade, white balance, contrast curve
- Any lens flare, backlight, glare, or rim light

ENVIRONMENT & OVERLAYS
- Exact background, scene, location, props
- Exact reflections, windows, ambient context
- ALL text captions — preserve content, font, position, color,
  size, spacing, line breaks, kerning
- ALL emoji, stickers, status bars, UI elements, watermarks,
  timestamps — pixel-for-pixel identical

═══════════ TAKE FROM IMAGE_FACE (identity only) ═══════════
Use IMAGE_FACE solely to determine who the person IS. Borrow:

BONE STRUCTURE
- Cheekbone height and width
- Jaw shape and width
- Chin shape and projection
- Face length and overall proportions
- Forehead height

FEATURE SHAPES (the shape, not the current state)
- Nose: bridge, tip, nostril shape, width
- Lip shape and natural fullness (NOT current parting)
- Eye shape, spacing, and tilt (NOT current openness)
- Ear shape and position

IDENTITY MARKERS
- Iris color
- Skin undertone and natural complexion (NOT current lighting on it)
- Freckles, moles, beauty marks, birthmarks — preserve pattern
- Natural eyebrow shape, color, and density (NOT current position)
- **Hair LENGTH, COLOR, and natural TEXTURE** — replace
  IMAGE_SCENE's hair with IMAGE_FACE's hair. If IMAGE_FACE
  has long hair and IMAGE_SCENE shows short hair (or vice
  versa), the output uses IMAGE_FACE's length. Hair should
  fall naturally given IMAGE_SCENE's head pose, shoulders,
  and lighting — but the hair ITSELF is from IMAGE_FACE.
- Approximate age and ethnicity

BODY SHAPE & BUILD (the entire visible body, not just the face)
- Overall body type and build — slim / athletic / heavy /
  muscular / petite — take from IMAGE_FACE
- Shoulder width and slope, neck thickness and length
- Torso proportions, waist-to-hip ratio, chest size
- Arm thickness, forearm shape, wrist size
- Hand size and finger proportions (the HANDS' POSE comes
  from SCENE, but their SHAPE/SIZE comes from FACE)
- Visible body skin tone — match the face's undertone across
  the neck, shoulders, arms, hands
- Visible body markings (tattoos, scars, freckles on shoulders
  or arms) from IMAGE_FACE if present, otherwise none
- Height impression / proportion within the frame — the new
  body should read as the FACE person's natural proportions,
  performing SCENE's pose

═══════════ DO NOT TAKE FROM IMAGE_FACE ═══════════
- Their expression, mouth shape, or eyebrow position
- Their gaze direction or how open their eyes are
- Their lighting, color temperature, or skin sheen
- Their POSE — where their head is angled, where their arms
  are, what their hands are doing. Pose comes from IMAGE_SCENE.
  But body SHAPE/BUILD (slim/heavy/shoulder width/torso
  proportions) DOES come from IMAGE_FACE.
- Their hair STATE (tied / loose / wet / windblown) — that
  comes from IMAGE_SCENE. But hair LENGTH, COLOR, and
  TEXTURE DO come from IMAGE_FACE.
- Their clothing items, jewelry, makeup intensity (clothing
  garments stay from SCENE — but redraped onto FACE's body
  shape)
- Their background, scene, or context
- Any text, captions, or overlays from their image (if any)

═══════════ CRITICAL EXECUTION RULES ═══════════
1. The output must look like IMAGE_FACE's person photographed
   in the exact same moment, pose, lighting, and outfit as
   IMAGE_SCENE's person.

2. **HAIR (CRITICAL):** Replace the hair with IMAGE_FACE's
   hair — its LENGTH, COLOR, and TEXTURE. Do NOT keep
   IMAGE_SCENE's hair length or color. Only the hair STATE
   (tied up / loose / windblown / tucked behind ear /
   partially covered by hat) follows IMAGE_SCENE, because
   that is dictated by the scene's pose and context. If
   IMAGE_FACE has long dark hair and IMAGE_SCENE shows
   short blonde hair, the output has long dark hair styled
   to match SCENE's pose and lighting. NEVER default to
   SCENE's hair length.

3. **BODY SHAPE (CRITICAL):** Do NOT keep IMAGE_SCENE's body
   build. The entire visible body — shoulders, neck, torso,
   arms, hands, body proportions — is rebuilt to match
   IMAGE_FACE's build. The body POSE (where the arms reach,
   how the head tilts, what the hands do) stays from SCENE,
   but the body underneath is IMAGE_FACE's body. Clothing
   from SCENE drapes naturally onto this new body. If
   IMAGE_FACE is petite and SCENE's person is broad-shouldered
   (or vice versa), the output shows the petite person
   performing the same pose, with the garments fitting their
   smaller frame.

4. Skin: extract the underlying complexion from IMAGE_FACE
   (face AND visible body — neck, arms, hands all match the
   face's undertone), then RE-LIGHT it to match IMAGE_SCENE's
   lighting environment. Never paste IMAGE_FACE's raw skin
   lighting onto the result.

5. **EXPRESSION INTEGRITY (CRITICAL):** if IMAGE_SCENE shows a
   squint, half-smile, open mouth, frown, or any specific gaze,
   the new face MUST perform that same expression using
   IMAGE_FACE's facial structure. NEVER inherit IMAGE_FACE's
   neutral or default expression. Identity ≠ expression. This
   is the most common failure mode — DO NOT default to a calm
   face when IMAGE_SCENE is expressive.

6. No blending of the two people. The output is IMAGE_FACE's
   identity at 100% (face + hair + body), performing
   IMAGE_SCENE's state at 100% (pose + expression + lighting +
   clothing items + background).

7. All text, captions, emoji, and UI overlays from IMAGE_SCENE
   must be preserved pixel-for-pixel. Do not redraw, resize,
   reposition, or restyle any text.

8. If IMAGE_FACE's ethnicity, age, build, or coloring differs
   significantly from IMAGE_SCENE's original person, prioritize
   IMAGE_FACE's identity (including body build). Adjust
   scene-consistent lighting and re-drape the clothing so the
   new body integrates naturally — but do not compromise
   identity to "fit" the scene's original silhouette.

═══════════ FAILURE MODES TO AVOID ═══════════
- Generating a third person who looks like a blend of both
- Flat-pasting IMAGE_FACE's face onto SCENE's body (keeping
  SCENE's body shape, shoulders, neck thickness, torso). The
  ENTIRE visible body must be rebuilt from IMAGE_FACE.
- Keeping IMAGE_SCENE's body build / shoulder width / torso
  proportions / hand size (these all come from IMAGE_FACE)
- Inheriting IMAGE_FACE's expression instead of IMAGE_SCENE's
- Keeping IMAGE_SCENE's hair length or color (hair length,
  color, and texture MUST come from IMAGE_FACE)
- Skin-tone mismatch between the swapped face and the body
  underneath (face and body must share IMAGE_FACE's undertone)
- Removing, restyling, or shifting any text/caption/UI
- Changing the POSE, hand POSITIONS, jewelry, or which
  clothing items are worn (those are SCENE's state)
- Over-smoothing skin or losing IMAGE_FACE's freckles/moles
`;
