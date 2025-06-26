import { viewer } from "../../../utils/viewer.js";

export async function viewerCount(req, reply) {
  return { viewers: [...viewer], count: viewer.size };
}