import * as octokit from "@octokit/graphql";
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

const authorisedGraphQl = octokit.graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

/**
 * Like graphql from "@octokit/graphql", but with typed parameters and response
 * values.
 */
const typedRequest = <TResponse, TParams>(
  queryString: TypedDocumentString<TResponse, TParams>,
  params?: TParams & RequestParameters,
): GraphQlResponse<TResponse> => {
  return authorisedGraphQl<TResponse>(queryString.toString(), params);
};

async function main() {
  const res = await typedRequest(
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
}

main();
