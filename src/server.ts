import { app } from '@/app';
import { env } from '@/config/env';

app.listen(env.PORT, () => {
  console.log(`DANTE web escuchando en http://localhost:${env.PORT}`);
});
