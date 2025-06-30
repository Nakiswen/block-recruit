// 为Koa和koa-router类型添加声明扩展
import "koa-router";
import "koa";

declare module "koa-router" {
  interface RouterContext extends Koa.Context {}
}

declare module "koa" {
  interface DefaultContext {
    file?: File;
    files?: Record<string, File[]>;
  }
}

export default {};
