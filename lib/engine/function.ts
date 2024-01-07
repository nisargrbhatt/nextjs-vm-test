import { safeAsync } from "../utils/safe";
import { performance } from "node:perf_hooks";
import { createContext, runInNewContext, measureMemory } from "vm";

// import { LogSeverity, type WorkflowLogger } from '../logger';
import axios from "axios";

const httpClient = async (...args: any[]) => {
  // @ts-ignore-next-line
  const result: any = await axios.apply(this, args);
  return result.data;
};

export class FunctionProcessor {
  async process(
    params: Record<string, any>,
    global: Record<string, any>,
    // loggerObj: WorkflowLogger,
    results: Record<string, any>
    // task: Task,
  ): Promise<{}> {
    const tick = performance.now();
    const context = createContext({
      // console: {
      //   log: (...args: any[]) => loggerObj.log(LogSeverity.log, ...args),
      //   info: (...args: any[]) => loggerObj.log(LogSeverity.info, ...args),
      //   warn: (...args: any[]) => loggerObj.log(LogSeverity.warn, ...args),
      //   error: (...args: any[]) => loggerObj.log(LogSeverity.error, ...args),
      // },
      console: {
        log: (...args: any[]) => console.log(...args),
        info: (...args: any[]) => console.info(...args),
        warn: (...args: any[]) => console.warn(...args),
        error: (...args: any[]) => console.error(...args),
      },
      axios: httpClient,
      workflowParams: params,
      workflowGlobal: global,
      workflowResults: results,
    });

    const evalResult = await safeAsync(
      await runInNewContext(
        `
    async function handler(){
      console.log(workflowParams);
      console.log(workflowGlobal);
      console.log(workflowResults);
      const response  = await axios({url:"https://jsonplaceholder.typicode.com/users", method: "GET"});
      console.log(response);
      return response;
    }
    handler();
    `,
        context,
        {}
      )
    );

    if (evalResult.success === false) {
      throw evalResult.error;
    }

    const tock = performance.now();

    const timeTaken = (tock - tick) / 1000;

    if (!evalResult.data) {
      return {
        response: {},
        memoryUsage: 0,
        timeTaken,
      };
    }
    return {
      response: evalResult.data,
      memoryUsage: 0,
      timeTaken,
    };
  }
}
