import { InternalServerErrorException } from "@nestjs/common";
import { getUser } from "src/common/getUser";
import { UserAuthRequest, UserAuthResponse } from "./types";

export async function getAuthenticatedUser(
  req: UserAuthRequest
): Promise<UserAuthResponse> {
  const payload = await getUser(req.token);

  if (!payload || typeof payload.data !== "object" || payload.data === null) {
    throw new InternalServerErrorException("Couldn't verify user");
  }

  const data: Partial<Record<UserAuthRequest["fields"][number], any>> = {};
  for (const field of req.fields) {
    data[field] = payload.data[field];
  }

  return { data };
}