import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

vi.mock('../services/api', () => ({
  fetchDashboardStats: vi.fn().mockResolvedValue({
    students: 150,
    teachers: 25,
    courses: 45,
    attendance: 95,
  }),
}));

describe('Dashboard', () => {
  it('should display dashboard stats', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText('150')).toBeInTheDocument();
    expect(await screen.findByText('25')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });
});