import { Job } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";

export const test = new Job().script("zig test src/*");

export const build = new Job().script("zig build");
