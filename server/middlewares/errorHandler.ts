import { NextResponse } from "next/server";
import createHttpError from "http-errors";

export function errorHandler(error: unknown) {
  if (error instanceof createHttpError.HttpError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}
