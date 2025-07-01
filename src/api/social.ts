// Declare process for React Native / browser bundlers that shim Node globals.
declare const process: any;

const BASE: string = (process?.env?.API_URL as string) || 'http://localhost:8080';

export interface Network {
  id: string;
  name: string;
  description: string;
  ownerDid: string;
  members: string[];
  createdAt: string;
}

export interface Post {
  cid: string;
  networkId: string;
  authorDid: string;
  createdAt: string;
}

function headers(signature: string, ts: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: signature,
    'Mesh-Ts': ts,
  } as HeadersInit;
}

export async function createNetwork(token: string, ts: string, id: string, name: string, description = '') {
  const res = await fetch(`${BASE}/networks`, {
    method: 'POST',
    headers: headers(token, ts),
    body: JSON.stringify({ id, name, description }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function joinNetwork(token: string, ts: string, id: string) {
  const res = await fetch(`${BASE}/networks/${id}/join`, {
    method: 'POST',
    headers: headers(token, ts),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function postToNetwork(token: string, ts: string, id: string, cid: string) {
  const res = await fetch(`${BASE}/networks/${id}/posts`, {
    method: 'POST',
    headers: headers(token, ts),
    body: JSON.stringify({ cid }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function fetchFeed(token: string, ts: string): Promise<Post[]> {
  const res = await fetch(`${BASE}/feed`, {
    headers: headers(token, ts),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
} 