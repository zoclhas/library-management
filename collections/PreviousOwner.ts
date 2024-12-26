import type { CollectionConfig } from "payload";

export const PreviousOwner: CollectionConfig = {
  slug: "previous",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "book",
          type: "relationship",
          relationTo: "book",
          hasMany: false,
          required: true,
          admin: {
            width: "50%",
          },
        },
        {
          name: "Student",
          type: "relationship",
          relationTo: "student",
          hasMany: false,
          required: true,
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "lend_date",
          label: "Lend Date",
          type: "date",
          required: true,
          admin: {
            width: "50%",
          },
        },
        {
          name: "Returned_date",
          label: "Returned Date",
          type: "date",
          required: true,
          admin: {
            width: "50%",
          },
        },
      ],
    },
  ],
};
