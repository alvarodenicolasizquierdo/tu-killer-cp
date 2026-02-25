import { Component, ProductCollection, TestingLevel, AIAssistSuggestion } from '@/types/styles';
import { mockComponents, mockCollections } from '@/data/stylesData';

// Test categories by component type and construction
const TEST_CATEGORIES = {
  fabric: {
    knit: ['Dimensional Stability', 'Pilling Resistance', 'Spirality', 'Bursting Strength'],
    woven: ['Tensile Strength', 'Tear Strength', 'Seam Slippage', 'Abrasion Resistance'],
    common: ['Colorfastness to Washing', 'Colorfastness to Rubbing', 'Fiber Analysis', 'Weight/GSM']
  },
  lining: ['Colorfastness to Perspiration', 'Colorfastness to Dry Cleaning', 'Dimensional Stability'],
  pocketing: ['Colorfastness to Rubbing', 'Tensile Strength', 'Tear Strength'],
  trim: {
    metal: ['Nickel Release', 'Corrosion Resistance', 'Breaking Strength'],
    plastic: ['Breaking Strength', 'Heat Resistance'],
    elastic: ['Stretch & Recovery', 'Dimensional Stability after Washing']
  }
};

// Risk modifiers based on department
const DEPARTMENT_TESTS: Record<string, string[]> = {
  'Infant Apparel': ['Formaldehyde', 'pH Value', 'Azo Dyes', 'Heavy Metals', 'Drawcord Safety'],
  'Kids Bottoms': ['Lead Content', 'Phthalates', 'Drawcord Safety', 'Button Pull Test'],
  'Activewear': ['Moisture Wicking', 'UV Protection', 'Stretch Recovery'],
  'Womens Athletic': ['Moisture Wicking', 'Stretch Recovery', 'Colorfastness to Perspiration'],
  'Outerwear': ['Water Resistance', 'Wind Resistance', 'Down Fill Power'],
  'Mens Casual': ['Shrinkage', 'Appearance after Washing']
};

// Lab recommendations based on test type
const LAB_RECOMMENDATIONS = {
  chemical: ['THT Ningbo', 'THT Shanghai', 'Intertek Shenzhen'],
  physical: ['THT Hong Kong', 'THT Dongguan', 'Bureau Veritas Guangzhou'],
  performance: ['THT Performance Lab', 'Intertek Sports Lab']
};

export interface TestPlanSuggestion {
  testName: string;
  testCode: string;
  reason: string;
  priority: 'required' | 'recommended' | 'optional';
  estimatedDays: number;
}

export interface LabRecommendation {
  labName: string;
  matchScore: number;
  capabilities: string[];
  turnaround: string;
}

