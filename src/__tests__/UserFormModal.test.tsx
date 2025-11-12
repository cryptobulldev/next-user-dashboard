import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserFormModal from '@/app/dashboard/components/UserFormModal';
import { createUser, updateUser } from '@/lib/users';

jest.mock('@/lib/users', () => ({
  createUser: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UserFormModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Create modal and submits form', async () => {
    const user = userEvent.setup();
    (createUser as jest.Mock).mockResolvedValue({});
    const onClose = jest.fn();
    const onSuccess = jest.fn();

    render(
      <UserFormModal isOpen={true} onClose={onClose} initialData={null} onSuccess={onSuccess} />,
    );

    await user.type(screen.getByLabelText(/name/i), 'Ramer');
    await user.type(screen.getByLabelText(/email/i), 'ramer@example.com');
    await user.type(screen.getByLabelText(/password/i), '12345');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(createUser).toHaveBeenCalledWith({
        name: 'Ramer',
        email: 'ramer@example.com',
        password: '12345',
      }),
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('renders Edit modal and submits update', async () => {
    const user = userEvent.setup();
    (updateUser as jest.Mock).mockResolvedValue({});
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const mockUser = { id: 1, name: 'Old Name', email: 'old@example.com' };

    render(
      <UserFormModal
        isOpen={true}
        onClose={onClose}
        initialData={mockUser}
        onSuccess={onSuccess}
      />,
    );

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: 'New Name', email: 'old@example.com' }),
      ),
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });
});
