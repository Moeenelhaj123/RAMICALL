# Data Architecture Fix - Users as Single Source of Truth

## Problem
Avatar changes in the Users page were not reflected in the Agents Status board because user identity data (name, avatarUrl, email, role) was duplicated in both the `Agent` and `UserAccount` types.

## Solution
Implemented a normalized data architecture where Users are the single source of truth for identity fields.

## Changes Made

### 1. Type Definitions (`src/types/agent.ts`)
- **Removed** `name` and `avatarUrl` from `Agent` interface
- **Added** `userId: string` field to `Agent` interface to link to Users
- **Created** new `AgentView` interface that extends `Agent` with identity fields (name, avatarUrl, email, role)
- **Updated** `AgentsStatusBoardProps` to accept `AgentView[]` instead of `Agent[]`

### 2. Selector Logic (`src/lib/agentSelectors.ts`)
- **Created** new file with selector functions
- **Implemented** `createAgentViews()` to join agents with users efficiently using a Map
- **Implemented** `createAgentView()` for single agent transformations
- These selectors derive view models by combining Agent call data with User identity data

### 3. Mock Data (`src/App.tsx`)
- **Updated** `mockAgents` to remove duplicate identity fields (name, avatarUrl)
- **Added** `userId` field to each agent linking to corresponding user
- **Imported** `createAgentViews` selector from lib
- **Added** `agentViews` calculation that runs on every render: `const agentViews = createAgentViews(mockAgents, users)`
- **Updated** AgentsStatusBoard to receive `agentViews` instead of raw `mockAgents`

### 4. Component Updates (`src/components/AgentsStatusBoard.tsx`)
- **Updated** imports to use `AgentView` instead of `Agent`
- **Updated** `AgentCardProps` interface to accept `AgentView`
- **Updated** helper functions to work with `AgentView` type

### 5. Documentation (`PRD.md`)
- **Updated** Users Page section to reflect full CRUD capabilities
- **Added** Data Architecture section explaining the single source of truth pattern
- **Documented** the Agent-User linking via `userId` field

## How It Works

1. **Storage**: User identity lives only in `users` state (via `useState`)
2. **Linking**: Each `Agent` has a `userId` that references a `User.id`
3. **Derivation**: On each render, `createAgentViews()` joins agents with users to create `AgentView` objects
4. **Propagation**: When user avatar changes, React re-renders with updated users, agentViews are recalculated, and AgentsStatusBoard displays the new avatar

## Benefits

✅ **No Duplication**: Identity data stored once, in Users
✅ **Automatic Sync**: Avatar/name changes in Users instantly appear in Agents Status
✅ **Type Safety**: TypeScript enforces the architecture
✅ **Performance**: Map-based lookup is O(1) per agent
✅ **Maintainability**: Clear separation of concerns between call state and user identity

## Testing

To verify the fix:
1. Navigate to Users page
2. Edit Mahdi's user profile
3. Upload/change the avatar
4. Save changes
5. Navigate back to Dashboard
6. Confirm Mahdi's avatar is updated in the Agents Status board