export function generateTestPlanSuggestions(
  collection: ProductCollection,
  testingLevel: TestingLevel,
  components: Component[]
): { tests: TestPlanSuggestion[]; labs: LabRecommendation[]; confidence: number } {
  const tests: TestPlanSuggestion[] = [];
  let confidence = 75;

  // Analyze components
  const fabrics = components.filter(c => c.type === 'Fabric');
  const linings = components.filter(c => c.type === 'Lining');
  const pocketings = components.filter(c => c.type === 'Pocketing');
  const trims = components.filter(c => c.type === 'Trim');

  // Base level tests - focus on component-level
  if (testingLevel === 'Base') {
    // Fabric tests
    fabrics.forEach(fabric => {
      const isKnit = fabric.construction.toLowerCase().includes('knit') || 
                     fabric.construction.toLowerCase().includes('jersey');
      
      const fabricTests = isKnit 
        ? TEST_CATEGORIES.fabric.knit 
        : TEST_CATEGORIES.fabric.woven;
      
      fabricTests.forEach(test => {
        tests.push({
          testName: test,
          testCode: `B-${test.substring(0, 3).toUpperCase()}-${fabric.id.substring(-3)}`,
          reason: `Required for ${fabric.name} (${isKnit ? 'knit' : 'woven'} construction)`,
          priority: 'required',
          estimatedDays: 5
        });
      });

      // Common fabric tests
      TEST_CATEGORIES.fabric.common.forEach(test => {
        tests.push({
          testName: test,
          testCode: `B-${test.substring(0, 3).toUpperCase()}-CMN`,
          reason: `Standard test for all fabric components`,
          priority: 'required',
          estimatedDays: 3
        });
      });
    });

    // Lining tests for >10% area
    linings.filter(l => l.areaPercentage > 10).forEach(lining => {
      TEST_CATEGORIES.lining.forEach(test => {
        tests.push({
          testName: test,
          testCode: `B-LIN-${test.substring(0, 3).toUpperCase()}`,
          reason: `Required for ${lining.name} (${lining.areaPercentage}% area - exceeds 10% threshold)`,
          priority: 'required',
          estimatedDays: 4
        });
      });
    });

    // Pocketing always requires full testing
    pocketings.forEach(pocketing => {
      TEST_CATEGORIES.pocketing.forEach(test => {
        tests.push({
          testName: test,
          testCode: `B-PKT-${test.substring(0, 3).toUpperCase()}`,
          reason: `Pocketing components always require full testing per policy`,
          priority: 'required',
          estimatedDays: 3
        });
      });
    });

    confidence += 10; // Higher confidence for base testing
  }

  // Bulk level tests - focus on production consistency
  if (testingLevel === 'Bulk') {
    tests.push(
      {
        testName: 'Bulk Production Colorfastness',
        testCode: 'BLK-CF-001',
        reason: 'Verify color consistency in bulk production matches approved samples',
        priority: 'required',
        estimatedDays: 5
      },
      {
        testName: 'Bulk Dimensional Stability',
        testCode: 'BLK-DS-001',
        reason: 'Ensure shrinkage within spec across production lot',
        priority: 'required',
        estimatedDays: 4
      },
      {
        testName: 'Random Sample Fiber Analysis',
        testCode: 'BLK-FA-001',
        reason: 'Confirm fiber composition matches declared content',
        priority: 'required',
        estimatedDays: 3
      }
    );
  }

  // Garment level tests
  if (testingLevel === 'Garment') {
    tests.push(
      {
        testName: 'Garment Appearance After Washing',
        testCode: 'GAR-AAW-001',
        reason: 'Verify complete garment appearance after 5 wash cycles',
        priority: 'required',
        estimatedDays: 7
      },
      {
        testName: 'Garment Dimensional Stability',
        testCode: 'GAR-DS-001',
        reason: 'Measure shrinkage of finished garment to size chart',
        priority: 'required',
        estimatedDays: 5
      },
      {
        testName: 'Seam Strength Testing',
        testCode: 'GAR-SS-001',
        reason: 'Verify seam construction meets durability standards',
        priority: 'required',
        estimatedDays: 3
      }
    );
  }

  // Department-specific tests
  const deptTests = DEPARTMENT_TESTS[collection.department] || [];
  deptTests.forEach(test => {
    tests.push({
      testName: test,
      testCode: `DEPT-${test.substring(0, 3).toUpperCase()}`,
      reason: `Required for ${collection.department} department per safety standards`,
      priority: collection.department.includes('Infant') || collection.department.includes('Kids') 
        ? 'required' 
        : 'recommended',
      estimatedDays: 5
    });
  });

  // High risk score means more tests
  if (collection.riskScore > 50) {
    tests.push({
      testName: 'Enhanced Chemical Safety Panel',
      testCode: 'RISK-CHEM-001',
      reason: `High risk score (${collection.riskScore}) requires additional chemical testing`,
      priority: 'required',
      estimatedDays: 7
    });
    confidence -= 5; // Lower confidence for high risk
  }

  // Lab recommendations
  const hasChemicalTests = tests.some(t => 
    t.testName.toLowerCase().includes('color') || 
    t.testName.toLowerCase().includes('chemical') ||
    t.testName.toLowerCase().includes('formaldehyde')
  );

  const labs: LabRecommendation[] = [
    {
      labName: hasChemicalTests ? 'THT Shanghai Chemical Lab' : 'THT Hong Kong Physical Lab',
      matchScore: 95,
      capabilities: hasChemicalTests 
        ? ['Colorfastness', 'Chemical Analysis', 'RSL Testing']
        : ['Physical Testing', 'Dimensional Analysis', 'Strength Testing'],
      turnaround: '5-7 days'
    },
    {
      labName: 'THT Dongguan Integrated Lab',
      matchScore: 88,
      capabilities: ['Physical & Chemical', 'Performance Testing'],
      turnaround: '7-10 days'
    }
  ];

  return { 
    tests: tests.slice(0, 12), // Limit to avoid overwhelming
    labs, 
    confidence: Math.min(95, confidence) 
  };
}

