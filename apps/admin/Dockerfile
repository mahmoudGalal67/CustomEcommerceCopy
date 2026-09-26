FROM node:22-alpine

WORKDIR /workspace

# Root workspace files
COPY package.json package-lock.json ./

# Workspace package manifests
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages/sharedSections/package.json ./packages/sharedSections/package.json

# Install dependencies from the workspace root
RUN npm install

# Explicitly install the Alpine/Linux SWC binary
RUN npm install --save-dev @next/swc-linux-x64-musl

# Copy the actual source
COPY apps/admin ./apps/admin
COPY packages/sharedSections ./packages/sharedSections

WORKDIR /workspace/apps/admin

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]