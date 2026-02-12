---
description: How to document new development work
---

# Documentation Workflow

This workflow explains how to maintain comprehensive documentation for all development activities on the M&A Platform.

## When to Document

Document whenever you:
- Add a new feature
- Fix a bug
- Refactor code
- Change dependencies
- Modify configuration
- Make any architectural decision

## Step-by-Step Process

### 1. Update DEVELOPMENT_LOG.md

Add a new entry following this template:

```markdown
## YYYY-MM-DD - [Brief Title]

### Timestamp: HH:MM IST

#### Context
[Why was this work needed? What problem are we solving?]

#### Actions Taken
1. [Detailed step 1]
2. [Detailed step 2]

#### Technical Details
- **Files Modified**: [list files]
- **New Files Created**: [list files]
- **Dependencies Added**: [list packages]

#### Rationale
[Why this approach? What alternatives were considered?]

#### Outcome
[What was achieved? Any issues? Next steps?]

#### Testing
[How was this tested?]
```

### 2. Update CHANGELOG.md (for significant changes)

Under the `[Unreleased]` section, add entries in the appropriate category:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Fixed**: Bug fixes
- **Removed**: Removed features
- **Security**: Security improvements

### 3. Update ARCHITECTURE.md (for architectural changes)

If the change affects:
- System design
- Component interactions
- Database schema
- API endpoints
- Technology stack

Update the relevant sections in ARCHITECTURE.md

### 4. Update task.md (artifact)

Mark completed tasks as `[x]` and add new tasks as needed.

### 5. Commit with descriptive message

```bash
git add .
git commit -m "feat: [brief description]

- Detail 1
- Detail 2

Updated: DEVELOPMENT_LOG.md, CHANGELOG.md"
```

## Quick Reference

- **Development Log**: `c:\Users\dhire\M&A\DEVELOPMENT_LOG.md`
- **Changelog**: `c:\Users\dhire\M&A\CHANGELOG.md`
- **Architecture**: `c:\Users\dhire\M&A\ARCHITECTURE.md`
- **Task Tracking**: Artifact task.md

## Tips

- Be specific, not vague
- Include code snippets for important changes
- Link to files using markdown: `[filename](file:///path/to/file)`
- Update immediately after completing work
- Use clear timestamps
