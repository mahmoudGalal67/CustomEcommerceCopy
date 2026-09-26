FROM node:22-alpine

WORKDIR /workspace

# Root workspace files
COPY package.json package-lock.json ./

# Workspace package manifests
COPY apps/cms/package.json ./apps/cms/package.json
COPY packages/sharedSections/package.json ./packages/sharedSections/package.json

# Install dependencies from the workspace root
RUN npm install

# Copy the actual source
COPY apps/cms ./apps/cms
COPY packages/sharedSections ./packages/sharedSections

WORKDIR /workspace/apps/cms

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]