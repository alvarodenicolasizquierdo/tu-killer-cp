import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SupplierDetailDrawer } from '../SupplierDetailDrawer';
import type { RichSupplier } from '@/types/supplier';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const fullSupplier: RichSupplier = {
  id: 'sup-test',
  code: 'TST-001',
  name: 'Test Supplier Ltd',
  country: 'Germany',
  city: 'Berlin',
  factoryCount: 2,
  status: 'active',
  tier: 'strategic',
  complianceStatus: 'compliant',
  overallScore: 85,
  complianceScore: 90,
  qualityScore: 80,
  deliveryScore: 75,
  contacts: [
    { id: 'c1', name: 'Anna Müller', role: 'QA Lead', email: 'anna@test.com', phone: '+49123', isPrimary: true },
  ],
  primaryContact: { id: 'c1', name: 'Anna Müller', role: 'QA Lead', email: 'anna@test.com', phone: '+49123', isPrimary: true },
  certifications: [
    { id: 'cert-1', name: 'ISO 9001', issuer: 'TÜV', issuedDate: '2024-01-01', expiryDate: '2027-01-01', status: 'valid' },
  ],
  certificatesExpiring: 0,
  specializations: [
    { id: 'sp-1', name: 'Denim', category: 'Apparel' },
    { id: 'sp-2', name: 'Knits', category: 'Textiles' },
  ],
  openTRFs: 3,
  activeStyles: 12,
  passRate: 92,
  lastAuditDate: '2025-06-15',
  nextAuditDate: '2026-06-15',
  createdAt: '2023-01-01',
  updatedAt: '2026-01-01',
};

const minimalSupplier: RichSupplier = {
  id: 'sup-min',
  code: 'MIN-001',
  name: 'Minimal Corp',
  country: 'Japan',
  factoryCount: 0,
  status: 'inactive',
  tier: 'approved',
  complianceStatus: 'pending_audit',
  overallScore: 0,
  complianceScore: 0,
  qualityScore: 0,
  deliveryScore: 0,
  contacts: [],
  certifications: [],
  certificatesExpiring: 0,
  specializations: [],
  openTRFs: 0,
  activeStyles: 0,
  passRate: 0,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

function renderDrawer(supplier: RichSupplier | null, open = true) {
  const onClose = vi.fn();
  const result = render(
    <MemoryRouter>
      <SupplierDetailDrawer supplier={supplier} open={open} onClose={onClose} />
    </MemoryRouter>
  );
  return { ...result, onClose };
}

describe('SupplierDetailDrawer integration', () => {
  it('renders nothing when supplier is null', () => {
    const { container } = renderDrawer(null);
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('renders all sections for a full supplier', () => {
    renderDrawer(fullSupplier);

    // Header
    expect(screen.getByText('Test Supplier Ltd')).toBeInTheDocument();
    expect(screen.getByText(/Berlin, Germany/)).toBeInTheDocument();

    // Scores
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();

    // Activity
    expect(screen.getByText('12')).toBeInTheDocument(); // activeStyles
    expect(screen.getByText('92%')).toBeInTheDocument(); // passRate

    // Contact
    expect(screen.getByText('Anna Müller')).toBeInTheDocument();
    expect(screen.getByText('anna@test.com')).toBeInTheDocument();

    // Certifications
    expect(screen.getByText('ISO 9001')).toBeInTheDocument();

    // Specializations
    expect(screen.getByText('Denim')).toBeInTheDocument();
    expect(screen.getByText('Knits')).toBeInTheDocument();

    // Audit Schedule
    expect(screen.getByText('Last Audit')).toBeInTheDocument();
    expect(screen.getByText('Next Audit')).toBeInTheDocument();

    // Action buttons
    expect(screen.getByText('Send Questionnaire')).toBeInTheDocument();
    expect(screen.getByText('View Full Profile')).toBeInTheDocument();
  });

  it('hides optional sections when data is empty', () => {
    renderDrawer(minimalSupplier);

    // Header still renders
    expect(screen.getByText('Minimal Corp')).toBeInTheDocument();

    // No contact section
    expect(screen.queryByText('anna@test.com')).not.toBeInTheDocument();

    // Specializations hidden (component returns null for empty)
    expect(screen.queryByText(/Specializations/)).not.toBeInTheDocument();

    // Certifications shows empty message
    expect(screen.getByText('No certifications on file')).toBeInTheDocument();

    // Scores show 0%
    expect(screen.getAllByText('0%').length).toBeGreaterThanOrEqual(4);

    // Buttons still present
    expect(screen.getByText('Send Questionnaire')).toBeInTheDocument();
  });

  it('navigates to full profile on button click', () => {
    const { onClose } = renderDrawer(fullSupplier);

    fireEvent.click(screen.getByText('View Full Profile'));
    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/suppliers/sup-test');
  });

  it('opens questionnaire in new tab on button click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderDrawer(fullSupplier);

    fireEvent.click(screen.getByText('Send Questionnaire'));
    expect(openSpy).toHaveBeenCalledWith(
      'https://suppllier-uki-questionnaire.manus.space/',
      '_blank'
    );
    openSpy.mockRestore();
  });
});
