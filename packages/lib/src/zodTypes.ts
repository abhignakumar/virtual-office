import z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  password: z.string().min(4, "Minimum of 4 characters"),
  avatarId: z.string().min(1, "Required"),
});

export const LogInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});

export const CreateSpaceSchema = z.object({
  name: z.string().min(1, "Required"),
  mapId: z.string().min(1, "Required"),
});

const IncomingMessageJoin = z.object({
  type: z.literal("join"),
  payload: z.object({
    token: z.string(),
    spaceId: z.string(),
    mapId: z.string(),
  }),
});

const IncomingMessageMove = z.object({
  type: z.literal("move"),
  payload: z.object({
    locationX: z.number(),
    locationY: z.number(),
  }),
});

const IncomingMessageExit = z.object({
  type: z.literal("exit"),
  payload: z.object({}),
});

export const IncomingMessage =
  IncomingMessageJoin.or(IncomingMessageMove).or(IncomingMessageExit);
