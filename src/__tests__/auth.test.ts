import {
  createLoginUser,
  createRegisterUser,
} from '@/core/usecases/auth/loginUser';
import type { AuthDispatch } from '@/state/auth.store';

describe('auth use cases', () => {
  const gateway = {
    login: jest.fn(),
    register: jest.fn(),
  };
  const dispatch: AuthDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login sends credentials and dispatches tokens', async () => {
    const loginUseCase = createLoginUser({ gateway, dispatch });
    const responseData = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    gateway.login.mockResolvedValueOnce(responseData);

    const payload = { email: 'jane@example.com', password: 'password123' };
    const result = await loginUseCase(payload);

    expect(gateway.login).toHaveBeenCalledWith(payload);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESS',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(result).toEqual(responseData);
  });

  it('register sends payload and dispatches tokens', async () => {
    const registerUseCase = createRegisterUser({ gateway, dispatch });
    const responseData = {
      accessToken: 'created-access',
      refreshToken: 'created-refresh',
    };
    gateway.register.mockResolvedValueOnce(responseData);

    const payload = {
      email: 'new@example.com',
      password: 'StrongPass1!',
      name: 'New User',
    };
    const result = await registerUseCase(payload);

    expect(gateway.register).toHaveBeenCalledWith(payload);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESS',
      accessToken: 'created-access',
      refreshToken: 'created-refresh',
    });
    expect(result).toEqual(responseData);
  });

  it('falls back to empty refresh token when omitted', async () => {
    const loginUseCase = createLoginUser({ gateway, dispatch });
    gateway.login.mockResolvedValueOnce({
      accessToken: 'token-without-refresh',
    });

    await loginUseCase({ email: 'solo@example.com', password: 'secret' });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESS',
      accessToken: 'token-without-refresh',
      refreshToken: '',
    });
  });
});
