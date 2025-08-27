import { spawn } from "child_process";
import { Repository } from "./Repository";

interface ResticMessage {
  message_type: string;
  percent_done?: number;
  [key: string]: unknown;
}

const repo = "C:\\Users\\Francois\\Desktop\\restic_test";
const src = "C:\\Users\\Francois\\Downloads";

const repository = new Repository(repo);
console.log(repository);

/* const restic = spawn("restic", [
  "-r", repo,
  "backup", src,
  "--json",
  "--verbose=2",
  "--insecure-no-password"
]);

restic.stdout.on("data", (data: Buffer) => {
  const lines = data.toString().trim().split("\n");
  for (const line of lines) {
    try {
      const msg = JSON.parse(line) as ResticMessage;
      if (msg.message_type === "status" && msg.percent_done !== undefined) {
        console.log(`Progress: ${(msg.percent_done * 100).toFixed(1)}%`);
      }
      if (msg.message_type === "summary") {
        console.log("Backup finished:", msg);
      }
    } catch (e) {
      console.error("Non-JSON output:", line);
    }
  }
});

restic.stderr.on("data", (data: Buffer) => {
  console.error("Error:", data.toString());
});

restic.on("close", (code: number) => {
  console.log(`Restic exited with code ${code}`);
}); */