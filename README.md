# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## How can I compare branches?

To see the differences between the current branch and another branch (e.g., `sgs-new-cp`), you can use the following git commands:

**View a summary of file changes:**
```sh
# Compare current branch with another branch
git diff --stat origin/sgs-new-cp

# Or explicitly specify both branches
git diff --stat origin/sgs-new-cp..HEAD
```

**View detailed code differences:**
```sh
# See full diff between branches
git diff origin/sgs-new-cp

# See diff for a specific file
git diff origin/sgs-new-cp -- path/to/file.ts
```

**View commit history differences:**
```sh
# Show commits in current branch that are not in sgs-new-cp
git log origin/sgs-new-cp..HEAD --oneline

# Show commits in sgs-new-cp that are not in current branch
git log HEAD..origin/sgs-new-cp --oneline
```

**Compare branches on GitHub:**
You can also compare branches directly on GitHub by visiting:
`https://github.com/alvarodenicolasizquierdo/tu-killer-cp/compare/sgs-new-cp...YOUR_BRANCH_NAME`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
