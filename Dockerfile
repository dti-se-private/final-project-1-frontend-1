# Set base image.
FROM oven/bun:latest

# Setup apt.
ENV DEBIAN_FRONTEND=noninteractive
RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

# Install apt dependencies.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt update -y \
    &&  \
    yes | apt install -y \
    zip

# Set workdir.
ENV WORKDIR=/workdir
WORKDIR $WORKDIR

# Set environment variables.
ARG NEXT_PUBLIC_BACKEND_1_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_BACKEND_1_URL=$NEXT_PUBLIC_BACKEND_1_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Copy the source code.
COPY . .
RUN if [ -f .env ]; then rm .env; fi

# Install dependencies.
RUN --mount=type=cache,target=~/.bun/install/cache,sharing=locked  \
    bun install

# Build the application.
RUN bun run build

# Start the application.
CMD ["bun", "run", "start"]