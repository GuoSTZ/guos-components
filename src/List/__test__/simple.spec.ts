import List from '../test/simple';

jest.mock('../index.module.less', () => ({}));

describe('List simple', () => {
  it('should export component', () => {
    expect(List).toBeTruthy();
  });
});
