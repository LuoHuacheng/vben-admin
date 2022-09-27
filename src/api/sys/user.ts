import { defHttp } from '/@/utils/http/axios';

enum Api {
  Login = '/user/login',
  Logout = '/user/logout',
  Register = '/user/register',
  EditPwd = '/user/edit',
}

/**
 * @description: user login api
 */
export interface ILoginData {
  mobile: string | number;
  password: string;
}

export function doLogin(data: ILoginData) {
  return defHttp.post({ url: Api.Login, data }, { showSuccessMsg: true });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function editPwd(data: ILoginData) {
  return defHttp.post({ url: Api.EditPwd, data });
}
