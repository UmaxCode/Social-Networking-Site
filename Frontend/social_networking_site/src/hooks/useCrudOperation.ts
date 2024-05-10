type CrudPropType = {
  method: string;
  data?: Object;
  url: string;
  token: string | null;
};
const useCrudOperation = async (info: CrudPropType) => {
  let response;

  if (info.method === "Get") {
    response = await fetch(info.url, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${info.token}`,
      },
    });
  }
  if (info.method === "Put") {
    response = await fetch(info.url, {
      method: "Put",
      headers: {
        Authorization: `Bearer ${info.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info.data),
    });
    console.log(response);
  } else {
    response = await fetch(info.url, {
      method: info.method,
      headers: {
        Authorization: `Bearer ${info.token}`,
        ContentType: "application/json",
      },
      body: JSON.stringify(info.data),
    });
  }

  console.log(response);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();
  console.log(data);

  return data;
};

export default useCrudOperation;
