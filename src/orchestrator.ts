import { StandupBot } from "./standup-bot";
import { Log } from "./checks/log";
import { Config } from "./config";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Orchestrator {
  export function runStandups(currentTime: Date = new Date()): void {
    const configs: Config.StandupConfig[] = Config.loadConfigs(); // TODO load
    Log.log("Loading configurations, got " + configs.length + " configs");

    for (const config of configs) {
      Log.log(`Checking config for calendar ${config.calendarId}`);
      const standup = StandupBot.getStandupEvent(config, currentTime);
      if (standup === undefined) {
        Log.log("No standup event found");
        continue;
      }

      const standupPhase = StandupBot.getStandupPhase(
        config,
        currentTime,
        standup
      );
      if (standupPhase === undefined) {
        Log.log("No standup phase found");
        continue;
      } else if (standupPhase === StandupBot.StandupPhase.Start) {
        StandupBot.postStandupThread(config, standup);
      } else if (standupPhase === StandupBot.StandupPhase.Nudge) {
        StandupBot.sendStandupNudges(config, standup);
      } else if (standupPhase === StandupBot.StandupPhase.Finish) {
        if (config.notesDocumentUrl === "") {
          Log.log("No docUrl found");
          continue;
        }
        StandupBot.postStandupsToDoc(config);
      }
    }
  }
}
