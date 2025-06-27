import { viewer } from "../../../utils/objects.js";

export async function viewerCount(req, reply) {
  return { viewers: [...viewer], count: viewer.size };
}