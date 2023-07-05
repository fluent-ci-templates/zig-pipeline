import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { test } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .image("homebrew/brew")
  .beforeScript("brew install zig")
  .addJob("test", test);

export default gitlabci;
