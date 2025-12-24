# ---------- Build ----------
    FROM node:20-alpine AS build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build -- --configuration production
    
    # ---------- Nginx ----------
    FROM nginx:alpine
    
    RUN rm /etc/nginx/conf.d/default.conf
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # ⚠️ ICI est la clé
    COPY --from=build /app/dist/NgrxStripe/browser /usr/share/nginx/html
    
    EXPOSE 80
    