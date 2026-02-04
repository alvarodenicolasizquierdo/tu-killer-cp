import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CategoryNav } from '@/components/help-support/CategoryNav';
import { ArticlePanel } from '@/components/help-support/ArticlePanel';
import { AskCarlosPanel } from '@/components/help-support/AskCarlosPanel';
import { IntentCard } from '@/components/help-support/IntentCard';
import { GuidedResolution, GuidedResolutionData } from '@/components/help-support/GuidedResolution';
import { guidedResolutions } from '@/data/guidedResolutions';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  ClipboardCheck, 
  BookOpen, 
  FileSpreadsheet, 
  Camera, 
  Beaker, 
  Link2, 
  Download, 
  AlertTriangle 
} from 'lucide-react';

export interface HelpCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  articleCount: number;
}

export interface HelpIntent {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  categoryId: string;
  intentId?: string;
  steps: {
    title: string;
    content: string;
    tip?: string;
  }[];
  relatedArticles?: string[];
}

const categories: HelpCategory[] = [
  { id: 'audits', label: 'Audits, TRFs & Testing', icon: ClipboardCheck, articleCount: 12 },
  { id: 'fabrics', label: 'Fabrics, Styles & Components', icon: BookOpen, articleCount: 8 },
  { id: 'reports', label: 'Reports & Excel Exports', icon: FileSpreadsheet, articleCount: 6 },
  { id: 'photos', label: 'Photos & Documents', icon: Camera, articleCount: 5 },
  { id: 'dashboard', label: 'Dashboard, Tabs & Roles', icon: Beaker, articleCount: 9 },
  { id: 'care', label: 'Care Codes, Labels & Compliance', icon: Link2, articleCount: 7 },
  { id: 'calendar', label: 'Calendar, Fit Log & Dates', icon: Download, articleCount: 4 },
  { id: 'notifications', label: 'Notifications & Approvals', icon: AlertTriangle, articleCount: 6 },
];

const intents: (HelpIntent & { categoryId: string })[] = [
  { id: 'create-audit', label: 'Create an Audit', icon: ClipboardCheck, description: 'Start a new factory audit', categoryId: 'audits' },
  { id: 'create-workbook', label: 'Create a Workbook', icon: BookOpen, description: 'Build a test workbook for styles', categoryId: 'audits' },
  { id: 'submit-lab', label: 'Submit TRF', icon: Beaker, description: 'Submit a Test Request Form', categoryId: 'audits' },
  { id: 'send-to-lab', label: 'Send to Lab', icon: Beaker, description: 'Send samples for testing', categoryId: 'audits' },
  { id: 'link-fabric', label: 'Link Fabric to Style', icon: Link2, description: 'Associate fabric components', categoryId: 'fabrics' },
  { id: 'fabric-test-link', label: 'Fabric Test Link Missing', icon: AlertTriangle, description: 'Fabric linked but no test', categoryId: 'fabrics' },
  { id: 'export-excel', label: 'Export to Excel', icon: Download, description: 'Download data as spreadsheet', categoryId: 'reports' },
  { id: 'excel-missing', label: 'Excel Missing Fields', icon: FileSpreadsheet, description: 'Export has missing columns', categoryId: 'reports' },
  { id: 'upload-photos', label: 'Upload Photos', icon: Camera, description: 'Add images to records', categoryId: 'photos' },
  { id: 'phone-upload', label: 'Upload from Phone', icon: Camera, description: 'Mobile photo upload issues', categoryId: 'photos' },
  { id: 'fix-tab', label: 'Fix Missing Tab', icon: AlertTriangle, description: 'Tab not visible', categoryId: 'dashboard' },
  { id: 'supplier-tabs', label: 'Supplier Missing Tabs', icon: AlertTriangle, description: 'Supplier can\'t see PD tabs', categoryId: 'dashboard' },
  { id: 'care-issue', label: 'Care Code Issue', icon: FileSpreadsheet, description: 'Care label problems', categoryId: 'care' },
  { id: 'label-generation', label: 'Generate Care Labels', icon: Link2, description: 'Create care label artwork', categoryId: 'care' },
];

