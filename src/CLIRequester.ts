import { spawnSync } from "child_process";
import { Commands } from "./Commands";


export function request(params: {
    command: Commands,
    repository?: string,
    insecureNoPassword?: boolean,
}): any{
    const cliParameters = [params.command, "--json"]
    
    if (params.repository)
        cliParameters.push("-r", params.repository)
    
    if (params.insecureNoPassword)
        cliParameters.push("--insecure-no-password")
    
    
    const result = spawnSync("restic", cliParameters, { encoding: 'utf-8' })

    if (result.status !== 0)
        throw new Error(`Failed to execute command: ${result.stderr}`)

    return JSON.parse(result.stdout);
}