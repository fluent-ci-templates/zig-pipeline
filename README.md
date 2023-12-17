# Zig Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fzig_pipeline&query=%24.version)](https://pkg.fluentci.io/zig_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/zig-pipeline)](https://codecov.io/gh/fluent-ci-templates/zig-pipeline)

A ready-to-use CI/CD Pipeline for your [Zig](https://ziglang.org/) projects.

## 🚀 Usage

Run the following command in your project:

```bash
dagger run fluentci zig_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t zig
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger mod install github.com/fluent-ci-templates/zig-pipeline@mod
```

## Environment variables

| Variable        | Description                                    |
| --------------- | ---------------------------------------------- |
| `ZIG_VERSION`   | The version of Zig to use. Defaults to `0.10.1` |

## Jobs

| Job       | Description   |
| --------- | ------------- |
| test      | Run tests     |
| build     | Build project |

```typescript
test(
  src: Directory | string = ".",
  version?: string
): Promise<string>

build(
  src: Directory | string = ".",
  version?: string
): Promise<Directory | string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test, build } from "https://pkg.fluentci.io/zig_pipeline@v0.4.0/mod.ts";

await test();
await build();
```
