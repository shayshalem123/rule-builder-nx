# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9fbe7233-b249-4bb8-b762-d9bf9d9ff700

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9fbe7233-b249-4bb8-b762-d9bf9d9ff700) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The project uses pnpm as the package manager - [install pnpm](https://pnpm.io/installation)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
pnpm install

# Step 4: Start the development server with auto-reloading and an instant preview.
pnpm run dev
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

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- pnpm (package manager with isolated node_modules)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9fbe7233-b249-4bb8-b762-d9bf9d9ff700) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Package Management with pnpm

This project uses pnpm with isolated node modules. The key features of this setup:

- Dependencies are stored in the `.pnpm` folder inside `node_modules`
- Improved disk space usage through content-addressable storage
- Faster installation times
- Strict dependency management

Common pnpm commands:

```sh
# Install dependencies
pnpm install

# Add a new dependency
pnpm add <package-name>

# Add a development dependency
pnpm add -D <package-name>

# Run scripts
pnpm run dev
pnpm run build

# Clean node_modules
pnpm run clean
```
