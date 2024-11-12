import { HTTP_SERVER_URL } from "@repo/lib/config";
import {
  CreateSpaceSchema,
  LogInSchema,
  SignUpSchema,
} from "@repo/lib/zodTypes";
import axios from "axios";
import { z } from "zod";

export async function getAllAvatars() {
  return axios
    .get(`${HTTP_SERVER_URL}/api/v1/avatar/all`)
    .then((res) => res.data);
}

export async function postSignUp(body: z.infer<typeof SignUpSchema>) {
  return axios
    .post(`${HTTP_SERVER_URL}/api/v1/auth/signup`, body)
    .then((res) => res.data);
}

export async function postLogIn(body: z.infer<typeof LogInSchema>) {
  return axios
    .post(`${HTTP_SERVER_URL}/api/v1/auth/login`, body)
    .then((res) => res.data);
}

export async function getSpaces() {
  return axios
    .get(`${HTTP_SERVER_URL}/api/v1/space/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}

export async function getMaps() {
  return axios.get(`${HTTP_SERVER_URL}/api/v1/map/all`).then((res) => res.data);
}

export async function postCreateSpace(body: z.infer<typeof CreateSpaceSchema>) {
  return axios
    .post(`${HTTP_SERVER_URL}/api/v1/space/create`, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}

export async function getSpaceData(spaceId: string) {
  return axios
    .get(`${HTTP_SERVER_URL}/api/v1/space/${spaceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}
