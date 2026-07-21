/**
 * AG Translation - 开发启动脚本
 * 同时启动 Vite 开发服务器和 Electron
 */
const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 启动 Vite 开发服务器
const viteProcess = spawn(
  'npx',
  ['vite', '--config', path.join(rootDir, 'vite.config.ts')],
  {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' },
  }
);

viteProcess.stdout.on('data', (data) => {
  const text = data.toString();
  process.stdout.write(`[Vite] ${text}`);
  // Vite 启动后启动 Electron
  if (text.includes('Local:') || text.includes('ready in')) {
    startElectron();
  }
});

viteProcess.stderr.on('data', (data) => {
  process.stderr.write(`[Vite] ${data.toString()}`);
});

let electronStarted = false;
function startElectron() {
  if (electronStarted) return;
  electronStarted = true;

  setTimeout(() => {
    const electronProcess = spawn(
      'npx',
      ['electron', path.join(rootDir, 'src/main/main.js'), '--dev'],
      {
        cwd: rootDir,
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, NODE_ENV: 'development' },
      }
    );

    electronProcess.on('close', () => {
      viteProcess.kill();
      process.exit();
    });
  }, 2000); // 给 Vite 一点时间完全初始化
}

process.on('SIGINT', () => {
  viteProcess.kill();
  process.exit();
});
