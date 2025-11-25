import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserTable from '@/app/dashboard/components/UserTable';
import { useUsersQuery } from '@/interface/hooks/useUsersQuery';
import { deleteUserEntry } from '@/core/usecases/users/manageUsers';

jest.mock('@/interface/hooks/useUsersQuery', () => ({
  useUsersQuery: jest.fn(),
}));

jest.mock('@/core/usecases/users/manageUsers', () => ({
  deleteUserEntry: jest.fn(),
  createUserEntry: jest.fn(),
  updateUserEntry: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/app/dashboard/components/UserFormModal', () => ({
  __esModule: true,
  default: ({ isOpen, initialData }: { isOpen: boolean; initialData?: { id: number } | null }) =>
    isOpen ? <div role="dialog">{initialData ? 'Edit User' : 'Create User'}</div> : null,
}));

describe('UserTable', () => {
  const users = [
    { id: '1', name: 'Ramer', email: 'ramer@example.com', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: '2', name: 'Arturo', email: 'arturo@example.com', createdAt: '2024-01-02T00:00:00.000Z' },
  ];

  const setupQueryMock = () => {
    const queryResponse = {
      data: { users, total: users.length },
      isLoading: false,
      refetch: jest.fn(),
    };
    (useUsersQuery as jest.Mock).mockReturnValue(queryResponse);
    return queryResponse;
  };

  const renderComponent = async () => {
    setupQueryMock();
    const user = userEvent.setup();
    render(<UserTable />);
    await waitFor(() => expect(screen.getByText('Ramer')).toBeInTheDocument());
    return { user };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user list', async () => {
    await renderComponent();
    expect(screen.getByText('Arturo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ new user/i })).toBeInTheDocument();
  });

  it('opens the create user modal', async () => {
    const { user } = await renderComponent();
    await user.click(screen.getByRole('button', { name: /\+ new user/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Create User');
  });

  it('opens the edit user modal', async () => {
    const { user } = await renderComponent();
    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(screen.getByRole('dialog')).toHaveTextContent('Edit User');
  });

  it('calls delete when confirmed', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    (deleteUserEntry as jest.Mock).mockResolvedValue({});
    const { user } = await renderComponent();

    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    await waitFor(() => expect(deleteUserEntry).toHaveBeenCalledWith('1'));
    confirmSpy.mockRestore();
  });
});
