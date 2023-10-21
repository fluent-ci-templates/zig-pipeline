import Client, { connect } from "../../deps.ts";

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
    .from("ghcr.io/fluentci-io/devbox:latest")
    .withExec(["mv", "/nix/store", "/nix/store-orig"])
    .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
    .withExec([
      "sh",
      "-c",
      'cp -r /nix/store-orig/* /nix/store/ && eval "$(devbox global shellenv --recompute)"',
    ])
    .withExec(["sh", "-c", "devbox version update"])
    .withExec([
      "devbox",
      "global",
      "add",
      `zig@${ZIG_VERSION || version || "0.10.1"}`,
    ]);

export const test = async (src = ".", version?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = baseCtr(client, Job.test, version)
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
  });
  return "Done";
};

export const build = async (src = ".", version?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = baseCtr(client, Job.build, version)
      .withMountedCache("/app/zig-cache", client.cacheVolume("zig-cache"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && zig build']);

    await ctr.directory("/app/zig-out").export("zig-out");

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export type JobExec = (
  src?: string,
  version?: string
) =>
  | Promise<string>
  | ((
      src?: string,
      version?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
};
