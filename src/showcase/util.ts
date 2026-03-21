namespace utils {
  export function getIconForCategory(icon: string) {
    switch (icon) {
      case 'media':
        return 'image';
      case 'model':
        return 'deployed_code';
      case 'game':
        return 'stadia_controller';
      default:
        return icon;
    }
  }

  export function getIconForFlag(flag: string): string {
    switch (flag) {
      case 'external':
        return 'open_in_new';
      case 'keyboard_required':
        return 'keyboard';
      case 'mouse_required':
        return 'mouse';

      default:
        return flag;
    }
  }

  export function getTagDisplayName(tag: string): string {
    if (tag.startsWith('festival_')) {
      let year = Number.parseInt(tag.substring(9), 10);
      if (Number.isInteger(year)) {
        return '虹色祭' + year + '年';
      }
    }

    switch (tag) {
      case 'math_museum':
        return '数学美術館';

      default:
        return tag;
    }
  }
}

export default utils;
