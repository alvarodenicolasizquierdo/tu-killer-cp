
# Add Keyboard Navigation to Platform Tour

## Overview
Add keyboard navigation support to the Platform Tour for improved accessibility. Users will be able to navigate through tour steps using arrow keys and dismiss the tour with the Escape key.

## Keyboard Controls
| Key | Action |
|-----|--------|
| Right Arrow / Down Arrow | Go to next step |
| Left Arrow / Up Arrow | Go to previous step |
| Escape | Skip/close the tour |
| Enter / Space | Activate focused button (native behavior) |

## Implementation

### File to Modify: `src/components/tour/PlatformTour.tsx`

Add a new `useEffect` hook that listens for keyboard events when the tour is open:

**Changes:**
1. Add a `useEffect` that attaches a `keydown` event listener to the document
2. Handle arrow keys (Left/Right and Up/Down for accessibility) to navigate steps
3. Handle Escape key to skip the tour
4. Only listen when `isOpen` is true
5. Clean up the event listener on unmount or when tour closes

### Code Logic
```text
+----------------------------------+
|  Tour Opens (isOpen = true)      |
|         |                        |
|         v                        |
|  Attach keydown listener         |
|         |                        |
|         v                        |
|  User presses key:               |
|  - ArrowRight/ArrowDown → Next   |
|  - ArrowLeft/ArrowUp → Previous  |
|  - Escape → Skip tour            |
|         |                        |
|         v                        |
|  Tour closes (isOpen = false)    |
|         |                        |
|         v                        |
|  Remove keydown listener         |
+----------------------------------+
```

### Accessibility Considerations
- Both horizontal (Left/Right) and vertical (Up/Down) arrow keys are supported for flexibility
- Escape key follows standard modal dismissal patterns
- Event handler uses `useCallback` for stable reference
- Prevents default browser behavior only for handled keys to avoid interfering with other functionality

## Testing Checklist
- Verify Right Arrow advances to the next step
- Verify Left Arrow goes to the previous step
- Verify Up/Down arrows also work for navigation
- Verify Escape closes the tour and saves to localStorage
- Verify keyboard navigation doesn't work when tour is closed
- Verify no interference with other keyboard interactions on the page
