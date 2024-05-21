import { useCallback, useEffect, useMemo, useState } from "react";

type UseSearchParams<T> = [
  {
    value: Partial<T>;
    toString(): string;
  },
  (newParams: Partial<T>) => void
];

type Handler = (...args: any[]) => void;

class EventEmitter {
  private eventMap: Record<string, Handler[]>;
  constructor() {
    this.eventMap = {};
  }

  private exist(type: string) {
    const tasks = this.eventMap[type];
    return Array.isArray(tasks) && tasks.length > 0;
  }

  /** 订阅、注册 */
  on(type: string, handler: Handler) {
    if (!(handler instanceof Function)) {
      throw new Error("handler must be a function");
    }

    if (!this.eventMap[type]) {
      this.eventMap[type] = [];
    }

    this.eventMap[type].push(handler);
  }

  /** 发布、触发 */
  emit(type: string, ...args: any[]) {
    const tasks = this.eventMap[type];
    if (this.exist(type)) {
      tasks.forEach((handler) => handler(...args));
    }
  }

  /** 卸载、取消订阅 */
  off(type: string, handler: Handler) {
    const tasks = this.eventMap[type];
    if (this.exist(type)) {
      tasks.splice(
        tasks.indexOf((cb) => cb === handler),
        1
      );
    }
  }
}

const EMPTY_LIST = [null, undefined, "", NaN];
const GLOBAL_CHANNEL_ID = "global";
const eventEmitter = new EventEmitter();

/**
 * 同步location.search参数，该hook更新时不发生页面跳转；可跨组件通信
 * @param fields 用于初始化location.search参数的类型校验，注意：该值不表示默认值
 * @param channelId 通信Id，不传递时默认使用全局通信Id【global】
 */
const useSearchParams = <T extends Record<string, unknown>>(
  fields: T,
  channelId?: string
): UseSearchParams<T> => {
  const CHANNEL_ID = channelId || GLOBAL_CHANNEL_ID;
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    eventEmitter.on(CHANNEL_ID, updateByChannelId);
    return () => {
      eventEmitter.off(CHANNEL_ID, updateByChannelId);
    };
  }, []);

  const checkType = useCallback((key: keyof T, value: any) => {
    const type = typeof fields[key];

    switch (type) {
      case "number": {
        return +value;
      }
      case "boolean": {
        return JSON.parse(value);
      }
      default: {
        return value;
      }
    }
  }, []);

  const init = useCallback(() => {
    const tasks = new URLSearchParams(location.search).entries();
    const result: Partial<T> = {};
    let run = tasks.next();

    while (!run.done) {
      const [key, value] = run.value as [keyof T, any];
      result[key] = checkType(key, value);
      run = tasks.next();
    }

    return result;
  }, []);

  const toString = useCallback(() => {
    let result = "";
    const kv: string[] = [];

    for (const key in search.value) {
      const value = search.value[key];
      if (!EMPTY_LIST.includes(value as any)) {
        kv.push(`${key}=${value}`);
      }
    }

    if (kv.length > 0) {
      result = `?${kv.join("&")}`;
    }

    return result;
  }, []);

  const search = useMemo(
    () => ({
      value: init(),
      toString,
    }),
    []
  );

  const updateByChannelId = useCallback((newParams: Partial<T>) => {
    search.value = {
      ...search.value,
      ...newParams,
    };

    const url = new URL(location.href);
    url.search = toString();
    window.history.replaceState({}, "", url);

    forceUpdate((c) => c + 1);
  }, []);

  const update = useCallback((newParams: Partial<T>) => {
    eventEmitter.emit(CHANNEL_ID, newParams);
  }, []);

  return [search, update];
};

export { useSearchParams };
