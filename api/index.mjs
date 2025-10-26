// api/index.mjs – Vercel handler w trybie ES Modules

export default async (req, res) => {
  try {
    const { app } = await import('../dist/bhp-page/server/server.mjs');
    return app(req, res);
  } catch (error) {
    console.error('Error loading server module:', error);
    res.status(500).send('Server Error');
  }
};
