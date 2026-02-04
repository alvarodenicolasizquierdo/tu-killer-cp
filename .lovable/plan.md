

# Add Smooth Scroll to Platform Tour

## Overview
When users navigate through the tour, elements like the Scenario Simulator may be below the fold and not visible. This enhancement will automatically scroll highlighted elements into view with smooth animation before the spotlight appears.

## Implementation Approach

The scroll behavior will be added to `PlatformTour.tsx` as a side effect that triggers whenever the current step changes. The scroll will happen before the spotlight and card render, ensuring a smooth visual experience.

### Key Behavior
- When a step has a `selector`, find the target element
- Check if the element is fully visible in the viewport
- If not visible, smoothly scroll it into view with padding for the tour card
- Wait for scroll to complete before the spotlight animates in

## Files to Modify

### 1. `src/components/tour/PlatformTour.tsx`
Add a `useEffect` that runs when `currentStep` changes:

```text
+-------------------------------------------+
|  Step Changes                             |
|       ↓                                   |
|  Find element via selector                |
|       ↓                                   |
|  Check if element is in viewport          |
|       ↓                                   |
|  If off-screen → scrollIntoView()         |
|       ↓                                   |
|  Spotlight & Card render                  |
+-------------------------------------------+
```

**Changes:**
- Add new `useEffect` hook triggered by `currentStep` and `isOpen`
- Use `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` for native smooth scrolling
- Add small delay after scroll to allow spotlight to recalculate position

### 2. `src/components/tour/TourSpotlight.tsx` (minor adjustment)
- Add a small delay before initial rect calculation to account for scroll animation
- Use `requestAnimationFrame` or a short timeout to ensure scroll completes first

## Technical Details

### Scroll Logic in PlatformTour.tsx
```typescript
useEffect(() => {
  if (!isOpen) return;
  
  const step = tourSteps[currentStep];
  if (!step.selector) return;
  
  const element = document.querySelector(step.selector);
  if (!element) return;
  
  // Check if element is in viewport
  const rect = element.getBoundingClientRect();
  const isVisible = (
    rect.top >= 0 &&
    rect.bottom <= window.innerHeight
  );
  
  if (!isVisible) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
  }
}, [currentStep, isOpen]);
```

### Viewport Detection
Uses `getBoundingClientRect()` to determine if the element is within the visible viewport area, accounting for:
- Element being above the fold (top < 0)
- Element being below the fold (bottom > window.innerHeight)

### Scroll Options
- `behavior: 'smooth'` - Enables native CSS smooth scrolling
- `block: 'center'` - Centers the element vertically, leaving room for the tour card
- `inline: 'nearest'` - Minimal horizontal scrolling if needed

## User Experience Flow

1. User clicks "Next" to advance to a step targeting an off-screen element
2. Page smoothly scrolls to center the target element
3. After scroll completes (~300-500ms), spotlight animates in with the element visible
4. Tour card positions itself relative to the now-visible element

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Element already visible | No scroll, spotlight appears immediately |
| No selector (center steps) | No scroll needed, card appears centered |
| Element doesn't exist | Falls back to centered overlay |
| Rapid step navigation | Each step triggers its own scroll |

## Testing Checklist

- Verify scroll works for `[data-tour="scenario-simulator"]` (typically below fold)
- Confirm no scroll happens for already-visible elements
- Test rapid clicking through steps
- Verify spotlight animates correctly after scroll completes
- Test on different viewport sizes

