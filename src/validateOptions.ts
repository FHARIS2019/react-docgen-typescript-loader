import * as Ajv from "ajv";
import LoaderOptions from "./LoaderOptions";
import createAppError from "./createAppError";

const ajv = new Ajv();
const validate = ajv.compile({
  type: "object",
  additionalProperties: false,
  properties: {
    skipPropsWithName: {
      anyOf: [
        { type: "string", minLength: 1 },
        { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
      ],
    },

    skipPropsWithoutDoc: {
      type: "boolean",
    },

    tsconfigPath: {
      type: "string",
      minLength: 1,
    },

    compilerOptions: {
      type: "object",
    },

    docgenCollectionName: {
      anyOf: [{ type: "string", minLength: 1 }, { type: "null" }],
    },
  },
});

function validateOptions(options?: LoaderOptions) {
  if (!options) return;
  const valid = validate(options);

  if (!valid) {
    const errorMessage = validate.errors!
      .map(e => {
        let message: string = e.message!;
        if (e.dataPath) message = `${e.dataPath} ${message}`;
        return message;
      })
      .join(", ");
    throw createAppError(errorMessage);
  }
}

export default validateOptions;
