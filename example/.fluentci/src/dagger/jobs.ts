import { Client, Directory } from "../../sdk/client.gen.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  build = "build",
}

export const exclude = ["zig-cache", "zig-out"];

const ZIG_VERSION = Deno.env.get("ZIG_VERSION");

const baseCtr = (client: Client, name: string, version?: string) =>
  client
    .pipeline(name)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withMountedCache("/root/.pkgx", client.cacheVolume("pkgx-cache"))
    .withEnvVariable("PATH", "$HOME/.local/bin:$PATH", { expand: true })
    .withExec([`pkgx`, "install", `zig@${ZIG_VERSION || version || "0.11"}`]);

/**
 * @function
 * @description Run tests
 * @param {string | Directory} src
 * @param {string} version
 * @returns {Promise<string>}
 */
export async function test(
  src: Directory | string = ".",
  version?: string
): Promise<string> {
  let result = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = baseCtr(client, Job.test, version)
      .withMountedCache("/app/zig-cache", client.cacheVolume("zig-cache"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", "zig build test"]);

    result = await ctr.stdout();
  });
  return result;
}

/**
 * @function
 * @description Build the project
 * @param {string | Directory} src
 * @param {string} version
 * @returns {Promise<Directory | string>}
 */
export async function build(
  src: Directory | string = ".",
  version?: string
): Promise<Directory | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = baseCtr(client, Job.build, version)
      .withMountedCache("/app/zig-cache", client.cacheVolume("zig-cache"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", "zig build"])
      .withExec(["sh", "-c", "cp -r /app/zig-out /zig-out"]);

    await ctr.directory("/app/zig-out").export("zig-out");

    await ctr.stdout();

    id = await ctr.directory("/zig-out").id();
  });
  return id;
}

export type JobExec = (
  src: Directory | string,
  version?: string
) => Promise<Directory | string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
};
