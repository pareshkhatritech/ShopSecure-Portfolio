# =========================================================
# BUILD
# =========================================================

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund

COPY . .

ARG VITE_API_URL=/api
ARG VITE_TURNSTILE_SITE_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

RUN npm run build


# =========================================================
# PRODUCTION
# =========================================================

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
