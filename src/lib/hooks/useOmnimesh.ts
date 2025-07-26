import { useState, useEffect, useCallback } from 'react';
import { useSession, useAgent } from '#/state/session';
import api from '#/lib/meshApi';

// Define types as per spec
type UnifiedFeedItem =
  | { recordType: 'post'; id: string; /* ... Bluesky post fields */ }
  | { recordType: 'omnimesh.job'; id: `job:${string}`; jobId: string; status: 'queued' | 'running' | 'succeeded' | 'failed'; ownerDid: string; createdAt: string; updatedAt?: string }
  | { recordType: 'omnimesh.tx'; id: `tx:${string}`; txId: string; phase: 'pending' | 'confirmed' | 'failed'; ownerDid: string; shardCid?: string; createdAt: string; updatedAt?: string };

type TxDraft = { action: string; amount: number; targetDid?: string; memo?: string };
type JobSpec = { /* Define job spec fields */ };

export function useOmnimesh() {
  const { currentAccount } = useSession(); // Get current user's DID
  const agent = useAgent();
  const did = currentAccount?.did;

  const [feedItems, setFeedItems] = useState<UnifiedFeedItem[]>([]);

  // Function to fetch and merge feeds
  const fetchUnifiedFeed = useCallback(async (targetDid?: string) => {
    try {
      // Fetch Bluesky posts
      const timelineRes = await agent.getTimeline({});
      const blueskyPosts = timelineRes.data.feed.map(post => ({
        recordType: 'post',
        id: post.post.uri,
        // Add other fields as needed
      }));

      // Fetch Omnimesh synthetic items
      const omnimeshRes = await api.get('/omnimesh/feed', { params: { did: targetDid || did } });
      const omnimeshItems = omnimeshRes.data; // Assume it returns UnifiedFeedItem[] of jobs and tx

      // Merge and sort
      const merged = [...blueskyPosts, ...omnimeshItems].sort((a, b) => {
        const timeA = Math.max(new Date(a.updatedAt || a.createdAt).getTime(), new Date(a.createdAt).getTime());
        const timeB = Math.max(new Date(b.updatedAt || b.createdAt).getTime(), new Date(b.createdAt).getTime());
        return timeB - timeA;
      });

      setFeedItems(merged);
    } catch (error) {
      console.error('Failed to fetch unified feed', error);
    }
  }, [did, agent]);

  useEffect(() => {
    if (did) {
      fetchUnifiedFeed();
    }
  }, [did, fetchUnifiedFeed]);

  const joinNetwork = useCallback(async (networkDid: string) => {
    await api.post('/omnimesh/networks/join', { did, networkDid });
    fetchUnifiedFeed(); // Refresh feed
  }, [did, fetchUnifiedFeed]);

  const leaveNetwork = useCallback(async (networkDid: string) => {
    await api.post('/omnimesh/leave', { did, networkDid });
    fetchUnifiedFeed(); // Refresh feed
  }, [did, fetchUnifiedFeed]);

  const submitTransaction = useCallback(async (draft: TxDraft) => {
    const response = await api.post('/omnimesh/transaction', { did, ...draft });
    fetchUnifiedFeed(); // Optimistically refresh
    return { txId: response.txId };
  }, [did, fetchUnifiedFeed]);

  const launchJob = useCallback(async (spec: JobSpec) => {
    const response = await api.post('/omnimesh/job', { did, ...spec });
    fetchUnifiedFeed(); // Optimistically refresh
    return { jobId: response.jobId };
  }, [did, fetchUnifiedFeed]);

  return {
    unifiedFeedItemsFor: (targetDid?: string) => {
      fetchUnifiedFeed(targetDid);
      return feedItems;
    },
    joinNetwork,
    leaveNetwork,
    submitTransaction,
    launchJob,
  };
} 