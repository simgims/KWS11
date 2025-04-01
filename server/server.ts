import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const app = new Hono();

const connectionString = process.env.DATABASE_URL;
const postgresql = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({ user: "postgres" });

// const postgresql = new pg.Pool({ user: "postgres", password: "postgres" }); // Gammel versjon
const latitudeLongitude = { type: "name", properties: { name: "ESPG:4326" } };

app.get("/api/skoler", async (c) => {
  const result = await postgresql.query(
    "select skolenavn, st_transform(skole.posisjon, 4326)::json as posisjon\n" +
      "from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole skole\n" +
      "         inner join fylker_ba7aea2735714391a98b1a585644e98a.fylke fylke\n" +
      "                    on st_contains(fylke.omrade, skole.posisjon)\n" +
      "         inner join fylker_ba7aea2735714391a98b1a585644e98a.administrativenhetnavn navn\n" +
      "                    on fylke.objid = navn.fylke_fk and navn.sprak = 'nor'\n" +
      "where navn.navn = 'Viken'",
  );
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

app.use("*", serveStatic({ root: "../dist" }));
serve({
  fetch: app.fetch,
  port: process.env.port ? parseInt(process.env.port) : 3000,
});
