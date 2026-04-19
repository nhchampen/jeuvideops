# Use lightweight Nginx alpine image
FROM nginx:alpine

# Copy the main landing page (index.html) and any root assets
RUN rm -rf /usr/share/nginx/html/*

# If youy have add
COPY index.html /usr/share/nginx/html/

# Copy additional root assets CSS, JS...
COPY *.css *.js *.png /usr/share/nginx/html/

# Copy the entire games folder structure
COPY games/ /usr/share/nginx/html/games/

# Add a custom nginx configuration for SPA fallback, compression, etc.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]