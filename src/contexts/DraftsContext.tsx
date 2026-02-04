import { createContext, useContext, useState, ReactNode } from 'react';

export interface Draft {
  id: string;
  question: string;
  answer: string;
  sourceType: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  originalQuestionId: string;
  status: 'draft' | 'in_review' | 'ready';
}

interface DraftsContextType {
  drafts: Draft[];
  addDraft: (draft: Omit<Draft, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateDraft: (id: string, updates: Partial<Draft>) => void;
  deleteDraft: (id: string) => void;
  publishDraft: (id: string) => void;
}

const DraftsContext = createContext<DraftsContextType | undefined>(undefined);

// Initial mock data
const initialDrafts: Draft[] = [
  {
    id: 'draft-1',
    question: 'How do I request a rush TRF approval for urgent orders?',
    answer: 'For urgent TRF approvals, navigate to the TRF detail page and click the "Request Rush" button in the top toolbar. This will escalate the request to senior approvers and flag it as high priority. Rush requests typically receive response within 4 hours during business hours.',
    sourceType: 'sme',
    createdBy: 'Leo Martinez',
    createdAt: '2026-02-04T09:15:00Z',
    lastModified: '2026-02-04T10:30:00Z',
    originalQuestionId: 'uq-1',
    status: 'in_review',
  },
  {
    id: 'draft-2',
    question: 'What happens if a supplier fails the same test twice?',
    answer: 'When a supplier fails the same test twice, the system automatically triggers a Supplier Performance Review (SPR). The supplier status changes to "At Risk" and they receive a formal notification. A corrective action plan must be submitted within 14 days, and retesting is required before any new TRFs can be approved.',
    sourceType: 'sop',
    createdBy: 'Emma Wilson',
    createdAt: '2026-02-03T16:45:00Z',
    lastModified: '2026-02-03T16:45:00Z',
    originalQuestionId: 'uq-2',
    status: 'draft',
  },
  {
    id: 'draft-3',
    question: 'How do I export test results to PDF for auditors?',
    answer: 'To export test results: 1) Open the TRF detail page, 2) Click the "Export" dropdown in the top-right, 3) Select "PDF Report", 4) Choose sections to include (results, timeline, approvals), 5) Click Generate. The PDF will download automatically and includes digital signatures for audit compliance.',
    sourceType: 'email',
    createdBy: 'Sarah Chen',
    createdAt: '2026-02-02T11:20:00Z',
    lastModified: '2026-02-04T08:00:00Z',
    originalQuestionId: 'uq-4',
    status: 'ready',
  },
  {
    id: 'draft-4',
    question: 'Can I bulk approve components from different styles?',
    answer: 'Yes, bulk approval is available for users with QA Manager role or higher. Go to Components > Select multiple components using checkboxes > Click "Bulk Actions" > "Approve Selected". Note: All selected components must meet minimum testing requirements and cannot have pending failures.',
    sourceType: 'webinar',
    createdBy: 'Hajra Malik',
    createdAt: '2026-02-01T14:30:00Z',
    lastModified: '2026-02-01T14:30:00Z',
    originalQuestionId: 'uq-3',
    status: 'draft',
  },
];

export function DraftsProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);

  const addDraft = (draft: Omit<Draft, 'id' | 'createdAt' | 'lastModified'>) => {
    const now = new Date().toISOString();
    const newDraft: Draft = {
      ...draft,
      id: `draft-${Date.now()}`,
      createdAt: now,
      lastModified: now,
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const updateDraft = (id: string, updates: Partial<Draft>) => {
    setDrafts(prev => prev.map(d => 
      d.id === id 
        ? { ...d, ...updates, lastModified: new Date().toISOString() }
        : d
    ));
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const publishDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DraftsContext.Provider value={{ drafts, addDraft, updateDraft, deleteDraft, publishDraft }}>
      {children}
    </DraftsContext.Provider>
  );
}

export function useDrafts() {
  const context = useContext(DraftsContext);
  if (context === undefined) {
    throw new Error('useDrafts must be used within a DraftsProvider');
  }
  return context;
}
