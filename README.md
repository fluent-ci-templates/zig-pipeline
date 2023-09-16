# Zig Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fzig_pipeline&query=%24.version)](https://pkg.fluentci.io/zig_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
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
dagger run fluentci .
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

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import Client, { connect } from "https://sdk.fluentci.io/v0.1.7/mod.ts";
import { test, build } from "https://pkg.fluentci.io/zig_pipeline@v0.2.0/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
