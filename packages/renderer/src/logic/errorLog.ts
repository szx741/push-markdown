/*
 * @Author: szx
 * @Date: 2021-07-05 19:44:30
 * @LastEditTime: 2022-07-23 22:14:19
 * @Description: errorLog.ts的封装，对Error类型的封装
 * @FilePath: \push-markdown\packages\renderer\src\logic\errorLog.ts
 */
import { ComponentPublicInstance } from 'vue';
import dayjs from 'dayjs';
// import os from 'os';
import useMessage from '/@/components/message';
import { ipc, nodeFs } from '#preload';

function getShortStack(stack?: string): string {
  const splitStack = stack?.split('\n    ');
  if (!splitStack) return '';
  const newStack: string[] = [];
  for (const line of splitStack) {
    // 其他信息
    if (line.includes('bundler')) continue;

    // 只保留错误文件信息
    if (line.includes('?!.')) {
      newStack.push(line.replace(/webpack-internal:\/\/\/\.\/node_modules\/.+\?!/, ''));
    } else {
      newStack.push(line);
    }
  }
  // 转换string
  return newStack.join('\n    ');
}

// In renderer process (web page).
// export const errorLogPath = ipcRenderer.sendSync('exePath'); // prints "pong"
export const errorLogPath = ipc.syncMsg('exePath'); // prints "pong"

// ipc.receive('menu.welcome', (data: any) => {
//   console.log(`Received ${data} from main process`);
// });

export default function (error: unknown, vm: ComponentPublicInstance | null, info: string): void {
  const { message, stack } = error as Error;
  const { electron, chrome, node, v8 } = ipc.syncMsg('process.versions');
  const { outerWidth, outerHeight, innerWidth, innerHeight } = window;
  const { width, height } = window.screen;

  // 报错信息
  const errorInfo = {
    errorInfo: info,
    errorMessage: message,
    errorStack: getShortStack(stack)
  };
  // electron
  const electronInfo = { electron, chrome, node, v8 };
  // 浏览器窗口信息
  const browserInfo = { outerWidth, outerHeight, innerWidth, innerHeight };
  const errorLog = {
    versions: ipc.syncMsg('version'),
    date: dayjs().format('YYYY-MM-DD HH:mm'),
    error: errorInfo,
    electron: electronInfo,
    // window: {
    //   type: os.type(),
    //   platform: os.platform()
    // },
    browser: browserInfo,
    screen: { width, height }
  };

  useMessage('程序出现异常', 'error');

  if (process.env.NODE_ENV === 'production') {
    nodeFs.fsWriteFileSync(errorLogPath, JSON.stringify(errorLog) + '\n', { flag: 'a' });
    // fs.writeFileSync(errorLogPath, JSON.stringify(errorLog) + '\n', { flag: 'a' });
  } else {
    console.log(errorInfo.errorStack);
  }
}
