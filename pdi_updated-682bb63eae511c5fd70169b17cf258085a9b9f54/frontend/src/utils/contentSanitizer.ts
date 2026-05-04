/**
 * Sanitizes content by removing unwanted placeholders like double dashes ("--")
 * and cleaning up whitespace.
 */
export const sanitizeContent = (obj: any): any => {
  if (typeof obj === 'string') {
    // Replace markdown bold (**) with empty string
    let sanitized = obj.replace(/\*\*/g, '');

    // Replace double or more dashes (--, ---, ----) with empty string
    sanitized = sanitized.replace(/-{2,}/g, '');
    
    // Replace em-dashes with standard dashes or keep as is? 
    // The user said remove ----, but maybe they mean the em-dash too.
    // I'll leave em-dash for now unless it's a standalone placeholder.
    
    // Replace multiple spaces with a single space
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    // Trim leading/trailing whitespace
    sanitized = sanitized.trim();
    
    // If the resulting string is just a placeholder, return empty
    if (sanitized === "" || sanitized === " " || sanitized === "---" || sanitized === "----" || sanitized === "—") {
      return "";
    }
    
    return sanitized;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeContent(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = sanitizeContent(obj[key]);
    }
    return newObj;
  }
  
  return obj;
};
