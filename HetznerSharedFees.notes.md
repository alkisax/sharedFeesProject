### nginx
```nginx
location ^~ /shared-fees/ {
    proxy_pass http://localhost:3012/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

### hetzner cmd
```bash
git remote -v
ssh root@49.12.76.128
cd /var/www
git clone git@github.com:alkisax/sharedFeesProject.git shared-fees
cd shared-fees #→VITE_BACKEND_URL=/shared-fees/api
cd frontend
npm install
nano .env
npm run build
cd ../backend
nano .env
npm install
npm run build

pm2 start build/src/server.js --name shared-fees
curl http://localhost:3012/api/ping

cat /etc/nginx/sites-available/portfolio-projects.space
nano /etc/nginx/sites-available/portfolio-projects.space
nginx -t
systemctl reload nginx
curl https://portfolio-projects.space/shared-fees/ | head
```

