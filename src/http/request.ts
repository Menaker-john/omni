import http from "http";

export function request(
  opts: http.RequestOptions,
  resultsHandler?: (results: string) => void
) {
  return new Promise((resolve, reject) => {
    http
      .get(opts, (res) => {
        res.setEncoding("utf-8");

        let buffer = "";
        res.on("data", (chunk) => (buffer += chunk));
        res.on("end", () => {
          if (resultsHandler != undefined) {
            resolve(resultsHandler(buffer));
          } else {
            resolve(buffer);
          }
        });
      })
      .on("error", (error) => reject(error));
  });
}
