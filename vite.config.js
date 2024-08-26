export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
}
