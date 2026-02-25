import { useState, useMemo } from 'react';
import { tagEvent } from '@/utils/clarityTracking';
import { markdownToSafeHtml } from '@/lib/sanitize';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Mail,
  ChevronRight,
  Clock,
  ThumbsUp,
  Eye,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  mockArticles,
  helpCategories,
  HelpCategory,
  HelpArticle,
} from '@/data/helpData';

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let articles = mockArticles;

    if (selectedCategory !== 'all') {
      articles = articles.filter(a => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return articles.sort((a, b) => b.viewCount - a.viewCount);
  }, [selectedCategory, searchQuery]);

  // Group articles by category for display
  const articlesByCategory = useMemo(() => {
    const grouped: Record<string, HelpArticle[]> = {};
    filteredArticles.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    return grouped;
  }, [filteredArticles]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'webinar': return Video;
      case 'guide': return BookOpen;
      case 'sop': return FileText;
      default: return Sparkles;
    }
  };

  if (selectedArticle) {
    return (
      <AppLayout title="Knowledge Hub" subtitle="Learn how to get the most out of CARLOS">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button
              onClick={() => setSelectedArticle(null)}
              className="hover:text-primary transition-colors"
            >
              Knowledge Hub
            </button>
            <ChevronRight className="h-4 w-4" />
            <span>{helpCategories[selectedArticle.category].label}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{selectedArticle.title}</span>
          </div>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {helpCategories[selectedArticle.category].label}
                  </Badge>
                  <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedArticle.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {selectedArticle.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {selectedArticle.helpfulCount} found helpful
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated {selectedArticle.lastUpdated}
                </span>
                {selectedArticle.source && (
                  <span className="flex items-center gap-1">
                    {(() => {
                      const Icon = getSourceIcon(selectedArticle.source.type);
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {selectedArticle.source.reference}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: markdownToSafeHtml(selectedArticle.content)
                }}
              />

              {/* Tags */}
              <div className="mt-8 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Was this article helpful?</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Yes
                  </Button>
                  <Button variant="outline" size="sm">
                    No
                  </Button>
                  <span className="text-xs text-muted-foreground ml-4">
                    {Math.round((selectedArticle.helpfulCount / selectedArticle.viewCount) * 100)}% found this helpful
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="mt-4"
          >
            ← Back to Knowledge Hub
          </Button>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Knowledge Hub" subtitle="Learn how to get the most out of CARLOS">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Search our knowledge base or browse by topic to find answers to your questions.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles, guides, and FAQs..."
              className="pl-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Grid */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {Object.entries(helpCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as HelpCategory)}
                className="p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
              >
                <cat.icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm">{cat.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Category Filter Pills */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Topics
            </Button>
            {Object.entries(helpCategories).map(([key, cat]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key as HelpCategory)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        )}

        {/* Results Count */}
        {(searchQuery || selectedCategory !== 'all') && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${helpCategories[selectedCategory].label}`}
          </p>
        )}

        {/* Articles List */}
        <div className="space-y-6">
          {selectedCategory === 'all' && !searchQuery ? (
            // Grouped by category
            Object.entries(articlesByCategory).map(([category, articles]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    {(() => {
                      const cat = helpCategories[category as HelpCategory];
                      return (
                        <>
                          <cat.icon className="h-4 w-4 text-primary" />
                          {cat.label}
                        </>
                      );
                    })()}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(category as HelpCategory)}
                  >
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.slice(0, 2).map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                    onClick={() => { setSelectedArticle(article); tagEvent('knowledge_article_view', article.title); }}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Flat list
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => { setSelectedArticle(article); tagEvent('knowledge_article_view', article.title); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No articles found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or browse all topics.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear filters
            </Button>
          </div>
        )}

        {/* AI Assist CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl ai-gradient flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">Can't find what you're looking for?</h3>
              <p className="text-sm text-muted-foreground">
                Ask our AI assistant for personalized help based on your current context.
              </p>
            </div>
            <Button className="ai-gradient border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

// Article Card Component
function ArticleCard({ 
  article, 
  onClick 
}: { 
  article: HelpArticle; 
  onClick: () => void;
}) {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'webinar': return Video;
      case 'guide': return BookOpen;
      case 'sop': return FileText;
      default: return Sparkles;
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left w-full group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
            {article.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {article.summary}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {Math.round((article.helpfulCount / article.viewCount) * 100)}%
            </span>
            {article.source && (
              <span className="flex items-center gap-1">
                {(() => {
                  const Icon = getSourceIcon(article.source.type);
                  return <Icon className="h-3 w-3" />;
                })()}
                {article.source.type}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </motion.button>
  );
}
