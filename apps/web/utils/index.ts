/**
 * 通用轮询工具函数
 * @param requestFn 需要轮询的异步请求函数，返回Promise
 * @param checkFn 判断是否结束的函数，参数为请求结果，返回true则结束
 * @param interval 轮询间隔（毫秒）
 * @param timeout 超时时间（毫秒），默认60秒
 * @returns Promise<最终结果>
 */
export async function pollWithInterval<T>(
  requestFn: () => Promise<T>,
  checkFn: (result: T) => boolean,
  interval = 2000,
  timeout = 60000
): Promise<T> {
  const start = Date.now();
  return new Promise<T>((resolve, reject) => {
    const poll = async () => {
      try {
        const result = await requestFn();
        if (checkFn(result)) {
          resolve(result);
          return;
        }
        if (Date.now() - start > timeout) {
          reject(new Error('轮询超时'));
          return;
        }
        setTimeout(poll, interval);
      } catch (err) {
        reject(err);
      }
    };
    poll();
  });
}

/**
 * 混合进度条管理器
 * 结合伪进度和真实进度，提供平滑的用户体验
 */
export class HybridProgressManager {
  private fakeProgress: number = 0;
  private realProgress: number = 0;
  private timer: NodeJS.Timeout | null = null;
  private onProgressUpdate: (progress: number) => void;
  private finished: boolean = false;
  
  /**
   * 创建混合进度条管理器
   * @param onProgressUpdate 进度更新回调函数
   * @param initialProgress 初始进度值(0-100)
   */
  constructor(onProgressUpdate: (progress: number) => void, initialProgress: number = 0) {
    this.onProgressUpdate = onProgressUpdate;
    this.fakeProgress = initialProgress;
    this.realProgress = initialProgress;
  }
  
  /**
   * 开始伪进度增长
   * @param maxProgress 伪进度最大值(0-100)，默认90
   * @param incrementInterval 增长间隔(毫秒)，默认200ms
   */
  startFakeProgress(maxProgress: number = 90, incrementInterval: number = 200) {
    // 清除可能存在的定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // 创建新的定时器
    this.timer = setInterval(() => {
      if (this.finished) return;
      
      // 伪进度增长速度随进度增加而减缓
      const increment = Math.max(0.1, (maxProgress - this.fakeProgress) / 100);
      this.fakeProgress = Math.min(this.fakeProgress + increment, maxProgress);
      
      // 取伪进度和真实进度的最大值
      const currentProgress = Math.max(this.fakeProgress, this.realProgress);
      this.onProgressUpdate(currentProgress);
    }, incrementInterval);
    
    return this;
  }
  
  /**
   * 更新真实进度
   * @param progress 真实进度值(0-100)
   */
  updateRealProgress(progress: number) {
    this.realProgress = progress;
    // 如果真实进度大于伪进度，立即更新UI
    if (this.realProgress > this.fakeProgress) {
      this.onProgressUpdate(this.realProgress);
    }
    return this;
  }
  
  /**
   * 完成进度
   * @param finalProgress 最终进度值，默认100
   */
  complete(finalProgress: number = 100) {
    this.finished = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.realProgress = finalProgress;
    this.fakeProgress = finalProgress;
    this.onProgressUpdate(finalProgress);
    return this;
  }
  
  /**
   * 清理资源
   */
  cleanup() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    return this;
  }
}