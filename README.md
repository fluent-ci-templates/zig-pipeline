# Zig Pipeline

[![deno module](https://shield.deno.dev/x/zig_pipeline)](https://deno.land/x/zig_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/zig-pipeline)](https://codecov.io/gh/fluent-ci-templates/zig-pipeline)

A ready-to-use Pipeline for your [Zig](https://ziglang.org/) projects.

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
| `ZIG_VERSION`   | The version of Zig to use. Defaults to `0.11.0` |

## Jobs

| Job       | Description   |
| --------- | ------------- |
| test      | Run tests     |
| build     | Build project |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/zig_pipeline/mod.ts";

const { test, build } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
