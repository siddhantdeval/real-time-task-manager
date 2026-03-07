---
name: jira-tickets-crud
description: Create, read, update, and delete Jira tickets for the job-scrapper project. Handles full lifecycle management of Jira issues across project boards, including searching, filtering, transitioning statuses, linking issues, and adding comments/worklogs.
---

# Jira Tickets CRUD

## Keywords
create ticket, create issue, new task, new bug, new story, new epic, open ticket, read ticket, get issue, view issue, show ticket, fetch issue, update ticket, edit issue, modify ticket, change status, transition issue, close ticket, resolve issue, delete ticket, remove issue, link issue, add comment, log work, worklog, search tickets, find issues, list issues, filter tickets, JQL, jira ticket, jira issue, jira task, jira bug, jira story, jira epic, epic hierarchy, story under epic, subtask, child issue, parent issue, epic to story, story to subtask, create child ticket, create subtask, create story under epic

## Overview
Full lifecycle management of Jira issues for the **job-scrapper** project. Supports creating, reading, updating, and transitioning tickets across two projects:

- **RTMP1MF** — "Redis Task Manager – Phase 1 Monolithic Foundation" (Task, Epic, Bug, Story, Subtask)
- **MDP** — "My discovery project" (Idea)

**Atlassian Cloud ID:** `82e8a16b-c784-4633-9e7b-87b37b92e18c`  
**Jira Site:** `https://siddhantdeval.atlassian.net`

**Use this skill when:** The user wants to manage Jira tickets — creating new ones, reading/searching existing ones, updating fields/statuses, adding comments, logging work, or linking issues.

---

## Workflow

### Operation: CREATE

#### Step 1: Gather Information
Identify from user input:
- **Summary** (required) — brief one-liner title for the ticket
- **Issue Type** — Task, Bug, Story, Epic, Subtask, or Idea
- **Project** — RTMP1MF or MDP (default to RTMP1MF if not specified)
- **Description** (optional) — detailed description in Markdown
- **Assignee** (optional) — name or email of the person to assign

If the issue type isn't clear, use the context:
- Bug report → `Bug`
- Feature / user goal → `Story`
- Small piece of work → `Task`
- Large initiative → `Epic`
- Discovery / brainstorm → `Idea` (MDP project only)

#### Step 2: Lookup Assignee (if provided)
```
lookupJiraAccountId(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  searchString="[name or email]"
)
```
Handle results:
- **1 match** → use `accountId`
- **0 matches** → create unassigned, inform user
- **2+ matches** → ask user to clarify

#### Step 3: Create the Issue
```
createJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  projectKey="RTMP1MF",        // or "MDP"
  issueTypeName="Task",         // Task | Bug | Story | Epic | Subtask | Idea
  summary="[concise title]",
  description="[markdown description]",
  assignee_account_id="[account ID if found]"
)
```

#### Step 4: Confirm Creation
Return to user:
```
✅ Created [RTMP1MF-123] — [Summary]
🔗 https://siddhantdeval.atlassian.net/browse/RTMP1MF-123
   Type: Task | Assigned to: [Name or Unassigned]
```

---

### Operation: READ / SEARCH

#### Option A: Read a specific issue
If user provides an issue key (e.g., RTMP1MF-42):
```
getJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42"
)
```

#### Option B: Search with natural language
Use Rovo Search for natural language queries:
```
search(query="[user's query]")
```

#### Option C: Structured JQL search
For precise filtering (by status, assignee, type, date):
```
searchJiraIssuesUsingJql(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  jql="project = RTMP1MF AND status = 'In Progress' ORDER BY created DESC",
  fields=["summary", "status", "assignee", "issuetype", "priority", "created"],
  maxResults=20
)
```

**Common JQL patterns:**
| Need | JQL |
|---|---|
| All open issues | `project = RTMP1MF AND statusCategory != Done` |
| My issues | `project = RTMP1MF AND assignee = currentUser()` |
| Bugs only | `project = RTMP1MF AND issuetype = Bug` |
| Recently created | `project = RTMP1MF ORDER BY created DESC` |
| By keyword | `project = RTMP1MF AND summary ~ "LinkedIn"` |
| Unassigned | `project = RTMP1MF AND assignee is EMPTY` |
| Epics | `project = RTMP1MF AND issuetype = Epic` |

