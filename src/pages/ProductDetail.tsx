import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tagScreen } from '@/utils/clarityTracking';
import { ArrowLeft, Package, Building2, MapPin, FileText, AlertTriangle, CheckCircle2, Clock, ExternalLink, ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { mockProducts, mockTRFs, mockSuppliers } from '@/data/mockData';
import { Product } from '@/types';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { AIAssessmentStrip } from '@/components/ai/AIAssessmentStrip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => { tagScreen('portal-product-detail'); }, []);

  const product = mockProducts.find(p => p.id === id);
  const supplier = mockSuppliers.find(s => s.id === product?.supplierId);
  const relatedTRFs = mockTRFs.filter(trf => 
    trf.productCode === product?.code || 
    trf.productName.toLowerCase().includes(product?.name.toLowerCase().split(' ')[0] || '')
  );

  if (!product) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getComplianceColor = (status: Product['complianceStatus']) => {
    switch (status) {
      case 'compliant': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'pending_review': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'non_compliant': return 'bg-red-500/10 text-red-600 border-red-200';
    }
  };

  const getComplianceIcon = (status: Product['complianceStatus']) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending_review': return <Clock className="h-4 w-4" />;
      case 'non_compliant': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getComplianceLabel = (status: Product['complianceStatus']) => {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'pending_review': return 'Pending Review';
      case 'non_compliant': return 'Non-Compliant';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getRiskBg = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTRFStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-600';
      case 'approved': return 'bg-emerald-500/10 text-emerald-600';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600';
      case 'pending_review': return 'bg-amber-500/10 text-amber-600';
      case 'rejected': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="overflow-x-auto">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="-mt-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1.5 w-fit ${getComplianceColor(product.complianceStatus)}`}
              >
                {getComplianceIcon(product.complianceStatus)}
                {getComplianceLabel(product.complianceStatus)}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-0.5 rounded">{product.code}</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
          </div>
        </div>

        {/* AI Assessment Strip */}
        <AIAssessmentStrip
          assessment={{
            objectType: 'product',
            objectId: product.id,
            readiness: product.passRate,
            readinessTrend: product.passRate >= 90 ? 'up' : product.passRate >= 70 ? 'stable' : 'down',
            confidence: product.riskScore < 40 ? 'high' : product.riskScore < 70 ? 'medium' : 'low',
            primaryRisk: product.complianceStatus === 'non_compliant' 
              ? 'Product fails compliance requirements'
              : product.riskScore >= 70 
                ? 'High risk score detected'
                : product.complianceStatus === 'pending_review'
                  ? 'Awaiting compliance review'
                  : 'No major risks identified',
            recommendation: product.complianceStatus === 'non_compliant'
              ? 'Initiate corrective action with supplier immediately'
              : product.riskScore >= 70
                ? 'Schedule additional testing and supplier audit'
                : product.activeTRFs > 0
                  ? `Review ${product.activeTRFs} active TRF(s) for completion status`
                  : 'Product is in good standing',
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image Gallery */}
            <ProductImageGallery 
              images={product.images || []} 
              productName={product.name}
              editable={true}
            />

            {/* Description */}
            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{product.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {product.specifications.material && (
                      <div>
                        <p className="text-sm text-muted-foreground">Material</p>
                        <p className="font-medium">{product.specifications.material}</p>
                      </div>
                    )}
                    {product.specifications.weight && (
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{product.specifications.weight}</p>
                      </div>
                    )}
                    {product.specifications.dimensions && (
                      <div>
                        <p className="text-sm text-muted-foreground">Size Range</p>
                        <p className="font-medium">{product.specifications.dimensions}</p>
                      </div>
                    )}
                    {product.specifications.origin && (
                      <div>
                        <p className="text-sm text-muted-foreground">Origin</p>
                        <p className="font-medium">{product.specifications.origin}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related TRFs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Related Test Requests</span>
                  <Badge variant="outline">{relatedTRFs.length} TRF{relatedTRFs.length !== 1 ? 's' : ''}</Badge>
                </CardTitle>
                <CardDescription>
                  Test Request Forms associated with this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                {relatedTRFs.length > 0 ? (
                  <div className="space-y-3">
                    {relatedTRFs.map(trf => (
                      <motion.div
                        key={trf.id}
                        whileHover={{ x: 4 }}
                        onClick={() => navigate(`/trfs/${trf.id}`)}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{trf.reference}</span>
                            <Badge variant="outline" className={getTRFStatusColor(trf.status)}>
                              {trf.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{trf.productName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{trf.passedTests}/{trf.testCount} tests</p>
                            <Progress value={(trf.passedTests / trf.testCount) * 100} className="h-1 w-20" />
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No TRFs found for this product</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create New TRF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Pass Rate</span>
                    <span className="font-semibold">{product.passRate}%</span>
                  </div>
                  <Progress value={product.passRate} className="h-2" />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <span className={`font-semibold ${getRiskColor(product.riskScore)}`}>
                      {product.riskScore}/100
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getRiskBg(product.riskScore)} transition-all`}
                      style={{ width: `${product.riskScore}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active TRFs</span>
                  <Badge variant="outline">{product.activeTRFs}</Badge>
                </div>

                {product.lastTested && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Tested</span>
                    <span className="text-sm font-medium">
                      {new Date(product.lastTested).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplier Info */}
            {supplier && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {supplier.country}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Compliance</p>
                      <p className="font-medium">{supplier.complianceScore}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality</p>
                      <p className="font-medium">{supplier.qualityScore}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery</p>
                      <p className="font-medium">{supplier.deliveryScore}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Factories</p>
                      <p className="font-medium">{supplier.factoryCount}</p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/suppliers')}
                  >
                    View Supplier Details
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
