// api/index.mjs – Vercel handler for Angular SSR

export default async (req, res) => {
  try {
    const { app } = await import('../dist/wizytowka-slub/server/server.mjs');
    return app(req, res);
  } catch (error) {
    console.error('Error loading server module:', error);
    res.status(500).send('Server Error');
  }
};