export function generateAISuggestionsForTesting(
  collection: ProductCollection,
  testingLevel: TestingLevel
): AIAssistSuggestion[] {
  const components = mockComponents.filter(c => collection.componentIds.includes(c.id));
  const { tests, labs, confidence } = generateTestPlanSuggestions(collection, testingLevel, components);
  
  const suggestions: AIAssistSuggestion[] = [];

  // Main test plan suggestion
  if (tests.length > 0) {
    const requiredTests = tests.filter(t => t.priority === 'required');
    const totalDays = Math.max(...tests.map(t => t.estimatedDays));
    
    suggestions.push({
      id: `test-plan-${testingLevel.toLowerCase()}-${collection.id}`,
      type: 'test_plan',
      title: `Pre-fill ${testingLevel} Test Plan`,
      description: `${requiredTests.length} required tests identified for ${collection.name}`,
      confidence,
      reasoning: [
        `Based on ${components.length} linked components (${components.filter(c => c.type === 'Fabric').length} fabrics, ${components.filter(c => c.type === 'Trim').length} trims)`,
        `Department: ${collection.department} - includes specific safety requirements`,
        `Estimated completion: ${totalDays} days at recommended lab`,
        collection.riskScore > 40 
          ? `Higher risk score (${collection.riskScore}) requires enhanced testing`
          : `Standard risk profile allows optimized test selection`
      ],
      suggestedValues: {
        tests: tests.map(t => ({
          name: t.testName,
          code: t.testCode,
          priority: t.priority
        })),
        recommendedLab: labs[0]?.labName,
        estimatedDays: totalDays
      }
    });
  }

  // Lab assignment suggestion
  if (labs.length > 0) {
    suggestions.push({
      id: `lab-assign-${testingLevel.toLowerCase()}-${collection.id}`,
      type: 'test_plan',
      title: `Assign to ${labs[0].labName}`,
      description: `Best match for this test profile (${labs[0].matchScore}% compatibility)`,
      confidence: labs[0].matchScore,
      reasoning: [
        `Capabilities match: ${labs[0].capabilities.join(', ')}`,
        `Expected turnaround: ${labs[0].turnaround}`,
        `Prior successful tests with this supplier: 12`,
        `Current capacity: Available`
      ],
      suggestedValues: {
        labId: labs[0].labName.replace(/\s/g, '-').toLowerCase(),
        labName: labs[0].labName
      }
    });
  }

  // Component-specific warnings
  const highAreaComponents = components.filter(c => c.areaPercentage > 10 && c.type !== 'Fabric');
  if (highAreaComponents.length > 0) {
    suggestions.push({
      id: `component-warning-${collection.id}`,
      type: 'approval_block',
      title: `High-area components require full testing`,
      description: `${highAreaComponents.length} non-fabric component(s) exceed 10% area threshold`,
      confidence: 100,
      reasoning: highAreaComponents.map(c => 
        `${c.name} (${c.type}): ${c.areaPercentage}% area - full testing required per policy`
      )
    });
  }

  // Prior failure pattern detection (simulated)
  if (collection.department === 'Kids Bottoms' || collection.department === 'Infant Apparel') {
    suggestions.push({
      id: `prior-failure-${collection.id}`,
      type: 'test_plan',
      title: `Add pH & Formaldehyde re-test`,
      description: `Historical data shows 15% failure rate for ${collection.supplierName}`,
      confidence: 78,
      reasoning: [
        `Supplier ${collection.supplierName} had 3 pH failures in last 6 months`,
        `Kids/Infant category has stricter chemical limits`,
        `Recommend duplicate testing to avoid delays`
      ],
      suggestedValues: {
        additionalTests: ['pH Value Re-test', 'Formaldehyde Duplicate Sample']
      }
    });
  }

  return suggestions;
}

// Generate suggestions for TRF creation
export function generateTRFCreationSuggestions(collection: ProductCollection): AIAssistSuggestion[] {
  const suggestions: AIAssistSuggestion[] = [];
  const components = mockComponents.filter(c => collection.componentIds.includes(c.id));
  
  // Determine next testing level
  let nextLevel: TestingLevel = 'Base';
  if (collection.baseTesting.status === 'approved') {
    nextLevel = 'Bulk';
  }
  if (collection.bulkTesting.status === 'approved') {
    nextLevel = 'Garment';
  }

  // Get test suggestions for next level
  const testSuggestions = generateAISuggestionsForTesting(collection, nextLevel);
  suggestions.push(...testSuggestions);

  // Add component set completeness check
  if (components.length < 2) {
    suggestions.push({
      id: `component-check-${collection.id}`,
      type: 'approval_block',
      title: `Incomplete component set`,
      description: `Only ${components.length} component(s) linked - typical collections have 2-4`,
      confidence: 85,
      reasoning: [
        `Review whether trims, linings, or pocketing should be added`,
        `Missing components may cause TRF rejection`,
        `AI can suggest components based on department patterns`
      ]
    });
  }

  // Suggest fast-track if eligible
  if (collection.riskScore < 25 && collection.supplierName.includes('Eco')) {
    suggestions.push({
      id: `fast-track-${collection.id}`,
      type: 'test_plan',
      title: `Eligible for Fast-Track Testing`,
      description: `Low risk + preferred supplier qualifies for accelerated timeline`,
      confidence: 92,
      reasoning: [
        `Risk score ${collection.riskScore} is below fast-track threshold (25)`,
        `${collection.supplierName} has 98% pass rate`,
        `Can reduce testing cycle by 3-5 days`
      ],
      suggestedValues: {
        fastTrack: true,
        estimatedSavings: '3-5 days'
      }
    });
  }

  return suggestions;
}
