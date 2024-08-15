// import { StandupBot } from "./standup-bot";
// import { Log } from "./checks/log";
// import { Slack } from "./slack";
// import { Config } from "./config";
import { Orchestrator } from "./orchestrator";

export function debug() {
  const date = new Date("2024-08-19T21:00:05.710Z");
  Orchestrator.runStandups(date);
}
