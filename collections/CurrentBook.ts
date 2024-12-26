import type { CollectionConfig } from "payload";

export const CurrentBook: CollectionConfig = {
  slug: "current",
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
          defaultValue: new Date(Date.now()),
          required: true,
          admin: {
            width: "33%",
          },
        },
        {
          name: "due_date",
          label: "Due Date",
          type: "date",
          defaultValue: (() => {
            const today = new Date();
            const oneWeekFromNow = new Date(today);
            oneWeekFromNow.setDate(today.getDate() + 7);

            // Adjust to the following Monday if the due date falls on Saturday (6) or Sunday (0)
            if (oneWeekFromNow.getDay() === 6) {
              // Saturday -> Add 2 days
              oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 2);
            } else if (oneWeekFromNow.getDay() === 0) {
              // Sunday -> Add 1 day
              oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 1);
            }

            return oneWeekFromNow;
          })(),
          required: true,
          admin: {
            width: "33%",
          },
        },
        {
          name: "returned",
          label: "Returned",
          type: "checkbox",
          defaultValue: false,
          admin: {
            width: "33%",
            style: {
              justifyContent: "center",
            },
          },
        },
      ],
    },
  ],
};