#### Present Results
Format search results as:
```
Found [N] issues in RTMP1MF:

1. [RTMP1MF-10] Fix LinkedIn rate limiting — Bug | In Progress | @Sid
2. [RTMP1MF-11] Add scraping retry logic — Task | To Do | Unassigned
3. [RTMP1MF-12] Job deduplication feature — Story | In Review | @Sid

🔗 View all: https://siddhantdeval.atlassian.net/jira/software/projects/RTMP1MF/boards
```

---

### Operation: UPDATE

#### Option A: Update fields (summary, description, assignee, etc.)

First confirm what to change with the user, then:
```
editJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42",
  fields={
    "summary": "Updated title",
    "description": "Updated description in markdown",
    "assignee": { "accountId": "[account ID]" }
  }
)
```

#### Option B: Transition status (move through workflow)

Step 1 — Get available transitions:
```
getTransitionsForJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42"
)
```

Step 2 — Apply the transition:
```
transitionJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42",
  transition={ "id": "[transition ID]" }
)
```

**Common status flows:**
```
To Do → In Progress → In Review → Done
```

#### Option C: Add a comment
```
addCommentToJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42",
  commentBody="[comment in Markdown]"
)
```

#### Option D: Log work (worklog)
```
addWorklogToJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42",
  timeSpent="2h",
  commentBody="[optional note about the work done]"
)
```
Time format: `30m`, `2h`, `1d`, `1w`

#### Option E: Link two issues
Step 1 — Get available link types:
```
jiraRead(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  action="getIssueLinkTypes"
)
```

Step 2 — Create the link:
```
jiraWrite(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  action="createIssueLink",
  type="Blocks",             // or: Duplicate, Clones, Relates
  inwardIssue="RTMP1MF-42",
  outwardIssue="RTMP1MF-55"
)
```

---

### Operation: DELETE / CLOSE

> [!IMPORTANT]
> Jira does not support true deletion of issues via MCP tools. The standard approach is to **transition an issue to "Done"** or add a "Won't Fix" resolution. Only Jira admins can permanently delete issues through the Jira UI.

**To close/resolve an issue:**
1. Get transitions → look for "Done", "Closed", "Won't Fix", or "Cancelled"
2. Apply the appropriate transition
3. Optionally add a closing comment explaining why

```
// Step 1: Get transitions
getTransitionsForJiraIssue(cloudId="...", issueIdOrKey="RTMP1MF-42")

// Step 2: Transition to Done (use the ID from step 1)
transitionJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42",
  transition={ "id": "[done transition ID]" }
)

// Step 3 (optional): Add closing note
addCommentToJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  issueIdOrKey="RTMP1MF-42",
  commentBody="Closing: [reason]"
)
```

---

## Issue Type Reference

| Type | Project | Hierarchy Level | Use Case |
|---|---|---|---|
| `Epic` | RTMP1MF | Top (Level 1) | Large initiative grouping multiple stories/tasks |
| `Story` | RTMP1MF | Mid (Level 2) | User-facing feature; child of an Epic |
| `Task` | RTMP1MF | Mid (Level 2) | Small, distinct piece of work; child of an Epic |
| `Bug` | RTMP1MF | Mid (Level 2) | Problem or error; can live under an Epic |
| `Subtask` | RTMP1MF | Bottom (Level 3) | Part of a Story or Task; must have a parent |
| `Idea` | MDP | Flat | Discovery / brainstorming concept |

---

## Issue Hierarchy (Epic → Story → Subtask)

Jira in this project uses a **3-level hierarchy:**

```
Epic  (top-level initiative)
  └── Story / Task / Bug  (mid-level work items)
        └── Subtask  (smallest unit; must have a parent)
```

### Creating a Child Issue (set the `parent` field)

When creating a Story, Task, or Bug **under an Epic**, pass the Epic's issue key as `parent`:

```
createJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  projectKey="RTMP1MF",
  issueTypeName="Story",
  summary="Implement LinkedIn job deduplication",
  parent="RTMP1MF-5"           // ← Epic key
)
```

When creating a **Subtask under a Story or Task**:

