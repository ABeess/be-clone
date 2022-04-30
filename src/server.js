import app from "./index.js";

app.listen({ port: process.env.PORT }, () => {
  console.log("Server run port ", process.env.PORT);
});
