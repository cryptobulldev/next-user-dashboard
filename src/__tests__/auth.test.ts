import { login, register } from '@/lib/auth';

type AuthStoreMock = {
  setTokensMock: jest.Mock;
};

type ApiMock = {
  post: jest.Mock;
};

jest.mock('@/store/auth.store', () => {
  const setTokensMock = jest.fn();
  return {
    __esModule: true,
    useAuthStore: {
      getState: () => ({ setTokens: setTokensMock }),
    },
    setTokensMock,
  };
});

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const { setTokensMock } = jest.requireMock('@/store/auth.store') as AuthStoreMock;
const apiMock = jest.requireMock('@/lib/api').default as ApiMock;

describe('auth helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login sends credentials and stores tokens', async () => {
    const responseData = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: 1, email: 'jane@example.com' },
    };
    apiMock.post.mockResolvedValueOnce({ data: responseData });

    const result = await login('jane@example.com', 'password123');

    expect(apiMock.post).toHaveBeenCalledWith('/auth/login', {
      email: 'jane@example.com',
      password: 'password123',
    });
    expect(setTokensMock).toHaveBeenCalledWith('access-token', 'refresh-token');
    expect(result).toEqual(responseData);
  });

  it('register sends payload and stores tokens', async () => {
    const responseData = {
      accessToken: 'created-access',
      refreshToken: 'created-refresh',
      user: { id: 2, email: 'new@example.com', name: 'New User' },
    };
    apiMock.post.mockResolvedValueOnce({ data: responseData });

    const result = await register('new@example.com', 'StrongPass1!', 'New User');

    expect(apiMock.post).toHaveBeenCalledWith('/auth/register', {
      email: 'new@example.com',
      password: 'StrongPass1!',
      name: 'New User',
    });
    expect(setTokensMock).toHaveBeenCalledWith('created-access', 'created-refresh');
    expect(result).toEqual(responseData);
  });

  it('sets empty refresh token when backend omits it', async () => {
    const responseData = {
      accessToken: 'token-without-refresh',
    };
    apiMock.post.mockResolvedValueOnce({ data: responseData });

    await login('solo@example.com', 'secret');

    expect(setTokensMock).toHaveBeenCalledWith('token-without-refresh', '');
  });
});
