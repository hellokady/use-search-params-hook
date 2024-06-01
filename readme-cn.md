### 介绍

```text
  该函数是一个自定义的hooks，用于处理URL的查询参数。它接收一个类型参数fields定义了查询参数的键值对类型，和一个可选的channelId用于监听参数更新的事件频道。返回一个数组，包含两个元素：search对象包含当前查询参数的值和将其转换为字符串的方法，update函数用于更新查询参数
```

### 使用

```tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "use-search-params-hook";

/** 注意：该对象是用于保证数据类型 */
const DEFAULT_VALIDATE = {
  name: "",
  age: 10,
  status: false,
};

const Age = () => {
  const [searchParams, setSearchParams] = useSearchParams(
    DEFAULT_QUERY,
    "query"
  );
  const [value, setValue] = useState(searchParams.value?.age);

  useEffect(() => {
    console.log(searchParams.value, "Age searchParams.value");
  }, [searchParams.value]);

  const handleChange = (age: number | null) => {
    setSearchParams({ age: age as number });
    setValue(age as number);
  };

  return <input type="number" value={value} onChange={handleChange} />;
};

const Name = () => {
  const [searchParams, setSearchParams] = useSearchParams(
    DEFAULT_QUERY,
    "query"
  );
  const [value, setValue] = useState(searchParams.value?.name);

  useEffect(() => {
    console.log(searchParams.value, "Name searchParams.value");
  }, [searchParams.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSearchParams({ name });
    setValue(name);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};

function App() {
  const [searchParams] = useSearchParams(DEFAULT_QUERY, "query");

  useEffect(() => {
    console.log(searchParams.value, "App searchParams.value");
  }, [searchParams.value]);

  return (
    <>
      <Name />
      <Age />
    </>
  );
}
```
