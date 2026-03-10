import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Paginator from '../components/Paginator';

describe('Paginator', () => {
  it('renders current page and total pages', () => {
    render(<Paginator page={3} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText(/Page 3 of 10/)).toBeInTheDocument();
  });

  it('calls onPageChange with next page when clicking next', async () => {
    const onPageChange = vi.fn();
    render(<Paginator page={2} totalPages={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getAllByRole('button')[1]);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page when clicking previous', async () => {
    const onPageChange = vi.fn();
    render(<Paginator page={3} totalPages={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getAllByRole('button')[0]);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Paginator page={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getAllByRole('button')[0]).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Paginator page={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getAllByRole('button')[1]).toBeDisabled();
  });

  it('disables both buttons when disabled prop is true', () => {
    render(<Paginator page={2} totalPages={5} onPageChange={vi.fn()} disabled={true} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });
});
