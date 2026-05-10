"use client";

import type { GitHubRepo } from "../../preview/types";
import { editorSectionLabels, parseCommaSeparated } from "../editor-utils";
import type { EditorSectionConfig } from "../types";
import { CardEditor } from "./CardEditor";

type SectionEditorProps = {
  repos: GitHubRepo[];
  section: EditorSectionConfig | null;
  onSectionChange: (nextSection: EditorSectionConfig) => void;
};

export function SectionEditor({
  repos,
  section,
  onSectionChange,
}: SectionEditorProps) {
  if (!section) {
    return (
      <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">
        Select a section from the structure panel to edit its content.
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Section editor
        </p>
        <h2 className="text-xl font-semibold text-white">
          {editorSectionLabels[section.type]}
        </h2>
      </div>

      <div className="mt-5">
        {section.type === "hero" ? (
          <HeroEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "skills" ? (
          <SkillsEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "featured-project" ? (
          <FeaturedProjectEditor
            repos={repos}
            section={section}
            onChange={onSectionChange}
          />
        ) : null}
        {section.type === "projects-grid" ? (
          <ProjectsGridEditor
            repos={repos}
            section={section}
            onChange={onSectionChange}
          />
        ) : null}
        {section.type === "text" ? (
          <TextSectionEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "mixed-media" ? (
          <MixedMediaEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "media-slide" ? (
          <MediaSlideEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "collage" ? (
          <CollageEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "highlights" ? (
          <HighlightsEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "contributions" ? (
          <SimpleTitleEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "contribution-activity" ? (
          <SimpleTitleEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "socials" ? (
          <SimpleTitleEditor section={section} onChange={onSectionChange} />
        ) : null}
        {section.type === "contact" ? (
          <ContactEditor section={section} onChange={onSectionChange} />
        ) : null}
      </div>
    </section>
  );
}

function TextSectionEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "text" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Section eyebrow"
          value={section.eyebrow}
          onChange={(value) => onChange({ ...section, eyebrow: value })}
        />
      </div>
      <SelectField
        label="Text alignment"
        value={section.alignment}
        options={[
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ]}
        onChange={(value) =>
          onChange({ ...section, alignment: value as typeof section.alignment })
        }
      />
      <TextAreaField
        label="Body copy"
        rows={6}
        value={section.description}
        onChange={(value) => onChange({ ...section, description: value })}
      />
    </div>
  );
}

function MixedMediaEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "mixed-media" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Section eyebrow"
          value={section.eyebrow}
          onChange={(value) => onChange({ ...section, eyebrow: value })}
        />
      </div>
      <TextAreaField
        label="Body copy"
        rows={5}
        value={section.description}
        onChange={(value) => onChange({ ...section, description: value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Media URL"
          value={section.mediaUrl}
          onChange={(value) => onChange({ ...section, mediaUrl: value })}
        />
        <TextField
          label="Media alt text"
          value={section.mediaAlt}
          onChange={(value) => onChange({ ...section, mediaAlt: value })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Media label"
          value={section.mediaLabel}
          onChange={(value) => onChange({ ...section, mediaLabel: value })}
        />
        <SelectField
          label="Media side"
          value={section.mediaSide}
          options={[
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ]}
          onChange={(value) =>
            onChange({
              ...section,
              mediaSide: value as typeof section.mediaSide,
            })
          }
        />
      </div>
      <ToggleField
        label="Show media label"
        checked={section.showMediaLabel}
        onChange={(checked) => onChange({ ...section, showMediaLabel: checked })}
      />
    </div>
  );
}

function MediaSlideEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "media-slide" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Section eyebrow"
          value={section.eyebrow}
          onChange={(value) => onChange({ ...section, eyebrow: value })}
        />
      </div>
      <ToggleField
        label="Show intro paragraph"
        checked={section.showIntro}
        onChange={(checked) => onChange({ ...section, showIntro: checked })}
      />
      <TextAreaField
        label="Intro paragraph"
        rows={4}
        value={section.intro}
        onChange={(value) => onChange({ ...section, intro: value })}
      />
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm font-semibold text-white">Main media</p>
        <div className="mt-4 grid gap-4">
          <SelectField
            label="Media type"
            value={section.media.type}
            options={[
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
            ]}
            onChange={(value) =>
              onChange({
                ...section,
                media: {
                  ...section.media,
                  type: value as typeof section.media.type,
                },
              })
            }
          />
          <TextField
            label="Media URL"
            value={section.media.url}
            onChange={(value) =>
              onChange({
                ...section,
                media: { ...section.media, url: value },
              })
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Alt text"
              value={section.media.alt}
              onChange={(value) =>
                onChange({
                  ...section,
                  media: { ...section.media, alt: value },
                })
              }
            />
            <TextField
              label="Caption"
              value={section.media.caption}
              onChange={(value) =>
                onChange({
                  ...section,
                  media: { ...section.media, caption: value },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CollageEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "collage" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Section eyebrow"
          value={section.eyebrow}
          onChange={(value) => onChange({ ...section, eyebrow: value })}
        />
      </div>
      <ToggleField
        label="Show intro paragraph"
        checked={section.showIntro}
        onChange={(checked) => onChange({ ...section, showIntro: checked })}
      />
      <TextAreaField
        label="Intro paragraph"
        rows={4}
        value={section.intro}
        onChange={(value) => onChange({ ...section, intro: value })}
      />
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Collage items</p>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...section,
                items:
                  section.items.length >= 6
                    ? section.items
                    : [
                        ...section.items,
                        {
                          id: `media-${Math.random().toString(36).slice(2, 8)}`,
                          type: "image",
                          url: "",
                          alt: `Collage media ${section.items.length + 1}`,
                          caption: `Collage item ${section.items.length + 1}`,
                        },
                      ],
              })
            }
            className="rounded-full border border-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/10"
          >
            Add collage item
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {section.items.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Item {index + 1}</p>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...section,
                      items:
                        section.items.length > 1
                          ? section.items.filter((currentItem) => currentItem.id !== item.id)
                          : section.items,
                    })
                  }
                  className="rounded-full border border-rose-400/20 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-400/10"
                >
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-4">
                <SelectField
                  label="Media type"
                  value={item.type}
                  options={[
                    { label: "Image", value: "image" },
                    { label: "Video", value: "video" },
                  ]}
                  onChange={(value) =>
                    onChange({
                      ...section,
                      items: section.items.map((currentItem) =>
                        currentItem.id === item.id
                          ? { ...currentItem, type: value as typeof item.type }
                          : currentItem,
                      ),
                    })
                  }
                />
                <TextField
                  label="Media URL"
                  value={item.url}
                  onChange={(value) =>
                    onChange({
                      ...section,
                      items: section.items.map((currentItem) =>
                        currentItem.id === item.id
                          ? { ...currentItem, url: value }
                          : currentItem,
                      ),
                    })
                  }
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Alt text"
                    value={item.alt}
                    onChange={(value) =>
                      onChange({
                        ...section,
                        items: section.items.map((currentItem) =>
                          currentItem.id === item.id
                            ? { ...currentItem, alt: value }
                            : currentItem,
                        ),
                      })
                    }
                  />
                  <TextField
                    label="Caption"
                    value={item.caption}
                    onChange={(value) =>
                      onChange({
                        ...section,
                        items: section.items.map((currentItem) =>
                          currentItem.id === item.id
                            ? { ...currentItem, caption: value }
                            : currentItem,
                        ),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HighlightsEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "highlights" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  const visibleItems = section.items.slice(0, section.itemCount);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Section eyebrow"
          value={section.eyebrow}
          onChange={(value) => onChange({ ...section, eyebrow: value })}
        />
      </div>
      <NumberField
        label="Cards shown"
        value={section.itemCount}
        min={1}
        max={6}
        onChange={(value) => onChange({ ...section, itemCount: value })}
      />
      <div className="space-y-4">
        {visibleItems.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Highlight {index + 1}</p>
            <div className="mt-4 grid gap-4">
              <TextField
                label="Card title"
                value={item.title}
                onChange={(value) =>
                  onChange({
                    ...section,
                    items: section.items.map((currentItem) =>
                      currentItem.id === item.id
                        ? { ...currentItem, title: value }
                        : currentItem,
                    ),
                  })
                }
              />
              <TextAreaField
                label="Card description"
                rows={3}
                value={item.description}
                onChange={(value) =>
                  onChange({
                    ...section,
                    items: section.items.map((currentItem) =>
                      currentItem.id === item.id
                        ? { ...currentItem, description: value }
                        : currentItem,
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "hero" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Eyebrow"
        value={section.eyebrow}
        onChange={(value) => onChange({ ...section, eyebrow: value })}
      />
      <TextField
        label="Portfolio title"
        value={section.title}
        onChange={(value) => onChange({ ...section, title: value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Subtitle"
          value={section.subtitle}
          onChange={(value) => onChange({ ...section, subtitle: value })}
        />
        <TextField
          label="Handle"
          value={section.handle}
          onChange={(value) => onChange({ ...section, handle: value })}
        />
      </div>
      <TextField
        label="Avatar image URL"
        value={section.avatarUrl}
        onChange={(value) => onChange({ ...section, avatarUrl: value })}
      />
      <TextAreaField
        label="Hero bio"
        rows={4}
        value={section.bio}
        onChange={(value) => onChange({ ...section, bio: value })}
      />
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm font-semibold text-white">Hero contact panel</p>
        <div className="mt-4 grid gap-4">
          <TextField
            label="Contact title"
            value={section.contactTitle}
            onChange={(value) => onChange({ ...section, contactTitle: value })}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <ToggleField
              label="Show contact panel"
              checked={section.showHeroContact}
              onChange={(checked) =>
                onChange({ ...section, showHeroContact: checked })
              }
            />
            <ToggleField
              label="Show GitHub button"
              checked={section.showGithubButton}
              onChange={(checked) =>
                onChange({ ...section, showGithubButton: checked })
              }
            />
            <ToggleField
              label="Show GitHub text"
              checked={section.showGithubUrl}
              onChange={(checked) =>
                onChange({ ...section, showGithubUrl: checked })
              }
            />
            <ToggleField
              label="Show email"
              checked={section.showEmail}
              onChange={(checked) => onChange({ ...section, showEmail: checked })}
            />
            <ToggleField
              label="Show phone"
              checked={section.showPhone}
              onChange={(checked) => onChange({ ...section, showPhone: checked })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="GitHub label"
              value={section.githubLabel}
              onChange={(value) => onChange({ ...section, githubLabel: value })}
            />
            <TextField
              label="GitHub button label"
              value={section.githubButtonLabel}
              onChange={(value) =>
                onChange({ ...section, githubButtonLabel: value })
              }
            />
            <TextField
              label="Email label"
              value={section.emailLabel}
              onChange={(value) => onChange({ ...section, emailLabel: value })}
            />
            <TextField
              label="Phone label"
              value={section.phoneLabel}
              onChange={(value) => onChange({ ...section, phoneLabel: value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="GitHub value"
              value={section.githubValue}
              onChange={(value) => onChange({ ...section, githubValue: value })}
            />
            <TextField
              label="GitHub button URL"
              value={section.githubButtonUrl}
              onChange={(value) =>
                onChange({ ...section, githubButtonUrl: value })
              }
            />
            <TextField
              label="Email value"
              value={section.emailValue}
              onChange={(value) => onChange({ ...section, emailValue: value })}
            />
            <TextField
              label="Phone value"
              value={section.phoneValue}
              onChange={(value) => onChange({ ...section, phoneValue: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "skills" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Section title"
        value={section.title}
        onChange={(value) => onChange({ ...section, title: value })}
      />
      <TextField
        label="Section eyebrow"
        value={section.eyebrow}
        onChange={(value) => onChange({ ...section, eyebrow: value })}
      />
      <NumberField
        label="Badge count"
        value={section.itemCount}
        min={1}
        max={12}
        onChange={(value) => onChange({ ...section, itemCount: value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Languages title"
          value={section.languagesTitle}
          onChange={(value) => onChange({ ...section, languagesTitle: value })}
        />
        <TextField
          label="Roles title"
          value={section.rolesTitle}
          onChange={(value) => onChange({ ...section, rolesTitle: value })}
        />
      </div>
      <TextAreaField
        label="Languages"
        rows={3}
        value={section.languages.join(", ")}
        onChange={(value) =>
          onChange({ ...section, languages: parseCommaSeparated(value) })
        }
      />
      <TextAreaField
        label="Suggested roles"
        rows={3}
        value={section.roles.join(", ")}
        onChange={(value) =>
          onChange({ ...section, roles: parseCommaSeparated(value) })
        }
      />
    </div>
  );
}

function FeaturedProjectEditor({
  onChange,
  repos,
  section,
}: {
  repos: GitHubRepo[];
  section: Extract<EditorSectionConfig, { type: "featured-project" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Section title"
        value={section.title}
        onChange={(value) => onChange({ ...section, title: value })}
      />
      <TextField
        label="Section eyebrow"
        value={section.eyebrow}
        onChange={(value) => onChange({ ...section, eyebrow: value })}
      />
      <CardEditor
        title="Featured card"
        repos={repos}
        card={section.card}
        onCardChange={(nextCard) => onChange({ ...section, card: nextCard })}
      />
    </div>
  );
}

function ProjectsGridEditor({
  onChange,
  repos,
  section,
}: {
  repos: GitHubRepo[];
  section: Extract<EditorSectionConfig, { type: "projects-grid" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  const visibleCards = section.cards.slice(0, section.itemCount);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Section eyebrow"
          value={section.eyebrow}
          onChange={(value) => onChange({ ...section, eyebrow: value })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          label="Cards shown"
          value={section.itemCount}
          min={1}
          max={12}
          onChange={(value) => onChange({ ...section, itemCount: value })}
        />
      </div>

      <div className="space-y-4">
        {visibleCards.map((card, index) => (
          <CardEditor
            key={card.id}
            title={`Project card ${index + 1}`}
            repos={repos}
            card={card}
            onCardChange={(nextCard) =>
              onChange({
                ...section,
                cards: section.cards.map((currentCard) =>
                  currentCard.id === nextCard.id ? nextCard : currentCard,
                ),
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function ContactEditor({
  onChange,
  section,
}: {
  section: Extract<EditorSectionConfig, { type: "contact" }>;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Section title"
        value={section.title}
        onChange={(value) => onChange({ ...section, title: value })}
      />
      <TextAreaField
        label="Description"
        rows={3}
        value={section.description}
        onChange={(value) => onChange({ ...section, description: value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="GitHub URL"
          value={section.githubUrl}
          onChange={(value) => onChange({ ...section, githubUrl: value })}
        />
        <TextField
          label="Email"
          value={section.email}
          onChange={(value) => onChange({ ...section, email: value })}
        />
      </div>
      <TextField
        label="Phone"
        value={section.phone}
        onChange={(value) => onChange({ ...section, phone: value })}
      />
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Contact cards</p>
          <p className="text-xs text-white/50">Min 1, max 3 visible</p>
        </div>
        <div className="mt-4 grid gap-4">
          {section.items.map((item) => (
            <div key={item.key} className="grid gap-3 md:grid-cols-[auto_1fr]">
              <ToggleField
                label={`Show ${item.key}`}
                checked={item.enabled}
                onChange={(checked) =>
                  onChange({
                    ...section,
                    items: enforceMinimumContactItems(
                      section.items.map((currentItem) =>
                        currentItem.key === item.key
                          ? { ...currentItem, enabled: checked }
                          : currentItem,
                      ),
                    ),
                  })
                }
              />
              <TextField
                label="Card title"
                value={item.label}
                onChange={(value) =>
                  onChange({
                    ...section,
                    items: section.items.map((currentItem) =>
                      currentItem.key === item.key
                        ? { ...currentItem, label: value }
                        : currentItem,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SimpleTitleEditor({
  onChange,
  section,
}: {
  section: Extract<
    EditorSectionConfig,
    { type: "contributions" | "contribution-activity" | "socials" }
  >;
  onChange: (nextSection: EditorSectionConfig) => void;
}) {
  if (section.type === "contributions") {
    return (
      <div className="grid gap-4">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Stat boxes</p>
          <div className="mt-4 grid gap-4">
            {section.stats.map((stat) => (
              <div key={stat.key} className="grid gap-3 md:grid-cols-[auto_1fr]">
                <ToggleField
                  label={`Show ${stat.key}`}
                  checked={stat.enabled}
                  onChange={(checked) =>
                    onChange({
                      ...section,
                      stats: section.stats.map((currentStat) =>
                        currentStat.key === stat.key
                          ? { ...currentStat, enabled: checked }
                          : currentStat,
                      ),
                    })
                  }
                />
                <TextField
                  label="Stat label"
                  value={stat.label}
                  onChange={(value) =>
                    onChange({
                      ...section,
                      stats: section.stats.map((currentStat) =>
                        currentStat.key === stat.key
                          ? { ...currentStat, label: value }
                          : currentStat,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "contribution-activity") {
    return (
      <div className="grid gap-4">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <TextField
          label="Summary suffix"
          value={section.summarySuffix}
          onChange={(value) => onChange({ ...section, summarySuffix: value })}
        />
      </div>
    );
  }

  if (section.type === "socials") {
    return (
      <div className="grid gap-4">
        <TextField
          label="Section title"
          value={section.title}
          onChange={(value) => onChange({ ...section, title: value })}
        />
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">Links</p>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...section,
                  links: [
                    ...section.links,
                    {
                      key: `custom-${Math.random().toString(36).slice(2, 8)}`,
                      enabled: true,
                      label: "Custom Link",
                      value: "",
                      href: "",
                    },
                  ],
                })
              }
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/10"
            >
              Add link
            </button>
          </div>
          <div className="mt-4 grid gap-4">
            {section.links.map((link) => (
              <div key={link.key} className="grid gap-3">
                <ToggleField
                  label={`Show ${link.label || "link"}`}
                  checked={link.enabled}
                  onChange={(checked) =>
                    onChange({
                      ...section,
                      links: section.links.map((currentLink) =>
                        currentLink.key === link.key
                          ? { ...currentLink, enabled: checked }
                          : currentLink,
                      ),
                    })
                  }
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...section,
                        links:
                          section.links.length > 1
                            ? section.links.filter(
                                (currentLink) => currentLink.key !== link.key,
                              )
                            : section.links,
                      })
                    }
                    className="rounded-full border border-rose-400/20 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-400/10"
                  >
                    Remove link
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <TextField
                    label="Link label"
                    value={link.label}
                    onChange={(value) =>
                      onChange({
                        ...section,
                        links: section.links.map((currentLink) =>
                          currentLink.key === link.key
                            ? { ...currentLink, label: value }
                            : currentLink,
                        ),
                      })
                    }
                  />
                  <TextField
                    label="Displayed value"
                    value={link.value}
                    onChange={(value) =>
                      onChange({
                        ...section,
                        links: section.links.map((currentLink) =>
                          currentLink.key === link.key
                            ? { ...currentLink, value }
                            : currentLink,
                        ),
                      })
                    }
                  />
                  <TextField
                    label="Link URL"
                    value={link.href}
                    onChange={(value) =>
                      onChange({
                        ...section,
                        links: section.links.map((currentLink) =>
                          currentLink.key === link.key
                            ? { ...currentLink, href: value }
                            : currentLink,
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <TextField
        label="Section title"
        value={section.title}
        onChange={(value) => onChange({ ...section, title: value })}
      />
    </div>
  );
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function TextAreaField({
  label,
  onChange,
  rows,
  value,
}: {
  label: string;
  rows: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function NumberField({
  label,
  max,
  min,
  onChange,
  value,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  checked,
  label,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-white"
      />
    </label>
  );
}

function enforceMinimumContactItems(
  items: Extract<EditorSectionConfig, { type: "contact" }>["items"],
) {
  const enabledCount = items.filter((item) => item.enabled).length;

  if (enabledCount === 0) {
    return items.map((item, index) =>
      index === 0 ? { ...item, enabled: true } : item,
    );
  }

  return items;
}
