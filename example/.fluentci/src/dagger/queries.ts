import { gql } from "../../deps.ts";

export const test = gql`
  query test($src: String!, $version: String!) {
    test(src: $src, version: $version)
  }
`;

export const build = gql`
  query build($src: String!, $version: String!) {
    build(src: $src, version: $version)
  }
`;
