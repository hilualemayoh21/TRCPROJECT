docker-compose pull
docker-compose up -d db redis
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
