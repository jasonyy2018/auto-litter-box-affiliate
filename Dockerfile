FROM node:22-alpine AS builder

# Configure reliable APK mirror and install dependencies required by Prisma
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories || true
RUN apk add --no-cache --retries 5 --timeout 30 openssl || apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN pnpm build

# ---
FROM node:22-alpine AS runner

# Configure reliable APK mirror and install dependencies for runner
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories || true
RUN apk add --no-cache --retries 5 --timeout 30 openssl || apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data

# Expose the production port
EXPOSE 3000

# Start the application in production mode
CMD ["node", "server.js"]
