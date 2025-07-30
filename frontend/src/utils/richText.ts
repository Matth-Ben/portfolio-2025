/**
 * Fonction pour extraire le texte simple du contenu riche Strapi
 */
export function extractTextFromRichText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).join('');
  }
  return '';
}

/**
 * Fonction pour extraire le contenu avec retours à la ligne
 */
export function extractRichTextWithLineBreaks(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).join('\n\n');
  }
  return '';
}

/**
 * Fonction pour rendre le contenu riche en HTML
 */
export function renderRichTextToHTML(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(block => renderRichTextBlock(block)).join('\n\n');
  }
  return '';
}

/**
 * Fonction pour rendre un bloc de contenu riche
 */
function renderRichTextBlock(block: any): string {
  if (!block || !block.type) return '';
  
  switch (block.type) {
    case 'paragraph':
      if (block.children) {
        const text = block.children.map((child: any) => child.text || '').join('');
        return `<p>${text}</p>`;
      }
      return '';
    case 'heading':
      if (block.children) {
        const text = block.children.map((child: any) => child.text || '').join('');
        const level = block.level || 1;
        return `<h${level}>${text}</h${level}>`;
      }
      return '';
    case 'list':
      if (block.children) {
        const listType = block.format === 'ordered' ? 'ol' : 'ul';
        const items = block.children.map((item: any) => {
          if (item.children) {
            return `<li>${item.children.map((child: any) => child.text || '').join('')}</li>`;
          }
          return '';
        }).join('');
        return `<${listType}>${items}</${listType}>`;
      }
      return '';
    case 'quote':
      if (block.children) {
        const text = block.children.map((child: any) => child.text || '').join('');
        return `<blockquote>${text}</blockquote>`;
      }
      return '';
    case 'code':
      if (block.children) {
        const text = block.children.map((child: any) => child.text || '').join('');
        return `<code>${text}</code>`;
      }
      return '';
    default:
      if (block.children) {
        const text = block.children.map((child: any) => child.text || '').join('');
        return `<p>${text}</p>`;
      }
      return '';
  }
} 