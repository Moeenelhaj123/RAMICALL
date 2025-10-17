import type { Trunk, TrunkFormData } from '@/types/trunks'

export async function fetchTrunks(): Promise<Trunk[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  throw new Error('Backend not configured')
}

export async function createTrunk(data: TrunkFormData): Promise<Trunk> {
  await new Promise(resolve => setTimeout(resolve, 800))
  throw new Error('Backend not configured')
}

export async function updateTrunk(id: string, data: Partial<TrunkFormData>): Promise<Trunk> {
  await new Promise(resolve => setTimeout(resolve, 800))
  throw new Error('Backend not configured')
}

export async function toggleTrunkActive(id: string, active: boolean): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 600))
  throw new Error('Backend not configured')
}

export async function testTrunkFailover(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  throw new Error('Backend not configured')
}

export async function refreshTrunkStatus(): Promise<Trunk[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  throw new Error('Backend not configured')
}
