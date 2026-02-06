import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupplierScores } from '../SupplierScores';
import { SupplierActivity } from '../SupplierActivity';
import { SupplierContact } from '../SupplierContact';
import { SupplierCertifications } from '../SupplierCertifications';
import { SupplierSpecializations } from '../SupplierSpecializations';
import { SupplierTasks } from '../SupplierTasks';
import { SupplierAuditSchedule } from '../SupplierAuditSchedule';

describe('SupplierScores', () => {
  it('renders all four score labels', () => {
    render(<SupplierScores overallScore={92} complianceScore={80} qualityScore={65} deliveryScore={50} />);
    expect(screen.getByText('Overall')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
  });

  it('displays score values with percent', () => {
    render(<SupplierScores overallScore={92} complianceScore={80} qualityScore={65} deliveryScore={50} />);
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('handles zero scores', () => {
    render(<SupplierScores overallScore={0} complianceScore={0} qualityScore={0} deliveryScore={0} />);
    expect(screen.getAllByText('0%')).toHaveLength(4);
  });
});

describe('SupplierActivity', () => {
  it('renders stats and pass rate', () => {
    render(<SupplierActivity activeStyles={5} openTRFs={3} factoryCount={2} passRate={88} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Styles')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    render(<SupplierActivity activeStyles={0} openTRFs={0} factoryCount={0} passRate={0} />);
    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});

describe('SupplierContact', () => {
  it('renders contact info', () => {
    render(<SupplierContact contact={{ name: 'Jane', role: 'Manager', email: 'jane@test.com', phone: '+1234' }} />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    expect(screen.getByText('+1234')).toBeInTheDocument();
  });

  it('renders without phone', () => {
    render(<SupplierContact contact={{ name: 'Jane', role: 'Manager', email: 'jane@test.com' }} />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.queryByText('+1234')).not.toBeInTheDocument();
  });
});

describe('SupplierCertifications', () => {
  it('renders certifications with status', () => {
    render(<SupplierCertifications certifications={[
      { id: '1', name: 'ISO 9001', issuer: 'BSI', status: 'valid' },
      { id: '2', name: 'OEKO-TEX', issuer: 'Hohenstein', status: 'expired' },
    ]} />);
    expect(screen.getByText('ISO 9001')).toBeInTheDocument();
    expect(screen.getByText('Valid')).toBeInTheDocument();
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('shows empty message when no certifications', () => {
    render(<SupplierCertifications certifications={[]} />);
    expect(screen.getByText('No certifications on file')).toBeInTheDocument();
  });
});

describe('SupplierSpecializations', () => {
  it('renders specialization badges', () => {
    render(<SupplierSpecializations specializations={[
      { id: '1', name: 'Denim' },
      { id: '2', name: 'Knits' },
    ]} />);
    expect(screen.getByText('Denim')).toBeInTheDocument();
    expect(screen.getByText('Knits')).toBeInTheDocument();
    expect(screen.getByText('Specializations (2)')).toBeInTheDocument();
  });

  it('returns null for empty specializations', () => {
    const { container } = render(<SupplierSpecializations specializations={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('SupplierTasks', () => {
  it('renders tasks with status badges', () => {
    render(<SupplierTasks tasks={[
      { id: '1', title: 'Submit docs', dueDate: '2025-03-01', status: 'pending' },
      { id: '2', title: 'Review audit', dueDate: '2025-04-01', status: 'overdue' },
    ]} />);
    expect(screen.getByText('Submit docs')).toBeInTheDocument();
    expect(screen.getByText('overdue')).toBeInTheDocument();
  });

  it('returns null for empty tasks', () => {
    const { container } = render(<SupplierTasks tasks={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('SupplierAuditSchedule', () => {
  it('renders both dates when provided', () => {
    render(<SupplierAuditSchedule lastAuditDate="2024-06-15" nextAuditDate="2025-06-15" />);
    expect(screen.getByText('Last Audit')).toBeInTheDocument();
    expect(screen.getByText('Next Audit')).toBeInTheDocument();
  });

  it('renders only header when no dates provided', () => {
    render(<SupplierAuditSchedule />);
    expect(screen.getByText('Audit Schedule')).toBeInTheDocument();
    expect(screen.queryByText('Last Audit')).not.toBeInTheDocument();
    expect(screen.queryByText('Next Audit')).not.toBeInTheDocument();
  });

  it('renders only last audit when next is missing', () => {
    render(<SupplierAuditSchedule lastAuditDate="2024-06-15" />);
    expect(screen.getByText('Last Audit')).toBeInTheDocument();
    expect(screen.queryByText('Next Audit')).not.toBeInTheDocument();
  });
});
