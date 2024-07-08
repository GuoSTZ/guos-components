import { message, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

export function rootContainer(
  container: React.ReactElement,
  args: { routes: any; plugin: any; history: any },
) {
  // const socket = React.useMemo(() => {
  //   return io('https://guostz.com/guos-components');
  // }, [io]);
  const socket = io('https://guostz.com/guos-components');
  console.log(socket, '======socket,被建立');
  socket.on('connect', () => {
    console.log(socket.connected, '========connected');
  });
  socket.on('begin updating', (msg) => {
    notification.open({
      message: '正在更新中，请稍后刷新页面',
    });
  });

  // React.useEffect(() => {
  //   // 监听来自服务器的'chat message'事件
  //   socket.on('begin updating', (msg) => {
  //     notification.open({
  //       message: '正在更新中，请稍后刷新页面',
  //     });
  //   });

  //   // 清理函数，在组件卸载时执行
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  return container;
}
