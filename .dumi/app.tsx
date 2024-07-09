import { message, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

export function rootContainer(
  container: React.ReactElement,
  args: { routes: any; plugin: any; history: any },
) {
  const socket = io('https://guostz.com', {
    query: {
      name: 'guos-components',
    },
  });

  socket.on('connect', () => {
    console.log(`${socket.id} 应用加入连接`);
  });

  socket.on('update successful', (msg: { commits: any[] }) => {
    console.log(msg);
    notification.success({
      message: '新内容已部署',
      description: (
        <div>
          <div>本次提交内容如下</div>
          {msg?.commits?.map((item, idx: number) => (
            <div
              style={{ textIndent: 28 }}
              key={idx}
            >{`${item?.idx}. ${item?.message}`}</div>
          ))}
          <div>
            请<a onClick={() => window.location.reload()}>刷新页面</a>
            以查看最新内容
          </div>
        </div>
      ),
      duration: 20,
    });
  });

  socket.on('update failed', (msg) => {
    notification.error({
      message: '内容更新失败',
      description: (
        <div>
          <div>请登录服务器查看具体原因</div>
          <div>{'xxxxxx'}</div>
        </div>
      ),
      duration: 20,
    });
  });

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log(`${socket.id} 应用断开连接`);
  });

  return container;
}
