module.exports = {
  // 选定测试文件位置
  roots: ['<rootDir>/src'],
  // 全局匹配要处理的文件
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  // 通过ts-jest来处理ts/tsx文件
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
