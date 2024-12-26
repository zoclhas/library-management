import type { CollectionConfig } from "payload";

export const Book: CollectionConfig = {
  slug: "book",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "id",
          label: "Book ID",
          type: "number",
          required: true,
          admin: {
            width: "33%",
          },
        },
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            width: "66%",
          },
        },
      ],
    },
    {
      name: "condition",
      type: "select",
      options: [
        {
          value: "original",
          label: "Original",
        },
        {
          value: "torn",
          label: "Torn",
        },
        {
          value: "missing_pages",
          label: "Missing Pages",
        },
        {
          value: "lost",
          label: "Lost",
        },
      ],
      defaultValue: "original",
      required: true,
    },
  ],
};
