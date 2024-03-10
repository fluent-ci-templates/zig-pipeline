/**
 * @module zig
 * @description This module provides a set of functions for Zig Projects
 */

import { Directory, dag, env } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  build = "build",
}

export const exclude = ["zig-cache", "zig-out"];

const ZIG_VERSION = env.get("ZIG_VERSION");

const baseCtr = (name: string, version?: string) =>
  dag
    .pipeline(name)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withMountedCache("/root/.pkgx", dag.cacheVolume("pkgx-cache"))
    .withEnvVariable("PATH", "$HOME/.local/bin:$PATH", { expand: true })
    .withExec([`pkgx`, "install", `zig@${ZIG_VERSION || version || "0.11"}`]);

/**
 * Run tests
 *
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
  const context = await getDirectory(src);
  const ctr = baseCtr(Job.test, version)
    .withMountedCache("/app/zig-cache", dag.cacheVolume("zig-cache"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "zig build test"]);

  return ctr.stdout();
}

/**
 * Build the project
 *
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
  const context = await getDirectory(src);
  const ctr = baseCtr(Job.build, version)
    .withMountedCache("/app/zig-cache", dag.cacheVolume("zig-cache"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "zig build"])
    .withExec(["sh", "-c", "cp -r /app/zig-out /zig-out"]);

  await ctr.directory("/app/zig-out").export("zig-out");

  await ctr.stdout();

  return ctr.directory("/zig-out").id();
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
