import app from "./http_server";

const HTTP_PORT = 3000;
app.listen(HTTP_PORT, () => {
  console.log("Http server is listing at : http://localhost:" + HTTP_PORT);
});
