import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRow from '@/app/dashboard/components/UserRow';

describe('UserRow', () => {
  const mockUser = {
    id: 1,
    name: 'Ramer',
    email: 'ramer@example.com',
    createdAt: new Date('2024-01-01').toISOString(),
  };

  it('renders user details', () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser} onEdit={jest.fn()} onDelete={jest.fn()} />
        </tbody>
      </table>,
    );

    expect(screen.getByText('Ramer')).toBeInTheDocument();
    expect(screen.getByText('ramer@example.com')).toBeInTheDocument();
  });

  it('calls edit and delete handlers', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <table>
        <tbody>
          <UserRow user={mockUser} onEdit={onEdit} onDelete={onDelete} />
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
