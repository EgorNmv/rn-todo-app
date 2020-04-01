export class Http {
  static HEADERS = { "Content-type": "application/json" };

  static async get(url) {
    try {
      return await request(url);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async post(url, data) {
    try {
      return await request(url, "POST", data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async delete(url) {
    try {
      return await request(url, "DELETE");
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async patch(url, data) {
    try {
      request(url, "PATCH", data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

async function request(url, method = "GET", data = {}) {
  const config = { method, headers: Http.HEADERS };

  if (method === "POST" || method === "PATCH") {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  return await response.json(async);
}
