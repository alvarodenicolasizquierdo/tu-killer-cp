/**
 * Carlos Help Center Knowledge Base
 * 
 * This KB uses intent_similarity_then_tags matching strategy.
 * Fields for embedding: title, user_symptoms, intent, why_usually_happens, fix_steps, keywords, tags
 */

export interface HelpCategory {
  id: string;
  name: string;
  order: number;
}

export interface HelpArticle {
  id: string;
  category_id: string;
  title: string;
  intent: string;
  user_symptoms: string[];
  why_usually_happens: string[];
  fix_steps: string[];
  still_not_working_escalate_when: string[];
  escalation_payload_fields: string[];
  keywords: string[];
  tags: string[];
  ai_hidden_notes: {
    root_cause_tags: string[];
    triage_priority: 'low' | 'medium' | 'high';
  };
}

export interface UIIntentCard {
  id: string;
  title: string;
  description: string;
  article_id: string;
  icon: string;
  order: number;
}

export interface HelpKnowledgeBase {
  kb_name: string;
  version: string;
  language: string;
  matching: {
    strategy: string;
    fields_for_embedding: string[];
    fallback: string;
  };
  categories: HelpCategory[];
  articles: HelpArticle[];
  ui_intent_cards: UIIntentCard[];
}

export const helpKnowledgeBase: HelpKnowledgeBase = {
  kb_name: "Carlos Help Center KB",
  version: "v1.0",
  language: "en",
  matching: {
    strategy: "intent_similarity_then_tags",
    fields_for_embedding: ["title", "user_symptoms", "intent", "why_usually_happens", "fix_steps", "keywords", "tags"],
    fallback: "route_to_ask_carlos"
  },
  categories: [
    { id: "cat_audits_testing", name: "Audits, TRFs & Testing", order: 1 },
    { id: "cat_fabrics_styles_components", name: "Fabrics, Styles & Components", order: 2 },
    { id: "cat_reports_exports", name: "Reports & Excel Exports", order: 3 },
    { id: "cat_photos_documents", name: "Photos & Documents", order: 4 },
    { id: "cat_dashboard_roles", name: "Dashboard, Tabs & Roles", order: 5 },
    { id: "cat_carecode_compliance", name: "Care Codes, Labels & Compliance", order: 6 },
    { id: "cat_calendar_fitlog", name: "Calendar, Fit Log & Dates", order: 7 },
    { id: "cat_notifications_approvals", name: "Notifications & Approvals", order: 8 }
  ],
  articles: [
    {
      id: "a_cannot_create_audit",
      category_id: "cat_audits_testing",
      title: "Cannot create an Audit (button disabled or error)",
      intent: "Create an Audit",
      user_symptoms: [
        "The 'Create Audit' button is greyed out.",
        "I click 'Create Audit' and get an error.",
        "Audit creation fails after selecting factory/supplier."
      ],
      why_usually_happens: [
        "Factory is not correctly linked to the supplier profile.",
        "Factory approval status is not Active.",
        "User role/permission does not allow audit creation.",
        "Browser/session cache issue."
      ],
      fix_steps: [
        "Confirm the factory appears under the correct supplier profile.",
        "Check the factory status is Active (not Pending/Inactive).",
        "Log out and log back in, then retry in Chrome.",
        "If you still cannot create the audit, capture a screenshot of the disabled state/error message."
      ],
      still_not_working_escalate_when: [
        "Factory is visible and Active but create still fails.",
        "The 'Create Audit' option is missing entirely for a role that should have it."
      ],
      escalation_payload_fields: [
        "supplier_name", "factory_name", "factory_id_if_known", "user_email", "user_role", "screenshot_or_error_text", "timestamp_local"
      ],
      keywords: ["create audit", "audit button disabled", "cannot create audit", "audit error"],
      tags: ["audit", "permissions", "supplier", "factory", "workflow"],
      ai_hidden_notes: {
        root_cause_tags: ["relationship_missing", "status_blocking", "permission_denied", "session_cache"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_cannot_create_workbook",
      category_id: "cat_audits_testing",
      title: "Cannot create a Workbook",
      intent: "Create a Workbook",
      user_symptoms: [
        "Error when creating a workbook.",
        "'Create Workbook' is missing.",
        "Workbook creation loads but fails on save."
      ],
      why_usually_happens: [
        "Style is not correctly linked to fabric/components.",
        "Product group mapping missing or invalid.",
        "Role lacks workbook permission."
      ],
      fix_steps: [
        "Open the Style and verify fabric/components are linked and saved.",
        "Confirm Product Group is set correctly for the style.",
        "Log out/in and retry in Chrome.",
        "If 'Create Workbook' is not visible, this is likely a permissions issue."
      ],
      still_not_working_escalate_when: [
        "All links exist and Product Group is correct but creation still fails.",
        "User cannot see 'Create Workbook' and should have access."
      ],
      escalation_payload_fields: [
        "style_code", "supplier_name", "user_email", "user_role", "screenshot_or_error_text", "steps_already_tried"
      ],
      keywords: ["create workbook", "workbook error", "workbook missing"],
      tags: ["workbook", "style", "components", "permissions", "product_group"],
      ai_hidden_notes: {
        root_cause_tags: ["mapping_missing", "permission_denied", "linking_incomplete"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_cannot_submit_trf_topsheet",
      category_id: "cat_audits_testing",
      title: "Cannot submit TRF / Testing Top Sheet",
      intent: "Submit TRF / Top Sheet",
      user_symptoms: [
        "Submit button does nothing.",
        "Submission fails with validation error.",
        "System says mandatory fields missing but I cannot find them."
      ],
      why_usually_happens: [
        "Mandatory fields not completed (often composition/care/appendix/version).",
        "Data required for compliance (e.g., UKAS appendix/version) missing.",
        "Session/browser caching prevents validation refresh."
      ],
      fix_steps: [
        "Re-check mandatory fields (especially fibre composition, care code, and required compliance fields).",
        "Confirm appendix number and version fields are filled where required.",
        "Save, refresh page, then submit again.",
        "Try in Chrome or after logging out/in."
      ],
      still_not_working_escalate_when: [
        "All fields are completed but submit still fails.",
        "Validation error is unclear or points to a field that is not present in UI."
      ],
      escalation_payload_fields: [
        "style_code", "trf_or_request_id_if_known", "error_text", "screenshot", "browser", "timestamp_local"
      ],
      keywords: ["submit trf", "top sheet", "cannot submit", "testing request"],
      tags: ["trf", "testing", "compliance", "validation"],
      ai_hidden_notes: {
        root_cause_tags: ["required_fields_missing", "ui_validation_bug", "session_cache"],
        triage_priority: "high"
      }
    },
    {
      id: "a_send_to_lab_disabled",
      category_id: "cat_audits_testing",
      title: "'Send to Lab' is disabled",
      intent: "Send to Lab",
      user_symptoms: [
        "Send to Lab button is disabled.",
        "Cannot progress to lab stage."
      ],
      why_usually_happens: [
        "Workbook is incomplete or not approved.",
        "Required documents are missing.",
        "Workflow stage prerequisites not met."
      ],
      fix_steps: [
        "Open the workbook and confirm status is Approved (not Draft/In Review).",
        "Check required documents are uploaded.",
        "Refresh and retry."
      ],
      still_not_working_escalate_when: [
        "Workbook shows Approved and documents are present but button remains disabled."
      ],
      escalation_payload_fields: [
        "workbook_id_if_known", "style_code", "current_status", "screenshot", "timestamp_local"
      ],
      keywords: ["send to lab disabled", "lab submission", "cannot send to lab"],
      tags: ["lab", "workflow", "workbook", "testing"],
      ai_hidden_notes: {
        root_cause_tags: ["workflow_prereq", "status_blocking"],
        triage_priority: "high"
      }
    },
    {
      id: "a_fabric_link_no_test_link",
      category_id: "cat_fabrics_styles_components",
      title: "Fabric linked to Style but no Test Link appears",
      intent: "Link Fabric to Style / Create Test Link",
      user_symptoms: [
        "Fabric shows linked but test link does not appear.",
        "Test link appears intermittently."
      ],
      why_usually_happens: [
        "Relationship did not persist due to save/caching issue.",
        "User linked but did not save the style properly.",
        "Delayed indexing of linkage."
      ],
      fix_steps: [
        "Re-open the Style, remove and re-add the fabric link.",
        "Save the Style and refresh the page.",
        "Log out/in if link still does not appear."
      ],
      still_not_working_escalate_when: [
        "Repeated relink + save does not generate test link."
      ],
      escalation_payload_fields: [
        "style_code", "fabric_id_or_name", "screenshot", "steps_already_tried"
      ],
      keywords: ["test link", "fabric link", "style fabric link", "no test link"],
      tags: ["fabric", "style", "linking", "testing"],
      ai_hidden_notes: {
        root_cause_tags: ["save_not_persisted", "indexing_delay", "ui_cache"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_excel_export_missing_fields",
      category_id: "cat_reports_exports",
      title: "Excel export is missing fields (measurements, care codes, colours)",
      intent: "Export to Excel / Generate Report",
      user_symptoms: [
        "Export works but key columns are missing.",
        "Measurements/care codes/colours do not appear in Excel."
      ],
      why_usually_happens: [
        "Report template mapping does not include the field.",
        "Field exists in UI but is not wired into export."
      ],
      fix_steps: [
        "Confirm the field exists in the UI for the record in question.",
        "Identify exactly which missing fields are required and in which report/export.",
        "Escalate as a configuration/template update request (not user error)."
      ],
      still_not_working_escalate_when: [
        "Always escalate if the issue is missing columns in export (requires THT change)."
      ],
      escalation_payload_fields: [
        "report_name", "export_type", "missing_fields_list", "example_style_code", "screenshot"
      ],
      keywords: ["excel export missing fields", "missing columns", "report export"],
      tags: ["reports", "excel", "export", "mapping"],
      ai_hidden_notes: {
        root_cause_tags: ["report_template_mapping"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_cannot_upload_photos_mobile",
      category_id: "cat_photos_documents",
      title: "Cannot upload photos from phone",
      intent: "Upload Photos",
      user_symptoms: [
        "Upload fails on mobile.",
        "Photo selector opens but nothing uploads.",
        "Upload spins indefinitely on iPhone/Android."
      ],
      why_usually_happens: [
        "Mobile browser compatibility limitation.",
        "Large image size or permissions issue."
      ],
      fix_steps: [
        "Try uploading from desktop using Chrome.",
        "If mobile is required, use Chrome (not in-app browsers).",
        "Try a smaller image file if upload starts but fails."
      ],
      still_not_working_escalate_when: [
        "Desktop Chrome upload also fails for the same record."
      ],
      escalation_payload_fields: [
        "device_type", "browser", "style_code_or_record", "error_text_if_any", "screenshot"
      ],
      keywords: ["upload photos", "mobile upload", "iphone upload", "android upload"],
      tags: ["photos", "upload", "mobile", "documents"],
      ai_hidden_notes: {
        root_cause_tags: ["mobile_compatibility", "file_size", "permission_issue"],
        triage_priority: "low"
      }
    },
    {
      id: "a_supplier_cannot_see_pd_tabs",
      category_id: "cat_dashboard_roles",
      title: "Supplier cannot see Product Development tabs",
      intent: "Access Product Development tabs",
      user_symptoms: [
        "Tabs are missing for supplier user.",
        "Supplier can log in but sees limited navigation."
      ],
      why_usually_happens: [
        "Role permission not assigned correctly.",
        "Supplier tier restrictions."
      ],
      fix_steps: [
        "Confirm the user role that should have access.",
        "Request THT to assign the correct permission group/role."
      ],
      still_not_working_escalate_when: [
        "Always escalate if tabs are missing (permissions/configuration)."
      ],
      escalation_payload_fields: [
        "supplier_name", "user_email", "expected_role", "screenshots_of_missing_tabs"
      ],
      keywords: ["missing tabs", "cannot see product development", "pd tabs missing"],
      tags: ["roles", "permissions", "tabs", "dashboard"],
      ai_hidden_notes: {
        root_cause_tags: ["permission_denied", "tier_restriction"],
        triage_priority: "high"
      }
    },
    // Care & Compliance articles
    {
      id: "a_care_label_wrong",
      category_id: "cat_carecode_compliance",
      title: "Care label content is wrong or incomplete",
      intent: "Fix Care Label Content",
      user_symptoms: [
        "Care symbols don't match fabric type.",
        "Instructions are incorrect for the garment.",
        "Some care information is missing."
      ],
      why_usually_happens: [
        "Fabric composition wasn't entered correctly.",
        "Care rules engine using outdated mappings.",
        "Custom override was applied but not saved.",
        "Destination market/region isn't set correctly."
      ],
      fix_steps: [
        "Verify fabric composition adds up to 100%.",
        "Check care rule mappings in Settings → Care Labelling → Rules.",
        "Look for yellow 'Override' badge indicating manual changes.",
        "Set correct destination market (US, EU, APAC).",
        "Click 'Refresh Care Label' to recalculate."
      ],
      still_not_working_escalate_when: [
        "Composition is correct but symbols remain wrong.",
        "Care rules appear to be system-wide issue."
      ],
      escalation_payload_fields: [
        "style_code", "fabric_composition", "expected_symbols", "actual_symbols", "screenshot"
      ],
      keywords: ["care label wrong", "wrong symbols", "care instructions", "label content"],
      tags: ["carecode", "carelabel", "symbols", "compliance"],
      ai_hidden_notes: {
        root_cause_tags: ["composition_error", "rule_mapping", "override_applied"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_care_label_missing",
      category_id: "cat_carecode_compliance",
      title: "Cannot generate a care label",
      intent: "Generate Care Label",
      user_symptoms: [
        "Generate button is disabled.",
        "Nothing happens when clicking generate.",
        "Care label section shows empty."
      ],
      why_usually_happens: [
        "Style doesn't have fabric components linked.",
        "Fabric composition is incomplete.",
        "Care labelling module isn't enabled.",
        "Validation error blocking generation."
      ],
      fix_steps: [
        "Add at least one fabric with composition data.",
        "Complete fiber type and percentage for each fabric.",
        "Verify Care Labelling appears in navigation.",
        "Check for red warning banners on style page."
      ],
      still_not_working_escalate_when: [
        "All fabric data is complete but generation still disabled."
      ],
      escalation_payload_fields: [
        "style_code", "components_linked", "screenshot", "error_messages"
      ],
      keywords: ["generate care label", "care label disabled", "no care label"],
      tags: ["carecode", "carelabel", "generate", "disabled"],
      ai_hidden_notes: {
        root_cause_tags: ["no_fabric_linked", "incomplete_composition", "module_disabled"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_carecode_not_applying",
      category_id: "cat_carecode_compliance",
      title: "Care code changes aren't being applied",
      intent: "Apply Care Code Changes",
      user_symptoms: [
        "Changes don't appear on label preview.",
        "Exports show old care information.",
        "Updates seem to not save."
      ],
      why_usually_happens: [
        "Changes made but not saved.",
        "Cached version being displayed.",
        "Style-level override blocking update.",
        "Care code library update pending approval."
      ],
      fix_steps: [
        "Click Save after making edits.",
        "Click 'Regenerate Label' or refresh page.",
        "Check for style-level override toggles.",
        "Verify library sync status in Settings → Care Codes.",
        "Clear label cache for this style."
      ],
      still_not_working_escalate_when: [
        "All steps completed but changes still not reflecting."
      ],
      escalation_payload_fields: [
        "style_code", "changes_made", "current_display", "expected_display", "screenshot"
      ],
      keywords: ["care code changes", "carecode not applying", "label not updating"],
      tags: ["carecode", "update", "cache", "sync"],
      ai_hidden_notes: {
        root_cause_tags: ["unsaved_changes", "cache_stale", "override_blocking"],
        triage_priority: "medium"
      }
    },
    // Fitlog articles
    {
      id: "a_fitlog_photos_missing",
      category_id: "cat_calendar_fitlog",
      title: "Fitlog photos aren't showing up",
      intent: "View Fitlog Photos",
      user_symptoms: [
        "Uploaded photos not appearing.",
        "Gallery shows empty.",
        "Photos visible sometimes but not always."
      ],
      why_usually_happens: [
        "Photos still uploading in background.",
        "File format not supported (needs JPG, PNG, HEIC).",
        "Browser cache issue.",
        "Photos uploaded to different fitlog version."
      ],
      fix_steps: [
        "Wait 30 seconds and refresh.",
        "Check upload queue in bottom-right.",
        "Verify file format is JPG, PNG, or HEIC.",
        "Press Ctrl+Shift+R for hard refresh.",
        "Check correct fitlog version (v1, v2, etc.)."
      ],
      still_not_working_escalate_when: [
        "Photos confirmed uploaded but never appear."
      ],
      escalation_payload_fields: [
        "style_code", "fitlog_id", "photo_filenames", "browser", "screenshot"
      ],
      keywords: ["fitlog photos", "photos missing", "fit photos not showing"],
      tags: ["fitlog", "photos", "upload", "gallery"],
      ai_hidden_notes: {
        root_cause_tags: ["upload_pending", "file_format", "cache_issue"],
        triage_priority: "low"
      }
    },
    {
      id: "a_fitlog_cant_create",
      category_id: "cat_calendar_fitlog",
      title: "Cannot create a new Fitlog entry",
      intent: "Create Fitlog Entry",
      user_symptoms: [
        "Create button is missing.",
        "Button is disabled/greyed out.",
        "Error when trying to create."
      ],
      why_usually_happens: [
        "Style doesn't have sample linked.",
        "Don't have Fit Technician/Design permissions.",
        "Style is archived or locked.",
        "Maximum fitlog entries reached."
      ],
      fix_steps: [
        "Link a sample first in Style → Samples.",
        "Check role in Settings → My Profile.",
        "Verify style shows 'Active' status.",
        "Review existing fitlogs - may need to update one.",
        "Try creating from specific sample view."
      ],
      still_not_working_escalate_when: [
        "Sample linked, role correct, but still can't create."
      ],
      escalation_payload_fields: [
        "style_code", "sample_id", "user_role", "screenshot", "error_text"
      ],
      keywords: ["create fitlog", "fitlog disabled", "new fit session"],
      tags: ["fitlog", "create", "sample", "permissions"],
      ai_hidden_notes: {
        root_cause_tags: ["no_sample", "role_permissions", "style_locked"],
        triage_priority: "medium"
      }
    },
    {
      id: "a_fitlog_measurements_wrong",
      category_id: "cat_calendar_fitlog",
      title: "Fitlog measurements don't match the spec",
      intent: "Fix Measurement Mismatch",
      user_symptoms: [
        "Measurements differ from tech pack.",
        "Tolerance calculations seem wrong.",
        "Wrong size being compared."
      ],
      why_usually_happens: [
        "Spec sheet updated after fit session.",
        "Measurements in wrong unit (cm vs inches).",
        "Tolerance calculations not applied correctly.",
        "Wrong size used as reference."
      ],
      fix_steps: [
        "Compare spec versions in Documents tab.",
        "Verify measurement units match (Settings → Preferences).",
        "Review tolerance settings in Style → Specs → Tolerances.",
        "Check reference size is correct base size.",
        "Create new fit session if data entry error suspected."
      ],
      still_not_working_escalate_when: [
        "Units correct, tolerances verified, but mismatch persists."
      ],
      escalation_payload_fields: [
        "style_code", "fitlog_id", "measurement_point", "expected_value", "actual_value", "screenshot"
      ],
      keywords: ["fitlog measurements", "spec mismatch", "tolerance wrong"],
      tags: ["fitlog", "measurements", "specs", "tolerance"],
      ai_hidden_notes: {
        root_cause_tags: ["spec_version_mismatch", "unit_mismatch", "tolerance_config"],
        triage_priority: "medium"
      }
    }
  ],
  ui_intent_cards: [
    {
      id: "ic_create_audit",
      title: "Create an Audit",
      description: "Fix disabled buttons and audit creation errors.",
      article_id: "a_cannot_create_audit",
      icon: "clipboard-check",
      order: 1
    },
    {
      id: "ic_create_workbook",
      title: "Create a Workbook",
      description: "Resolve workbook creation failures and missing actions.",
      article_id: "a_cannot_create_workbook",
      icon: "file-plus",
      order: 2
    },
    {
      id: "ic_submit_trf",
      title: "Submit TRF / Top Sheet",
      description: "Fix submission errors and missing required fields.",
      article_id: "a_cannot_submit_trf_topsheet",
      icon: "send",
      order: 3
    },
    {
      id: "ic_send_to_lab",
      title: "Send to Lab",
      description: "Unblock lab submission when button is disabled.",
      article_id: "a_send_to_lab_disabled",
      icon: "flask-conical",
      order: 4
    },
    {
      id: "ic_link_fabric_style",
      title: "Link Fabric to Style",
      description: "Fix missing test links after linking fabrics.",
      article_id: "a_fabric_link_no_test_link",
      icon: "link",
      order: 5
    },
    {
      id: "ic_export_excel",
      title: "Export to Excel",
      description: "Resolve missing fields in exports and reports.",
      article_id: "a_excel_export_missing_fields",
      icon: "file-spreadsheet",
      order: 6
    },
    {
      id: "ic_upload_photos",
      title: "Upload Photos",
      description: "Fix mobile upload issues and browser constraints.",
      article_id: "a_cannot_upload_photos_mobile",
      icon: "image-up",
      order: 7
    },
    {
      id: "ic_missing_tabs",
      title: "Missing Tabs / Access",
      description: "Restore missing Product Development tabs via role permissions.",
      article_id: "a_supplier_cannot_see_pd_tabs",
      icon: "layout-dashboard",
      order: 8
    },
    // Additional intent cards for care/fitlog
    {
      id: "ic_care_label",
      title: "Care Label Issues",
      description: "Fix wrong symbols, missing labels, or generation errors.",
      article_id: "a_care_label_wrong",
      icon: "tag",
      order: 9
    },
    {
      id: "ic_fitlog",
      title: "Fitlog Problems",
      description: "Resolve photo, measurement, and creation issues.",
      article_id: "a_fitlog_photos_missing",
      icon: "ruler",
      order: 10
    }
  ]
};

// Helper functions
export function getArticleById(id: string): HelpArticle | undefined {
  return helpKnowledgeBase.articles.find(a => a.id === id);
}

export function getArticlesByCategory(categoryId: string): HelpArticle[] {
  return helpKnowledgeBase.articles.filter(a => a.category_id === categoryId);
}

export function getCategoryById(id: string): HelpCategory | undefined {
  return helpKnowledgeBase.categories.find(c => c.id === id);
}

export function getIntentCardByArticleId(articleId: string): UIIntentCard | undefined {
  return helpKnowledgeBase.ui_intent_cards.find(c => c.article_id === articleId);
}

/**
 * Intent similarity matching - maps natural language queries to articles
 * Uses keywords, tags, user_symptoms, and title for matching
 */
export function matchArticleByQuery(query: string): HelpArticle | null {
  if (!query.trim()) return null;
  
  const lowerQuery = query.toLowerCase();
  let bestMatch: { article: HelpArticle; score: number } | null = null;
  
  for (const article of helpKnowledgeBase.articles) {
    let score = 0;
    
    // Check title (high weight)
    if (article.title.toLowerCase().includes(lowerQuery)) {
      score += 10;
    }
    
    // Check intent (high weight)
    if (article.intent.toLowerCase().includes(lowerQuery)) {
      score += 8;
    }
    
    // Check keywords (high weight)
    for (const keyword of article.keywords) {
      if (lowerQuery.includes(keyword) || keyword.includes(lowerQuery)) {
        score += 5;
      }
    }
    
    // Check tags (medium weight)
    for (const tag of article.tags) {
      if (lowerQuery.includes(tag)) {
        score += 3;
      }
    }
    
    // Check user symptoms (medium weight)
    for (const symptom of article.user_symptoms) {
      const lowerSymptom = symptom.toLowerCase();
      if (lowerSymptom.includes(lowerQuery) || lowerQuery.includes(lowerSymptom.slice(0, 20))) {
        score += 4;
      }
    }
    
    // Word overlap check
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    const articleText = [
      article.title,
      article.intent,
      ...article.keywords,
      ...article.tags
    ].join(' ').toLowerCase();
    
    for (const word of queryWords) {
      if (articleText.includes(word)) {
        score += 2;
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { article, score };
    }
  }
  
  return bestMatch?.article || null;
}

/**
 * Get articles matching a category for display
 */
export function getIntentCardsForCategory(categoryId: string): UIIntentCard[] {
  const articleIds = helpKnowledgeBase.articles
    .filter(a => a.category_id === categoryId)
    .map(a => a.id);
  
  return helpKnowledgeBase.ui_intent_cards.filter(c => articleIds.includes(c.article_id));
}
