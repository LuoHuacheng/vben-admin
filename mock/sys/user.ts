import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createFakeUserList() {
  return [
    {
      userId: 1,
      userName: 'admin',
      gameId: 0,
      gameName: 'D-Men',
      password: '123456',
      token: 'fakeToken1',
    },
    {
      userId: 2,
      userName: 'test',
      gameId: 0,
      gameName: 'D-Men',
      password: '123456',
      token: 'fakeToken2',
    },
  ];
}

export default [
  // mock user login
  {
    url: '/api/sys/user/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body;
      const checkUser = createFakeUserList().find(
        (item) => item.userName === userName && password === item.password,
      );
      if (!checkUser) {
        return resultError('Incorrect account or password !');
      }
      const { userId, userName: _username, token, gameId, gameName } = checkUser;
      return resultSuccess({
        userId,
        userName: _username,
        token,
        gameId,
        gameName,
      });
    },
  },
  {
    url: '/api/sys/user/profile',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
  {
    url: '/api/sys/user/binding',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { gameId, isDefault, userId } = body;
      return resultSuccess({
        gameId,
        isDefault,
        userId,
      });
    },
  },
  {
    url: '/api/sys/user/logout',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, { message: 'Token has been destroyed' });
    },
  },
] as MockMethod[];
