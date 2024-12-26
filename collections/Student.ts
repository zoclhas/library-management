import type { CollectionConfig } from "payload";

export const Student: CollectionConfig = {
  slug: "student",
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return Boolean(user);
    },
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "sid",
          label: "Student ID",
          type: "number",
          required: true,
          admin: {
            width: "34%",
          },
        },
        {
          name: "name",
          label: "Full Name",
          type: "text",
          required: true,
          admin: {
            width: "66%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "grade",
          type: "select",
          options: [
            {
              value: "pre_kg",
              label: "Pre KG",
            },
            {
              value: "kg_1",
              label: "KG 1",
            },
            {
              value: "kg_2",
              label: "KG 2",
            },
            ...Array.from({ length: 12 }, (_, index) => {
              const value = String(index + 1);
              return { value, label: `Grade ${value}` };
            }),
          ],
          admin: {
            width: "50%",
          },
          required: true,
        },
        {
          name: "section",
          type: "text",
          admin: {
            width: "50%",
          },
          required: true,
        },
      ],
    },
  ],
};
