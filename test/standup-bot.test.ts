import { jest } from "@jest/globals";

import { StandupBot } from "../src/standup-bot";
import { MessageElement } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { messages } from "./slack-data";

describe("StandupBot.getUserIdMentionsFromMessage", () => {
  test("should pull ids from message", () => {
    expect(StandupBot.getUserIdMentionsFromMessage(messages[0])).toEqual([
      "U044HT4GLVD",
      "U1V25CFLP",
    ]);
  });
});

describe("StandupBot.isRoughlyThisTime", () => {
  test("is roughly this time", () => {
    expect(
      StandupBot.isRoughlyThisTime(
        new Date("Oct 28, 2024, 9:20:00 AM"),
        new Date("Oct 28, 2024, 9:17:21 AM")
      )
    ).toEqual(true);

    expect(
      StandupBot.isRoughlyThisTime(
        new Date("Oct 28, 2024, 9:17:21 AM"),
        new Date("Oct 28, 2024, 9:20:00 AM")
      )
    ).toEqual(false);
  });
});
