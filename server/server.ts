import { Hono } from "hono";
import { serve } from "@hono/node-server";
import pg from "pg";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

/*
const postgresql = new pg.Pool({ user: "postgres" });
const latitudeLongitude = { type: "name", properties: { name: "ESPG:4326" } };

app.get("/api/skoler", async (c) => {
  const result = await postgresql.query(//TODO);
  return c.json({
    type: "FeatureCollection",
    crs: latitudeLongitude,
    features: result.rows.map(
      ({ posisjon: { coordinates, type }, ...properties }) => ({
        type: "Feature",
        properties,
        geometry: { type, coordinates },
      }),
    ),
  });
});

*/

app.get("/api/hello", async (c) => {
  return c.text("Hello World!");
});
app.use("*", serveStatic({ root: "../dist" }));
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
serve({ ...app, port });
