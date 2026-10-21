export type ThesisCardData = {
  badge: string;
  title: string;
  description: string;
  items: string[];
  theme?: "light" | "dark";
};

export type ThesisSectionData = {
  sectionTag: string;
  title: string;
  subtitle: string;
  withoutX402: ThesisCardData;
  withX402: ThesisCardData;
};

export type RepoItem = {
  name: string;
  href: string;
  tags: string[];
  description: string;
  colSpan?: string;
};

export type EcosystemSectionData = {
  sectionTag: string;
  title: string;
  subtitle: string;
  repos: RepoItem[];
};

export type AboutTag = {
  icon: string;
  label: string;
};

export type AboutSectionData = {
  sectionTag: string;
  title: string;
  description: string;
  tags: AboutTag[];
  whitepaperHref: string;
  communityHref: string;
};

export type HeroAction = {
  label: string;
  href: string;
  icon: string;
  variant: "primary" | "secondary";
};

export type HeroData = {
  statusPill: string;
  headline: string;
  subtitle: string;
  tagline: string;
  actions: HeroAction[];
  command: string;
  terminalNote: string;
};

export type CtaData = {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
};
