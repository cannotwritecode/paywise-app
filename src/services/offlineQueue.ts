// src/services/offlineQueue.ts
import { setItem, getItem, removeItem } from "./storage";
import API from "./api";

const QUEUE_KEY = "offline_queue_v1";

export type QueuedItem = {
  id: string; // uuid
  endpoint: string; // e.g. /prices
  method: "POST" | "PUT";
  body: any;
  attachments?: string[]; // data URLs or blobs saved keys
  createdAt: string;
};

export async function enqueue(item: QueuedItem) {
  const q = (await getItem<QueuedItem[]>(QUEUE_KEY)) || [];
  q.push(item);
  await setItem(QUEUE_KEY, q);
}

export async function getQueue() {
  return (await getItem<QueuedItem[]>(QUEUE_KEY)) || [];
}

export async function clearQueue() {
  await removeItem(QUEUE_KEY);
}

export async function processQueue() {
  const q = await getQueue();
  if (!q.length) return;
  const failed: QueuedItem[] = [];
  for (const item of q) {
    try {
      await API.post(item.endpoint, item.body);
      // TODO: handle attachments: upload them separately if needed
    } catch (e) {
      failed.push(item);
    }
  }
  await setItem(QUEUE_KEY, failed);
}