const articles: HelpArticle[] = [
  {
    id: 'create-audit',
    title: 'Create a New Audit',
    categoryId: 'audits',
    intentId: 'create-audit',
    steps: [
      {
        title: 'Navigate to Inspections',
        content: 'From the main sidebar, click on "Inspections" to open the inspection management view. You\'ll see the calendar view by default.',
        tip: 'Use keyboard shortcut ⌘+I to quickly jump to Inspections.'
      },
      {
        title: 'Click "Schedule Inspection"',
        content: 'In the top-right corner, click the "Schedule Inspection" button. This opens the audit creation wizard.',
      },
      {
        title: 'Select Factory & Type',
        content: 'Choose the supplier factory from the dropdown, then select the audit type (Initial, Follow-up, or Unannounced).',
        tip: 'For first-time factories, "Initial" audit is required before production approval.'
      },
      {
        title: 'Assign Inspector & Date',
        content: 'Select an available inspector from the team list and pick a date on the calendar. The system shows inspector availability automatically.',
      },
      {
        title: 'Review & Submit',
        content: 'Verify all details are correct, then click "Create Audit". The factory will receive an automatic notification.',
        tip: 'You can edit the audit up to 24 hours before the scheduled date.'
      }
    ],
    relatedArticles: ['submit-lab', 'upload-photos']
  },
  {
    id: 'create-workbook',
    title: 'Create a Test Workbook',
    categoryId: 'audits',
    intentId: 'create-workbook',
    steps: [
      {
        title: 'Open Testing Levels',
        content: 'Navigate to "Testing Levels" from the sidebar to access the workbook builder.',
      },
      {
        title: 'Click "New Workbook"',
        content: 'Use the "New Workbook" button to start a blank workbook template.',
      },
      {
        title: 'Add Test Requirements',
        content: 'Select tests from the library or add custom test parameters based on product requirements.',
        tip: 'AI can suggest tests based on product category and materials.'
      },
      {
        title: 'Link to Styles',
        content: 'Associate the workbook with one or more styles that need these tests.',
      },
      {
        title: 'Save & Activate',
        content: 'Save the workbook to make it available for lab submissions.',
      }
    ]
  },
  {
    id: 'submit-lab',
    title: 'Submit Samples to Lab',
    categoryId: 'audits',
    intentId: 'submit-lab',
    steps: [
      {
        title: 'Open TRF Queue',
        content: 'Navigate to "TRFs" and select the "Pending Submission" tab.',
      },
      {
        title: 'Select Samples',
        content: 'Check the samples you want to submit. You can select multiple samples for the same lab.',
        tip: 'Group samples by lab to save on shipping costs.'
      },
      {
        title: 'Verify Test Plan',
        content: 'Review the test plan for each sample. AI will highlight any missing tests based on your compliance requirements.',
      },
      {
        title: 'Generate Submission',
        content: 'Click "Generate Submission" to create the lab order with barcodes and shipping labels.',
      },
      {
        title: 'Track Status',
        content: 'Monitor progress in the "In Progress" tab. Results typically arrive in 5-7 business days.',
      }
    ]
  },
  {
    id: 'link-fabric',
    title: 'Link Fabric to Style',
    categoryId: 'fabrics',
    intentId: 'link-fabric',
    steps: [
      {
        title: 'Open the Style',
        content: 'Navigate to "Styles" and find the style you want to update.',
      },
      {
        title: 'Go to Components Tab',
        content: 'In the style detail view, click the "Components" tab.',
      },
      {
        title: 'Click "Add Component"',
        content: 'Use the "Add Component" button and select "Fabric" from the type dropdown.',
        tip: 'You can add multiple fabric components for lined or multi-layer garments.'
      },
      {
        title: 'Search & Select',
        content: 'Search for the fabric by code or description. The system shows test status for each option.',
      },
      {
        title: 'Set Usage & Coverage',
        content: 'Specify how the fabric is used (shell, lining, trim) and coverage percentage.',
      }
    ]
  },
  {
    id: 'export-excel',
    title: 'Export Reports to Excel',
    categoryId: 'reports',
    intentId: 'export-excel',
    steps: [
      {
        title: 'Navigate to Report',
        content: 'Open the report or data view you want to export.',
      },
      {
        title: 'Apply Filters',
        content: 'Set any date ranges, status filters, or search criteria to narrow your export.',
        tip: 'Exports include only visible/filtered data, so filter first.'
      },
      {
        title: 'Click Export Button',
        content: 'Look for the "Export" button (usually top-right) and select "Excel (.xlsx)".',
      },
      {
        title: 'Choose Columns',
        content: 'Select which columns to include. You can save presets for frequent exports.',
      },
      {
        title: 'Download File',
        content: 'The file downloads automatically. Large exports may take a few moments.',
      }
    ]
  },
  {
    id: 'upload-photos',
    title: 'Upload Photos to Records',
    categoryId: 'photos',
    intentId: 'upload-photos',
    steps: [
      {
        title: 'Open the Record',
        content: 'Navigate to the inspection, audit, or style where you want to add photos.',
      },
      {
        title: 'Find Photos Section',
        content: 'Look for the "Photos" or "Documents" tab within the record.',
      },
      {
        title: 'Drag & Drop or Click',
        content: 'Drag files onto the upload zone, or click to browse. Supports JPG, PNG, and PDF.',
        tip: 'Maximum file size is 10MB per image. Compress large photos first.'
      },
      {
        title: 'Add Descriptions',
        content: 'Tag each photo with a category (Defect, Sample, Label, etc.) and add notes.',
      },
      {
        title: 'Save Changes',
        content: 'Click "Save" to attach the photos to the record.',
      }
    ]
  },
  {
    id: 'fix-tab',
    title: 'Fix Missing or Hidden Tabs',
    categoryId: 'dashboard',
    intentId: 'fix-tab',
    steps: [
      {
        title: 'Check Your Role',
        content: 'Some tabs are role-restricted. Verify your user role in Settings > Profile.',
        tip: 'Contact your admin if you need access to restricted tabs.'
      },
      {
        title: 'Check Tab Settings',
        content: 'Go to Settings > Display and verify which tabs are enabled for your view.',
      },
      {
        title: 'Clear Browser Cache',
        content: 'Sometimes cached settings hide tabs. Clear cache or try incognito mode.',
      },
      {
        title: 'Check Record Status',
        content: 'Some tabs only appear for records in certain states (e.g., "Results" tab appears after lab submission).',
      },
      {
        title: 'Contact Support',
        content: 'If tabs are still missing, ask Carlos or contact support with your user ID.',
      }
    ]
  },
  {
    id: 'care-issue',
    title: 'Resolve Care Code / Label Issues',
    categoryId: 'care',
    intentId: 'care-issue',
    steps: [
      {
        title: 'Identify the Issue',
        content: 'Check if the problem is: missing care codes, wrong symbols, or label generation error.',
      },
      {
        title: 'Verify Component Data',
        content: 'Care codes are derived from fabric composition. Ensure all components have accurate fiber content.',
        tip: 'Care codes update automatically when you change fabric composition.'
      },
      {
        title: 'Check Market Requirements',
        content: 'Different markets (US, EU, Asia) have different label requirements. Verify the target market is set correctly.',
      },
      {
        title: 'Manual Override',
        content: 'If AI suggestions are wrong, you can manually override care instructions with proper documentation.',
      },
      {
        title: 'Regenerate Labels',
        content: 'After fixes, click "Regenerate Labels" to create updated label artwork.',
      }
    ]
  }
];

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [activeResolution, setActiveResolution] = useState<GuidedResolutionData | null>(null);

  const handleIntentClick = (intentId: string) => {
    // First try to find a guided resolution
    const resolutionMap: Record<string, string> = {
      'create-audit': 'create-audit',
      'create-workbook': 'create-workbook',
      'submit-lab': 'submit-trf',
      'link-fabric': 'fabric-no-test-link',
      'export-excel': 'excel-missing-fields',
      'upload-photos': 'upload-photos-phone',
      'fix-tab': 'supplier-no-pd-tabs',
      'care-issue': 'submit-trf',
    };
    
    const resolutionId = resolutionMap[intentId];
    if (resolutionId && guidedResolutions[resolutionId]) {
      setActiveResolution(guidedResolutions[resolutionId]);
      setSelectedArticle(null);
    } else {
      const article = articles.find(a => a.intentId === intentId);
      if (article) {
        setSelectedArticle(article);
        setActiveResolution(null);
        setSelectedCategory(article.categoryId);
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveResolution(null);
    setSelectedArticle(null); // Clear article to show category intents
  };

  const handleResolutionMatch = (resolution: GuidedResolutionData) => {
    setActiveResolution(resolution);
    setSelectedArticle(null);
  };

  // Intent similarity matching - maps natural language queries to intents
  const intentSimilarityMap: { intentIds: string[]; phrases: string[] }[] = [
    {
      intentIds: ['submit-lab', 'send-to-lab'],
      phrases: [
        'testing', 'test', 'lab', 'send to lab', 'submit', 'topsheet', 'top sheet', 
        'trf', 'can\'t test', 'cannot test', 'can\'t do testing', 'submit trf',
        'send samples', 'lab submission', 'testing issue', 'test request'
      ]
    },
    {
      intentIds: ['create-audit'],
      phrases: [
        'audit', 'factory audit', 'create audit', 'schedule audit', 'new audit',
        'inspection', 'can\'t audit', 'cannot audit', 'start audit'
      ]
    },
    {
      intentIds: ['create-workbook'],
      phrases: [
        'workbook', 'test workbook', 'create workbook', 'new workbook',
        'can\'t create workbook', 'cannot create workbook', 'workbook issue'
      ]
    },
    {
      intentIds: ['link-fabric', 'fabric-test-link'],
      phrases: [
        'fabric', 'link fabric', 'component', 'material', 'fabric test',
        'fabric linked', 'no test', 'fabric issue', 'add fabric'
      ]
    },
    {
      intentIds: ['export-excel', 'excel-missing'],
      phrases: [
        'excel', 'export', 'download', 'spreadsheet', 'missing fields',
        'missing columns', 'excel problem', 'can\'t export', 'cannot export'
      ]
    },
    {
      intentIds: ['upload-photos', 'phone-upload'],
      phrases: [
        'photo', 'photos', 'upload', 'image', 'picture', 'mobile', 'phone',
        'can\'t upload', 'cannot upload', 'upload issue', 'add photo'
      ]
    },
    {
      intentIds: ['fix-tab', 'supplier-tabs'],
      phrases: [
        'tab', 'tabs', 'missing tab', 'hidden', 'can\'t see', 'cannot see',
        'not visible', 'supplier tab', 'pd tab', 'product development'
      ]
    },
    {
      intentIds: ['care-issue', 'label-generation'],
      phrases: [
        'care', 'label', 'care code', 'care label', 'compliance',
        'generate label', 'label issue', 'care issue'
      ]
    }
  ];

  const matchIntentsBySimilarity = (query: string): string[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const matchedIntentIds: Set<string> = new Set();
    
    for (const mapping of intentSimilarityMap) {
      for (const phrase of mapping.phrases) {
        // Check if query contains any matching phrase or vice versa
        if (lowerQuery.includes(phrase) || phrase.includes(lowerQuery)) {
          mapping.intentIds.forEach(id => matchedIntentIds.add(id));
          break;
        }
        // Also check word overlap for multi-word queries
        const queryWords = lowerQuery.split(/\s+/);
        const phraseWords = phrase.split(/\s+/);
        const overlap = queryWords.filter(w => phraseWords.some(pw => pw.includes(w) || w.includes(pw)));
        if (overlap.length >= 1 && queryWords.length >= 2) {
          mapping.intentIds.forEach(id => matchedIntentIds.add(id));
          break;
        }
      }
    }
    
    return Array.from(matchedIntentIds);
  };

  const matchedIntentIds = matchIntentsBySimilarity(searchQuery);
  
  const filteredIntents = searchQuery.trim()
    ? intents.filter(intent => matchedIntentIds.includes(intent.id))
    : intents;

  return (
    <AppLayout title="Help & Support" subtitle="Get unstuck fast">
      {/* Hero Search - Notion/Linear style */}
      <div className="mb-10">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
            What do you need help with?
          </h1>
          <p className="text-muted-foreground">
            Describe what you're trying to do and we'll guide you through it
          </p>
        </div>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="e.g. I can't submit to lab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
          />
        </div>
      </div>

      {/* Intent Cards Grid - Linear style list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
        {filteredIntents.map(intent => (
          <IntentCard
            key={intent.id}
            icon={intent.icon}
            title={intent.label}
            description={intent.description}
            onClick={() => handleIntentClick(intent.id)}
            isActive={selectedArticle?.intentId === intent.id}
          />
        ))}
      </div>

      {/* Three-Panel Layout - Clean Stripe/Linear style */}
      <div className="grid grid-cols-12 gap-8 min-h-[500px]">
        {/* LEFT: Categories Navigation */}
        <div className="col-span-2 border-r border-border pr-6">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryClick}
          />
        </div>

        {/* CENTER: Dynamic Article / Guided Resolution / Category Intents */}
        <div className="col-span-6">
          {activeResolution ? (
            <div className="bg-card rounded-lg border border-border h-full">
              <GuidedResolution
                data={activeResolution}
                onEscalate={() => {
                  console.log('Escalating to SGS support');
                }}
              />
            </div>
          ) : selectedCategory && !selectedArticle ? (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
                {categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <div className="space-y-1">
                {intents
                  .filter(intent => intent.categoryId === selectedCategory)
                  .map(intent => (
                    <IntentCard
                      key={intent.id}
                      icon={intent.icon}
                      title={intent.label}
                      description={intent.description}
                      onClick={() => handleIntentClick(intent.id)}
                      variant="compact"
                    />
                  ))}
              </div>
              {intents.filter(i => i.categoryId === selectedCategory).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No topics in this category yet.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border h-full">
              <ArticlePanel
                article={selectedArticle}
                articles={articles}
                onSelectRelated={(articleId) => {
                  const related = articles.find(a => a.id === articleId);
                  if (related) {
                    setSelectedArticle(related);
                    setActiveResolution(null);
                    setSelectedCategory(related.categoryId);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* RIGHT: Ask Carlos AI Panel */}
        <div className="col-span-4">
          <AskCarlosPanel
            onResolutionMatch={handleResolutionMatch}
          />
        </div>
      </div>
    </AppLayout>
  );
}
