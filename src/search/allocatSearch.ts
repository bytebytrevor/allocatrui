import { ALLOCAT_SEARCH_ALIAS_GROUPS } from "./allocatSearchAliases";

export type SearchableAllocat = {
  fullName?: string | null;
  title?: string | null;
  headline?: string | null;
  bio?: string | null;
  skills?: readonly { name?: string | null; category?: string | null }[];
};

// Deliberately literal matching, not fuzzy spelling or profession/credential inference.
function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function createAllocatSearch(value?: string | null) {
  const query = normalize(value);
  const aliasKey = query.replace(/\s+/g, " ");
  const exactGroups = ALLOCAT_SEARCH_ALIAS_GROUPS.filter((terms) =>
    terms.some((term) => term === aliasKey),
  );
  // Keep complete terms precise. Otherwise expand recognized prefixes while
  // typing, starting at three characters to avoid very broad short queries.
  const groups = exactGroups.length
    ? exactGroups
    : aliasKey.length >= 3
      ? ALLOCAT_SEARCH_ALIAS_GROUPS.filter((terms) =>
          terms.some((term) => term.startsWith(aliasKey)),
        )
      : [];
  // Expand original-query groups once, without recursively merging services
  // or changing canonical required skill IDs.
  const aliases: readonly string[] = [...new Set(groups.flat())].filter(
    (term) => term !== query,
  );

  function rank(person: SearchableAllocat): number {
    if (!query) return 0;
    const title = normalize(person.title);
    const headline = normalize(person.headline);
    const bio = normalize(person.bio);
    const name = normalize(person.fullName);
    const skills = (person.skills ?? []).map((skill) => normalize(skill.name));
    const categories = (person.skills ?? []).map((skill) =>
      normalize(skill.category),
    );
    const professionalExact = (term: string) =>
      title === term || skills.some((skill) => skill === term);
    const professionalContains = (term: string) =>
      title.includes(term) || skills.some((skill) => skill.includes(term));

    if (professionalExact(query)) return 1000;
    if (name === query) return 950;
    if (professionalContains(query)) return 900;
    if (headline.includes(query)) return 800;
    if (aliases.some(professionalExact)) return 775;
    if (aliases.some(professionalContains)) return 750;
    if (name.includes(query)) return 700;
    if (aliases.some((term) => headline.includes(term))) return 600;
    if (bio.includes(query)) return 400;
    if (categories.some((category) => category.includes(query))) return 300;
    if (aliases.some((term) => bio.includes(term))) return 200;
    if (
      aliases.some((term) =>
        categories.some((category) => category.includes(term)),
      )
    )
      return 100;
    return 0;
  }

  return { query, aliases, rank };
}
