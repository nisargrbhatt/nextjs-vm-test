import { FunctionProcessor } from "@/lib/engine/function";
import type { ServerRuntime } from "next";
import { NextResponse } from "next/server";

export const runtime: ServerRuntime = "nodejs";

export const GET = async (req: Request) => {
  try {
    const processor = new FunctionProcessor();
    const res = await processor.process(
      {
        p1: Date.now(),
      },
      {
        p2: new Date().toJSON(),
      },
      {
        r1: "r1",
      }
    );
    console.info("result");
    console.log(res);
    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "failed",
      },
      {
        status: 500,
      }
    );
  }
};
