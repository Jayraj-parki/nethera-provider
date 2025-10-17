export const getPathByLevel = (pathname, level) => {
  const segments = pathname.split("/").filter(Boolean);
  const selected = segments.slice(0, level);
  return "/" + selected.join("/");
}
