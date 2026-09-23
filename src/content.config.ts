import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';
import { resumeSchema } from './schemas/resume';

// One resume document. The `file` loader expects a keyed object, so we wrap the
// flat YAML under a single `resume` id — keeping resume.yaml itself flat/editable.
const resume = defineCollection({
  loader: file('src/data/resume.yaml', {
    parser: (text) => ({ resume: parseYaml(text) }),
  }),
  schema: resumeSchema,
});

export const collections = { resume };
