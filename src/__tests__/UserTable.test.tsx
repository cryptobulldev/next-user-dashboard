import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserTable from '@/app/dashboard/components/UserTable';
import { getUsers, deleteUser } from '@/lib/users';

jest.mock('@/lib/users', () => ({
  getUsers: jest.fn(),
  deleteUser: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
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
    { id: 1, name: 'Ramer', email: 'ramer@example.com', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 2, name: 'Arturo', email: 'arturo@example.com', createdAt: '2024-01-02T00:00:00.000Z' },
  ];

  const renderWithClient = async () => {
    (getUsers as jest.Mock).mockResolvedValue({ data: users, meta: { total: users.length } });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <UserTable />
      </QueryClientProvider>,
    );

    await waitFor(() => expect(screen.getByText('Ramer')).toBeInTheDocument());

    return { user };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user list', async () => {
    await renderWithClient();
    expect(screen.getByText('Arturo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ new user/i })).toBeInTheDocument();
  });

  it('opens the create user modal', async () => {
    const { user } = await renderWithClient();
    await user.click(screen.getByRole('button', { name: /\+ new user/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Create User');
  });

  it('opens the edit user modal', async () => {
    const { user } = await renderWithClient();
    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(screen.getByRole('dialog')).toHaveTextContent('Edit User');
  });

  it('calls delete when confirmed', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    (deleteUser as jest.Mock).mockResolvedValue({});
    const { user } = await renderWithClient();

    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith(1));
    confirmSpy.mockRestore();
  });
});
