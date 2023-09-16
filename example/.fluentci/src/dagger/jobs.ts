import Client from "@fluentci.io/dagger";
import { withDevbox } from "https://nix.fluentci.io/v0.5.0/src/dagger/steps.ts";

export enum Job {
  test = "test",
  build = "build",
}

export const exclude = ["zig-cache", "zig-out"];

const ZIG_VERSION = Deno.env.get("ZIG_VERSION") || "0.10.1";

const baseCtr = (client: Client, name: string) =>
  withDevbox(
    client
      .pipeline(name)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  ).withExec(["devbox", "global", "add", `zig@${ZIG_VERSION}`]);

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = baseCtr(client, Job.test)
    .withMountedCache("/app/zig-cache", client.cacheVolume("zig-cache"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec([
      "sh",
      "-c",
      'eval "$(devbox global shellenv)" && zig build test',
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export const build = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = baseCtr(client, Job.build)
    .withMountedCache("/app/zig-cache", client.cacheVolume("zig-cache"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && zig build']);

  await ctr.directory("/app/zig-out").export("zig-out");

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
};