export const BotService = {
  getData() {
    return [
      {
        id: "1",
        description:
          "Open your Telegram and create a group and add the members",
        image: "step-one",
      },
      {
        id: "2",
        description: "After group is created, add the ProCon helper bot",
        image: "step-two",
      },
      {
        id: "3",
        description: "After group is created, add the GroupID helper bot",
        image: "step-three",
      },
      {
        id: "4",
        description:
          "After that, copy the group ID in the message and submit in ProCon project! Enjoy!",
        image: "step-four",
      },
    ];
  },

  getProductsSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  },
};
