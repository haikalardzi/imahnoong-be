import { viewer } from "../../../viewer.js";

export async function viewerCount(req, reply) {
  return { viewers: viewer, count: viewer.length };
}