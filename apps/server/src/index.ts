import { app } from "./server";

app.listen(process.env.PORT, () => {
    console.log(
        `Server up ${process.env.NODE_ENV === "development" ? `on http://localhost:${process.env.PORT}` : ""} `
    );
});
