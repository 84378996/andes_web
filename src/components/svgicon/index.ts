const req = require.context("@/assets/svg", false, /\.svg$/);
const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().map(requireContext);
requireAll(req);
