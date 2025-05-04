// 使用方式： 成功响应
// res.json(success({ name: 'John' }, '获取成功'));
export function success(data = {}, msg = 'success') {
  return {
    code: 0,
    data,
    msg
  };
}

// 失败响应，使用方式：
// res.status(400).json(fail('参数错误'));
export function fail(msg = 'error', data = {}) {
  return {
    code: -1,
    data,
    msg
  };
}