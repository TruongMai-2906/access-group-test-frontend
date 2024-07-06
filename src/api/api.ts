import clientAxios from "./axios";

interface ConfigDataType<T> {
  [key: string]: T;
}

const get = async (
  endpoint: string,
  config?: ConfigDataType<string | number>
) => {
  try {
    return await clientAxios.get(endpoint, config);
  } catch (err) {
    console.log("GET error", err);
  }
};

const post = async (
  endpoint: string,
  data: string | number | boolean,
  config?: ConfigDataType<string | number>
) => {
  try {
    return clientAxios.post(endpoint, JSON.parse(data.toString()), config);
  } catch (err) {
    console.log("POST error", err);
  }
};

const put = async (
  endpoint: string,
  data: string | number | boolean,
  config?: ConfigDataType<string | number>
) => {
  try {
    return clientAxios.put(endpoint, JSON.parse(data.toString()), config);
  } catch (err) {
    console.log("PUT error", err);
  }
};

const del = (endpoint: string, config?: ConfigDataType<string | number>) => {
  try {
    return clientAxios.delete(endpoint, config);
  } catch (err) {
    console.log("DEL error", err);
  }
};

//wrap up all things
const func = {
  get,
  post,
  put,
  del,
};

export default func;
