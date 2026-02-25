// Documentation Export Functions
// Generates JSON and Markdown exports for the documentation pack

import { DocumentationExport } from './types';
import { documentationRegistry } from './registry';

/**
 * Generates the complete documentation export object
 */
export function generateDocumentationExport(): DocumentationExport {
  return {
    meta: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      appName: 'CARLOS',
      totalScreens: documentationRegistry.screens.length,
      totalWorkflows: documentationRegistry.workflows.length,
      totalEntities: documentationRegistry.entities.length,
    },
    screens: documentationRegistry.screens,
    workflows: documentationRegistry.workflows,
    dataModel: {
      entities: documentationRegistry.entities,
      enums: documentationRegistry.enums,
      relationships: documentationRegistry.relationships,
    },
    roles: {
      definitions: documentationRegistry.roles,
      approvalMatrix: documentationRegistry.approvalMatrix,
      featureFlags: documentationRegistry.featureFlags,
    },
  };
}

/**
 * Exports the documentation as a JSON file
 */
export function exportAsJSON(): void {
  const exportData = generateDocumentationExport();
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'carlos_docs_pack.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates Markdown documentation
 */
export function generateMarkdown(): string {
  const data = generateDocumentationExport();
  const lines: string[] = [];

  // Header
  lines.push('# CARLOS Documentation Pack');
  lines.push(`**Exported:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
  lines.push(`**Version:** ${data.meta.version}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  lines.push('1. [App Map](#app-map)');
  lines.push('2. [Roles & Entitlements](#roles--entitlements)');
  lines.push('3. [Workflows](#workflows)');
  lines.push('4. [Data Model](#data-model)');
  lines.push('');
  lines.push('---');
  lines.push('');

  // =====================
  // APP MAP
  // =====================
  lines.push('## App Map');
  lines.push('');
  lines.push(`Total Screens: **${data.screens.length}**`);
  lines.push('');

  for (const screen of data.screens) {
    lines.push(`### ${screen.name}`);
    lines.push('');
    lines.push(`- **Route:** \`${screen.route}\``);
    lines.push(`- **Primary Persona:** ${screen.primaryPersona}`);
    lines.push(`- **Other Personas:** ${screen.otherPersonas.length > 0 ? screen.otherPersonas.join(', ') : 'None'}`);
    lines.push(`- **Source File:** \`${screen.sourceFile}\``);
    lines.push('');
    lines.push(`> ${screen.description}`);
    lines.push('');

    // Jobs to be done
    lines.push('**Jobs To Be Done:**');
    for (const job of screen.jobsToBeDone) {
      lines.push(`- ${job}`);
    }
    lines.push('');

    // UI Sections
    if (screen.uiSections.length > 0) {
      lines.push('**UI Sections:**');
      lines.push('');
      lines.push('| Section | Type | Description |');
      lines.push('|---------|------|-------------|');
      for (const section of screen.uiSections) {
        const conditional = section.isConditional ? ` *(${section.conditionDescription})*` : '';
        lines.push(`| ${section.name} | ${section.type} | ${section.description}${conditional} |`);
      }
      lines.push('');
    }

    // Actions
    if (screen.actions.length > 0) {
      lines.push('**Actions:**');
      lines.push('');
      lines.push('| Action | Trigger | Side Effects |');
      lines.push('|--------|---------|--------------|');
      for (const action of screen.actions) {
        const restricted = action.roleRestricted ? ` *(${action.roleRestricted.join(', ')} only)*` : '';
        lines.push(`| ${action.label}${restricted} | ${action.trigger} | ${action.sideEffects.join('; ')} |`);
      }
      lines.push('');
    }

    // Data Entities
    if (screen.dataEntitiesUsed.length > 0) {
      lines.push('**Data Entities Used:**');
      for (const entity of screen.dataEntitiesUsed) {
        lines.push(`- \`${entity.entityName}\` (${entity.operation}): ${entity.fields.join(', ')}`);
      }
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // =====================
  // ROLES & ENTITLEMENTS
  // =====================
  lines.push('## Roles & Entitlements');
  lines.push('');

  // Role definitions
  lines.push('### Role Definitions');
  lines.push('');
  
  for (const role of data.roles.definitions) {
    lines.push(`#### ${role.displayName} (\`${role.role}\`)`);
    lines.push('');
    lines.push(`> ${role.description}`);
    lines.push('');
    lines.push('**Primary Responsibilities:**');
    for (const resp of role.primaryResponsibilities) {
      lines.push(`- ${resp}`);
    }
    lines.push('');
    lines.push(`**Accessible Screens:** ${role.accessibleScreens.length} screens`);
    lines.push('');
  }

  // Approval Matrix
  lines.push('### Approval Matrix');
  lines.push('');
  lines.push('| Level | Care Labels | Base Testing | Bulk Testing | Garment Testing |');
  lines.push('|-------|-------------|--------------|--------------|-----------------|');
  for (const level of data.roles.approvalMatrix) {
    const p = level.permissions;
    lines.push(`| **${level.level}** | ${p.careLabels ? '✅' : '❌'} | ${p.baseTesting ? '✅' : '❌'} | ${p.bulkTesting ? '✅' : '❌'} | ${p.garmentTesting ? '✅' : '❌'} |`);
  }
  lines.push('');

  for (const level of data.roles.approvalMatrix) {
    lines.push(`- **${level.level}:** ${level.description}`);
  }
  lines.push('');

  // Feature Flags
  lines.push('### Feature Flags');
  lines.push('');
  lines.push('| Flag | Name | Default | Description |');
  lines.push('|------|------|---------|-------------|');
  for (const flag of data.roles.featureFlags) {
    lines.push(`| \`${flag.id}\` | ${flag.name} | ${flag.defaultValue ? 'ON' : 'OFF'} | ${flag.description} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // =====================
  // WORKFLOWS
  // =====================
  lines.push('## Workflows');
  lines.push('');
  lines.push(`Total Workflows: **${data.workflows.length}**`);
  lines.push('');

  for (const workflow of data.workflows) {
    lines.push(`### ${workflow.name}`);
    lines.push('');
    lines.push(`> ${workflow.description}`);
    lines.push('');
    lines.push(`**Trigger:** ${workflow.trigger}`);
    lines.push('');

    // Steps
    lines.push('**Steps:**');
    lines.push('');
    for (const step of workflow.steps) {
      const duration = step.expectedDuration ? ` *(${step.expectedDuration})*` : '';
      lines.push(`${step.order}. **${step.name}** - ${step.description} [${step.actor}]${duration}`);
    }
    lines.push('');

    // Decision Points
    if (workflow.decisionPoints.length > 0) {
      lines.push('**Decision Points:**');
      for (const dp of workflow.decisionPoints) {
        lines.push(`- After Step ${dp.afterStepId}: "${dp.condition}"`);
        for (const outcome of dp.outcomes) {
          lines.push(`  - ${outcome.label} → ${outcome.nextStepId}`);
        }
      }
      lines.push('');
    }

    // Failure Modes
    if (workflow.failureModes.length > 0) {
      lines.push('**Failure Modes:**');
      for (const fm of workflow.failureModes) {
        lines.push(`- **[${fm.severity.toUpperCase()}]** At ${fm.atStepId}: ${fm.description}`);
        lines.push(`  - Recovery: ${fm.recovery}`);
      }
      lines.push('');
    }

    // AI Moments
    if (workflow.aiMoments.length > 0) {
      lines.push('**AI Involvement:**');
      for (const ai of workflow.aiMoments) {
        const icon = ai.type === 'assists' ? '🤖' : '🔇';
        lines.push(`- ${icon} **${ai.type === 'assists' ? 'AI Assists' : 'AI Silent'}** at ${ai.stepId}: ${ai.description}`);
        if (ai.reasoning) {
          lines.push(`  - Reasoning: ${ai.reasoning}`);
        }
      }
      lines.push('');
    }

    // Outputs
    lines.push('**Outputs:**');
    for (const output of workflow.outputs) {
      lines.push(`- ${output}`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // =====================
  // DATA MODEL
  // =====================
  lines.push('## Data Model');
  lines.push('');
  lines.push(`Total Entities: **${data.dataModel.entities.length}** | Enums: **${data.dataModel.enums.length}** | Relationships: **${data.dataModel.relationships.length}**`);
  lines.push('');

  // Entities
  lines.push('### Entities');
  lines.push('');

  for (const entity of data.dataModel.entities) {
    lines.push(`#### ${entity.name}`);
    lines.push('');
    lines.push(`> ${entity.description}`);
    lines.push('');
    lines.push(`**Source:** \`${entity.sourceFile}\``);
    if (entity.dppRelevance) {
      lines.push(`**DPP Relevance:** ${entity.dppRelevance}`);
    }
    lines.push('');

    lines.push('| Field | Type | Required | Description |');
    lines.push('|-------|------|----------|-------------|');
    for (const field of entity.fields) {
      const req = field.required ? 'Yes' : 'No';
      const enumRef = field.enumRef ? ` (enum: ${field.enumRef})` : '';
      lines.push(`| \`${field.name}\` | ${field.type}${enumRef} | ${req} | ${field.description} |`);
    }
    lines.push('');
  }

  // Enums
  lines.push('### Enums');
  lines.push('');

  for (const enumDef of data.dataModel.enums) {
    lines.push(`#### ${enumDef.name}`);
    lines.push('');
    lines.push('| Value | Description |');
    lines.push('|-------|-------------|');
    for (const val of enumDef.values) {
      lines.push(`| \`${val.value}\` | ${val.description} |`);
    }
    lines.push('');
  }

  // Relationships
  lines.push('### Relationships');
  lines.push('');
  lines.push('| From | To | Type | Description |');
  lines.push('|------|----|------|-------------|');
  for (const rel of data.dataModel.relationships) {
    lines.push(`| ${rel.from} | ${rel.to} | ${rel.type} | ${rel.description} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Footer
  lines.push('*Generated by CARLOS Documentation Module*');

  return lines.join('\n');
}

/**
 * Exports the documentation as a Markdown file
 */
export function exportAsMarkdown(): void {
  const markdown = generateMarkdown();
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'carlos_docs_pack.md';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy Markdown to clipboard
 */
export async function copyMarkdownToClipboard(): Promise<boolean> {
  try {
    const markdown = generateMarkdown();
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
