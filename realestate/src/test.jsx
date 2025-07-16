import { useEffect, useState } from "react";

function Test() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      const response = await fetch("http://localhost:3000/", {
        method:"GET"
    });
    const res = await response.text();
    setMessage(res);
    console.log(res);
  };

  console.log(message);

  return <h1>{message}</h1>;
}

export default Test;
