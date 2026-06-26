// External if the href carries a scheme (https:, mailto:, ...) or is protocol-relative (//host).
// Bare paths, hash fragments, and query strings stay internal.
const isExternalHref = (href: string) => /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(href);

export { isExternalHref };
