// storage-adapter-import-placeholder
// import { sqliteAdapter } from "@payloadcms/db-sqlite";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Book } from "./collections/Book";
import { Student } from "./collections/Student";
import { CurrentBook } from "./collections/CurrentBook";
import { PreviousOwner } from "./collections/PreviousOwner";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Student, Book, CurrentBook, PreviousOwner],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // db: sqliteAdapter({
  //   client: {
  //     url: process.env.DATABASE_URI || "",
  //   },
  // }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [],
});
