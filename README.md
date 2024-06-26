### Description

```text
  This function is a custom hook that handles URL query parameters. It takes a generic parameter fields defining the types of query parameters and an optional channelId for event channel to listen for parameter updates. It returns an array with two elements: search, an object containing the current query parameter values and a method to convert them to a string, and update, a function to update the query parameters.
```

### Useage

```tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "use-search-params-hook";

/** Note: This object is used to guarantee that the datatype */
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
