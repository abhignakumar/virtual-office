import {
  CreateSpaceSchema,
  JoinSpaceSchema,
  LogInSchema,
  SignUpSchema,
} from "@repo/lib/zodTypes";
import axios from "axios";
import { z } from "zod";

export async function getAllAvatars() {
  return axios
    .get(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/avatar/all`)
    .then((res) => res.data);
}

export async function postSignUp(body: z.infer<typeof SignUpSchema>) {
  return axios
    .post(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/auth/signup`, body)
    .then((res) => res.data);
}

export async function postLogIn(body: z.infer<typeof LogInSchema>) {
  return axios
    .post(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/auth/login`, body)
    .then((res) => res.data);
}

export async function getSpaces() {
  return axios
    .get(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/space/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}

export async function getMaps() {
  return axios
    .get(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/map/all`)
    .then((res) => res.data);
}

export async function postCreateSpace(body: z.infer<typeof CreateSpaceSchema>) {
  return axios
    .post(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/space/create`, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}

export async function getSpaceData(spaceId: string) {
  return axios
    .get(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/space/${spaceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}

export async function deleteSpace({ spaceId }: { spaceId: string }) {
  return axios
    .delete(`${import.meta.env.VITE_HTTP_SERVER_URL}/api/v1/space/${spaceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);
}

export async function postJoinSpace(body: z.infer<typeof JoinSpaceSchema>) {
  return axios
    .post(
      body.inviteURL,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((res) => res.data);
}
