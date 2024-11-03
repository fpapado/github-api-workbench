import * as octokitGraphQL from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import type {
  GraphQlResponse,
  RequestParameters,
} from "@octokit/graphql/types";
import type { TypedDocumentString } from "./graphql/graphql.ts";
import { graphql } from "./graphql/gql.ts";

const token = process.env.GH_TOKEN;

if (!token) {
  throw new Error(
    "Could not find token as process.env.GH_TOKEN. Ensure that the environment variable or .env file is set up correctly.",
  );
}

const authorisedGraphQl = octokitGraphQL.graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const octokit = new Octokit({
  auth: token,
});

/**
 * Like graphql from "@octokit/graphql", but with typed parameters and response
 * values.
 */
const typedGraphQlRequest = <TResponse, TParams>(
  queryString: TypedDocumentString<TResponse, TParams>,
  // Read this as: parameters are optional if the query takes no variables,
  // otherwise they are required
  ...[params]: TParams extends Record<string, never>
    ? [RequestParameters?]
    : [TParams & RequestParameters]
): GraphQlResponse<TResponse> => {
  return authorisedGraphQl<TResponse>(queryString.toString(), params);
};

async function main() {
  const res = await typedGraphQlRequest(
    graphql(`
      query demo($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          name
          stargazerCount
        }
      }
    `),
    {
      owner: "octokit",
      repo: "graphql.js",
    },
  );

  console.log(res.repository);

  const res2 = await octokit.repos.get({
    owner: "octokit",
    repo: "graphql.js",
  });

  console.log(res2.data);
}

main();
