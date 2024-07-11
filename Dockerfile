FROM nginx:stable-alpine

ARG DIST

COPY $DIST /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
