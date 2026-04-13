import React, { useState } from 'react';
import { Button, message, Modal, notification, Space, Typography } from 'antd';
import { BoxSelect, type BoxSelectValue } from 'guos-components';

const customDataSource = [
  { label: '每2小时', value: 2 },
  { label: '每4小时', value: 4 },
  { label: '每6小时', value: 6 },
  { label: '每8小时', value: 8 },
];

const App = () => {
  const [weekValue, setWeekValue] = useState<BoxSelectValue[]>([1, 3, 5]);
  const [monthValue, setMonthValue] = useState<BoxSelectValue[]>([1, 15, 31]);
  const [customValue, setCustomValue] = useState<BoxSelectValue[]>([4]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Button
        onClick={() => {
          notification.warn({
            message: '测试',
            description: '这是一个测试通知',
            onClose: () => {
              message.success('关闭了');
            },
            duration: null,
            btn: (
              <Space>
                <Button
                  onClick={() => {
                    Modal.confirm({
                      title: '确认消息设置',
                      okText: '确认',
                      maskStyle: {
                        zIndex: 1020,
                      },
                      zIndex: 1030,
                      onOk: () => {
                        message.success('确认了');
                      },
                    });
                  }}
                >
                  消息设置
                </Button>
                <Button>取消</Button>
              </Space>
            ),
          });
        }}
      >
        测试
      </Button>
      <div>
        <Typography.Text strong>week（内置周一~周日）</Typography.Text>
        <div style={{ marginTop: 8 }}>
          <BoxSelect type="week" value={weekValue} onChange={setWeekValue} />
        </div>
        <div style={{ marginTop: 8 }}>当前值：{JSON.stringify(weekValue)}</div>
      </div>

      <div>
        <Typography.Text strong>month（内置1~31）</Typography.Text>
        <div style={{ marginTop: 8 }}>
          <BoxSelect type="month" value={monthValue} onChange={setMonthValue} />
        </div>
        <div style={{ marginTop: 8 }}>当前值：{JSON.stringify(monthValue)}</div>
      </div>

      <div>
        <Typography.Text strong>custom（自定义 dataSource）</Typography.Text>
        <div style={{ marginTop: 8 }}>
          <BoxSelect
            type="custom"
            dataSource={customDataSource}
            value={customValue}
            onChange={setCustomValue}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          当前值：{JSON.stringify(customValue)}
        </div>
      </div>
    </div>
  );
};

export default App;
