import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CategoryNav } from '@/components/help-support/CategoryNav';
import { ArticlePanel } from '@/components/help-support/ArticlePanel';
import { AskCarlosPanel } from '@/components/help-support/AskCarlosPanel';
import { IntentCard } from '@/components/help-support/IntentCard';
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

const intents: HelpIntent[] = [
  { id: 'create-audit', label: 'Create an Audit', icon: ClipboardCheck, description: 'Start a new factory audit from scratch' },
  { id: 'create-workbook', label: 'Create a Workbook', icon: BookOpen, description: 'Build a test workbook for your styles' },
  { id: 'submit-lab', label: 'Submit to Lab', icon: Beaker, description: 'Send samples for laboratory testing' },
  { id: 'link-fabric', label: 'Link Fabric to Style', icon: Link2, description: 'Associate fabric components with styles' },
  { id: 'export-excel', label: 'Export to Excel', icon: Download, description: 'Download reports and data as spreadsheets' },
  { id: 'upload-photos', label: 'Upload Photos', icon: Camera, description: 'Add images to audits or inspections' },
  { id: 'fix-tab', label: 'Fix Missing Tab', icon: AlertTriangle, description: 'Troubleshoot hidden or missing tabs' },
  { id: 'care-issue', label: 'Care Code / Label Issue', icon: FileSpreadsheet, description: 'Resolve care labeling problems' },
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
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const handleIntentClick = (intentId: string) => {
    const article = articles.find(a => a.intentId === intentId);
    if (article) {
      setSelectedArticle(article);
      setSelectedCategory(article.categoryId);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Show first article in category
    const categoryArticle = articles.find(a => a.categoryId === categoryId);
    if (categoryArticle) {
      setSelectedArticle(categoryArticle);
    }
  };

  const handleAskCarlos = (message: string) => {
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: `I understand you're asking about "${message}". Let me help you with that.\n\nBased on your question, here are some suggestions:\n\n1. Check the relevant article in the center panel\n2. Follow the step-by-step guide\n3. If you need more help, describe your specific situation\n\nWould you like me to explain any of these steps in more detail?` }
    ]);
  };

  const filteredIntents = intents.filter(intent =>
    intent.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    intent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Help & Support" subtitle="AI-assisted operational guidance">
      {/* Top Search Section */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What are you trying to do?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-card border-2 border-muted focus:border-primary rounded-xl shadow-sm"
          />
        </div>

        {/* Intent Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredIntents.map(intent => (
            <IntentCard
              key={intent.id}
              intent={intent}
              onClick={() => handleIntentClick(intent.id)}
              isActive={selectedArticle?.intentId === intent.id}
            />
          ))}
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="grid grid-cols-12 gap-6 min-h-[600px]">
        {/* LEFT: Categories Navigation */}
        <div className="col-span-3">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryClick}
          />
        </div>

        {/* CENTER: Dynamic Article / Guided Resolution */}
        <div className="col-span-5">
          <ArticlePanel
            article={selectedArticle}
            articles={articles}
            onSelectRelated={(articleId) => {
              const related = articles.find(a => a.id === articleId);
              if (related) {
                setSelectedArticle(related);
                setSelectedCategory(related.categoryId);
              }
            }}
          />
        </div>

        {/* RIGHT: Ask Carlos AI Panel */}
        <div className="col-span-4">
          <AskCarlosPanel
            messages={chatMessages}
            onSendMessage={handleAskCarlos}
            currentArticle={selectedArticle}
          />
        </div>
      </div>
    </AppLayout>
  );
}
