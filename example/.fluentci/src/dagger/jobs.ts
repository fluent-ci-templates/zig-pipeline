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
    .from("pkgxdev/pkgx:latest")
    .withMountedCache("/root/.pkgx", client.cacheVolume("pkgx-cache"))
    .withEnvVariable("PATH", "$HOME/.local/bin:$PATH", { expand: true })
    .withExec([
      "sh",
      "-c",
      `pkgx install zig@${ZIG_VERSION || version || "0.11"}`,
    ]);

export const test = async (src = ".", version?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = baseCtr(client, Job.test, version)
      .withMountedCache("/app/zig-cache", client.cacheVolume("zig-cache"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", "zig build test"]);

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
      .withExec(["sh", "-c", "zig build"]);

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
