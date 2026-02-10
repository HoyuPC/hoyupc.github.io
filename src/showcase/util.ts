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
    switch (tag) {
      case 'festival_2025':
        return '虹色祭2025';

      default:
        return tag;
    }
  }
}

export default utils;
