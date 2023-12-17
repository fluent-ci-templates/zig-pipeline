import {
  test,
  build,
} from "https://pkg.fluentci.io/zig_pipeline@v0.4.0/mod.ts";

await test();
await build();
