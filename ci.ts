import {
  test,
  build,
} from "https://pkg.fluentci.io/zig_pipeline@v0.3.0/mod.ts";

await test();
await build();
