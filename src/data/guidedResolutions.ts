import { GuidedResolutionData } from '@/components/help-support/GuidedResolution';

export const guidedResolutions: Record<string, GuidedResolutionData> = {
  'create-audit': {
    id: 'create-audit',
    title: "I can't create an Audit",
    intent: "You want to schedule a new factory audit, but the 'Create Audit' button is disabled or missing.",
    causes: [
      "Your account doesn't have Audit Manager permissions",
      "The supplier you're trying to audit hasn't been fully onboarded yet",
      "There's already a pending audit for this supplier within the cooling-off period",
      "The factory location is missing required compliance documents"
    ],
    steps: [
      {
        action: "Check your role permissions",
        detail: "Go to Settings → My Profile and confirm you have 'Audit Manager' or 'QA Lead' role"
      },
      {
        action: "Verify the supplier is fully onboarded",
        detail: "Open the Supplier page and check all required fields are complete (address, contact, certifications)"
      },
      {
        action: "Check for existing pending audits",
        detail: "Look in Inspections → Calendar for any scheduled audits for this supplier"
      },
      {
        action: "Review factory compliance status",
        detail: "Ensure the factory has uploaded required documents (business license, fire safety cert)"
      }
    ],
    tags: ['audit', 'inspection', 'factory', 'supplier', 'compliance', 'schedule', 'qa', 'roles'],
    aiNotes: {
      rootCauseTags: ['permissions', 'supplier-onboarding', 'audit-cooldown', 'compliance-docs'],
      confidence: 0.89,
      relatedIssues: ['supplier-missing-docs', 'audit-scheduling-conflict']
    }
  },

  'create-workbook': {
    id: 'create-workbook',
    title: "I can't create a Workbook",
    intent: "You want to start a new product workbook, but you're unable to create one or the option isn't available.",
    causes: [
      "The season or collection you're working in is locked",
      "You've reached the maximum workbook limit for your account tier",
      "The parent style doesn't exist or was archived",
      "Your role is set to 'View Only' for this brand or division"
    ],
    steps: [
      {
        action: "Check if the season is still open",
        detail: "Go to Styles → Seasons and verify your target season shows 'Active' status"
      },
      {
        action: "Confirm you have editing rights",
        detail: "Check Settings → My Profile → Brand Access for your permission level"
      },
      {
        action: "Verify the parent style exists",
        detail: "Search for the style in Styles and ensure it's not archived"
      },
      {
        action: "Check your workbook quota",
        detail: "Contact your admin if you see a 'Limit Reached' message"
      }
    ],
    tags: ['workbook', 'style', 'season', 'collection', 'product', 'roles', 'tabs'],
    aiNotes: {
      rootCauseTags: ['season-locked', 'quota-limit', 'style-archived', 'view-only-role'],
      confidence: 0.87,
      relatedIssues: ['season-management', 'workbook-templates']
    }
  },

  'submit-trf': {
    id: 'submit-trf',
    title: "I can't submit a TRF / Top Sheet",
    intent: "You want to submit a Test Request Form to the lab, but the submit button is disabled or you're getting errors.",
    causes: [
      "Required fields on the TRF are incomplete (sample info, test methods, etc.)",
      "The style doesn't have a Testing Level assigned yet",
      "Lab samples haven't been marked as 'Received' in the system",
      "There's a pending approval blocking the submission"
    ],
    steps: [
      {
        action: "Review all required fields",
        detail: "Look for red asterisks (*) on the TRF form and fill in any missing information"
      },
      {
        action: "Check Testing Level assignment",
        detail: "Go to the Style → Testing tab and ensure a level is selected"
      },
      {
        action: "Confirm samples are logged",
        detail: "Check Lab → Sample Tracking to verify samples show 'Received' status"
      },
      {
        action: "Look for pending approvals",
        detail: "Check your Notifications for any approval requests that need action"
      },
      {
        action: "Validate test method selection",
        detail: "Ensure at least one test method is selected for each component"
      }
    ],
    tags: ['trf', 'testing', 'topsheet', 'lab', 'submit', 'approval', 'sample', 'notification'],
    aiNotes: {
      rootCauseTags: ['incomplete-fields', 'testing-level', 'sample-status', 'pending-approval'],
      confidence: 0.94,
      relatedIssues: ['sample-tracking', 'test-method-selection', 'approval-workflow']
    }
  },

  'send-to-lab': {
    id: 'send-to-lab',
    title: "'Send to Lab' button is disabled",
    intent: "You want to send test requests to the lab, but the 'Send to Lab' button is greyed out and won't click.",
    causes: [
      "No test items have been selected for submission",
      "The selected lab doesn't support the chosen test methods",
      "Your account isn't linked to any active lab partnerships",
      "There's a billing hold on your lab account"
    ],
    steps: [
      {
        action: "Select items to send",
        detail: "Use the checkboxes to select at least one TRF or test request"
      },
      {
        action: "Verify lab compatibility",
        detail: "Check that your selected lab is certified for the test methods you need"
      },
      {
        action: "Confirm lab partnership is active",
        detail: "Go to Settings → Lab Connections and check your linked labs"
      },
      {
        action: "Check for account holds",
        detail: "Contact your finance team if you see a 'Billing Hold' notification"
      }
    ],
    tags: ['lab', 'testing', 'trf', 'submit', 'button', 'disabled', 'greyed'],
    aiNotes: {
      rootCauseTags: ['no-selection', 'lab-compatibility', 'lab-partnership', 'billing-hold'],
      confidence: 0.91,
      relatedIssues: ['lab-setup', 'test-method-mapping', 'billing-issues']
    }
  },

  'fabric-no-test-link': {
    id: 'fabric-no-test-link',
    title: "Fabric is linked but no Test Link appears",
    intent: "You've linked a fabric to a style, but when you go to testing, the fabric doesn't show up as a testable component.",
    causes: [
      "The fabric was linked after the TRF was created",
      "The fabric's component type isn't mapped to any test methods",
      "The fabric record is missing required specifications (weight, content)",
      "There's a sync delay between the fabric and testing modules"
    ],
    steps: [
      {
        action: "Refresh the Testing tab",
        detail: "Close and reopen the style, or press Ctrl+Shift+R to force refresh"
      },
      {
        action: "Check fabric specifications",
        detail: "Open the fabric record and verify weight, content %, and construction are filled in"
      },
      {
        action: "Verify component mapping",
        detail: "Go to Settings → Testing Levels and check fabric test method assignments"
      },
      {
        action: "Re-link the fabric if needed",
        detail: "Remove and re-add the fabric link to trigger a fresh sync"
      },
      {
        action: "Wait 2 minutes and check again",
        detail: "Sometimes the system needs a moment to update across modules"
      }
    ],
    tags: ['fabric', 'testing', 'link', 'component', 'trf', 'tabs', 'sync'],
    aiNotes: {
      rootCauseTags: ['timing-issue', 'component-mapping', 'missing-specs', 'sync-delay'],
      confidence: 0.86,
      relatedIssues: ['fabric-linking', 'component-testing', 'test-method-config']
    }
  },

  'excel-missing-fields': {
    id: 'excel-missing-fields',
    title: "Excel export is missing fields",
    intent: "You exported data to Excel, but some columns or information you expected aren't showing up in the file.",
    causes: [
      "The export template doesn't include those fields by default",
      "You don't have permission to view certain data fields",
      "The fields are empty in the system, so they appear blank in Excel",
      "You selected a filtered view that excluded some records"
    ],
    steps: [
      {
        action: "Check your export template",
        detail: "Go to Reports → Export Templates and review which fields are included"
      },
      {
        action: "Remove any active filters",
        detail: "Clear all filters before exporting to get complete data"
      },
      {
        action: "Verify field permissions",
        detail: "Some fields may be hidden based on your role — check with your admin"
      },
      {
        action: "Try 'Export All Fields' option",
        detail: "Look for an advanced export option that includes all available columns"
      },
      {
        action: "Check the source data",
        detail: "Open a few records manually to confirm the data exists in the system"
      }
    ],
    tags: ['excel', 'export', 'download', 'report', 'columns', 'fields', 'roles'],
    aiNotes: {
      rootCauseTags: ['export-template', 'field-permissions', 'empty-data', 'filtered-view'],
      confidence: 0.88,
      relatedIssues: ['export-configuration', 'report-builder', 'data-visibility']
    }
  },

  'upload-photos-phone': {
    id: 'upload-photos-phone',
    title: "I can't upload photos from my phone",
    intent: "You're trying to upload inspection photos or product images from your mobile device, but the upload isn't working.",
    causes: [
      "Your browser doesn't have permission to access your camera or photo library",
      "The photo file is too large (over 10MB)",
      "You're on a slow mobile connection and the upload is timing out",
      "The mobile browser isn't fully supported"
    ],
    steps: [
      {
        action: "Grant camera/photo permissions",
        detail: "Check your phone's Settings → Browser → Permissions and enable camera access"
      },
      {
        action: "Reduce photo size",
        detail: "Try taking a new photo at lower resolution, or use your phone's photo editor to compress"
      },
      {
        action: "Switch to WiFi",
        detail: "Mobile data can be unreliable — connect to WiFi for better upload stability"
      },
      {
        action: "Try a different browser",
        detail: "Use Chrome or Safari for best compatibility with photo uploads"
      },
      {
        action: "Upload one photo at a time",
        detail: "If batch upload fails, try uploading photos individually"
      }
    ],
    tags: ['photos', 'upload', 'mobile', 'camera', 'images', 'inspection', 'fitlog'],
    aiNotes: {
      rootCauseTags: ['browser-permissions', 'file-size', 'connection-timeout', 'browser-compatibility'],
      confidence: 0.90,
      relatedIssues: ['mobile-experience', 'photo-compression', 'network-issues']
    }
  },

  'supplier-no-pd-tabs': {
    id: 'supplier-no-pd-tabs',
    title: "Supplier can't see Product Development tabs",
    intent: "Your supplier partner has logged in but they can't see the Product Development section or related tabs.",
    causes: [
      "The supplier account was created with 'Production Only' access",
      "Product Development sharing hasn't been enabled for this supplier",
      "The supplier is linked to the wrong brand or division",
      "Their account invitation hasn't been fully activated"
    ],
    steps: [
      {
        action: "Check supplier access level",
        detail: "Go to Suppliers → [Supplier Name] → Access Settings and review their permissions"
      },
      {
        action: "Enable PD sharing",
        detail: "Toggle on 'Product Development Access' in the supplier's settings"
      },
      {
        action: "Verify brand assignment",
        detail: "Confirm the supplier is linked to the correct brands under 'Brand Access'"
      },
      {
        action: "Resend the invitation",
        detail: "If they never completed setup, send a fresh activation email"
      },
      {
        action: "Ask them to log out and back in",
        detail: "Permission changes require a fresh login to take effect"
      }
    ],
    tags: ['supplier', 'tabs', 'roles', 'permissions', 'product', 'notification', 'access'],
    aiNotes: {
      rootCauseTags: ['access-level', 'pd-sharing', 'brand-assignment', 'activation-incomplete'],
      confidence: 0.93,
      relatedIssues: ['supplier-onboarding', 'permission-management', 'brand-access']
    }
  },

  'care-label-wrong': {
    id: 'care-label-wrong',
    title: "Care label content is wrong or incomplete",
    intent: "You've generated a care label but the symbols, instructions, or content don't match what you expected.",
    causes: [
      "The fabric composition wasn't entered correctly on the style",
      "The care rules engine is using outdated or default mappings",
      "A custom care instruction override was applied but not saved",
      "The destination market/region isn't set correctly"
    ],
    steps: [
      {
        action: "Verify fabric composition",
        detail: "Go to Style → Components and check that fabric content percentages add up to 100%"
      },
      {
        action: "Check care rule mappings",
        detail: "Go to Settings → Care Labelling → Rules and verify the fiber-to-symbol mappings"
      },
      {
        action: "Review any manual overrides",
        detail: "Look for a yellow 'Override' badge on the care label preview indicating manual changes"
      },
      {
        action: "Set the correct destination market",
        detail: "Update the Region field (US, EU, APAC) to get market-specific symbols"
      },
      {
        action: "Regenerate the label",
        detail: "Click 'Refresh Care Label' to recalculate based on current component data"
      }
    ],
    tags: ['carecode', 'carelabel', 'label', 'symbols', 'wash', 'fabric', 'composition', 'instructions'],
    aiNotes: {
      rootCauseTags: ['composition-error', 'rule-mapping', 'override-applied', 'market-setting'],
      confidence: 0.91,
      relatedIssues: ['fabric-entry', 'care-rules-config', 'label-generation']
    }
  },

  'care-label-missing': {
    id: 'care-label-missing',
    title: "I can't generate a care label",
    intent: "You want to create a care label for a style, but the generate button is disabled or nothing happens when you click it.",
    causes: [
      "The style doesn't have any fabric components linked",
      "Fabric composition is incomplete or missing fiber content",
      "The care labelling module isn't enabled for your account",
      "There's a validation error blocking label generation"
    ],
    steps: [
      {
        action: "Link fabric components first",
        detail: "Go to Style → Components and add at least one fabric with composition data"
      },
      {
        action: "Complete fabric specifications",
        detail: "Each fabric needs fiber type and percentage (e.g., 100% Cotton or 60% Poly/40% Cotton)"
      },
      {
        action: "Check module access",
        detail: "Verify Care Labelling appears in your navigation — contact admin if missing"
      },
      {
        action: "Look for validation errors",
        detail: "Check for red warning banners at the top of the style page"
      },
      {
        action: "Try a different style",
        detail: "Test with another style to confirm it's not a system-wide issue"
      }
    ],
    tags: ['carecode', 'carelabel', 'label', 'generate', 'disabled', 'fabric', 'component'],
    aiNotes: {
      rootCauseTags: ['no-fabric-linked', 'incomplete-composition', 'module-disabled', 'validation-block'],
      confidence: 0.88,
      relatedIssues: ['fabric-linking', 'care-module-setup', 'style-completion']
    }
  },

  'fitlog-photos-missing': {
    id: 'fitlog-photos-missing',
    title: "Fitlog photos aren't showing up",
    intent: "You uploaded photos to a fitlog entry, but they're not appearing in the gallery or timeline.",
    causes: [
      "The photos are still uploading in the background",
      "The file format isn't supported (needs to be JPG, PNG, or HEIC)",
      "There's a browser cache issue preventing display",
      "The photos were uploaded to a different fitlog version"
    ],
    steps: [
      {
        action: "Wait 30 seconds and refresh",
        detail: "Large photos can take time to process — give the system a moment"
      },
      {
        action: "Check the upload queue",
        detail: "Look for a progress indicator in the bottom-right showing pending uploads"
      },
      {
        action: "Verify file format",
        detail: "Ensure your photos are JPG, PNG, or HEIC (PDF and other formats aren't supported)"
      },
      {
        action: "Clear browser cache",
        detail: "Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to force a hard refresh"
      },
      {
        action: "Check fitlog version",
        detail: "Make sure you're viewing the correct fit session version (v1, v2, etc.)"
      }
    ],
    tags: ['fitlog', 'photos', 'images', 'upload', 'gallery', 'fit', 'session', 'missing'],
    aiNotes: {
      rootCauseTags: ['upload-pending', 'file-format', 'cache-issue', 'version-mismatch'],
      confidence: 0.85,
      relatedIssues: ['photo-upload', 'fitlog-versions', 'browser-cache']
    }
  },

  'fitlog-cant-create': {
    id: 'fitlog-cant-create',
    title: "I can't create a new Fitlog entry",
    intent: "You want to log a new fit session, but the create button is missing or disabled.",
    causes: [
      "The style doesn't have a sample linked yet",
      "You don't have Fit Technician or Design permissions",
      "The style is in an archived or locked state",
      "Maximum fitlog entries limit has been reached for this sample"
    ],
    steps: [
      {
        action: "Link a sample first",
        detail: "Go to Style → Samples and ensure at least one sample is created and linked"
      },
      {
        action: "Check your role",
        detail: "Go to Settings → My Profile and verify you have 'Fit Tech' or 'Designer' access"
      },
      {
        action: "Verify style status",
        detail: "Confirm the style shows 'Active' status, not 'Archived' or 'Cancelled'"
      },
      {
        action: "Review existing fitlogs",
        detail: "Check if there are already multiple fit sessions — you may need to update an existing one"
      },
      {
        action: "Try creating from the sample view",
        detail: "Navigate to the specific sample and click 'Add Fit Session' from there"
      }
    ],
    tags: ['fitlog', 'fit', 'session', 'create', 'sample', 'roles', 'disabled'],
    aiNotes: {
      rootCauseTags: ['no-sample', 'role-permissions', 'style-locked', 'entry-limit'],
      confidence: 0.87,
      relatedIssues: ['sample-creation', 'fitlog-workflow', 'style-lifecycle']
    }
  },

  'carecode-not-applying': {
    id: 'carecode-not-applying',
    title: "Care code changes aren't being applied",
    intent: "You updated care codes or instructions, but the changes don't appear on the label preview or exports.",
    causes: [
      "Changes were made but not saved",
      "There's a cached version of the label being displayed",
      "An override at the style level is blocking the care code update",
      "The care code library update is pending approval"
    ],
    steps: [
      {
        action: "Save your changes",
        detail: "Click the 'Save' button after making care code edits — check for unsaved changes indicator"
      },
      {
        action: "Force refresh the preview",
        detail: "Click 'Regenerate Label' or refresh the page to see updated content"
      },
      {
        action: "Check for style-level overrides",
        detail: "Go to Style → Care Label and look for any manual override toggles that are enabled"
      },
      {
        action: "Verify library sync status",
        detail: "Go to Settings → Care Codes and check if updates are in 'Pending' state"
      },
      {
        action: "Clear the label cache",
        detail: "Go to Care Labelling → Actions → Clear Cache for this style"
      }
    ],
    tags: ['carecode', 'carelabel', 'update', 'save', 'apply', 'changes', 'refresh', 'cache'],
    aiNotes: {
      rootCauseTags: ['unsaved-changes', 'cache-stale', 'override-blocking', 'pending-approval'],
      confidence: 0.89,
      relatedIssues: ['care-code-library', 'label-caching', 'override-management']
    }
  },

  'fitlog-measurements-wrong': {
    id: 'fitlog-measurements-wrong',
    title: "Fitlog measurements don't match the spec",
    intent: "The measurements recorded in the fitlog differ from what's expected in the tech pack or spec sheet.",
    causes: [
      "The spec sheet was updated after the fit session was recorded",
      "Measurements were entered in the wrong unit (cm vs inches)",
      "Tolerance calculations aren't being applied correctly",
      "The wrong size is being used as the reference"
    ],
    steps: [
      {
        action: "Compare spec versions",
        detail: "Check if the tech pack was updated — look for version history in the Documents tab"
      },
      {
        action: "Verify measurement units",
        detail: "Confirm both the fitlog and spec are using the same unit (check Settings → Preferences)"
      },
      {
        action: "Review tolerance settings",
        detail: "Go to Style → Specs → Tolerances and verify the acceptable ranges are correct"
      },
      {
        action: "Check the reference size",
        detail: "Ensure you're comparing to the correct base size (e.g., M for grading)"
      },
      {
        action: "Re-measure if needed",
        detail: "Create a new fit session with fresh measurements if data entry errors are suspected"
      }
    ],
    tags: ['fitlog', 'measurements', 'specs', 'tolerance', 'techpack', 'fit', 'grading', 'size'],
    aiNotes: {
      rootCauseTags: ['spec-version-mismatch', 'unit-mismatch', 'tolerance-config', 'size-reference'],
      confidence: 0.84,
      relatedIssues: ['spec-management', 'measurement-entry', 'tolerance-setup']
    }
  }
};

// Map intent IDs to resolution IDs
export const intentToResolutionMap: Record<string, string> = {
  'create-audit': 'create-audit',
  'create-workbook': 'create-workbook',
  'submit-lab': 'submit-trf',
  'link-fabric': 'fabric-no-test-link',
  'export-excel': 'excel-missing-fields',
  'upload-photos': 'upload-photos-phone',
  'missing-tab': 'supplier-no-pd-tabs',
  'care-label': 'care-label-wrong',
  'care-label-missing': 'care-label-missing',
  'fitlog': 'fitlog-photos-missing',
  'fitlog-create': 'fitlog-cant-create',
  'carecode': 'carecode-not-applying',
  'fitlog-measurements': 'fitlog-measurements-wrong'
};

export function getResolutionById(id: string): GuidedResolutionData | undefined {
  return guidedResolutions[id];
}

export function getResolutionForIntent(intentId: string): GuidedResolutionData | undefined {
  const resolutionId = intentToResolutionMap[intentId];
  return resolutionId ? guidedResolutions[resolutionId] : undefined;
}
