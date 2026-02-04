import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CategoryNav } from '@/components/help-support/CategoryNav';
import { AskCarlosPanel } from '@/components/help-support/AskCarlosPanel';
import { IntentCard } from '@/components/help-support/IntentCard';
import { GuidedResolution, GuidedResolutionData } from '@/components/help-support/GuidedResolution';
import { Input } from '@/components/ui/input';
import { Search, ClipboardCheck, BookOpen, FileSpreadsheet, Camera, Beaker, Link2, Download, AlertTriangle, Tag, Ruler, Send, LayoutDashboard, ImageUp, FlaskConical, FilePlus } from 'lucide-react';
import { 
  helpKnowledgeBase, 
  matchArticleByQuery, 
  getArticleById,
  getArticlesByCategory,
  HelpArticle,
  HelpCategory as KBCategory
} from '@/data/helpKnowledgeBase';

// Map icon names from KB to actual components
const iconMap: Record<string, React.ElementType> = {
  'clipboard-check': ClipboardCheck,
  'file-plus': FilePlus,
  'send': Send,
  'flask-conical': FlaskConical,
  'link': Link2,
  'file-spreadsheet': FileSpreadsheet,
  'image-up': ImageUp,
  'layout-dashboard': LayoutDashboard,
  'tag': Tag,
  'ruler': Ruler,
  'book-open': BookOpen,
  'camera': Camera,
  'beaker': Beaker,
  'download': Download,
  'alert-triangle': AlertTriangle,
};

// Category icons mapping
const categoryIconMap: Record<string, React.ElementType> = {
  'cat_audits_testing': ClipboardCheck,
  'cat_fabrics_styles_components': BookOpen,
  'cat_reports_exports': FileSpreadsheet,
  'cat_photos_documents': Camera,
  'cat_dashboard_roles': LayoutDashboard,
  'cat_carecode_compliance': Tag,
  'cat_calendar_fitlog': Ruler,
  'cat_notifications_approvals': AlertTriangle,
};

export interface HelpCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  articleCount: number;
}

// Convert KB categories to UI format
const categories: HelpCategory[] = helpKnowledgeBase.categories.map(cat => ({
  id: cat.id,
  label: cat.name,
  icon: categoryIconMap[cat.id] || AlertTriangle,
  articleCount: getArticlesByCategory(cat.id).length
}));

// Convert KB article to GuidedResolutionData format
function articleToResolution(article: HelpArticle): GuidedResolutionData {
  return {
    id: article.id,
    title: article.title,
    intent: `You want to: ${article.intent}`,
    causes: article.why_usually_happens,
    steps: article.fix_steps.map((step, i) => ({
      action: `Step ${i + 1}`,
      detail: step
    })),
    tags: article.tags,
    aiNotes: {
      rootCauseTags: article.ai_hidden_notes.root_cause_tags,
      confidence: article.ai_hidden_notes.triage_priority === 'high' ? 0.95 : 
                  article.ai_hidden_notes.triage_priority === 'medium' ? 0.85 : 0.75,
      relatedIssues: []
    }
  };
}

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeResolution, setActiveResolution] = useState<GuidedResolutionData | null>(null);

  const handleIntentClick = (articleId: string) => {
    const article = getArticleById(articleId);
    if (article) {
      setActiveResolution(articleToResolution(article));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveResolution(null);
  };

  const handleResolutionMatch = (resolution: GuidedResolutionData) => {
    setActiveResolution(resolution);
  };

  // Search handling - use KB matching
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      const matchedArticle = matchArticleByQuery(query);
      if (matchedArticle) {
        setActiveResolution(articleToResolution(matchedArticle));
      }
    }
  };

  // Get filtered intent cards based on search
  const getDisplayedIntentCards = () => {
    if (searchQuery.trim()) {
      // Filter cards that match search
      const matchedArticle = matchArticleByQuery(searchQuery);
      if (matchedArticle) {
        const matchedCard = helpKnowledgeBase.ui_intent_cards.find(c => c.article_id === matchedArticle.id);
        if (matchedCard) {
          return [matchedCard];
        }
      }
      // Fallback: filter by keyword
      return helpKnowledgeBase.ui_intent_cards.filter(card => {
        const article = getArticleById(card.article_id);
        if (!article) return false;
        const searchLower = searchQuery.toLowerCase();
        return article.keywords.some(k => k.includes(searchLower) || searchLower.includes(k)) ||
               article.tags.some(t => searchLower.includes(t)) ||
               card.title.toLowerCase().includes(searchLower);
      });
    }
    return helpKnowledgeBase.ui_intent_cards.sort((a, b) => a.order - b.order);
  };

  // Get category-specific articles
  const getCategoryArticles = (categoryId: string) => {
    return getArticlesByCategory(categoryId);
  };

  const displayedCards = getDisplayedIntentCards();

  return (
    <AppLayout title="Help & Support" subtitle="Carlos AI-Assisted Help Center">
      {/* Hero Search - Notion/Linear style */}
      <div className="mb-10">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
            What are you trying to do?
          </h1>
          <p className="text-muted-foreground">
            Describe your problem and Carlos will guide you to a solution
          </p>
        </div>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="e.g. I can't submit to lab, can't create audit, topsheet error..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 h-12 text-base bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
          />
        </div>
      </div>

      {/* Intent Cards Grid - Linear style list */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-10">
        {displayedCards.map(card => {
          const IconComponent = iconMap[card.icon] || AlertTriangle;
          return (
            <IntentCard
              key={card.id}
              icon={IconComponent}
              title={card.title}
              description={card.description}
              onClick={() => handleIntentClick(card.article_id)}
              isActive={activeResolution?.id === card.article_id}
            />
          );
        })}
      </div>

      {/* Three-Panel Layout - Clean Stripe/Linear style */}
      <div className="grid grid-cols-12 gap-8 min-h-[500px]">
        {/* LEFT: Categories Navigation */}
        <div className="col-span-2 border-r border-border pr-6">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryClick}
            onArticleClick={handleIntentClick}
          />
        </div>

        {/* CENTER: Dynamic Guided Resolution / Category View */}
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
          ) : selectedCategory ? (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
                {categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <div className="space-y-1">
                {getCategoryArticles(selectedCategory).map(article => {
                  const card = helpKnowledgeBase.ui_intent_cards.find(c => c.article_id === article.id);
                  const IconComponent = card ? (iconMap[card.icon] || AlertTriangle) : AlertTriangle;
                  return (
                    <IntentCard
                      key={article.id}
                      icon={IconComponent}
                      title={article.title}
                      description={article.intent}
                      onClick={() => handleIntentClick(article.id)}
                      variant="compact"
                    />
                  );
                })}
              </div>
              {getCategoryArticles(selectedCategory).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No topics in this category yet.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select a topic or search
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Click an intent card above, choose a category on the left, or describe your problem in the search bar.
              </p>
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
