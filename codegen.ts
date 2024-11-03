import type { CodegenConfig } from "@graphql-codegen/cli";
import fs from "node:fs";

const config: CodegenConfig = {
  schema: "https://docs.github.com/public/fpt/schema.docs.graphql",
  documents: ["src/**/*.ts"],
  ignoreNoDocuments: true,
  emitLegacyCommonJSImports: false,
  generates: {
    "./src/graphql/": {
      preset: "client-preset",
      config: {
        // The GitHub octokit/graphql API uses strings directly, instead of
        // document nodes, so we use the string API
        documentMode: "string",
        // Ensure `import type {} from 'some-place';`, so that we are compatible
        // with verbatim module syntax and thus --experimental-strip-types
        useTypeImports: true,
        // Prefer types over `enum`, for --experimental-strip-types compatibility
        enumsAsTypes: true,
        // NOTE: The use of typescript parameter properties makes the use of
        // --experimental-strip-types insufficient; we also need
        // --experimental-transform-types, for full compatibility
        //
        // TODO: upstream this as an internal change, to avoid parameter
        // properties in TypedDocumentString. The equivalent manual declarations
        // are small.
      },
      hooks: {
        afterOneFileWrite(path: string) {
          // NOTE: The default settings will output imports with .js extensions,
          // which are not compatible with --experimental-strip-types. Node's
          // transforms require .ts extensions, because they do not affect emit
          // at all. Thus, we change the import path here. This is silly, and we
          // could probably just use `tsx` as the loader, instead of Node's
          // experimental stuff. This is more fun though.
          //
          // TODO: upstream this as a config change
          const contents = fs.readFileSync(path, "utf-8");
          const newContent = contents.replaceAll(
            /from ['"]([\/\.a-zA-Z\-_]+)\.([cm])*js['"]/g,
            "from '$1.$2ts'",
          );
          fs.writeFileSync(path, newContent);
        },
      },
    },
    "./schema.docs.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
