import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXFrontmatter, TOCItem } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/courses');

export async function getCourseMDX(courseId: string, lessonId: string) {
  const filePath = path.join(CONTENT_DIR, courseId, `${lessonId}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`MDX file not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    frontmatter: data as MDXFrontmatter,
    content,
    source: fileContent,
  };
}

export function getAllCourses(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs.readdirSync(CONTENT_DIR).filter((item) => {
    const itemPath = path.join(CONTENT_DIR, item);
    return fs.statSync(itemPath).isDirectory();
  });
}

export function getCourseLessons(courseId: string): string[] {
  const courseDir = path.join(CONTENT_DIR, courseId);

  if (!fs.existsSync(courseDir)) {
    return [];
  }

  return fs
    .readdirSync(courseDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

export function generateTableOfContents(content: string): TOCItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TOCItem[] = [];
  const stack: (TOCItem | null)[] = [null, null, null];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 1 | 2 | 3;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const item: TOCItem = {
      id,
      title,
      level,
      children: [],
    };

    if (level === 1) {
      items.push(item);
      stack[0] = item;
      stack[1] = null;
      stack[2] = null;
    } else if (level === 2) {
      if (stack[0]) {
        if (!stack[0].children) stack[0].children = [];
        stack[0].children.push(item);
        stack[1] = item;
        stack[2] = null;
      }
    } else if (level === 3) {
      if (stack[1]) {
        if (!stack[1].children) stack[1].children = [];
        stack[1].children.push(item);
        stack[2] = item;
      }
    }
  }

  return items;
}

export function addHeadingIdsToMDX(content: string): string {
  return content.replace(/^(#{1,3})\s+(.+)$/gm, (match, hashes, title) => {
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `${hashes} ${title} {#${id}}`;
  });
}