```
createJiraIssue(
  cloudId="82e8a16b-c784-4633-9e7b-87b37b92e18c",
  projectKey="RTMP1MF",
  issueTypeName="Subtask",
  summary="Write unit tests for deduplication logic",
  parent="RTMP1MF-12"          // ← Story or Task key
)
```

> [!IMPORTANT]
> Subtasks **must** have a `parent`. Creating a Subtask without one will fail.

### Workflow: Create Full Epic Tree

If the user wants to scaffold an entire feature:

1. **Create the Epic** (no parent needed)
2. **Create Stories/Tasks** with `parent = [Epic key]`
3. **Create Subtasks** with `parent = [Story/Task key]`

Example interaction:
```
User: "Set up an Epic for the job alert feature with 2 stories and subtasks"

→ Create Epic: RTMP1MF-20 "Job Alert Feature"
→ Create Story: RTMP1MF-21 "Send email alerts"         (parent: RTMP1MF-20)
→ Create Story: RTMP1MF-22 "Preferences UI"            (parent: RTMP1MF-20)
→ Create Subtask: RTMP1MF-23 "Design email template"   (parent: RTMP1MF-21)
→ Create Subtask: RTMP1MF-24 "Write sendgrid service"  (parent: RTMP1MF-21)
```

### JQL: Traversing the Hierarchy

| Need | JQL |
|---|---|
| All issues in an Epic | `"Epic Link" = RTMP1MF-20` or `parent = RTMP1MF-20` |
| All Subtasks of a Story | `parent = RTMP1MF-21` |
| All Epics in project | `project = RTMP1MF AND issuetype = Epic` |
| All Stories without an Epic | `project = RTMP1MF AND issuetype = Story AND "Epic Link" is EMPTY` |
| All open Subtasks | `project = RTMP1MF AND issuetype = Subtask AND statusCategory != Done` |

---

## Edge Cases

### Ambiguous Issue Type
If the user says something like "create a ticket for the LinkedIn bug":
- Default to `Bug` for error/failure descriptions
- Default to `Task` for implementation work
- Default to `Story` for feature requests
- Ask if still unclear

### Issue Not Found
```
❌ Issue RTMP1MF-999 not found.

Options:
1. Search by keyword → search(query="[keyword]")
2. List recent issues → searchJiraIssuesUsingJql(jql="project = RTMP1MF ORDER BY created DESC")
3. Check the project board → https://siddhantdeval.atlassian.net/jira/software/projects/RTMP1MF/boards
```

### Wrong Project
If user mentions a project not in scope:
```
⚠️ I only have access to two projects:
- RTMP1MF (Redis Task Manager – Phase 1)
- MDP (My discovery project)

Which project did you mean?
```

### Multiple Matching Issues
When searching returns many results, ask the user to narrow down:
```
Found 15 issues matching "LinkedIn". Which one did you mean?
1. [RTMP1MF-5] LinkedIn scraping fails on rate limit
2. [RTMP1MF-8] LinkedIn job deduplication logic
3. [RTMP1MF-12] LinkedIn cookies not persisting
...

Type the issue number or a more specific description.
```

---

## Quick Reference

**Cloud ID:** `82e8a16b-c784-4633-9e7b-87b37b92e18c`  
**Projects:** `RTMP1MF` (software) · `MDP` (discovery)

| Operation | Primary Tool |
|---|---|
| Create ticket | `createJiraIssue` |
| Read specific issue | `getJiraIssue` |
| Search / filter | `searchJiraIssuesUsingJql` or `search` |
| Update fields | `editJiraIssue` |
| Transition status | `getTransitionsForJiraIssue` → `transitionJiraIssue` |
| Add comment | `addCommentToJiraIssue` |
| Log work | `addWorklogToJiraIssue` |
| Link issues | `jiraRead(getIssueLinkTypes)` → `jiraWrite(createIssueLink)` |
| Close/resolve | Transition to "Done" via `transitionJiraIssue` |
| Create child issue | `createJiraIssue` with `parent="[key]"` |
| List children of Epic/Story | `searchJiraIssuesUsingJql(jql="parent = [key]")` |

**Always:**
- Use cloudId `82e8a16b-c784-4633-9e7b-87b37b92e18c` for all API calls
- Confirm destructive or bulk operations before executing
- Show issue URL `https://siddhantdeval.atlassian.net/browse/[KEY]` in all responses
- Handle errors gracefully with actionable alternatives
