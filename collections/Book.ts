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
          name: "date",
          type: "date",
          required: true,
          admin: {
            width: "20%",
          },
        },
        {
          name: "bid",
          label: "Book ID",
          type: "number",
          required: true,
          admin: {
            width: "20%",
          },
        },
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            width: "60%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "text",
          required: true,
          admin: {
            width: "20%",
          },
        },
        {
          name: "publisher",
          label: "Place & Publisher",
          type: "text",
          required: true,
          admin: {
            width: "40%",
          },
        },
        {
          name: "year",
          type: "number",
          required: true,
          admin: {
            width: "20%",
          },
        },
        {
          name: "pages",
          type: "number",
          required: true,
          admin: {
            width: "20%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "volume",
          type: "number",
          required: true,
          defaultValue: 1,
          admin: {
            width: "20%",
          },
        },
        {
          name: "total_volume",
          label: "Total Volume",
          type: "number",
          required: true,
          defaultValue: 1,
          admin: {
            width: "20%",
          },
        },
        {
          name: "source",
          type: "text",
          required: true,
          admin: {
            width: "40%",
          },
        },
        {
          name: "cost",
          type: "text",
          defaultValue: "AED ",
          required: true,
          admin: {
            width: "20%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "class_no",
          label: "Class No.",
          type: "text",
          required: true,
          admin: {
            width: "20%",
          },
        },
        {
          name: "isbn",
          label: "ISBN No.",
          type: "text",
          defaultValue: "###",
          admin: {
            width: "20%",
          },
        },
        {
          name: "voucher_no",
          label: "Voucher No.",
          type: "text",
          admin: {
            width: "20%",
          },
        },
        {
          name: "voucher_date",
          label: "Voucher Date",
          type: "date",
          admin: {
            width: "20%",
          },
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
          admin: {
            width: "20%",
          },
        },
      ],
    },
  ],
};
