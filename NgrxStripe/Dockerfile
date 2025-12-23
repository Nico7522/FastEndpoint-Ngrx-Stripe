# ---------- Build Angular ----------
    FROM node:20-alpine AS build

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build -- --configuration production
    
    # ---------- Serve with Nginx ----------
    FROM nginx:alpine
    
    # Supprimer la conf par défaut
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copier la conf nginx
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copier le build Angular
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    