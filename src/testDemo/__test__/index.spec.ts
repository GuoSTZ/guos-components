import { jest } from '@jest/globals';
import axios from 'axios';

// 假定这个是实际的接口请求
const getData = () => {
  return axios.get('/api').then((res) => res.data);
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('测试 接口请求getData', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: 'hello' });
  mockedAxios.get.mockResolvedValueOnce({ data: 'world' });
  await getData().then((data) => {
    expect(data).toBe('hello');
  });
  await getData().then((data) => {
    expect(data).toBe('world');
  });
});

// 异步操作
test('async test', async () => {
  // @ts-ignore
  const asyncMock = jest.fn().mockResolvedValue(43);

  await asyncMock(); // 43
});

// 对第三方库的模拟
jest.mock('dayjs', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

/** 方法模拟 */
// const mockFn = jest.fn<((num: number) => number)>().mockImplementation(num => 42 + num);

const myMock = jest.fn();
myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
